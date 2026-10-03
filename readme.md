# 基于FreeMote的猫娘网页展示

<div align="center">
  <img src="https://teachermate.oss-cn-qingdao.aliyuncs.com/6QCbQ-1754206210534-NekoWebShow_logo.png" alt="NekoWebShow" />
</div>

[展示地址（php版本）](https://show.nekopara.uk)

[展示地址（html版本）](https://chocola-x.github.io/NekoWebShow/)

[部署/使用指南](https://www.nekopara.uk/archives/nekowebshow.html)

使用了[FreeMote WebG](https://github.com/Project-AZUSA/FreeMote-SDK)的SDK作为驱动构建，并且用了[FreeMote](https://github.com/UlyssesWu/FreeMote)的工具进行模型处理。素材来源是[UlyssesWu](https://github.com/UlyssesWu)制作的猫娘动态壁纸。

本分支 `php_version` 使用 `index.php` 渲染角色页面，模型路由和菜单由 `config/model-catalog.json` 统一生成，展示位置与触摸补充参数在 `config/model-presentation.json` 中维护。当前清单包含 195 个模型，所有模型复用已有角色的动作与语音配置。

部署时保持 `background/`、`config/`、`driver/`、`data/`、`sounds/` 与入口文件的相对目录结构。`index.php` 中的 `$local_mode` 控制菜单链接：默认 `false` 使用各角色域名与路径路由，需要把角色路径重写到 `index.php`；设置为 `true` 使用 `./?char=模型名`，适合单站和子目录部署，不需要 URL 重写。也可以直接访问 `index.php?char=chocola-lolita`。请按实际部署修改角色域名。

`main.js`设置了展示模型相关的参数，主要的设置部分也在`main.js`里面。

## 背景设置

设置菜单从 `background/` 读取背景。直接放在该目录的图片是固定背景；
`background/dynamic/` 中以相同场景名加 `A`、`B`、`C` 结尾的三张图片组成动态场景，
例如 `BG_01A.png`、`BG_01B.png`、`BG_01C.png`。只有三张齐全的场景会出现在菜单中。
场景名称及四种界面语言的译名在 `config/background-names.json` 中维护：固定背景使用完整文件名作为键，动态场景使用去掉 A/B/C 和扩展名的场景名。

动态场景根据浏览器本地时间选择图片：06:00–16:00 使用 A（日间），16:00–18:00 使用 B（夕阳），18:00–次日 06:00 使用 C（夜间）。窗口持续打开时会自动切换，先加载下一张图片，再用 1.8 秒渐变过渡。恢复窗口或改变系统时间后也会重新检查。固定背景不随时间变化，所选背景会在本机保存；旧背景被删除时自动回到有效默认背景。

目前项目主要部分已经基本完工，但是对于角色动作的配布，这方面我确实能力有限，弄得不是很好。调整角色动作和反应需要大量的尝试和时间，目前只是能用水平，并没有做的很好，调整的配置文件在`config/`文件夹内。希望有大佬可以指点帮助一下！

允许对项目进行二次开发，但是请不要删除作者相关信息！并且，根据AGPL v3许可，修改后的版本请一并开源并使用相同许可证。
