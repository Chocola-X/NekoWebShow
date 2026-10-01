// index.php 先加载 reaction-library.js，再加载角色配置。
// 一条语音只定义一次；多个触摸区域共享同一个反应。
function getConfig() {
    return NekoReactions.create('chocola', '示例：明快回应和轻微抱怨', [
        // id, zones, WAV 实测毫秒, 主表情, diff 动作, 意图
        ['h01', 'head face', 1070, '喜ぶ00', 'うんうん', '轻快回应摸头'],
        // 第 1554ms 换表情；语音继续播放，结束后统一复位。
        ['h06', 'face', 2391, '困る00', 'いやいや', '轻微抱怨后平复',
            [1554, '平常', '疑問']]
    ]);
}
