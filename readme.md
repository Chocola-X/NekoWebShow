# 基于FreeMote的猫娘网页展示

<div align="center">
  <img src="https://teachermate.oss-cn-qingdao.aliyuncs.com/6QCbQ-1754206210534-NekoWebShow_logo.png" alt="NekoWebShow" />
</div>

[展示地址](https://show.nekopara.uk)

[部署/使用指南](https://www.nekopara.uk/archives/nekowebshow.html)

使用了[FreeMote WebG](https://github.com/Project-AZUSA/FreeMote-SDK)的SDK作为驱动构建，并且用了[FreeMote](https://github.com/UlyssesWu/FreeMote)的工具进行模型处理。素材来源是[UlyssesWu](https://github.com/UlyssesWu)制作的猫娘动态壁纸。

为了节省代码量，我已经将`index.html`换成`index.php`，因此这个项目需要最基本的php环境，并且需要设置**URL 重写**。之前写的纯html版本是`old-index.html`，可以根据需要进行取舍和修改。

如果需要静态部署，请切换到`html_version`分支，那个是纯静态的实现。

`main.js`设置了展示模型相关的参数，主要的设置部分也在`main.js`里面。

目前项目主要部分已经基本完工，但是对于角色动作的配布，这方面我确实能力有限，弄得不是很好。调整角色动作和反应需要大量的尝试和时间，目前只是能用水平，并没有做的很好，调整的配置文件在`config/`文件夹内。希望有大佬可以指点帮助一下！

允许对项目进行二次开发，但是请不要删除作者相关信息！并且，根据AGPL v3许可，修改后的版本请一并开源并使用相同许可证。
