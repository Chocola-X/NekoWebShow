function start(zipUrl) {
    // 获取窗口宽度
    if (window.innerWidth)
        winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
        winWidth = document.body.clientWidth;
    // 获取窗口高度
    if (window.innerHeight)
        winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;
    // 通过深入 Document 内部对 body 进行检测，获取窗口大小
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)
    {
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
    }
    //const zipUrl = "./data/azuki-casual.pure.psb.zip";
    run(winWidth,winHeight,zipUrl, getConfig());
}

function getHeightRatio(height) {
    // 已知点 (height1, ratio1) 和 (height2, ratio2)
    const height1 = 600;
    const ratio1 = 0.3;
    const height2 = 1600;
    const ratio2 = 0.9;

    // 计算斜率 m
    const m = (ratio2 - ratio1) / (height2 - height1);

    // 计算截距 b
    const b = ratio1 - m * height1;

    // 计算对应高度的高度比例
    let ratio = m * height + b;

    // 确保比例不低于0.05
    if (ratio < 0.05) {
        ratio = 0.05;
    }

    return ratio;
}

async function run(width, height, zipUrl, reactionConfig) {
    // Initialize EmotePlayer
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
    //增加前端解压zip功能，减少数据传输量
    try {
        // 1. Fetch the ZIP file
        const resp = await fetch(zipUrl);
        if (!resp.ok) throw new Error(`Failed to load ${zipUrl}`);
        const zipData = new Uint8Array(await resp.arrayBuffer());

        // 2. Decompress ZIP using fflate
        const files = await new Promise((resolve, reject) => {
            fflate.unzip(zipData, (err, unzipped) => {
                if (err) {
                    console.error("ZIP decompression error:", err);
                    reject(err);
                } else {
                    resolve(unzipped);
                }
            });
        });

        // 3. Find the .bin model file (assume only one .bin file)
        const binFileName = Object.keys(files).find(name => name.endsWith('.psb'));
        if (!binFileName) {
            throw new Error("No .bin file found in ZIP");
        }

        const modelData = files[binFileName];

        // 4. Create blob URL for EmotePlayer
        const blob = new Blob([modelData], { type: 'application/octet-stream' });
        const fakeUrl = URL.createObjectURL(blob);

        // 5. Load model
        await player.promiseLoadDataFromURL(fakeUrl);

        // ===== Model loaded successfully =====
        document.getElementById('loading').innerHTML = "Done!";
        setTimeout(() => {
            document.getElementById('loading').style.visibility = "hidden";
        }, 1000);

        // === Eye tracking ===
        const eyetracking_reaction = (ev) => {
            const eyePosition = player.getMarkerPosition('eye');
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

        // === Reaction config helper ===
        function applyReactionConfig(config) {
            player.mainTimelineLabel = config.mainTimelineLabel || '';
            player.diffTimelineSlot1 = config.diffTimelineSlot1 || '';
            player.diffTimelineSlot2 = config.diffTimelineSlot2 || '';

            if (config.audio) {
                player.playAudio(config.audio);
            }

            if (config.variables) {
                config.variables.forEach(v => {
                    if (v.duration !== undefined && v.delay !== undefined) {
                        player.setVariable(v.name, v.value, v.duration, v.delay);
                    } else if (v.duration !== undefined) {
                        player.setVariable(v.name, v.value, v.duration);
                    } else {
                        player.setVariable(v.name, v.value);
                    }
                });
            }
        }

        // === Touch/click reactions ===
        let touching = false;
        const touch_reaction = (ev) => {
            if (touching) return;

            const bustPosition = player.getMarkerPosition('bust');
            const bustLength = Math.sqrt((bustPosition.clientX - ev.clientX) ** 2 + (bustPosition.clientY - ev.clientY) ** 2);

            const eyePosition = player.getMarkerPosition('eye');
            const eyeLength = Math.sqrt((eyePosition.clientX - ev.clientX) ** 2 + (eyePosition.clientY - ev.clientY) ** 2);

            const headPositionAX = player.getMarkerPosition('headAX');
            const headPositionAY = player.getMarkerPosition('headAY');
            const headPositionBX = player.getMarkerPosition('headBX');
            const headPositionBY = player.getMarkerPosition('headBY');
            const headCenterX = (headPositionAX.clientX + headPositionBX.clientX) / 2;
            const headCenterY = (headPositionAY.clientY + headPositionBY.clientY) / 2;
            const headLength = Math.sqrt((headCenterX - ev.clientX) ** 2 + (headCenterY - ev.clientY) ** 2);

            const faceLength = Math.sqrt(
                (headCenterX - ev.clientX) ** 2 +
                ((headCenterY + 40) - ev.clientY) ** 2
            );

            const pantPositionAX = player.getMarkerPosition('pantAX');
            const pantPositionAY = player.getMarkerPosition('pantAY');
            const pantPositionBX = player.getMarkerPosition('pantBX');
            const pantPositionBY = player.getMarkerPosition('pantBY');
            const pantCenterX = (pantPositionAX.clientX + pantPositionBX.clientX) / 2;
            const pantCenterY = (pantPositionAY.clientY + pantPositionBY.clientY) / 2;
            const pantLength = Math.sqrt((pantCenterX - ev.clientX) ** 2 + (pantCenterY - ev.clientY) ** 2);

            console.log(`Distances: Head=${headLength.toFixed(2)}, Bust=${bustLength.toFixed(2)}, Eye=${eyeLength.toFixed(2)}`);

            const tryReact = (zone, threshold, reactions) => {
                if (zone < threshold && reactions?.length) {
                    touching = true;
                    const selected = reactions[Math.floor(Math.random() * reactions.length)];
                    console.log(`${threshold} touch reaction`);
                    applyReactionConfig(selected.reaction);
                    setTimeout(() => {
                        applyReactionConfig(selected.recovery);
                        touching = false;
                    }, selected.duration);
                    return true;
                }
                return false;
            };

            if (
                !tryReact(bustLength, 50, reactionConfig.bust) &&
                !tryReact(eyeLength, 30, reactionConfig.eye) &&
                !tryReact(faceLength, 80, reactionConfig.face) &&
                !tryReact(headLength, 120, reactionConfig.head) &&
                !tryReact(pantLength, 180, reactionConfig.pant)
            ) {
                // No reaction triggered
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

        // Clean up blob URL
        URL.revokeObjectURL(fakeUrl);

    } catch (error) {
        console.error("Failed to load or decompress model:", error);
        document.getElementById('loading').innerHTML = "Error!";
    }
}
