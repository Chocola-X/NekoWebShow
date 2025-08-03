# 基于FreeMote的猫娘网页展示

<div align="center">
  <img src="https://teachermate.oss-cn-qingdao.aliyuncs.com/6QCbQ-1754206210534-NekoWebShow_logo.png" alt="NekoWebShow" />
</div>

[展示地址（php版本）](https://show.nekopara.uk)

[展示地址（html版本）](https://chocola-x.github.io/NekoWebShow/)

[部署/使用指南](https://www.nekopara.uk/archives/nekowebshow.html)

使用了[FreeMote WebG](https://github.com/Project-AZUSA/FreeMote-SDK)的SDK作为驱动构建，并且用了[FreeMote](https://github.com/UlyssesWu/FreeMote)的工具进行模型处理。素材来源是[UlyssesWu](https://github.com/UlyssesWu)制作的猫娘动态壁纸。

为了节省代码量，我已经将`index.html`换成`index.php`，因此这个项目需要最基本的php环境，并且需要设置**URL 重写**。之前写的纯html版本是`old-index.html`，可以根据需要进行取舍和修改。

~~如果需要静态部署，也可以，只不过要手搓几十个html文件。。。每个角色每个衣服一个（~~ 你说的对，我真搓了（X
主要是搓了之后方便本地部署做动态壁纸，就只需要一个简单的web服务器就好了，例如单开一个Nginx。

`main.js`设置了展示模型相关的参数，主要的设置部分也在`main.js`里面。

目前由于我时间和水平有限，调整角色动作和反应需要大量的尝试和时间，目前只是能用水平，希望有想法的可以帮忙优化项目，调整的配置文件在`config/`文件夹内。

项目已经基本上完工，只是动作确实没能力去调好了，希望懂的大佬可以帮帮忙。

允许对项目进行二次开发，但是请不要删除作者相关信息！并且，根据AGPL v3许可，修改后的版本请一并开源并使用相同许可证。
