function getConfig(){
  const reactionConfig = {
    bust: [
      {
        reaction: {
          mainTimelineLabel: '怒る01',
          diffTimelineSlot1: 'はじらい',
          diffTimelineSlot2: 'いやいや',
          audio: "./sounds/cinnamon/b01.wav",
          variables: [
            { name: 'arm_type', value: 2, duration: 300 },
            { name: 'face_mouth', value: 30, duration: 500, delay: 0 },
            { name: 'face_talk', value: 10, duration: 1000, delay: 0 }
          ]
        },
        recovery: {
          mainTimelineLabel: 'sample_怒02',
          diffTimelineSlot1: 'がっかり',
          diffTimelineSlot2: '',
          variables: [
            { name: 'arm_type', value: 0, duration: 300 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 1000 }
          ]
        },
        duration: 1500
      },
      {
        reaction: {
          mainTimelineLabel: '頬染め01',
          diffTimelineSlot1: 'いやいや',
          diffTimelineSlot2: 'びっくり1',
          audio: "./sounds/cinnamon/b02.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 3, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '困る00',
          diffTimelineSlot1: 'ぶりっこ',
          diffTimelineSlot2: '笑い',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 2000
      },
      {
        reaction: {
          mainTimelineLabel: '頬染め01',
          diffTimelineSlot1: 'いやいや',
          diffTimelineSlot2: 'びっくり1',
          audio: "./sounds/cinnamon/b03.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 3, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '困る00',
          diffTimelineSlot1: 'ぶりっこ',
          diffTimelineSlot2: '笑い',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 2000
      },
      {
        reaction: {
          mainTimelineLabel: '頬染め03',
          diffTimelineSlot1: 'いやいや',
          diffTimelineSlot2: 'びっくり1',
          audio: "./sounds/cinnamon/b04.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 2, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '楽しい01',
          diffTimelineSlot1: 'ぶりっこ',
          diffTimelineSlot2: '笑い',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 2000
      },
      {
        reaction: {
          mainTimelineLabel: '頬染め00',
          diffTimelineSlot1: 'いやいや2',
          diffTimelineSlot2: 'わくわく',
          audio: "./sounds/cinnamon/b05.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 1, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '楽しい01',
          diffTimelineSlot1: 'ぶりっこ',
          diffTimelineSlot2: '笑い',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 2000
      },
      {
        reaction: {
          mainTimelineLabel: '頬染め00',
          diffTimelineSlot1: 'いやいや2',
          diffTimelineSlot2: 'わくわく',
          audio: "./sounds/cinnamon/b06.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 1, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '楽しい01',
          diffTimelineSlot1: 'ぶりっこ',
          diffTimelineSlot2: '笑い',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 2000
      }
      // 可以添加更多胸部反应配置
    ],
    eye: [
      {
        reaction: {
          mainTimelineLabel: '驚き01',
          diffTimelineSlot1: 'びっくり1',
          diffTimelineSlot2: 'びっくり2',
          audio: "./sounds/cinnamon/h04.wav",
          variables: [
            //{ name: 'face_eye_open', value: 20 },
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 10, duration: 1000 }
          ]
        },
        recovery: {
          mainTimelineLabel: '平常',
          diffTimelineSlot1: '',
          diffTimelineSlot2: '',
          variables: [
            { name: 'face_mouth', value: 0 },
            { name: 'face_eye_open', value: 0 }
          ]
        },
        duration: 1000
      }
      // 可以添加更多眼部反应配置
    ],
    face: [
      {
        reaction: {
          mainTimelineLabel: '喜ぶ02',
          diffTimelineSlot1: 'いやいや2',
          diffTimelineSlot2: '首横振り',
          audio: "./sounds/cinnamon/h01.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 4, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '喜ぶ03',
          diffTimelineSlot1: 'ぶりっこ',
          diffTimelineSlot2: '',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 1700
      },
      {
        reaction: {
          mainTimelineLabel: '喜ぶ02',
          diffTimelineSlot1: 'いやいや2',
          diffTimelineSlot2: '首横振り',
          audio: "./sounds/cinnamon/h02.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 4, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '喜ぶ03',
          diffTimelineSlot1: 'ぶりっこ',
          diffTimelineSlot2: '',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 1700
      },
      {
        reaction: {
          mainTimelineLabel: '困る02',
          diffTimelineSlot1: '悩み',
          diffTimelineSlot2: '首横振り',
          audio: "./sounds/cinnamon/h03.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 1, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '平常',
          diffTimelineSlot1: 'ぶりっこ',
          diffTimelineSlot2: '',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 3000
      },
      {
        reaction: {
          mainTimelineLabel: '楽しい01',
          diffTimelineSlot1: 'いやいや',
          diffTimelineSlot2: '首横振り',
          audio: "./sounds/cinnamon/h04.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 1, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '平常',
          diffTimelineSlot1: 'ぶりっこ',
          diffTimelineSlot2: '',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 1000
      },
      {
        reaction: {
          mainTimelineLabel: '楽しい02',
          diffTimelineSlot1: 'いやいや',
          diffTimelineSlot2: '戸惑い',
          audio: "./sounds/cinnamon/h05.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 1, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '平常',
          diffTimelineSlot1: 'ぶりっこ',
          diffTimelineSlot2: '',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 1000
      },
      {
        reaction: {
          mainTimelineLabel: '困る00',
          diffTimelineSlot1: 'いやいや',
          diffTimelineSlot2: '戸惑い',
          audio: "./sounds/cinnamon/h06.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 1, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '平常',
          diffTimelineSlot1: 'ぶりっこ',
          diffTimelineSlot2: '笑い',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 2000
      },
      {
        reaction: {
          mainTimelineLabel: '楽しい03',
          diffTimelineSlot1: 'わくわく',
          diffTimelineSlot2: 'ごきげん',
          audio: "./sounds/cinnamon/h07.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 4, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '楽しい03',
          diffTimelineSlot1: 'ぶりっこ',
          diffTimelineSlot2: '笑い',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 2000
      },
      {
        reaction: {
          mainTimelineLabel: '困る02',
          diffTimelineSlot1: 'わくわく',
          diffTimelineSlot2: 'ごきげん',
          audio: "./sounds/cinnamon/h08.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 2, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '困る00',
          diffTimelineSlot1: 'ぶりっこ',
          diffTimelineSlot2: '笑い',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 2000
      },
      // 可以添加更多脸部反应配置
    ],
    head: [
      {
        reaction: {
          mainTimelineLabel: '喜ぶ02',
          diffTimelineSlot1: 'いやいや2',
          diffTimelineSlot2: '首横振り',
          audio: "./sounds/cinnamon/h01.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 4, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '喜ぶ03',
          diffTimelineSlot1: 'ぶりっこ',
          diffTimelineSlot2: '',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 1700
      },
      {
        reaction: {
          mainTimelineLabel: '喜ぶ02',
          diffTimelineSlot1: 'いやいや2',
          diffTimelineSlot2: '首横振り',
          audio: "./sounds/cinnamon/h02.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 4, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '喜ぶ03',
          diffTimelineSlot1: 'ぶりっこ',
          diffTimelineSlot2: '',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 1700
      },
      {
        reaction: {
          mainTimelineLabel: '困る02',
          diffTimelineSlot1: '悩み',
          diffTimelineSlot2: '首横振り',
          audio: "./sounds/cinnamon/h03.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 1, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '平常',
          diffTimelineSlot1: 'ぶりっこ',
          diffTimelineSlot2: '',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 3000
      },
      {
        reaction: {
          mainTimelineLabel: '楽しい01',
          diffTimelineSlot1: 'いやいや',
          diffTimelineSlot2: '首横振り',
          audio: "./sounds/cinnamon/h04.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 1, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '平常',
          diffTimelineSlot1: 'ぶりっこ',
          diffTimelineSlot2: '',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 1000
      },
      {
        reaction: {
          mainTimelineLabel: '楽しい02',
          diffTimelineSlot1: 'いやいや',
          diffTimelineSlot2: '戸惑い',
          audio: "./sounds/cinnamon/h05.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 1, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '平常',
          diffTimelineSlot1: 'ぶりっこ',
          diffTimelineSlot2: '',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 1000
      },
      {
        reaction: {
          mainTimelineLabel: '困る00',
          diffTimelineSlot1: 'いやいや',
          diffTimelineSlot2: '戸惑い',
          audio: "./sounds/cinnamon/h06.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 1, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '平常',
          diffTimelineSlot1: 'ぶりっこ',
          diffTimelineSlot2: '笑い',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 2000
      },
      {
        reaction: {
          mainTimelineLabel: '楽しい03',
          diffTimelineSlot1: 'わくわく',
          diffTimelineSlot2: 'ごきげん',
          audio: "./sounds/cinnamon/h07.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 4, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '楽しい03',
          diffTimelineSlot1: 'ぶりっこ',
          diffTimelineSlot2: '笑い',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 2000
      },
      {
        reaction: {
          mainTimelineLabel: '困る02',
          diffTimelineSlot1: 'わくわく',
          diffTimelineSlot2: 'ごきげん',
          audio: "./sounds/cinnamon/h08.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 2, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '困る00',
          diffTimelineSlot1: 'ぶりっこ',
          diffTimelineSlot2: '笑い',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 2000
      },
      // 可以添加更多头部反应配置
    ],
    pant: [
      {
        reaction: {
          mainTimelineLabel: '哀しい00',
          diffTimelineSlot1: 'はじらい',
          diffTimelineSlot2: 'ひく',
          audio: "./sounds/cinnamon/u01.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 1, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '困る00',
          diffTimelineSlot1: 'ためいき',
          diffTimelineSlot2: 'ひく',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 4000
      },
      {
        reaction: {
          mainTimelineLabel: '哀しい00',
          diffTimelineSlot1: 'はじらい',
          diffTimelineSlot2: 'ひく',
          audio: "./sounds/cinnamon/u02.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 1, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '困る00',
          diffTimelineSlot1: 'ためいき',
          diffTimelineSlot2: 'ひく',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 2000
      },
      {
        reaction: {
          mainTimelineLabel: '哀しい00',
          diffTimelineSlot1: 'はじらい',
          diffTimelineSlot2: 'ひく',
          audio: "./sounds/cinnamon/u03.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 1, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '困る00',
          diffTimelineSlot1: 'ためいき',
          diffTimelineSlot2: 'ひく',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 3000
      },
      {
        reaction: {
          mainTimelineLabel: '哀しい00',
          diffTimelineSlot1: 'はじらい',
          diffTimelineSlot2: 'ひく',
          audio: "./sounds/cinnamon/u04.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 1, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '困る00',
          diffTimelineSlot1: 'ためいき',
          diffTimelineSlot2: 'ひく',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 3000
      },
      {
        reaction: {
          mainTimelineLabel: '哀しい00',
          diffTimelineSlot1: 'はじらい',
          diffTimelineSlot2: 'ひく',
          audio: "./sounds/cinnamon/u05.wav",
          variables: [
            { name: 'face_mouth', value: 30, duration: 500 },
            { name: 'face_talk', value: 1, duration: 500 }
          ]
        },
        recovery: {
          mainTimelineLabel: '困る00',
          diffTimelineSlot1: 'ためいき',
          diffTimelineSlot2: 'ひく',
          variables: [
            { name: 'face_eye_open', value: 0, duration: 250 },
            { name: 'face_mouth', value: 0, duration: 500 },
            { name: 'face_talk', value: 0, duration: 500 }
          ]
        },
        duration: 4500
      }
      // 可以添加更多裤子反应配置
    ]
  };
  return reactionConfig
}
