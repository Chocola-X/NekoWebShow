function getConfig(){
  const reactionConfig = {
    //胸部触碰反应定义区
    bust: [
      {
        reaction: {
          mainTimelineLabel: '怒る01',//主动作
          diffTimelineSlot1: 'はじらい',//副动作1
          diffTimelineSlot2: 'いやいや',//副动作2
          audio: "./sounds/azuki/b01.wav",//声音
          variables: [
            { name: 'arm_type', value: 2, duration: 300 },//细节调整参数，第一个是调整的类型，第二个是调整的值，不同的数值会有不同的效果，具体要翻阅每个模型的json配置文件，第三个是动作持续时间，单位为毫秒，第四个是延迟，可以不传，我测试下来似乎没有影响？
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
      },//这里下面可以接下一组动作，实际触碰这个部位的时候会在这一整个搭配组合中进行随机的抽取。
      {
        reaction: {
          mainTimelineLabel: '頬染め01',
          diffTimelineSlot1: 'いやいや',
          diffTimelineSlot2: 'びっくり1',
          audio: "./sounds/azuki/b02.wav",
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

      // 可以添加更多胸部反应配置
    ],
    //眼部触碰反应定义区，同上，以此类推
    eye: [
      {
        reaction: {
          mainTimelineLabel: '驚き01',
          diffTimelineSlot1: 'びっくり1',
          diffTimelineSlot2: 'びっくり2',
          audio: "./sounds/azuki/h04.wav",
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
          audio: "./sounds/azuki/h01.wav",
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
          audio: "./sounds/azuki/h02.wav",
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

      // 可以添加更多脸部反应配置
    ],
    head: [
      {
        reaction: {
          mainTimelineLabel: '喜ぶ02',
          diffTimelineSlot1: 'いやいや2',
          diffTimelineSlot2: '首横振り',
          audio: "./sounds/azuki/h01.wav",
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
          audio: "./sounds/azuki/h02.wav",
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

      // 可以添加更多头部反应配置
    ],
    pant: [
      {
        reaction: {
          mainTimelineLabel: '哀しい00',
          diffTimelineSlot1: 'はじらい',
          diffTimelineSlot2: 'ひく',
          audio: "./sounds/azuki/u01.wav",
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
          audio: "./sounds/azuki/u02.wav",
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

      // 可以添加更多裤子反应配置
    ]
  };
  return reactionConfig
}
