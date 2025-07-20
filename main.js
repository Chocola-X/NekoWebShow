function start() {
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

    // initialize emote player
    EmotePlayer.createRenderCanvas(winWidth, winHeight);
    const canvas = document.getElementById('canvas');
    const player = new EmotePlayer(canvas);
    canvas.width = winWidth;
    canvas.height = winHeight;
    player.scale = 0.7;
    c = player.coord;
    c[1] -= 40;
    player.coord = c;
    player.diffTimelineSlot4 = '差分用_waiting_loop';

    // load data then, register mouse event
    player.promiseLoadDataFromURL("./data/azuki-casual.pure.psb")
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

        // mouse touch reaction
        let touching = false;
        const touch_reaction = (ev) => {
            if (touching)
                return;
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
            // bust touch reaction
            if (bustLength < 50) {
                touching = true;
                player.mainTimelineLabel = '怒る01';
                player.diffTimelineSlot1 = 'はじらい';
                player.diffTimelineSlot2 = 'いやいや';
                player.setVariable('arm_type', 2, 300);
                player.playAudio("./sounds/azuki/b01.wav");
                player.setVariable("face_mouth", 35, 250, 0);  // 嘴型形状，数值范围通常0-100
                player.setVariable("face_talk", 1, 150, 0);  // 说话动作，数值范围0-1
                console.log(`bust touch reaction`);
                setTimeout(() => {
                    touching = false;
                    player.mainTimelineLabel = 'sample_怒02';
                    player.diffTimelineSlot1 = 'がっかり';
                    player.diffTimelineSlot2 = '';
                    player.setVariable('arm_type', 0, 300);
                }, 1500);
            }
            // eye touch reaction
            else if (eyeLength < 30) {
                touching = true;
                player.mainTimelineLabel = '困る01';
                player.diffTimelineSlot1 = 'ひく';
                player.setVariable('face_eye_open', 10);
                console.log(`eye touch reaction`);
                setTimeout(() => {
                    touching = false;
                    player.mainTimelineLabel = '平常';
                    player.diffTimelineSlot1 = '';
                    player.setVariable('face_mouth', 0);
                    player.setVariable('face_eye_open', 0);
                }, 1000);
            }
            // face touch reaction
            else if (faceLength < 80) {
                touching = true;
                player.mainTimelineLabel = '喜ぶ01';
                player.diffTimelineSlot1 = 'わくわく';
                player.setVariable('face_talk', 10, 20);
                console.log(`face touch reaction`);
                setTimeout(() => {
                    touching = false;
                    player.mainTimelineLabel = '平常';
                    player.diffTimelineSlot1 = '';
                    player.setVariable('face_eye_open', 0);
                }, 1000);
            }
            // head touch reaction
            else if(headLength < 120) {
                touching = true;
                player.mainTimelineLabel = '楽しい01';
                player.diffTimelineSlot1 = 'うんうん';
                player.playAudio("./sounds/azuki/h02.wav");
                player.setVariable('face_mouth', 20);
                player.setVariable('face_talk', 20);
                console.log(`head touch reaction`);
                setTimeout(() => {
                    touching = false;
                    player.mainTimelineLabel = 'sample_喜04';
                    player.diffTimelineSlot1 = '';
                }, 1500);
            }
            // pant touch reaction
            else if(pantLength < 180) {
                touching = true;
                player.mainTimelineLabel = '驚き02';
                player.diffTimelineSlot1 = 'いやいや';
                player.diffTimelineSlot2 = 'ぷんぷん';
                player.diffTimelineSlot3 = 'はじらい';
                console.log(`pant touch reaction`);
                setTimeout(() => {
                    touching = false;
                    player.mainTimelineLabel = '平常';
                    player.diffTimelineSlot1 = '';
                    player.diffTimelineSlot2 = '';
                }, 1500)
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

