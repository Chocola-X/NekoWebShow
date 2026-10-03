# NekoWebShow · 基于 FreeMote 的猫娘网页展示

<div align="center">
  <img src="https://teachermate.oss-cn-qingdao.aliyuncs.com/6QCbQ-1754206210534-NekoWebShow_logo.png" alt="NekoWebShow" />
</div>

在浏览器中展示《猫娘乐园》的 E-mote 动态立绘，支持角色换装、触摸反应、语音与口型同步，以及随本地时间变化的背景，也可以用作网页动态壁纸。

- [PHP 版展示](https://show.nekopara.uk)
- [HTML 版展示](https://chocola-x.github.io/NekoWebShow/)
- [部署与使用指南](https://www.nekopara.uk/archives/nekowebshow.html)

## 功能概览

- 当前模型清单包含 8 个角色、195 个模型，涵盖不同服装、站姿及版本；菜单和页面标题会显示对应的服装与版本信息。
- 支持触摸反应、语音播放和口型同步；触摸区域跟随模型移动和缩放。
- 解锁角色后可以拖动立绘、通过鼠标滚轮缩放；设置中可以锁定位置与大小，或重设角色位置。
- 提供帧率限制、静音、背景选择，以及简体中文、繁体中文、英语和日语界面。
- 包含 16 个固定背景和 35 组动态场景，共 121 张背景图片；背景选择会在本机保存。

## 分支说明

本 README 位于 `html_version_v2` 分支。各分支使用相同的模型清单与角色配置，但入口、导航和部署方式不同。

| 分支 | 用途与入口 | 角色切换方式 | 部署要求 |
| --- | --- | --- | --- |
| [`main`](https://github.com/Chocola-X/NekoWebShow/tree/main) | 主开发分支，入口为 `index.php`，包含模型转换素材 | PHP 渲染页面，使用查询参数或角色域名下的路径切换 | PHP；路径模式需要 URL 重写 |
| [`php_version`](https://github.com/Chocola-X/NekoWebShow/tree/php_version) | PHP 部署分支，入口为 `index.php`，保留网页运行所需文件 | 与 `main` 相同，切换模型会加载新页面 | PHP；路径模式需要 URL 重写 |
| [`html_version`](https://github.com/Chocola-X/NekoWebShow/tree/html_version) | 多页面静态分支，入口为 `index.html`，每个模型有独立 HTML 页面 | 跳转到 `<模型名>.html` | 静态 HTTP(S) 服务，无需 PHP 或 URL 重写 |
| [`html_version_v2`](https://github.com/Chocola-X/NekoWebShow/tree/html_version_v2) | 单页面静态分支，只有一个 `index.html` 入口 | 使用 `#模型名`，在同一页面中无刷新切换 | 静态 HTTP(S) 服务，无需 PHP 或 URL 重写 |

有 PHP 环境时可以使用 `php_version`；需要独立模型页面时使用 `html_version`；需要在同一页面连续切换角色时使用 `html_version_v2`。两种静态版本均支持 GitHub Pages 和子目录部署。

各分支的部署细节也可查看对应分支中的 `readme.md`。切换分支后，请使用该分支的入口和资源文件一起部署。

## 部署与启动

部署时保留以下文件和目录的相对结构：

```text
index.html
character-switcher.js
main.js
ui.js
ui.css
locales.js
background.js
fflate.js
neko.png
config/
driver/
data/
background/
sounds/
```

需要支持 WebGL 和现代 JavaScript 的浏览器。正式部署不需要 PHP、数据库或前端构建步骤；GitHub Pages 和子目录部署均可使用。

### 单页面静态版本：`html_version_v2`

HTML 入口只有 `index.html`。模型链接使用 URL 片段，例如：

```text
index.html#chocola-date-a
index.html#vanilla-casual-a-with-bell
index.html#fraise-maid-b
```

切换和重载在同一文档、画布与 WebGL 设备中完成；再次点击当前模型菜单可以重新加载该模型。浏览器前进、后退也会切换模型。

加载成功后，角色选择保存到当前部署目录作用域内的 cookie，有效期为一年。入口没有模型片段时会恢复已保存的选择；URL 中的有效模型片段优先。禁止 cookie 时仍可通过菜单切换。

### 静态版本的本地预览

在本分支的项目根目录执行：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000/`。Python 仅用于这个本地预览示例，正式部署可以使用任意静态 HTTP(S) 服务。模型通过 `fetch` 加载，请通过 HTTP(S) 访问页面。

## 使用方法

1. 点击猫爪图标打开侧边栏，展开角色菜单选择服装、站姿和版本。
2. 点击立绘上的触摸区域触发动作；带语音的反应会播放声音并驱动口型。
3. 在设置中调整帧率、静音和背景。浏览器首次播放声音可能需要一次用户点击。
4. 需要移动或缩放立绘时，关闭“锁定人物位置与大小”；找不到被移开的角色时，使用“重设角色位置”。

## 模型与动作配置

| 文件或目录 | 作用 |
| --- | --- |
| [`config/model-catalog.json`](config/model-catalog.json) | 模型名、角色、服装、版本信息，以及使用的动作配置；PHP 路由和静态菜单以此为依据 |
| [`config/model-presentation.json`](config/model-presentation.json) | 每个模型的可见下缘和补充触摸标记，用于展示位置与触摸区域适配 |
| [`config/`](config/) 中的角色配置 | 触摸反应、表情、动作、语音及时间安排；幼年模型使用对应的 `ko*` 配置 |
| [`config/reaction-library.js`](config/reaction-library.js) | 公共反应配置与默认恢复动作 |
| [`data/`](data/) | 运行时加载的 `<模型名>.pure.psb.zip` 文件 |
| [`sounds/`](sounds/) | 各角色的语音文件 |
| [`main.js`](main.js) | 模型加载、响应式布局、输入交互、动作播放与口型同步 |
| [`driver/emoteplayer.js`](driver/emoteplayer.js) | 播放器封装、坐标转换与触摸区域计算 |
| [`config/background-catalog.js`](config/background-catalog.js) | 预生成的固定背景与动态场景清单 |
| [`config/model-catalog.js`](config/model-catalog.js) | 预生成的模型与展示参数清单 |
| [`character-switcher.js`](character-switcher.js) | 模型片段导航、加载状态和成功选择的保存 |

新增模型时，请将 ZIP、模型清单、对应动作配置和展示参数一起维护。服装可以复用已有角色配置，但需要确认模型支持其中的动作与变量。

角色动作和语音配布仍有改善空间。欢迎在 `config/` 中调整反应、表情和时间安排，并通过实际画面与试听检查效果。

### 更新页面与静态清单

本分支的页面和 JavaScript 清单由 [`scripts/generate-static.py`](scripts/generate-static.py) 生成。新增或调整模型、展示参数、背景及背景译名后，在项目根目录执行：

```bash
python3 scripts/generate-static.py --mode single
```

生成后将 `index.html`、`config/model-catalog.js`、`config/background-catalog.js` 与更新的资源一起提交并部署。生成器会保持模型菜单与模型文件对应。

请修改 JSON 清单和对应资源后再生成，直接修改生成文件会在下次生成时被覆盖。Python 仅用于维护，访问已部署网站无需 Python。

### 动作配置与连续切换

本分支会预加载各角色的动作配置，通过 `NekoConfigs` 注册；每次切换按模型清单选取配置，并应用该模型的展示位置与触摸补充参数。新增模型若使用了新的配置文件，重新生成入口后再部署。

切换时销毁旧播放器，停止语音与嘴型，取消下载、解压和动作定时器，并移除旧交互监听器。画布和 WebGL 设备持续复用，页面不会为每个模型创建独立的设备。

驱动使用固定堆，入口预留 256 MiB，供连续切换时使用。整个页面共享这一个驱动堆；浏览器总内存还包含纹理、画布和解压数据。

### 浏览器回归验证

本分支提供 [`scripts/verify-switch.browser.cjs`](scripts/verify-switch.browser.cjs)。需要 Node.js 22+ 与 Chromium；先启动本地静态服务：

```bash
python3 -m http.server 18220 --bind 127.0.0.1
```

另行启动带 `--remote-debugging-port=9260` 参数的 Chromium，然后在新终端执行：

```bash
node scripts/verify-switch.browser.cjs
```

可通过 `NEKO_TEST_URL` 与 `NEKO_CDP_URL` 指定服务和调试地址。验证会按清单遍历全部模型，检查动画、设备复用、重复切换的内存高水位、监听器数量、加载取消、失败重试、标题、前进后退、窗口尺寸与选择恢复；结果与截图写入系统临时目录。

## 背景设置

背景菜单读取预生成的 `config/background-catalog.js`。修改图片或译名后，请运行上面的生成命令。

固定背景放在 `background/` 根目录；动态场景放在 `background/dynamic/`。以相同场景名加 `A`、`B`、`C` 结尾的三张图片组成一组，例如：

```text
background/dynamic/BG_01A.png
background/dynamic/BG_01B.png
background/dynamic/BG_01C.png
```

只有 A/B/C 三张齐全的场景会出现在菜单中。名称与四种界面语言的译名在 [`config/background-names.json`](config/background-names.json) 中维护：固定背景使用完整文件名作为键，动态场景使用去掉 A/B/C 和扩展名的场景名。

动态场景根据**浏览器本地时间**选择图片：

| 本地时间 | 图片阶段 |
| --- | --- |
| 06:00–16:00 | A · 日间 |
| 16:00–18:00 | B · 夕阳 |
| 18:00–次日 06:00 | C · 夜间 |

窗口持续打开时会自动检查时段，先加载下一张图片，再进行 1.8 秒渐变。恢复窗口或改变系统时间后也会重新检查。固定背景不随时间变化；所选背景在本机保存，已删除的旧背景选择会自动回到有效默认背景。

## 技术与素材来源

使用了 [FreeMote WebG](https://github.com/Project-AZUSA/FreeMote-SDK) 的 SDK 作为驱动构建，并且用了 [FreeMote](https://github.com/UlyssesWu/FreeMote) 的工具进行模型处理。素材来源是 [UlyssesWu](https://github.com/UlyssesWu) 制作的猫娘动态壁纸，后续添加的动态立绘和背景图来源是 NEKOPARA Vol 4 和 Afer 的解包素材（感谢正版游戏没有加密，直接就拿出来了）。

## 许可

项目代码采用 [AGPL v3](LICENSE)。允许二次开发，请保留作者相关信息，并使用相同许可证开源修改后的代码。
