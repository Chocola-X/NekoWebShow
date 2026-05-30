function start(zipUrl) {
    let winWidth = window.innerWidth || document.body?.clientWidth || 0;
    let winHeight = window.innerHeight || document.body?.clientHeight || 0;

    if (document.documentElement?.clientHeight && document.documentElement?.clientWidth) {
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
    }

    run(winWidth, winHeight, zipUrl, getConfig());
}

function getHeightRatio(height) {
    const height1 = 600;
    const ratio1 = 0.3;
    const height2 = 1600;
    const ratio2 = 0.9;
    const m = (ratio2 - ratio1) / (height2 - height1);
    const b = ratio1 - m * height1;
    return Math.max(0.05, m * height + b);
}

async function run(width, height, zipUrl, reactionConfig) {
    EmotePlayer.createRenderCanvas(width, height);
    const canvas = document.getElementById('canvas');
    const player = new EmotePlayer(canvas);
    canvas.width = width;
    canvas.height = height;
    player.scale = getHeightRatio(height);
    let c = player.coord;
    c[1] -= 40;
    player.coord = c;
    player.diffTimelineSlot4 = '差分用_waiting_loop';

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

    function pickSupported(labels, supportedLabels) {
        if (!supportedLabels?.length) {
            return '';
        }
        const supported = labels.filter(label => supportedLabels.includes(label));
        return supported.length ? supported[Math.floor(Math.random() * supported.length)] : '';
    }

    function createLipSync() {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const decodedAudioCache = new Map();
        let audioContext = null;
        let rafId = null;
        let activeSource = null;
        let fallbackTimer = null;

        function stop() {
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            if (fallbackTimer !== null) {
                clearInterval(fallbackTimer);
                fallbackTimer = null;
            }
            if (activeSource) {
                try {
                    activeSource.stop();
                } catch (error) {
                    // The source may already be stopped by natural playback end.
                }
                activeSource = null;
            }
            player.setVariableDiff('lipSync', 'face_talk', 0, 120, -1);
        }

        async function getDecodedAudio(url) {
            if (!AudioContextClass) {
                return null;
            }
            if (!audioContext) {
                audioContext = new AudioContextClass();
            }
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }
            if (decodedAudioCache.has(url)) {
                return decodedAudioCache.get(url);
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load audio ${url}`);
            }
            const buffer = await response.arrayBuffer();
            const decoded = await audioContext.decodeAudioData(buffer.slice(0));
            decodedAudioCache.set(url, decoded);
            return decoded;
        }

        function driveMouthFromAnalyser(analyser) {
            const data = new Uint8Array(analyser.fftSize);
            let smoothed = 0;

            const update = () => {
                analyser.getByteTimeDomainData(data);
                let sum = 0;
                for (const sample of data) {
                    const centered = (sample - 128) / 128;
                    sum += centered * centered;
                }
                const rms = Math.sqrt(sum / data.length);
                const talk = Math.min(10, Math.max(0, (rms - 0.015) * 75));
                smoothed = smoothed * 0.62 + talk * 0.38;
                player.setVariableDiff('lipSync', 'face_talk', smoothed, 70, -1);
                rafId = requestAnimationFrame(update);
            };

            update();
        }

        function driveMouthFallback(durationMs) {
            const startedAt = performance.now();
            fallbackTimer = setInterval(() => {
                const elapsed = performance.now() - startedAt;
                if (elapsed > durationMs) {
                    stop();
                    return;
                }
                const wave = Math.sin(elapsed / 55) * 0.5 + 0.5;
                const jitter = Math.random() * 2;
                player.setVariableDiff('lipSync', 'face_talk', Math.min(8, 2 + wave * 5 + jitter), 80, -1);
            }, 90);
        }

        async function play(url) {
            stop();
            if (!url) {
                return { durationMs: 0, ended: Promise.resolve() };
            }

            if (!AudioContextClass) {
                const audio = new Audio(url);
                const metadataLoaded = new Promise(resolve => {
                    audio.addEventListener('loadedmetadata', resolve, { once: true });
                    audio.addEventListener('error', resolve, { once: true });
                });
                await metadataLoaded;
                const durationMs = Number.isFinite(audio.duration) ? audio.duration * 1000 : 1200;
                driveMouthFallback(durationMs);
                const ended = new Promise(resolve => {
                    audio.addEventListener('ended', resolve, { once: true });
                    audio.addEventListener('error', resolve, { once: true });
                }).finally(stop);
                audio.play().catch(error => console.error('Audio playback error:', error));
                return { durationMs, ended, startedAt: performance.now() };
            }

            const decoded = await getDecodedAudio(url);
            const source = audioContext.createBufferSource();
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 512;
            analyser.smoothingTimeConstant = 0.34;
            source.buffer = decoded;
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            activeSource = source;
            driveMouthFromAnalyser(analyser);

            const ended = new Promise(resolve => {
                source.onended = resolve;
            }).finally(stop);
            source.start(0);
            return { durationMs: decoded.duration * 1000, ended, startedAt: performance.now() };
        }

        return { play, stop };
    }

    const lipSync = createLipSync();

    try {
        const resp = await fetch(zipUrl);
        if (!resp.ok) {
            throw new Error(`Failed to load ${zipUrl}`);
        }
        const zipData = new Uint8Array(await resp.arrayBuffer());
        const files = await new Promise((resolve, reject) => {
            fflate.unzip(zipData, (err, unzipped) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(unzipped);
                }
            });
        });

        const binFileName = Object.keys(files).find(name => name.endsWith('.psb'));
        if (!binFileName) {
            throw new Error('No .psb file found in ZIP');
        }

        const modelData = files[binFileName];
        const blob = new Blob([modelData], { type: 'application/octet-stream' });
        const fakeUrl = URL.createObjectURL(blob);

        await player.promiseLoadDataFromURL(fakeUrl);
        URL.revokeObjectURL(fakeUrl);

        document.getElementById('loading').innerHTML = 'Done!';
        setTimeout(() => {
            document.getElementById('loading').style.visibility = 'hidden';
        }, 1000);

        const mainTimelineLabels = player.mainTimelineLabels;
        const diffTimelineLabels = player.diffTimelineLabels;
        const variableLabels = player.variableList.map(variable => variable.label);

        function safeMainTimeline(label) {
            return !label || mainTimelineLabels.includes(label) ? label : '';
        }

        function safeDiffTimeline(label) {
            return !label || diffTimelineLabels.includes(label) ? label : '';
        }

        function touchExtraDiff(zone) {
            const candidates = {
                bust: ['はじらい2', 'わなわな', '戸惑い'],
                eye: ['びっくり2', 'うつむき', '疑問'],
                face: ['にっこり2', 'ごきげん', 'うん'],
                head: ['うんうん', 'ごきげん', 'にっこり'],
                pant: ['戸惑い', 'ひく', 'わなわな']
            };
            return pickSupported(candidates[zone] || [], diffTimelineLabels);
        }

        function cloneVariablesForPlayback(config, phase) {
            const variables = (config.variables || [])
                .filter(variable => variableLabels.includes(variable.name))
                .map(variable => {
                    const result = { ...variable };
                    if (phase === 'reaction' && config.audio && result.name === 'face_talk') {
                        result.value = Math.min(result.value, 4);
                        result.duration = Math.min(result.duration || 180, 220);
                    }
                    return result;
                });

            if (
                phase === 'reaction' &&
                config.audio &&
                variableLabels.includes('face_talk') &&
                !variables.some(variable => variable.name === 'face_talk')
            ) {
                variables.push({ name: 'face_talk', value: 2, duration: 160 });
            }

            return variables;
        }

        function buildPlaybackConfig(config = {}, zone = '', phase = 'reaction') {
            const playback = { ...config };
            playback.mainTimelineLabel = safeMainTimeline(playback.mainTimelineLabel || '');
            playback.variables = cloneVariablesForPlayback(playback, phase);

            if (!Array.isArray(playback.diffTimelineSlots)) {
                for (let i = 1; i <= 6; i += 1) {
                    const key = `diffTimelineSlot${i}`;
                    if (hasOwn(playback, key)) {
                        playback[key] = safeDiffTimeline(playback[key] || '');
                    }
                }
                if (phase === 'reaction' && !hasOwn(playback, 'diffTimelineSlot3')) {
                    const extra = touchExtraDiff(zone);
                    if (extra) {
                        playback.diffTimelineSlot3 = extra;
                    }
                }
                if (phase === 'recovery' && !hasOwn(playback, 'diffTimelineSlot3')) {
                    playback.diffTimelineSlot3 = '';
                }
            } else {
                playback.diffTimelineSlots = playback.diffTimelineSlots.map(safeDiffTimeline);
            }

            return playback;
        }

        function applyDiffTimelineConfig(config) {
            if (Array.isArray(config.diffTimelineSlots)) {
                for (let i = 1; i <= 6; i += 1) {
                    player[`diffTimelineSlot${i}`] = config.diffTimelineSlots[i - 1] || '';
                }
                return;
            }

            for (let i = 1; i <= 6; i += 1) {
                const key = `diffTimelineSlot${i}`;
                if (hasOwn(config, key)) {
                    player[key] = config[key] || '';
                }
            }
        }

        function applyVariables(config) {
            for (const variable of config.variables || []) {
                const duration = variable.duration ?? 0;
                const easing = variable.easing ?? variable.delay ?? 0;
                player.setVariable(variable.name, variable.value, duration, easing);
            }
        }

        function applyReactionConfig(config, options = {}) {
            const playAudio = options.playAudio !== false;
            if (hasOwn(config, 'mainTimelineLabel')) {
                player.mainTimelineLabel = config.mainTimelineLabel || '';
            }
            applyDiffTimelineConfig(config);
            applyVariables(config);

            if (playAudio && config.audio) {
                return lipSync.play(config.audio);
            }
            return Promise.resolve({ durationMs: 0, ended: Promise.resolve() });
        }

        function getTimelineWaitMs(config) {
            if (!config.mainTimelineLabel) {
                return 0;
            }
            const ms = player.getTimelineTotalMilliSeconds(config.mainTimelineLabel);
            return Number.isFinite(ms) ? ms : 0;
        }

        async function waitForReaction(selected, reaction, audioPlaybackPromise, startedAt) {
            let audioDuration = 0;
            let audioEnded = Promise.resolve();
            let audioStartedAt = performance.now();

            try {
                const audioPlayback = await audioPlaybackPromise;
                audioDuration = audioPlayback.durationMs || 0;
                audioEnded = audioPlayback.ended || Promise.resolve();
                audioStartedAt = audioPlayback.startedAt || performance.now();
            } catch (error) {
                console.error('Audio playback error:', error);
            }

            const configuredDuration = selected.duration || 0;
            const timelineDuration = getTimelineWaitMs(reaction);
            const actionDuration = Math.max(configuredDuration, timelineDuration, 650);
            const actionRemainingMs = Math.max(0, actionDuration - (performance.now() - startedAt));
            const audioElapsedMs = performance.now() - audioStartedAt;
            const audioRemainingMs = Math.max(0, audioDuration - audioElapsedMs);
            const remainingMs = Math.max(actionRemainingMs, audioRemainingMs);
            await sleep(remainingMs);

            if (audioDuration > 0) {
                await Promise.race([audioEnded, sleep(250)]);
            }
        }

        async function playSelectedReaction(selected, zone) {
            const startedAt = performance.now();
            const reaction = buildPlaybackConfig(selected.reaction, zone, 'reaction');
            const recovery = buildPlaybackConfig(selected.recovery, zone, 'recovery');
            const audioPlaybackPromise = applyReactionConfig(reaction, { playAudio: true });
            await waitForReaction(selected, reaction, audioPlaybackPromise, startedAt);
            lipSync.stop();
            applyReactionConfig(recovery, { playAudio: false });
            await sleep(180);
        }

        const eyetracking_reaction = (ev) => {
            const eyePosition = player.getMarkerPosition('eye');
            if (!eyePosition) {
                return;
            }
            const mouseOffsetX = ev.clientX - eyePosition.clientX;
            const mouseOffsetY = ev.clientY - eyePosition.clientY;
            const angle = Math.atan2(mouseOffsetY, mouseOffsetX);
            const len = Math.sqrt(mouseOffsetX ** 2 + mouseOffsetY ** 2);
            const c = Math.cos(angle);
            const s = Math.sin(angle);

            player.setVariableDiff('eyetrack', 'face_eye_LR', len / 3 * c, 500, -1);
            player.setVariableDiff('eyetrack', 'face_eye_UD', len / 3 * s, 500, -1);

            if (len > 60) {
                player.setVariableDiff('eyetrack', 'head_slant', len / 12 * c, 1000, -1);
                player.setVariableDiff('eyetrack', 'head_LR', len / 6 * c, 1000, -1);
                player.setVariableDiff('eyetrack', 'head_UD', len / 6 * s, 1000, -1);
            }

            if (len > 120) {
                player.setVariableDiff('eyetrack', 'body_slant', len / 18 * c, 2000, -1);
                player.setVariableDiff('eyetrack', 'body_LR', len / 9 * c, 2000, -1);
                player.setVariableDiff('eyetrack', 'body_UD', len / 9 * s, 2000, -1);
            }
        };

        canvas.onmousemove = eyetracking_reaction;
        canvas.addEventListener('touchmove', (ev) => {
            eyetracking_reaction(ev.touches[0]);
            ev.preventDefault();
        }, false);

        let touching = false;
        const touch_reaction = (ev) => {
            if (touching) {
                return;
            }

            const bustPosition = player.getMarkerPosition('bust');
            const eyePosition = player.getMarkerPosition('eye');
            const headPositionAX = player.getMarkerPosition('headAX');
            const headPositionAY = player.getMarkerPosition('headAY');
            const headPositionBX = player.getMarkerPosition('headBX');
            const headPositionBY = player.getMarkerPosition('headBY');
            const pantPositionAX = player.getMarkerPosition('pantAX');
            const pantPositionAY = player.getMarkerPosition('pantAY');
            const pantPositionBX = player.getMarkerPosition('pantBX');
            const pantPositionBY = player.getMarkerPosition('pantBY');

            if (!bustPosition || !eyePosition || !headPositionAX || !headPositionAY || !headPositionBX || !headPositionBY || !pantPositionAX || !pantPositionAY || !pantPositionBX || !pantPositionBY) {
                return;
            }

            const bustLength = Math.sqrt((bustPosition.clientX - ev.clientX) ** 2 + (bustPosition.clientY - ev.clientY) ** 2);
            const eyeLength = Math.sqrt((eyePosition.clientX - ev.clientX) ** 2 + (eyePosition.clientY - ev.clientY) ** 2);
            const headCenterX = (headPositionAX.clientX + headPositionBX.clientX) / 2;
            const headCenterY = (headPositionAY.clientY + headPositionBY.clientY) / 2;
            const headLength = Math.sqrt((headCenterX - ev.clientX) ** 2 + (headCenterY - ev.clientY) ** 2);
            const faceLength = Math.sqrt((headCenterX - ev.clientX) ** 2 + ((headCenterY + 40) - ev.clientY) ** 2);
            const pantCenterX = (pantPositionAX.clientX + pantPositionBX.clientX) / 2;
            const pantCenterY = (pantPositionAY.clientY + pantPositionBY.clientY) / 2;
            const pantLength = Math.sqrt((pantCenterX - ev.clientX) ** 2 + (pantCenterY - ev.clientY) ** 2);

            const tryReact = (zone, distance, threshold, reactions) => {
                if (distance >= threshold || !reactions?.length) {
                    return false;
                }

                touching = true;
                const selected = reactions[Math.floor(Math.random() * reactions.length)];
                playSelectedReaction(selected, zone)
                    .catch(error => console.error('Touch reaction error:', error))
                    .finally(() => {
                        touching = false;
                    });
                return true;
            };

            if (
                !tryReact('bust', bustLength, 50, reactionConfig.bust) &&
                !tryReact('eye', eyeLength, 30, reactionConfig.eye) &&
                !tryReact('face', faceLength, 80, reactionConfig.face) &&
                !tryReact('head', headLength, 120, reactionConfig.head) &&
                !tryReact('pant', pantLength, 180, reactionConfig.pant)
            ) {
                // No reaction triggered.
            }
        };

        canvas.onclick = touch_reaction;
        canvas.addEventListener('touchstart', (ev) => {
            touch_reaction(ev.touches[0]);
            ev.preventDefault();
        }, false);
        canvas.addEventListener('touchend', (ev) => {
            ev.preventDefault();
        }, false);
    } catch (error) {
        console.error('Failed to load or decompress model:', error);
        document.getElementById('loading').innerHTML = 'Error!';
    }
}
