<?php
$domain_chocola = 'https://chocola.nekopara.uk';
$domain_vanilla = 'https://vanilla.nekopara.uk';
$domain_azuki = 'https://azuki.nekopara.uk';
$domain_coconut = 'https://coconut.nekopara.uk';
$domain_maple = 'https://maple.nekopara.uk';
$domain_cinnamon = 'https://cinnamon.nekopara.uk';
$domain_milk = 'https://milk.nekopara.uk';
$domain_fraise = 'https://fraise.nekopara.uk';
$background_url = './img/bakery.png';

// 扫描 img 文件夹，列出可用壁纸图片（供前端壁纸选择器使用）。
$wallpaper_files = [];
if (is_dir(__DIR__ . '/img')) {
    $wallpaper_exts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'];
    foreach (scandir(__DIR__ . '/img') as $wallpaper_file) {
        if ($wallpaper_file === '.' || $wallpaper_file === '..') {
            continue;
        }
        if (!is_file(__DIR__ . '/img/' . $wallpaper_file)) {
            continue;
        }
        $wallpaper_ext = strtolower(pathinfo($wallpaper_file, PATHINFO_EXTENSION));
        if (in_array($wallpaper_ext, $wallpaper_exts, true)) {
            $wallpaper_files[] = $wallpaper_file;
        }
    }
}
sort($wallpaper_files);
$default_wallpaper = in_array('bakery.png', $wallpaper_files, true) ? 'bakery.png' : ($wallpaper_files[0] ?? 'bakery.png');
$wallpaper_files_json = json_encode(array_values($wallpaper_files));
$default_wallpaper_json = json_encode($default_wallpaper);

// 获取当前请求路径，并兼容部署在 /NekoWebShow/ 这类子目录下的情况。
$request_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$script_dir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'])), '/');
if ($script_dir !== '' && $script_dir !== '.') {
  if ($request_path === $script_dir) {
    $request_path = '';
  } elseif (strpos($request_path, $script_dir . '/') === 0) {
    $request_path = substr($request_path, strlen($script_dir) + 1);
  }
}
$path = trim($request_path, '/');
if ($path === 'index.php') {
  $path = '';
}

// 定义页面内容（可以换成读取文件或数据库）
$pages = [
  '' => [
    'use_config' => 'chocola-config.js',
    'psb_url' => './data/chocola-lolita.pure.psb.zip' // 默认使用 chocola-lolita
  ],
  'chocola-casual' => [
      'use_config' => 'chocola-config.js',
      'psb_url' => './data/chocola-casual.pure.psb.zip'
  ],
  'chocola-dress' => [
      'use_config' => 'chocola-config.js',
      'psb_url' => './data/chocola-dress.pure.psb.zip'
  ],
  'chocola-lolita' => [
      'use_config' => 'chocola-config.js',
      'psb_url' => './data/chocola-lolita.pure.psb.zip'
  ],
  'chocola-maid' => [
      'use_config' => 'chocola-config.js',
      'psb_url' => './data/chocola-maid.pure.psb.zip'
  ],
  'chocola-pajama' => [
      'use_config' => 'chocola-config.js',
      'psb_url' => './data/chocola-pajama.pure.psb.zip'
  ],
  'chocola-santa' => [
      'use_config' => 'chocola-config.js',
      'psb_url' => './data/chocola-santa.pure.psb.zip'
  ],
  'chocola-winter' => [
      'use_config' => 'chocola-config.js',
      'psb_url' => './data/chocola-winter.pure.psb.zip'
  ],
  'chocola-wintermaid' => [
      'use_config' => 'chocola-config.js',
      'psb_url' => './data/chocola-wintermaid.pure.psb.zip'
  ],
  'chocola-yukata' => [
      'use_config' => 'chocola-config.js',
      'psb_url' => './data/chocola-yukata.pure.psb.zip'
  ],
  'chocola-teenage' => [
      'use_config' => 'kochocola-config.js',
      'psb_url' => './data/chocola-teenage.pure.psb.zip'
  ],
  'chocola-koneko' => [
      'use_config' => 'kochocola-config.js',
      'psb_url' => './data/chocola-koneko.pure.psb.zip'
  ],
  'vanilla-casual' => [
    'use_config' => 'vanilla-config.js',
    'psb_url' => './data/vanilla-casual.pure.psb.zip'
  ],
  'vanilla-dress' => [
      'use_config' => 'vanilla-config.js',
      'psb_url' => './data/vanilla-dress.pure.psb.zip'
  ],
  'vanilla-lolita' => [
      'use_config' => 'vanilla-config.js',
      'psb_url' => './data/vanilla-lolita.pure.psb.zip'
  ],
  'vanilla-maid' => [
      'use_config' => 'vanilla-config.js',
      'psb_url' => './data/vanilla-maid.pure.psb.zip'
  ],
  'vanilla-pajama' => [
      'use_config' => 'vanilla-config.js',
      'psb_url' => './data/vanilla-pajama.pure.psb.zip'
  ],
  'vanilla-santa' => [
      'use_config' => 'vanilla-config.js',
      'psb_url' => './data/vanilla-santa.pure.psb.zip'
  ],
  'vanilla-winter' => [
      'use_config' => 'vanilla-config.js',
      'psb_url' => './data/vanilla-winter.pure.psb.zip'
  ],
  'vanilla-wintermaid' => [
      'use_config' => 'vanilla-config.js',
      'psb_url' => './data/vanilla-wintermaid.pure.psb.zip'
  ],
  'vanilla-yukata' => [
      'use_config' => 'vanilla-config.js',
      'psb_url' => './data/vanilla-yukata.pure.psb.zip'
  ],
  'vanilla-teenage' => [
      'use_config' => 'kovanilla-config.js',
      'psb_url' => './data/vanilla-teenage.pure.psb.zip'
  ],
  'vanilla-koneko' => [
      'use_config' => 'kovanilla-config.js',
      'psb_url' => './data/vanilla-koneko.pure.psb.zip'
  ],
  'azuki-casual' => [
    'use_config' => 'azuki-config.js',
    'psb_url' => './data/azuki-casual.pure.psb.zip'
  ],
  'azuki-dress' => [
      'use_config' => 'azuki-config.js',
      'psb_url' => './data/azuki-dress.pure.psb.zip'
  ],
  'azuki-maid' => [
      'use_config' => 'azuki-config.js',
      'psb_url' => './data/azuki-maid.pure.psb.zip'
  ],
  'azuki-santa' => [
      'use_config' => 'azuki-config.js',
      'psb_url' => './data/azuki-santa.pure.psb.zip'
  ],
  'azuki-winter' => [
      'use_config' => 'azuki-config.js',
      'psb_url' => './data/azuki-winter.pure.psb.zip'
  ],
  'azuki-wintermaid' => [
      'use_config' => 'azuki-config.js',
      'psb_url' => './data/azuki-wintermaid.pure.psb.zip'
  ],
  'azuki-yukata' => [
      'use_config' => 'azuki-config.js',
      'psb_url' => './data/azuki-yukata.pure.psb.zip'
  ],
  'azuki-teenage' => [
      'use_config' => 'koazuki-config.js',
      'psb_url' => './data/azuki-teenage.pure.psb.zip'
  ],
  'coconut-casual' => [
    'use_config' => 'coconut-config.js',
    'psb_url' => './data/coconut-casual.pure.psb.zip'
  ],
  'coconut-dress' => [
      'use_config' => 'coconut-config.js',
      'psb_url' => './data/coconut-dress.pure.psb.zip'
  ],
  'coconut-maid' => [
      'use_config' => 'coconut-config.js',
      'psb_url' => './data/coconut-maid.pure.psb.zip'
  ],
  'coconut-pajama' => [
      'use_config' => 'coconut-config.js',
      'psb_url' => './data/coconut-pajama.pure.psb.zip'
  ],
  'coconut-santa' => [
      'use_config' => 'coconut-config.js',
      'psb_url' => './data/coconut-santa.pure.psb.zip'
  ],
  'coconut-winter' => [
      'use_config' => 'coconut-config.js',
      'psb_url' => './data/coconut-winter.pure.psb.zip'
  ],
  'coconut-wintermaid' => [
      'use_config' => 'coconut-config.js',
      'psb_url' => './data/coconut-wintermaid.pure.psb.zip'
  ],
  'coconut-yukata' => [
      'use_config' => 'coconut-config.js',
      'psb_url' => './data/coconut-yukata.pure.psb.zip'
  ],
  'coconut-teenage' => [
      'use_config' => 'kococonut-config.js',
      'psb_url' => './data/coconut-teenage.pure.psb.zip'
  ],
  'coconut-koneko' => [
      'use_config' => 'kococonut-config.js',
      'psb_url' => './data/coconut-koneko.pure.psb.zip'
  ],
  'maple-casual' => [
    'use_config' => 'maple-config.js',
    'psb_url' => './data/maple-casual.pure.psb.zip'
  ],
  'maple-dress' => [
      'use_config' => 'maple-config.js',
      'psb_url' => './data/maple-dress.pure.psb.zip'
  ],
  'maple-maid' => [
      'use_config' => 'maple-config.js',
      'psb_url' => './data/maple-maid.pure.psb.zip'
  ],
  'maple-santa' => [
      'use_config' => 'maple-config.js',
      'psb_url' => './data/maple-santa.pure.psb.zip'
  ],
  'maple-winter' => [
      'use_config' => 'maple-config.js',
      'psb_url' => './data/maple-winter.pure.psb.zip'
  ],
  'maple-wintermaid' => [
      'use_config' => 'maple-config.js',
      'psb_url' => './data/maple-wintermaid.pure.psb.zip'
  ],
  'maple-yukata' => [
      'use_config' => 'maple-config.js',
      'psb_url' => './data/maple-yukata.pure.psb.zip'
  ],
  'maple-teenage' => [
      'use_config' => 'komaple-config.js',
      'psb_url' => './data/maple-teenage.pure.psb.zip'
  ],
  'cinnamon-casual' => [
    'use_config' => 'cinnamon-config.js',
    'psb_url' => './data/cinnamon-casual.pure.psb.zip'
  ],
  'cinnamon-dress' => [
      'use_config' => 'cinnamon-config.js',
      'psb_url' => './data/cinnamon-dress.pure.psb.zip'
  ],
  'cinnamon-maid' => [
      'use_config' => 'cinnamon-config.js',
      'psb_url' => './data/cinnamon-maid.pure.psb.zip'
  ],
  'cinnamon-santa' => [
      'use_config' => 'cinnamon-config.js',
      'psb_url' => './data/cinnamon-santa.pure.psb.zip'
  ],
  'cinnamon-winter' => [
      'use_config' => 'cinnamon-config.js',
      'psb_url' => './data/cinnamon-winter.pure.psb.zip'
  ],
  'cinnamon-wintermaid' => [
      'use_config' => 'cinnamon-config.js',
      'psb_url' => './data/cinnamon-wintermaid.pure.psb.zip'
  ],
  'cinnamon-yukata' => [
      'use_config' => 'cinnamon-config.js',
      'psb_url' => './data/cinnamon-yukata.pure.psb.zip'
  ],
  'cinnamon-teenage' => [
      'use_config' => 'kocinnamon-config.js',
      'psb_url' => './data/cinnamon-teenage.pure.psb.zip'
  ],
  'milk-teenage' => [
    'use_config' => 'komilk-config.js',
    'psb_url' => './data/milk-teenage.pure.psb.zip'
  ],
  'milk-winter' => [
      'use_config' => 'milk-config.js',
      'psb_url' => './data/milk-winter.pure.psb.zip'
  ],
  'fraise-maid' => [
    'use_config' => 'fraise-config.js',
    'psb_url' => './data/fraise-maid.pure.psb.zip'
  ]
];

// 判断请求的页面是否存在
if (!isset($pages[$path])) {
  http_response_code(404);
  $use_config = 'chocola-config.js';
  $psb_url = './data/chocola-lolita.pure.psb.zip';
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
  <link rel="stylesheet" href="ui.css">
  <script src="./driver/FreeMoteDriver.js" charset="UTF-8"></script>
  <script src="./driver/emoteplayer.js" charset="UTF-8"></script>
  <script src="./config/<?php echo $use_config; ?>" charset="UTF-8"></script>
  <script src="./locales.js" charset="UTF-8"></script>
  <script type="text/JavaScript" src="main.js" charset="UTF-8"></script>
  <script type="text/JavaScript" src="fflate.js" charset="UTF-8"></script>
  <script>window.NekoWallpapers = <?php echo $wallpaper_files_json; ?>; window.NekoDefaultWallpaper = <?php echo $default_wallpaper_json; ?>;</script>
</head>
<body onload="start('<?php echo $psb_url; ?>')">

  <canvas id="canvas"></canvas>
  
    <div id="loading" data-i18n="loading">Loading...</div>
  

  <!-- 切换图标 -->
  <img id="toggle-icon" src="neko.png" alt="Toggle Topbar" />

  <!-- 顶部内容栏 -->
  <div id="topbar">
    <div class="label" data-i18n="pageTitle" style="font-weight:bold; font-size:18px; color:#6f4e37;">猫娘乐园角色E-mote图鉴</div>
    <!-- 内容元素示例 -->
    <div class="menu-item">
      <span class="label" data-i18n="chocola">Chocola</span>
      <div class="dropdown">
        <a href="<?php echo $domain_chocola; ?>/chocola-casual" data-i18n="casual">Casual</a>
        <a href="<?php echo $domain_chocola; ?>/chocola-dress" data-i18n="dress">Dress</a>
        <a href="<?php echo $domain_chocola; ?>/chocola-lolita" data-i18n="lolita">Lolita</a>
        <a href="<?php echo $domain_chocola; ?>/chocola-maid" data-i18n="maid">Maid</a>
        <a href="<?php echo $domain_chocola; ?>/chocola-pajama" data-i18n="pajama">Pajama</a>
        <a href="<?php echo $domain_chocola; ?>/chocola-santa" data-i18n="santa">Santa</a>
        <a href="<?php echo $domain_chocola; ?>/chocola-winter" data-i18n="winter">Winter</a>
        <a href="<?php echo $domain_chocola; ?>/chocola-wintermaid" data-i18n="wintermaid">Wintermaid</a>
        <a href="<?php echo $domain_chocola; ?>/chocola-yukata" data-i18n="yukata">Yukata</a>
        <a href="<?php echo $domain_chocola; ?>/chocola-teenage" data-i18n="teenage">Teenage</a>
        <a href="<?php echo $domain_chocola; ?>/chocola-koneko" data-i18n="koneko">Koneko</a>
      </div>
    </div>
    <div class="menu-item">
      <span class="label" data-i18n="vanilla">Vanilla</span>
      <div class="dropdown">
        <a href="<?php echo $domain_vanilla; ?>/vanilla-casual" data-i18n="casual">Casual</a>
        <a href="<?php echo $domain_vanilla; ?>/vanilla-dress" data-i18n="dress">Dress</a>
        <a href="<?php echo $domain_vanilla; ?>/vanilla-lolita" data-i18n="lolita">Lolita</a>
        <a href="<?php echo $domain_vanilla; ?>/vanilla-maid" data-i18n="maid">Maid</a>
        <a href="<?php echo $domain_vanilla; ?>/vanilla-pajama" data-i18n="pajama">Pajama</a>
        <a href="<?php echo $domain_vanilla; ?>/vanilla-santa" data-i18n="santa">Santa</a>
        <a href="<?php echo $domain_vanilla; ?>/vanilla-winter" data-i18n="winter">Winter</a>
        <a href="<?php echo $domain_vanilla; ?>/vanilla-wintermaid" data-i18n="wintermaid">Wintermaid</a>
        <a href="<?php echo $domain_vanilla; ?>/vanilla-yukata" data-i18n="yukata">Yukata</a>
        <a href="<?php echo $domain_vanilla; ?>/vanilla-teenage" data-i18n="teenage">Teenage</a>
        <a href="<?php echo $domain_vanilla; ?>/vanilla-koneko" data-i18n="koneko">Koneko</a>
      </div>
    </div>
    <div class="menu-item">
      <span class="label" data-i18n="azuki">Azuki</span>
      <div class="dropdown">
        <a href="<?php echo $domain_azuki; ?>/azuki-casual" data-i18n="casual">Casual</a>
        <a href="<?php echo $domain_azuki; ?>/azuki-dress" data-i18n="dress">Dress</a>
        <a href="<?php echo $domain_azuki; ?>/azuki-maid" data-i18n="maid">Maid</a>
        <a href="<?php echo $domain_azuki; ?>/azuki-santa" data-i18n="santa">Santa</a>
        <a href="<?php echo $domain_azuki; ?>/azuki-winter" data-i18n="winter">Winter</a>
        <a href="<?php echo $domain_azuki; ?>/azuki-wintermaid" data-i18n="wintermaid">Wintermaid</a>
        <a href="<?php echo $domain_azuki; ?>/azuki-yukata" data-i18n="yukata">Yukata</a>
        <a href="<?php echo $domain_azuki; ?>/azuki-teenage" data-i18n="teenage">Teenage</a>
      </div>
    </div>
    <div class="menu-item">
      <span class="label" data-i18n="coconut">Coconut</span>
      <div class="dropdown">
        <a href="<?php echo $domain_coconut; ?>/coconut-casual" data-i18n="casual">Casual</a>
        <a href="<?php echo $domain_coconut; ?>/coconut-dress" data-i18n="dress">Dress</a>
        <a href="<?php echo $domain_coconut; ?>/coconut-maid" data-i18n="maid">Maid</a>
        <a href="<?php echo $domain_coconut; ?>/coconut-pajama" data-i18n="pajama">Pajama</a>
        <a href="<?php echo $domain_coconut; ?>/coconut-santa" data-i18n="santa">Santa</a>
        <a href="<?php echo $domain_coconut; ?>/coconut-winter" data-i18n="winter">Winter</a>
        <a href="<?php echo $domain_coconut; ?>/coconut-wintermaid" data-i18n="wintermaid">Wintermaid</a>
        <a href="<?php echo $domain_coconut; ?>/coconut-yukata" data-i18n="yukata">Yukata</a>
        <a href="<?php echo $domain_coconut; ?>/coconut-teenage" data-i18n="teenage">Teenage</a>
        <a href="<?php echo $domain_coconut; ?>/coconut-koneko" data-i18n="koneko">Koneko</a>
      </div>
    </div>
    <div class="menu-item">
      <span class="label" data-i18n="maple">Maple</span>
      <div class="dropdown">
        <a href="<?php echo $domain_maple; ?>/maple-casual" data-i18n="casual">Casual</a>
        <a href="<?php echo $domain_maple; ?>/maple-dress" data-i18n="dress">Dress</a>
        <a href="<?php echo $domain_maple; ?>/maple-maid" data-i18n="maid">Maid</a>
        <a href="<?php echo $domain_maple; ?>/maple-santa" data-i18n="santa">Santa</a>
        <a href="<?php echo $domain_maple; ?>/maple-winter" data-i18n="winter">Winter</a>
        <a href="<?php echo $domain_maple; ?>/maple-wintermaid" data-i18n="wintermaid">Wintermaid</a>
        <a href="<?php echo $domain_maple; ?>/maple-yukata" data-i18n="yukata">Yukata</a>
        <a href="<?php echo $domain_maple; ?>/maple-teenage" data-i18n="teenage">Teenage</a>
      </div>
    </div>
    <div class="menu-item">
      <span class="label" data-i18n="cinnamon">Cinnamon</span>
      <div class="dropdown">
        <a href="<?php echo $domain_cinnamon; ?>/cinnamon-casual" data-i18n="casual">Casual</a>
        <a href="<?php echo $domain_cinnamon; ?>/cinnamon-dress" data-i18n="dress">Dress</a>
        <a href="<?php echo $domain_cinnamon; ?>/cinnamon-maid" data-i18n="maid">Maid</a>
        <a href="<?php echo $domain_cinnamon; ?>/cinnamon-santa" data-i18n="santa">Santa</a>
        <a href="<?php echo $domain_cinnamon; ?>/cinnamon-winter" data-i18n="winter">Winter</a>
        <a href="<?php echo $domain_cinnamon; ?>/cinnamon-wintermaid" data-i18n="wintermaid">Wintermaid</a>
        <a href="<?php echo $domain_cinnamon; ?>/cinnamon-yukata" data-i18n="yukata">Yukata</a>
        <a href="<?php echo $domain_cinnamon; ?>/cinnamon-teenage" data-i18n="teenage">Teenage</a>
      </div>
    </div>
    <div class="menu-item">
      <span class="label" data-i18n="milk">Milk</span>
      <div class="dropdown">
        <a href="<?php echo $domain_milk; ?>/milk-teenage" data-i18n="teenage">Teenage</a>
        <a href="<?php echo $domain_milk; ?>/milk-winter" data-i18n="winter">Winter</a>
      </div>
    </div>
    <div class="menu-item">
      <span class="label" data-i18n="fraise">Fraise</span>
      <div class="dropdown">
        <a href="<?php echo $domain_fraise; ?>/fraise-maid" data-i18n="maid">Maid</a>
      </div>
    </div>
    <!-- 可继续添加更多 menu-item -->
    <div class="infotext" data-i18n="by" data-i18n-params='{"author": "GTX690战术核显卡导弹"}'>By：<a href="https://www.nekopara.uk" target="_blank">GTX690战术核显卡导弹</a></div>
    <div class="infotext" data-i18n="githubProject" data-i18n-params='{"project": "NekoWebShow"}'>Github Project:<a href="https://github.com/Chocola-X/NekoWebShow" target="_blank">NekoWebShow</a></div>
  </div>

  <script type="text/JavaScript" src="ui.js" charset="UTF-8"></script>
</body>
</html>
