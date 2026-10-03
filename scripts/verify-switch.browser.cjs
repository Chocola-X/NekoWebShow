// Node.js 22+. See readme.md for the static server and Chromium commands.
// Pass --stress-only after a separate complete model sweep.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const appURL = process.env.NEKO_TEST_URL || 'http://127.0.0.1:18220/index.html';
const cdpURL = process.env.NEKO_CDP_URL || 'http://127.0.0.1:9260';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    const tabs = await (await fetch(cdpURL + '/json')).json();
    const ws = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl);
    await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
    let nextId = 0;
    const pending = new Map();
    const errors = [];
    let failRequests = false;
    ws.addEventListener('message', event => {
        const message = JSON.parse(event.data);
        if (message.id) {
            const callback = pending.get(message.id);
            pending.delete(message.id);
            if (message.error) callback.reject(message.error);
            else callback.resolve(message.result);
        } else if (message.method === 'Runtime.exceptionThrown') {
            errors.push(message.params.exceptionDetails);
        } else if (message.method === 'Fetch.requestPaused') {
            send(failRequests ? 'Fetch.failRequest' : 'Fetch.continueRequest', {
                requestId: message.params.requestId,
                ...(failRequests ? { errorReason: 'Failed' } : {}),
            });
        }
    });
    function send(method, params = {}) {
        return new Promise((resolve, reject) => {
            const id = ++nextId;
            pending.set(id, { resolve, reject });
            ws.send(JSON.stringify({ id, method, params }));
        });
    }
    async function evaluate(expression, includeCommandLineAPI = false) {
        const result = await send('Runtime.evaluate', {
            expression, returnByValue: true, awaitPromise: true, includeCommandLineAPI,
        });
        if (result.exceptionDetails) throw result.exceptionDetails;
        return result.result.value;
    }
    async function waitFor(id) {
        for (let attempt = 0; attempt < 300; attempt++) {
            const state = await evaluate('({state:document.body?.dataset.characterState,id:document.body?.dataset.character})');
            assert.notEqual(state.state, 'error', 'Model failed: ' + id);
            if (state.state === 'ready' && state.id === id) return;
            await delay(100);
        }
        throw new Error('Timed out loading ' + id);
    }
    async function switchTo(id) {
        await evaluate('location.hash=' + JSON.stringify(id));
        await waitFor(id);
        // Verify that the real renderer continues advancing the new player.
        await evaluate(`new Promise((resolve, reject) => {
            const player = EmotePlayer.device.playerList[0];
            const previous = player.onUpdate;
            let frames = 0;
            const timer = setTimeout(() => reject(new Error('Animation stopped')), 3000);
            player.onUpdate = time => {
                previous(time);
                if (++frames === 3) {
                    player.onUpdate = previous;
                    clearTimeout(timer);
                    resolve();
                }
            };
        })`);
    }
    const listeners = () => evaluate(`({
        move: getEventListeners(window).mousemove.length,
        resize: getEventListeners(window).resize.length,
        reset: getEventListeners(document)['neko:reset-character'].length
    })`, true);
    const resources = () => evaluate(`({
        same: document === testDocument && document.getElementById('canvas') === testCanvas && EmotePlayer.device === testDevice,
        players: EmotePlayer.device.playerList.length,
        refs: EmotePlayer.deviceRefCount,
        textures: GL.textures.filter(Boolean).length,
        initialized: EmotePlayer.device.playerList[0].initialized,
        top: HEAP32[DYNAMICTOP_PTR >> 2]
    })`);
    try {
        await send('Page.enable');
        await send('Page.navigate', { url: 'about:blank' });
        await send('Runtime.enable');
        await send('Page.navigate', { url: appURL + '#chocola-lolita' });
        await waitFor('chocola-lolita');
        await evaluate(`window.testDocument = document;
            window.testCanvas = document.getElementById('canvas');
            window.testDevice = EmotePlayer.device;`);
        const ids = await evaluate(`[...document.querySelectorAll('a[data-model]')].map(a => a.hash.slice(1))`);
        const expectedIds = Object.keys(JSON.parse(fs.readFileSync(path.join(__dirname, '../config/model-catalog.json'), 'utf8')));
        assert.deepEqual([...ids].sort(), expectedIds.sort());
        const baseline = await listeners();
        const counts = [];
        for (const id of process.argv.includes('--stress-only') ? [] : ids) {
            await switchTo(id);
            const state = await resources();
            assert.equal(state.same, true);
            assert.equal(state.players, 1);
            assert.equal(state.refs, 1);
            assert.equal(state.initialized, true);
            counts.push({ id, ...state });
            console.log('Loaded', id);
        }
        const stress = [];
        for (let round = 0; round < 5; round++) {
            for (const id of ['chocola-date-a', 'fraise-maid-b', 'vanilla-koneko', 'chocola-lolita']) {
                await switchTo(id);
                const state = await resources();
                assert.equal(state.players, 1);
                assert.ok(state.textures <= 4);
                stress.push(state);
            }
        }
        assert.equal(stress.at(-1).top, stress.at(-5).top, 'Native heap must reach a plateau');
        await switchTo('chocola-maid');
        await switchTo('chocola-lolita');
        await evaluate(`start('./data/chocola-lolita.pure.psb.zip', NekoConfigs.chocola()).catch(() => {});
            start('./data/vanilla-maid.pure.psb.zip', NekoConfigs.vanilla()).catch(() => {});
            location.hash = 'milk-winter';`);
        await waitFor('milk-winter');

        failRequests = true;
        await send('Fetch.enable', { patterns: [{ urlPattern: '*fraise-maid-b.pure.psb.zip*' }] });
        await evaluate(`location.hash = 'fraise-maid-b'`);
        for (let attempt = 0; attempt < 100; attempt++) {
            if (await evaluate(`document.body.dataset.characterState === 'error'`)) break;
            await delay(100);
        }
        assert.equal(await evaluate('document.body.dataset.characterState'), 'error');
        assert.equal(await evaluate('EmotePlayer.device.playerList.length'), 0);
        await send('Fetch.disable');
        failRequests = false;
        await switchTo('chocola-lolita');
        await switchTo('fraise-maid-b');
        await switchTo('fraise-france-maid-a');
        assert.equal(await evaluate('languageManager.characterCostume'), 'france-maid');
        assert.deepEqual(await evaluate('languageManager.characterVariants'), ['a']);
        assert.equal(await evaluate('document.title'), await evaluate('languageManager.getPageTitle()'));
        await evaluate('history.back()');
        await waitFor('fraise-maid-b');
        await evaluate('history.forward()');
        await waitFor('fraise-france-maid-a');
        await switchTo('fraise-maid-b');
        // Clicking the current menu entry reloads through the same session lifecycle.
        await evaluate(`document.querySelector('a[href="#fraise-maid-b"]').click()`);
        await waitFor('fraise-maid-b');
        for (const [width, height] of [[900, 900], [390, 844], [1280, 900]]) {
            await send('Emulation.setDeviceMetricsOverride', {width, height, deviceScaleFactor: 1, mobile: false});
            await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
            const cutoff = await evaluate(`({
                y: EmotePlayer.device.playerList[0].getPointPosition(0, NekoCurrentModel.presentation.cutoffY).clientY,
                height: innerHeight
            })`);
            assert.ok(cutoff.y >= cutoff.height, 'Visible model cut edge must stay below the viewport');
            assert.equal((await resources()).same, true);
        }
        assert.deepEqual(await listeners(), baseline);
        assert.equal((await resources()).same, true);
        const shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(os.tmpdir(), 'neko-v2-final.png'), Buffer.from(shot.data, 'base64'));

        // A reaction may still be fetching/playing when another character is selected.
        await evaluate(`{
            const eye = EmotePlayer.device.playerList[0].getMarkerPosition('eye');
            document.getElementById('canvas').onclick({clientX: eye.clientX, clientY: eye.clientY});
        }`);
        await delay(150);
        await switchTo('chocola-maid');
        await delay(1200);
        await switchTo('fraise-maid-b');
        await send('Page.navigate', { url: 'about:blank' });
        await send('Page.navigate', { url: appURL });
        await waitFor('fraise-maid-b');
        assert.deepEqual(errors, []);
        fs.writeFileSync(path.join(os.tmpdir(), 'neko-v2-results.json'), JSON.stringify({ counts, stress, baseline, errors }, null, 2));
        console.log('PASS: catalog links, ' + counts.length + ' models, animation, 20 stress switches, reload, cancellation, failure/retry, listeners, titles, history, reaction cancellation, cookie restore');
    } finally {
        ws.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
