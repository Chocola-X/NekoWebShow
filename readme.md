# 基于FreeMote的猫娘网页展示

<div align="center">
  <img src="https://teachermate.oss-cn-qingdao.aliyuncs.com/6QCbQ-1754206210534-NekoWebShow_logo.png" alt="NekoWebShow" />
</div>

[展示地址（php版本）](https://show.nekopara.uk)

[展示地址（html版本）](https://chocola-x.github.io/NekoWebShow/)

[部署/使用指南](https://www.nekopara.uk/archives/nekowebshow.html)

使用了[FreeMote WebG](https://github.com/Project-AZUSA/FreeMote-SDK)的SDK作为驱动构建，并且用了[FreeMote](https://github.com/UlyssesWu/FreeMote)的工具进行模型处理。素材来源是[UlyssesWu](https://github.com/UlyssesWu)制作的猫娘动态壁纸。

本分支 `html_version_v2` 是单入口静态版本。打开 `index.html`，通过菜单选择角色和服装；“重新加载角色”会重新加载并初始化当前模型。切换和重载均在同一文档、同一 canvas 和 WebGL 设备中完成，不刷新页面、不使用 iframe。

将项目的 `index.html`、JavaScript、CSS 和 `config/`、`driver/`、`data/`、`img/`、`sounds/`、`neko.png` 保持相对目录结构部署到静态 HTTP(S) 服务器即可，无需 PHP、构建或 URL 重写。例如在项目目录执行 `python3 -m http.server 8000`，访问 `http://localhost:8000/`。模型通过 fetch 加载，应通过 HTTP(S) 访问。

加载成功后，角色和服装保存到有效期一年的 cookie（作用域为当前部署目录）。打开不带角色片段的入口时自动恢复；禁止 cookie 时仍可正常切换。链接片段优先于 cookie，例如 `index.html#vanilla-maid`，浏览器前进/后退也会切换模型。原有的各角色 HTML 已聚合到 `index.html`，旧链接请改用这种片段形式。

角色、服装、模型 ZIP 和动作配置的对应关系集中在 `index.html` 菜单的 `href`、`data-model`、`data-config` 属性中，幼年模型保留各自的 `ko*` 配置。动作数据仍在 `config/` 中，通过 `NekoConfigs` 注册，避免多个 `getConfig()` 相互覆盖。

切换时会销毁旧原生 player，停止声音及嘴型、取消下载/解压/动作定时器，并移除旧交互监听器。渲染设备保留复用，空闲时停止动画循环。驱动是固定堆的 asm.js 版本；入口将堆设为 256 MiB，为连续切换时的分配器碎片保留余量（原默认 144 MiB 在连续换装时会耗尽）。这不是每个角色各占 256 MiB；页面始终只有一个驱动堆。实际浏览器总内存还包含纹理、画布和解压数据。

`main.js`设置了展示模型相关的参数，主要的设置部分也在`main.js`里面。

目前由于我时间和水平有限，调整角色动作和反应需要大量的尝试和时间，目前只是能用水平，希望有想法的可以帮忙优化项目，调整的配置文件在`config/`文件夹内。

项目已经基本上完工，只是动作确实没能力去调好了，希望懂的大佬可以帮帮忙。

允许对项目进行二次开发，但是请不要删除作者相关信息！并且，根据AGPL v3许可，修改后的版本请一并开源并使用相同许可证。

浏览器回归验证（Node.js 22+）：先启动静态服务 `python3 -m http.server 18220 --bind 127.0.0.1` 和带 `--remote-debugging-port=9260` 参数的 Chromium，然后运行 `node tests/character-switch.browser.cjs`。可用 `NEKO_TEST_URL` 和 `NEKO_CDP_URL` 指定服务地址。测试会遍历 59 个模型，验证动画推进、同文档/画布/设备复用、重复切换内存高水位、监听器数量、取消加载、故障重试、交互中切换和 cookie 恢复；测试 JSON 与截图写入系统临时目录。
