# 基于FreeMote的猫娘网页展示

<div align="center">
  <img src="https://teachermate.oss-cn-qingdao.aliyuncs.com/6QCbQ-1754206210534-NekoWebShow_logo.png" alt="NekoWebShow" />
</div>

[展示地址（php版本）](https://show.nekopara.uk)

[展示地址（html版本）](https://chocola-x.github.io/NekoWebShow/)

[部署/使用指南](https://www.nekopara.uk/archives/nekowebshow.html)

使用了[FreeMote WebG](https://github.com/Project-AZUSA/FreeMote-SDK)的SDK作为驱动构建，并且用了[FreeMote](https://github.com/UlyssesWu/FreeMote)的工具进行模型处理。素材来源是[UlyssesWu](https://github.com/UlyssesWu)制作的猫娘动态壁纸。

本分支 `html_version` 是多页面静态版本。入口为 `index.html`，每个模型都有独立的 `模型名.html` 页面，通过菜单跳转切换角色和服装。当前共有 195 个模型页面，文件名与 `data/<模型名>.pure.psb.zip` 一一对应。`fraise-maid.html` 已随新清单调整为 `fraise-maid-a.html` 和 `fraise-maid-b.html`，菜单链接同步更新。

部署时将所有 HTML、JavaScript、CSS、`neko.png`，以及 `background/`、`config/`、`driver/`、`data/`、`sounds/` 保持相对目录结构上传到静态 HTTP(S) 服务器即可，不需要 PHP 或 URL 重写，支持子目录和 GitHub Pages。模型通过 fetch 加载，应通过 HTTP(S) 访问。例如运行 `python3 -m http.server 8000` 后访问 `http://localhost:8000/`。

模型入口、菜单、标题与动作配置由 `config/model-catalog.json` 统一维护。每个模型的展示位置与触摸补充参数来自 `config/model-presentation.json`。背景清单由目录和 `config/background-names.json` 生成到 `config/background-catalog.js`，浏览器直接读取，无需服务器扫描目录。

修改模型清单、展示参数或背景后，运行 `python3 scripts/generate-static.py --mode multi` 更新全部 HTML 与静态背景清单，再提交生成文件。Python 仅在维护时使用，部署后无需 Python 或构建步骤。

`main.js`设置了展示模型相关的参数，主要的设置部分也在`main.js`里面。

## 背景设置

设置菜单从 `background/` 读取背景。直接放在该目录的图片是固定背景；
`background/dynamic/` 中以相同场景名加 `A`、`B`、`C` 结尾的三张图片组成动态场景，
例如 `BG_01A.png`、`BG_01B.png`、`BG_01C.png`。只有三张齐全的场景会出现在菜单中。
场景名称及四种界面语言的译名在 `config/background-names.json` 中维护：固定背景使用完整文件名作为键，动态场景使用去掉 A/B/C 和扩展名的场景名。

动态场景根据浏览器本地时间选择图片：06:00–16:00 使用 A（日间），16:00–18:00 使用 B（夕阳），18:00–次日 06:00 使用 C（夜间）。窗口持续打开时会自动切换，先加载下一张图片，再用 1.8 秒渐变过渡。恢复窗口或改变系统时间后也会重新检查。固定背景不随时间变化，所选背景会在本机保存；旧背景被删除时自动回到有效默认背景。

目前由于我时间和水平有限，调整角色动作和反应需要大量的尝试和时间，目前只是能用水平，希望有想法的可以帮忙优化项目，调整的配置文件在`config/`文件夹内。

项目已经基本上完工，只是动作确实没能力去调好了，希望懂的大佬可以帮帮忙。

允许对项目进行二次开发，但是请不要删除作者相关信息！并且，根据AGPL v3许可，修改后的版本请一并开源并使用相同许可证。
