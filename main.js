function start(psb_url) {
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
    //const psb_url = "./data/azuki-casual.pure.psb";
    run(winWidth,winHeight,psb_url, getConfig());
}

function calculateScale(width, height) {
    // 已知基准尺寸和对应的缩放比例
    const baseWidth = 1200;
    const baseHeight = 1000;
    const baseScaleWH = 0.58; // 1200x1000 对应的比例
    const baseScaleHalf = 0.28; // 600x500 对应的比例

    // 计算相对于基准尺寸的比例
    const scaleByWidth = width / baseWidth
    const scaleByHeight = height / baseHeight

    // 取最小比例来决定缩放比
    const minScale = Math.min(scaleByWidth, scaleByHeight)

    // 简单线性插值，根据最小边决定最终缩放比
    // 如果 minScale <= 0.5（即 600x500 的比例），使用 baseScaleHalf 作为下限
    // 如果 minScale >= 1（即 1200x1000 的比例），使用 baseScaleWH 作为上限
    let scale

    if (minScale <= 0.5) {
        scale = baseScaleHalf * (minScale / 0.5)
    } else if (minScale >= 1) {
        scale = baseScaleWH + (minScale - 1) * (baseScaleWH * 0.2) // 可以自定义扩展
    } else {
        // 在 0.5 到 1 之间做线性插值
        const ratio = (minScale - 0.5) / 0.5
        scale = baseScaleHalf + ratio * (baseScaleWH - baseScaleHalf)
    }

    return parseFloat(scale.toFixed(2)) // 保留两位小数
}

function run(width,height,psb_url,reactionConfig) {


    // initialize emote player
    EmotePlayer.createRenderCanvas(width,height);
    const canvas = document.getElementById('canvas');
    const player = new EmotePlayer(canvas);
    canvas.width = width;
    canvas.height = height;
    player.scale = calculateScale(width, height);
    c = player.coord;
    c[1] -= 40;
    player.coord = c;
    player.diffTimelineSlot4 = '差分用_waiting_loop';

    // load data then, register mouse event
    player.promiseLoadDataFromURL(psb_url)
    .then(() => {
        document.getElementById('loading').innerHTML = "Done!";
        setTimeout(()=>
        {
            document.getElementById('loading').style.visibility = "hidden";
        },1000);
        // mouse move eye tracking reaction
        const eyetracking_rection = (ev) => {
            const eyePosition = player.getMarkerPosition('eye');
            const mouseOffsetX = ev.clientX - eyePosition.clientX;
            const mouseOffsetY = ev.clientY - eyePosition.clientY;
            const angle = Math.atan2(mouseOffsetY, mouseOffsetX);
            const len = Math.sqrt(mouseOffsetX ** 2 + mouseOffsetY ** 2);
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            // eye tracking
            player.setVariableDiff('eyetrack', 'face_eye_LR', len / 3 * c, 500, -1);
            player.setVariableDiff('eyetrack', 'face_eye_UD', len / 3 * s, 500, -1);
            // head tracking
            if (len > 60) {
                player.setVariableDiff('eyetrack', 'head_slant', len / 12 * c, 1000, -1);
                player.setVariableDiff('eyetrack', 'head_LR', len / 6 * c, 1000, -1);
                player.setVariableDiff('eyetrack', 'head_UD', len / 6 * s, 1000, -1);
            }
            // body tracking
            if (len > 120) {
                player.setVariableDiff('eyetrack', 'body_slant', len / 18 * c, 2000, -1);
                player.setVariableDiff('eyetrack', 'body_LR', len / 9 * c, 2000, -1);
                player.setVariableDiff('eyetrack', 'body_UD', len / 9 * s, 2000, -1);
            }
        };
        // bind to mousemove event
        canvas.onmousemove = eyetracking_rection;
        // bind to mobile touch event
        canvas.addEventListener('touchmove', (ev) => {
            eyetracking_rection(ev.touches[0]);
            ev.preventDefault();
        }, false);



        // 应用反应配置
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

        // 鼠标触摸反应函数
        let touching = false;
        const touch_reaction = (ev) => {
            if (touching) return;

            // 计算各个部位的距离（保持原有计算逻辑）
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

            // 胸部触摸反应
            if (bustLength < 50 && reactionConfig.bust?.length) {
                touching = true;
                const reactions = reactionConfig.bust;
                const selected = reactions[Math.floor(Math.random() * reactions.length)];

                console.log('bust touch reaction');
                applyReactionConfig(selected.reaction);

                setTimeout(() => {
                    applyReactionConfig(selected.recovery);
                    touching = false;
                }, selected.duration);
            }
            // 眼部触摸反应
            else if (eyeLength < 30 && reactionConfig.eye?.length) {
                touching = true;
                const reactions = reactionConfig.eye;
                const selected = reactions[Math.floor(Math.random() * reactions.length)];

                console.log('eye touch reaction');
                applyReactionConfig(selected.reaction);

                setTimeout(() => {
                    applyReactionConfig(selected.recovery);
                    touching = false;
                }, selected.duration);
            }
            // 脸部触摸反应
            else if (faceLength < 80 && reactionConfig.face?.length) {
                touching = true;
                const reactions = reactionConfig.face;
                const selected = reactions[Math.floor(Math.random() * reactions.length)];

                console.log('face touch reaction');
                applyReactionConfig(selected.reaction);

                setTimeout(() => {
                    applyReactionConfig(selected.recovery);
                    touching = false;
                }, selected.duration);
            }
            // 头部触摸反应
            else if (headLength < 120 && reactionConfig.head?.length) {
                touching = true;
                const reactions = reactionConfig.head;
                const selected = reactions[Math.floor(Math.random() * reactions.length)];

                console.log('head touch reaction');
                applyReactionConfig(selected.reaction);

                setTimeout(() => {
                    applyReactionConfig(selected.recovery);
                    touching = false;
                }, selected.duration);
            }
            // 裤子触摸反应
            else if (pantLength < 180 && reactionConfig.pant?.length) {
                touching = true;
                const reactions = reactionConfig.pant;
                const selected = reactions[Math.floor(Math.random() * reactions.length)];

                console.log('pant touch reaction');
                applyReactionConfig(selected.reaction);

                setTimeout(() => {
                    applyReactionConfig(selected.recovery);
                    touching = false;
                }, selected.duration);
            }
        };
        // bind to mouse click event
        canvas.onclick = touch_reaction;
        // bind to mobule touch event
        canvas.addEventListener('touchstart', (ev) => {
            touch_reaction(ev.touches[0]);
            ev.preventDefault();
        }, false);
        canvas.addEventListener('touchend', (ev) => {
            ev.preventDefault();
        }, false);
   });
}

