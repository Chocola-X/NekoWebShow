<?php
$domain_chocola = 'https://chocola.nekopara.uk';
$domain_vanilla = 'https://vanilla.nekopara.uk';
$domain_azuki = 'https://azuki.nekopara.uk';
$domain_coconut = 'https://coconut.nekopara.uk';
$domain_maple = 'https://maple.nekopara.uk';
$domain_cinnamon = 'https://cinnamon.nekopara.uk';
$domain_milk = 'https://milk.nekopara.uk';
$domain_fraise = 'https://fraise.nekopara.uk';
$background_url = './img/bg.png';
// 获取当前请求路径
$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

// 定义页面内容（可以换成读取文件或数据库）
$pages = [
  '' => [
    'use_config' => 'chocola-config.js',
    'psb_url' => './data/chocola-lolita.pure.psb' // 默认使用 chocola-lolita
  ],
  'chocola-casual' => [
      'use_config' => 'chocola-config.js',
      'psb_url' => './data/chocola-casual.pure.psb'
  ],
  'chocola-dress' => [
      'use_config' => 'chocola-config.js',
      'psb_url' => './data/chocola-dress.pure.psb'
  ],
  'chocola-lolita' => [
      'use_config' => 'chocola-config.js',
      'psb_url' => './data/chocola-lolita.pure.psb'
  ],
  'chocola-maid' => [
      'use_config' => 'chocola-config.js',
      'psb_url' => './data/chocola-maid.pure.psb'
  ],
  'chocola-pajama' => [
      'use_config' => 'chocola-config.js',
      'psb_url' => './data/chocola-pajama.pure.psb'
  ],
  'chocola-santa' => [
      'use_config' => 'chocola-config.js',
      'psb_url' => './data/chocola-santa.pure.psb'
  ],
  'chocola-winter' => [
      'use_config' => 'chocola-config.js',
      'psb_url' => './data/chocola-winter.pure.psb'
  ],
  'chocola-wintermaid' => [
      'use_config' => 'chocola-config.js',
      'psb_url' => './data/chocola-wintermaid.pure.psb'
  ],
  'chocola-yukata' => [
      'use_config' => 'chocola-config.js',
      'psb_url' => './data/chocola-yukata.pure.psb'
  ],
  'chocola-teenage' => [
      'use_config' => 'kochocola-config.js',
      'psb_url' => './data/chocola-teenage.pure.psb'
  ],
  'chocola-koneko' => [
      'use_config' => 'kochocola-config.js',
      'psb_url' => './data/chocola-koneko.pure.psb'
  ],
  'vanilla-casual' => [
    'use_config' => 'vanilla-config.js',
    'psb_url' => './data/vanilla-casual.pure.psb'
  ],
  'vanilla-dress' => [
      'use_config' => 'vanilla-config.js',
      'psb_url' => './data/vanilla-dress.pure.psb'
  ],
  'vanilla-lolita' => [
      'use_config' => 'vanilla-config.js',
      'psb_url' => './data/vanilla-lolita.pure.psb'
  ],
  'vanilla-maid' => [
      'use_config' => 'vanilla-config.js',
      'psb_url' => './data/vanilla-maid.pure.psb'
  ],
  'vanilla-pajama' => [
      'use_config' => 'vanilla-config.js',
      'psb_url' => './data/vanilla-pajama.pure.psb'
  ],
  'vanilla-santa' => [
      'use_config' => 'vanilla-config.js',
      'psb_url' => './data/vanilla-santa.pure.psb'
  ],
  'vanilla-winter' => [
      'use_config' => 'vanilla-config.js',
      'psb_url' => './data/vanilla-winter.pure.psb'
  ],
  'vanilla-wintermaid' => [
      'use_config' => 'vanilla-config.js',
      'psb_url' => './data/vanilla-wintermaid.pure.psb'
  ],
  'vanilla-yukata' => [
      'use_config' => 'vanilla-config.js',
      'psb_url' => './data/vanilla-yukata.pure.psb'
  ],
  'vanilla-teenage' => [
      'use_config' => 'kovanilla-config.js',
      'psb_url' => './data/vanilla-teenage.pure.psb'
  ],
  'vanilla-koneko' => [
      'use_config' => 'kovanilla-config.js',
      'psb_url' => './data/vanilla-koneko.pure.psb'
  ],
  'azuki-casual' => [
    'use_config' => 'azuki-config.js',
    'psb_url' => './data/azuki-casual.pure.psb'
  ],
  'azuki-dress' => [
      'use_config' => 'azuki-config.js',
      'psb_url' => './data/azuki-dress.pure.psb'
  ],
  'azuki-maid' => [
      'use_config' => 'azuki-config.js',
      'psb_url' => './data/azuki-maid.pure.psb'
  ],
  'azuki-santa' => [
      'use_config' => 'azuki-config.js',
      'psb_url' => './data/azuki-santa.pure.psb'
  ],
  'azuki-winter' => [
      'use_config' => 'azuki-config.js',
      'psb_url' => './data/azuki-winter.pure.psb'
  ],
  'azuki-wintermaid' => [
      'use_config' => 'azuki-config.js',
      'psb_url' => './data/azuki-wintermaid.pure.psb'
  ],
  'azuki-yukata' => [
      'use_config' => 'azuki-config.js',
      'psb_url' => './data/azuki-yukata.pure.psb'
  ],
  'azuki-teenage' => [
      'use_config' => 'koazuki-config.js',
      'psb_url' => './data/azuki-teenage.pure.psb'
  ],
  'coconut-casual' => [
    'use_config' => 'coconut-config.js',
    'psb_url' => './data/coconut-casual.pure.psb'
  ],
  'coconut-dress' => [
      'use_config' => 'coconut-config.js',
      'psb_url' => './data/coconut-dress.pure.psb'
  ],
  'coconut-maid' => [
      'use_config' => 'coconut-config.js',
      'psb_url' => './data/coconut-maid.pure.psb'
  ],
  'coconut-pajama' => [
      'use_config' => 'coconut-config.js',
      'psb_url' => './data/coconut-pajama.pure.psb'
  ],
  'coconut-santa' => [
      'use_config' => 'coconut-config.js',
      'psb_url' => './data/coconut-santa.pure.psb'
  ],
  'coconut-winter' => [
      'use_config' => 'coconut-config.js',
      'psb_url' => './data/coconut-winter.pure.psb'
  ],
  'coconut-wintermaid' => [
      'use_config' => 'coconut-config.js',
      'psb_url' => './data/coconut-wintermaid.pure.psb'
  ],
  'coconut-yukata' => [
      'use_config' => 'coconut-config.js',
      'psb_url' => './data/coconut-yukata.pure.psb'
  ],
  'coconut-teenage' => [
      'use_config' => 'kococonut-config.js',
      'psb_url' => './data/coconut-teenage.pure.psb'
  ],
  'coconut-koneko' => [
      'use_config' => 'kococonut-config.js',
      'psb_url' => './data/coconut-koneko.pure.psb'
  ],
  'maple-casual' => [
    'use_config' => 'maple-config.js',
    'psb_url' => './data/maple-casual.pure.psb'
  ],
  'maple-dress' => [
      'use_config' => 'maple-config.js',
      'psb_url' => './data/maple-dress.pure.psb'
  ],
  'maple-maid' => [
      'use_config' => 'maple-config.js',
      'psb_url' => './data/maple-maid.pure.psb'
  ],
  'maple-santa' => [
      'use_config' => 'maple-config.js',
      'psb_url' => './data/maple-santa.pure.psb'
  ],
  'maple-winter' => [
      'use_config' => 'maple-config.js',
      'psb_url' => './data/maple-winter.pure.psb'
  ],
  'maple-wintermaid' => [
      'use_config' => 'maple-config.js',
      'psb_url' => './data/maple-wintermaid.pure.psb'
  ],
  'maple-yukata' => [
      'use_config' => 'maple-config.js',
      'psb_url' => './data/maple-yukata.pure.psb'
  ],
  'maple-teenage' => [
      'use_config' => 'komaple-config.js',
      'psb_url' => './data/maple-teenage.pure.psb'
  ],
  'cinnamon-casual' => [
    'use_config' => 'cinnamon-config.js',
    'psb_url' => './data/cinnamon-casual.pure.psb'
  ],
  'cinnamon-dress' => [
      'use_config' => 'cinnamon-config.js',
      'psb_url' => './data/cinnamon-dress.pure.psb'
  ],
  'cinnamon-maid' => [
      'use_config' => 'cinnamon-config.js',
      'psb_url' => './data/cinnamon-maid.pure.psb'
  ],
  'cinnamon-santa' => [
      'use_config' => 'cinnamon-config.js',
      'psb_url' => './data/cinnamon-santa.pure.psb'
  ],
  'cinnamon-winter' => [
      'use_config' => 'cinnamon-config.js',
      'psb_url' => './data/cinnamon-winter.pure.psb'
  ],
  'cinnamon-wintermaid' => [
      'use_config' => 'cinnamon-config.js',
      'psb_url' => './data/cinnamon-wintermaid.pure.psb'
  ],
  'cinnamon-yukata' => [
      'use_config' => 'cinnamon-config.js',
      'psb_url' => './data/cinnamon-yukata.pure.psb'
  ],
  'cinnamon-teenage' => [
      'use_config' => 'kocinnamon-config.js',
      'psb_url' => './data/cinnamon-teenage.pure.psb'
  ],
  'milk-teenage' => [
    'use_config' => 'komilk-config.js',
    'psb_url' => './data/milk-teenage.pure.psb'
  ],
  'milk-winter' => [
      'use_config' => 'milk-config.js',
      'psb_url' => './data/milk-winter.pure.psb'
  ],
  'fraise-maid' => [
    'use_config' => 'fraise-config.js',
    'psb_url' => './data/fraise-maid.pure.psb'
  ]
];

// 判断请求的页面是否存在
if (!isset($pages[$path])) {
  http_response_code(404);
  $use_config = 'chocola-config.js';
  $psb_url = 'chocola-lolita.pure.psb';
} else {
  $use_config = $pages[$path]['use_config'];
  $psb_url = $pages[$path]['psb_url'];
}

?>


<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>猫娘乐园角色E-mote图鉴</title>
  <link rel="icon" href="neko.png" type="image/png">
  <script src="./driver/FreeMoteDriver.js" charset="UTF-8"></script>
  <script src="./driver/emoteplayer.js" charset="UTF-8"></script>
  <script src="./config/<?php echo $use_config; ?>" charset="UTF-8"></script>
  <script type="text/JavaScript" src="main.js" charset="UTF-8"></script>
  <style>
    body {
      font-family: "微软雅黑";
      color: white;
      background: url("<?php echo $background_url; ?>") no-repeat center center fixed;
      background-size: cover;
      margin: 0;
      padding: 0;
    }
    /* 顶部内容栏 */
    #topbar {
      position: fixed;
      top: 4px;
      left: 4px;
      right: 4px;
      height: 40px; /* 高度为页面高度的5% */
      display: flex;
      align-items: center;
      padding: 0 16px;
      background: rgba(255, 204, 229, 0.7); /* 淡白粉色半透明 */
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      z-index: 999;
    }
    #topbar.open {
      transform: translateX(0);
    }
    /* 切换图标 */
    #toggle-icon {
      position: fixed;
      top: 4px;
      right: 4px;
      height: 40px; /* 高度为页面高度的5% */
      width: auto; /* 确保图标宽度自适应 */
      cursor: pointer;
      z-index: 1000;
    }
    /* 菜单项 */
    .menu-item {
      margin-left: 24px;
      position: relative;
      cursor: pointer;
      user-select: none;
    }
    .menu-item > .label {
      font-size: 16px;
      color: #333;
    }
    .dropdown {
      position: absolute;
      /* 下拉距离整个标题栏底部4px，标题高度5vh */
      top: 36px;
      left: 50%; /* 支持居中 */
      transform: translateX(-50%) scaleY(0);
      transform-origin: top center;
      background: rgba(255, 204, 229, 0.7);
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      overflow: hidden;
      transition: transform 0.2s ease;
      z-index: 1001;
      /* 自适应文字宽度 */
      white-space: nowrap;
      width: max-content;
    }
    .dropdown.open {
      transform: translateX(-50%) scaleY(1);
    }
    .dropdown a {
      display: block;
      padding: 8px 16px;
      text-decoration: none;
      color: #555;
      font-size: 14px;
    }
    .dropdown a:hover {
      background: rgba(255, 182, 203, 0.7);
      border-radius: 8px; /* 选中选项的提示颜色有圆角处理 */
    }
    /* Loading 框 */
    #loading {
      position: fixed;
      top: 20px;
      left: 20px;
      width: 120px;
      height: 32px;
      background: rgba(255, 182, 203, 0.7);
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: opacity 1s ease-in-out;
      font-size: 20px;
      text-align: center;
    }
    
    .infotext {
      font-size: 12px;
      text-align: center;
      color: #333;
      padding: 0 20px; /* 左右各12px间距 */

    }

    /* 设置链接样式：颜色不变，左右间距12px */
    .infotext a {
      color: inherit; /* 继承父元素颜色，即 #333 */
      text-decoration: none; /* 可选：去掉下划线 */
      
      display: inline-block; /* 可选：让 padding 生效更稳定 */
    }

    /* 鼠标悬停时也不变色（可选） */
    .infotext a:hover {
      color: inherit;
      text-decoration: underline; /* 可选：悬停时加下划线，但颜色不变 */
    }

  </style>
</head>
<body onload="start('<?php echo $psb_url; ?>')">

  <canvas id="canvas" width="100%" height="100%" style="position: fixed; top:0; margin:0; padding:0; z-index:1;"></canvas>
  
    <div id="loading">Loading...</div>
  

  <!-- 切换图标 -->
  <img id="toggle-icon" src="neko.png" alt="Toggle Topbar" />

  <!-- 顶部内容栏 -->
  <div id="topbar">
    <div class="label" style="font-weight:bold; font-size:18px; color:#333;">猫娘乐园角色E-mote图鉴</div>
    <!-- 内容元素示例 -->
    <div class="menu-item">
      <span class="label">Chocola ▾</span>
      <div class="dropdown">
        <a href="<?php echo $domain_chocola; ?>/chocola-casual">Casual</a>
        <a href="<?php echo $domain_chocola; ?>/chocola-dress">Dress</a>
        <a href="<?php echo $domain_chocola; ?>/chocola-lolita">Lolita</a>
        <a href="<?php echo $domain_chocola; ?>/chocola-maid">Maid</a>
        <a href="<?php echo $domain_chocola; ?>/chocola-pajama">Pajama</a>
        <a href="<?php echo $domain_chocola; ?>/chocola-santa">Santa</a>
        <a href="<?php echo $domain_chocola; ?>/chocola-winter">Winter</a>
        <a href="<?php echo $domain_chocola; ?>/chocola-wintermaid">Wintermaid</a>
        <a href="<?php echo $domain_chocola; ?>/chocola-yukata">Yukata</a>
        <a href="<?php echo $domain_chocola; ?>/chocola-teenage">Teenage</a>
        <a href="<?php echo $domain_chocola; ?>/chocola-koneko">Koneko</a>
      </div>
    </div>
    <div class="menu-item">
      <span class="label">Vanilla ▾</span>
      <div class="dropdown">
        <a href="<?php echo $domain_vanilla; ?>/vanilla-casual">Casual</a>
        <a href="<?php echo $domain_vanilla; ?>/vanilla-dress">Dress</a>
        <a href="<?php echo $domain_vanilla; ?>/vanilla-lolita">Lolita</a>
        <a href="<?php echo $domain_vanilla; ?>/vanilla-maid">Maid</a>
        <a href="<?php echo $domain_vanilla; ?>/vanilla-pajama">Pajama</a>
        <a href="<?php echo $domain_vanilla; ?>/vanilla-santa">Santa</a>
        <a href="<?php echo $domain_vanilla; ?>/vanilla-winter">Winter</a>
        <a href="<?php echo $domain_vanilla; ?>/vanilla-wintermaid">Wintermaid</a>
        <a href="<?php echo $domain_vanilla; ?>/vanilla-yukata">Yukata</a>
        <a href="<?php echo $domain_vanilla; ?>/vanilla-teenage">Teenage</a>
        <a href="<?php echo $domain_vanilla; ?>/vanilla-koneko">Koneko</a>
      </div>
    </div>
    <div class="menu-item">
      <span class="label">Azuki ▾</span>
      <div class="dropdown">
        <a href="<?php echo $domain_azuki; ?>/azuki-casual">Casual</a>
        <a href="<?php echo $domain_azuki; ?>/azuki-dress">Dress</a>
        <a href="<?php echo $domain_azuki; ?>/azuki-maid">Maid</a>
        <a href="<?php echo $domain_azuki; ?>/azuki-santa">Santa</a>
        <a href="<?php echo $domain_azuki; ?>/azuki-winter">Winter</a>
        <a href="<?php echo $domain_azuki; ?>/azuki-wintermaid">Wintermaid</a>
        <a href="<?php echo $domain_azuki; ?>/azuki-yukata">Yukata</a>
        <a href="<?php echo $domain_azuki; ?>/azuki-teenage">Teenage</a>
      </div>
    </div>
    <div class="menu-item">
      <span class="label">Coconut ▾</span>
      <div class="dropdown">
        <a href="<?php echo $domain_coconut; ?>/coconut-casual">Casual</a>
        <a href="<?php echo $domain_coconut; ?>/coconut-dress">Dress</a>
        <a href="<?php echo $domain_coconut; ?>/coconut-maid">Maid</a>
        <a href="<?php echo $domain_coconut; ?>/coconut-pajama">Pajama</a>
        <a href="<?php echo $domain_coconut; ?>/coconut-santa">Santa</a>
        <a href="<?php echo $domain_coconut; ?>/coconut-winter">Winter</a>
        <a href="<?php echo $domain_coconut; ?>/coconut-wintermaid">Wintermaid</a>
        <a href="<?php echo $domain_coconut; ?>/coconut-yukata">Yukata</a>
        <a href="<?php echo $domain_coconut; ?>/coconut-teenage">Teenage</a>
        <a href="<?php echo $domain_coconut; ?>/coconut-koneko">Koneko</a>
      </div>
    </div>
    <div class="menu-item">
      <span class="label">Maple ▾</span>
      <div class="dropdown">
        <a href="<?php echo $domain_maple; ?>/maple-casual">Casual</a>
        <a href="<?php echo $domain_maple; ?>/maple-dress">Dress</a>
        <a href="<?php echo $domain_maple; ?>/maple-maid">Maid</a>
        <a href="<?php echo $domain_maple; ?>/maple-santa">Santa</a>
        <a href="<?php echo $domain_maple; ?>/maple-winter">Winter</a>
        <a href="<?php echo $domain_maple; ?>/maple-wintermaid">Wintermaid</a>
        <a href="<?php echo $domain_maple; ?>/maple-yukata">Yukata</a>
        <a href="<?php echo $domain_maple; ?>/maple-teenage">Teenage</a>
      </div>
    </div>
    <div class="menu-item">
      <span class="label">Cinnamon ▾</span>
      <div class="dropdown">
        <a href="<?php echo $domain_cinnamon; ?>/cinnamon-casual">Casual</a>
        <a href="<?php echo $domain_cinnamon; ?>/cinnamon-dress">Dress</a>
        <a href="<?php echo $domain_cinnamon; ?>/cinnamon-maid">Maid</a>
        <a href="<?php echo $domain_cinnamon; ?>/cinnamon-santa">Santa</a>
        <a href="<?php echo $domain_cinnamon; ?>/cinnamon-winter">Winter</a>
        <a href="<?php echo $domain_cinnamon; ?>/cinnamon-wintermaid">Wintermaid</a>
        <a href="<?php echo $domain_cinnamon; ?>/cinnamon-yukata">Yukata</a>
        <a href="<?php echo $domain_cinnamon; ?>/cinnamon-teenage">Teenage</a>
      </div>
    </div>
    <div class="menu-item">
      <span class="label">Milk ▾</span>
      <div class="dropdown">
        <a href="<?php echo $domain_milk; ?>/milk-teenage">Teenage</a>
        <a href="<?php echo $domain_milk; ?>/milk-winter">Winter</a>
      </div>
    </div>
    <div class="menu-item">
      <span class="label">Fraise ▾</span>
      <div class="dropdown">
        <a href="<?php echo $domain_fraise; ?>/fraise-maid">Maid</a>
      </div>
    </div>
    <!-- 可继续添加更多 menu-item -->
    <div class="infotext">By：<a href="https://www.nekopara.uk" target="_blank">GTX690战术核显卡导弹</a></div>
    <div class="infotext">Github Project:<a href="https://github.com/Chocola-X/NekoWebShow" target="_blank">NekoWebShow</a></div>
  </div>

  <script>
    // 切换顶部栏展开/收起
    const icon = document.getElementById('toggle-icon');
    const topbar = document.getElementById('topbar');
    icon.addEventListener('click', () => {
      topbar.classList.toggle('open');
    });
    // 点击任意菜单项显示下拉，并自动收起其他下拉
    document.querySelectorAll('.menu-item').forEach(item => {
      const dropdown = item.querySelector('.dropdown');
      item.addEventListener('click', e => {
        e.stopPropagation();
        // 收起其他打开的下拉
        document.querySelectorAll('.dropdown.open').forEach(dd => {
          if (dd !== dropdown) dd.classList.remove('open');
        });
        // 切换当前下拉
        dropdown.classList.toggle('open');
      });
    });
    // 点击页面空白处，关闭所有下拉
    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown.open').forEach(dd => {
        dd.classList.remove('open');
      });
    });
  </script>
</body>
</html>
