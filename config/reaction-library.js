/* Shared mechanics only: each character file owns its voice-to-action choices. */
const NekoReactions = (() => {
    const idle = '差分用_waiting_loop';
    function pose(main, gesture = '') {
        return {
            mainTimelineLabel: main,
            // Explicit slots prevent the player's legacy zone gesture from changing the emotion.
            diffTimelineSlots: [gesture, '', '', idle, '', ''],
            variables: []
        };
    }

    function create(character, description, voices) {
        const config = { bust: [], eye: [], face: [], head: [], pant: [] };
        for (const voice of voices) {
            const [id, zones, duration, main, gesture, note, followup] = voice;
            const entry = {
                id: `${character}/${id}`,
                note,
                reaction: { ...pose(main, gesture), audio: `./sounds/${character}/${id}.wav` },
                recovery: {
                    ...pose('平常'),
                    variables: [
                        { name: 'face_talk', value: 0, duration: 120 },
                        { name: 'arm_type', value: 0, duration: 240 },
                        { name: 'move_LR', value: 0, duration: 240 },
                        { name: 'move_UD', value: 0, duration: 240 },
                        { name: 'body_slant', value: 0, duration: 240 }
                    ]
                },
                duration: Math.max(650, duration),
                recoveryDuration: 320,
                beats: followup ? [{ at: followup[0], ...pose(followup[1], followup[2]) }] : []
            };
            // A voice reused for head/cheek touches always points at the very same reaction.
            for (const zone of zones.split(' ')) config[zone].push(entry);
        }
        // Eye touches are a short, silent protective blink, never a random petting voice.
        config.eye.push({
            id: `${character}/blink`, note: '碰到眼睛：闭眼躲闪，再恢复注视',
            reaction: {
                // No expression timeline: its frame-zero eye value would overwrite the blink.
                ...pose(''),
                variables: [{ name: 'face_eye_open', value: 10, duration: 90 }]
            },
            recovery: {
                ...pose('平常'),
                variables: [{ name: 'face_eye_open', value: 0, duration: 180 }]
            },
            duration: 650, recoveryDuration: 220
        });
        Object.defineProperty(config, 'description', { value: description });
        return config;
    }
    return { create };
})();
