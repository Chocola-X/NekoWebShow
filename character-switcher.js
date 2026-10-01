// One document, one WebGL device; each selection owns a disposable model session.
(() => {
    const links = [...document.querySelectorAll('a[data-model][data-config]')];
    const models = new Map(links.map(link => [link.hash.slice(1), link]));
    const cookieName = 'nekoWebShowCharacter';
    const fallback = 'chocola-lolita';
    const loading = document.getElementById('loading');
    const status = document.getElementById('character-status');
    let selection = fallback;
    let revision = 0;
    const translate = key => window.languageManager.get(key);

    function savedSelection() {
        try {
            const value = document.cookie.split('; ').find(value => value.startsWith(cookieName + '='));
            return value ? decodeURIComponent(value.slice(cookieName.length + 1)) : '';
        } catch (_) { return ''; }
    }

    async function select(id) {
        const link = models.get(id);
        if (!link) return;
        selection = id;
        const request = ++revision;
        loading.textContent = translate('loading');
        loading.style.visibility = 'visible';
        document.body.dataset.characterState = 'loading';
        status.textContent = '';
        try {
            await start(link.dataset.model, window.NekoConfigs[link.dataset.config]());
            if (request !== revision) return;
            // Persist only successfully loaded, allow-listed selections.
            try {
                const path = location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1);
                document.cookie = `${cookieName}=${encodeURIComponent(id)}; Max-Age=31536000; Path=${path}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
            } catch (_) { /* Cookie-disabled browsers can still switch models. */ }
            for (const item of links) {
                if (item === link) item.setAttribute('aria-current', 'true');
                else item.removeAttribute('aria-current');
            }
            const [character, costume] = id.split('-');
            Object.assign(window.languageManager, { characterName: character, characterCostume: costume });
            window.languageManager.applyTranslations();
            document.body.dataset.character = id;
            document.body.dataset.characterState = 'ready';
            loading.style.visibility = 'hidden';
        } catch (error) {
            if (request !== revision) return;
            console.error('Character load failed:', error);
            document.body.dataset.characterState = 'error';
            loading.style.visibility = 'hidden';
            status.textContent = translate('characterLoadError');
        }
    }

    document.getElementById('topbar').addEventListener('click', event => {
        const link = event.target.closest('a[data-model]');
        if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        if (location.hash === link.hash) select(link.hash.slice(1));
        else location.hash = link.hash;
    });
    window.addEventListener('hashchange', () => select(models.has(location.hash.slice(1)) ? location.hash.slice(1) : fallback));
    window.addEventListener('load', () => {
        const hash = location.hash.slice(1);
        const saved = savedSelection();
        const id = models.has(hash) ? hash : models.has(saved) ? saved : fallback;
        history.replaceState(null, '', '#' + id);
        select(id);
    }, { once: true });
})();
