<?php
$domain_chocola = 'https://chocola.nekopara.uk';
$domain_vanilla = 'https://vanilla.nekopara.uk';
$domain_azuki = 'https://azuki.nekopara.uk';
$domain_coconut = 'https://coconut.nekopara.uk';
$domain_maple = 'https://maple.nekopara.uk';
$domain_cinnamon = 'https://cinnamon.nekopara.uk';
$domain_milk = 'https://milk.nekopara.uk';
$domain_fraise = 'https://fraise.nekopara.uk';
// === 模式开关：true=单URL模式(?char=)，false=域名独立模式(各角色子站) ===
// 本地测试时手动改为 true；子目录部署也用 true。切到 false 会把菜单指向各角色子站域名。
$local_mode = false;
if ($local_mode) {
    $domain_chocola = $domain_vanilla = $domain_azuki = $domain_coconut = $domain_maple = $domain_cinnamon = $domain_milk = $domain_fraise = '?char=';
} else {
    $domain_chocola .= '/'; $domain_vanilla .= '/'; $domain_azuki .= '/';
    $domain_coconut .= '/'; $domain_maple .= '/'; $domain_cinnamon .= '/';
    $domain_milk .= '/'; $domain_fraise .= '/';
}
// 根目录是单张背景，dynamic/ 中的 A/B/C 是同一场景的三个时段。
$background_names_path = __DIR__ . '/config/background-names.json';
$background_names = is_file($background_names_path) ? json_decode(file_get_contents($background_names_path), true, 512, JSON_THROW_ON_ERROR) : [];
$wallpaper_files = [];
$wallpaper_exts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'];
foreach (glob(__DIR__ . '/background/*') ?: [] as $wallpaper_path) {
    if (!is_file($wallpaper_path) || !in_array(strtolower(pathinfo($wallpaper_path, PATHINFO_EXTENSION)), $wallpaper_exts, true)) continue;
    $name = basename($wallpaper_path);
    $wallpaper_files[] = ['id' => $name, 'type' => 'static', 'image' => $name, 'names' => $background_names[$name] ?? []];
}
$dynamic_groups = [];
foreach (glob(__DIR__ . '/background/dynamic/*') ?: [] as $wallpaper_path) {
    if (!is_file($wallpaper_path) || !in_array(strtolower(pathinfo($wallpaper_path, PATHINFO_EXTENSION)), $wallpaper_exts, true)) continue;
    $name = basename($wallpaper_path);
    if (preg_match('/^(.+)([ABC])\.[^.]+$/i', $name, $match)) {
        $dynamic_groups[$match[1]][strtoupper($match[2])] = 'dynamic/' . $name;
    }
}
ksort($dynamic_groups);
foreach ($dynamic_groups as $scene => $images) {
    if (count(array_intersect(['A', 'B', 'C'], array_keys($images))) !== 3) continue;
    $wallpaper_files[] = ['id' => 'dynamic/' . $scene, 'type' => 'dynamic', 'images' => $images, 'names' => $background_names[$scene] ?? []];
}
$default_wallpaper = $wallpaper_files[0]['id'] ?? null;
$wallpaper_files_json = json_encode($wallpaper_files, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
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

// 路由、服装菜单和动作配置共享同一份审核后的模型清单。
$model_catalog = json_decode(file_get_contents(__DIR__ . '/config/model-catalog.json'), true, 512, JSON_THROW_ON_ERROR);
$pages = ['' => ['use_config' => 'chocola-config.js', 'psb_url' => './data/chocola-lolita.pure.psb.zip']];
$models_by_character = [];
foreach ($model_catalog as $model_id => $model) {
    $pages[$model_id] = ['use_config' => $model['config'], 'psb_url' => './data/' . $model_id . '.pure.psb.zip'];
    $models_by_character[$model['character']][$model_id] = $model;
}
$character_domains = [
    'chocola' => $domain_chocola, 'vanilla' => $domain_vanilla,
    'azuki' => $domain_azuki, 'coconut' => $domain_coconut,
    'maple' => $domain_maple, 'cinnamon' => $domain_cinnamon,
    'milk' => $domain_milk, 'fraise' => $domain_fraise
];

// 判断请求的页面是否存在
// === 本地测试模式：支持 ?char=角色名 查询参数切换 ===
if (isset($_GET['char']) && array_key_exists($_GET['char'], $pages)) {
  $path = $_GET['char'];
}
if (!isset($pages[$path])) {
  http_response_code(404);
  $use_config = 'chocola-config.js';
  $psb_url = './data/chocola-lolita.pure.psb.zip';
} else {
  $use_config = $pages[$path]['use_config'];
  $psb_url = $pages[$path]['psb_url'];
}

$current_model_id = isset($model_catalog[$path]) ? $path : 'chocola-lolita';
$model_presentation = json_decode(file_get_contents(__DIR__ . '/config/model-presentation.json'), true, 512, JSON_THROW_ON_ERROR);
$current_model_json = json_encode(['id' => $current_model_id, 'presentation' => $model_presentation[$current_model_id] ?? []] + $model_catalog[$current_model_id], JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
?>


<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>猫娘乐园角色E-mote图鉴</title>
  <link rel="icon" href="neko.png" type="image/png">
  <link rel="stylesheet" href="ui.css?v=<?php echo filemtime(__DIR__ . '/ui.css'); ?>">
  <script src="./driver/FreeMoteDriver.js" charset="UTF-8"></script>
  <script src="./driver/emoteplayer.js?v=<?php echo filemtime(__DIR__ . '/driver/emoteplayer.js'); ?>" charset="UTF-8"></script>
  <script src="./config/reaction-library.js?v=<?php echo filemtime(__DIR__ . '/config/reaction-library.js'); ?>" charset="UTF-8"></script>
  <script src="./config/<?php echo $use_config; ?>?v=<?php echo filemtime(__DIR__ . '/config/' . $use_config); ?>" charset="UTF-8"></script>
  <script>window.NekoCurrentModel = <?php echo $current_model_json; ?>;</script>
  <script src="./locales.js?v=<?php echo filemtime(__DIR__ . '/locales.js'); ?>" charset="UTF-8"></script>
  <script type="text/JavaScript" src="main.js?v=<?php echo filemtime(__DIR__ . '/main.js'); ?>" charset="UTF-8"></script>
  <script type="text/JavaScript" src="fflate.js" charset="UTF-8"></script>
  <script>window.NekoWallpapers = <?php echo $wallpaper_files_json; ?>; window.NekoDefaultWallpaper = <?php echo $default_wallpaper_json; ?>;</script>
  <script src="./background.js?v=<?php echo filemtime(__DIR__ . '/background.js'); ?>"></script>
</head>
<body onload="start('<?php echo $psb_url; ?>')">

  <canvas id="canvas"></canvas>
  
    <div id="loading" data-i18n="loading">Loading...</div>
  

  <!-- 切换图标 -->
  <img id="toggle-icon" src="neko.png" alt="Toggle Topbar" />

  <!-- 顶部内容栏 -->
  <div id="topbar">
    <div class="label" data-i18n="pageTitle" style="font-weight:bold; font-size:18px; color:#6f4e37;">猫娘乐园角色E-mote图鉴</div>
    <?php foreach ($character_domains as $character => $character_domain): ?>
    <div class="menu-item">
      <span class="label" data-i18n="<?php echo $character; ?>"><?php echo ucfirst($character); ?></span>
      <div class="dropdown">
        <?php foreach ($models_by_character[$character] ?? [] as $model_id => $model):
          $model_href = $local_mode ? './?char=' . rawurlencode($model_id) : $character_domain . rawurlencode($model_id);
        ?>
        <a href="<?php echo htmlspecialchars($model_href, ENT_QUOTES, 'UTF-8'); ?>" data-model="<?php echo $model_id; ?>"<?php if ($model_id === $current_model_id) echo ' aria-current="page"'; ?>>
          <span data-i18n="<?php echo $model['costume']; ?>"><?php echo $model['costume']; ?></span><?php foreach ($model['variants'] as $variant): ?> · <span data-i18n="variant-<?php echo $variant; ?>"><?php echo $variant; ?></span><?php endforeach; ?>
        </a>
        <?php endforeach; ?>
      </div>
    </div>
    <?php endforeach; ?>
    <!-- 可继续添加更多 menu-item -->
    <div class="infotext" data-i18n="by" data-i18n-params='{"author": "GTX690战术核显卡导弹"}'>By：<a href="https://www.nekopara.uk" target="_blank">GTX690战术核显卡导弹</a></div>
    <div class="infotext" data-i18n="githubProject" data-i18n-params='{"project": "NekoWebShow"}'>Github Project:<a href="https://github.com/Chocola-X/NekoWebShow" target="_blank">NekoWebShow</a></div>
  </div>

  <script type="text/JavaScript" src="ui.js?v=<?php echo filemtime(__DIR__ . '/ui.js'); ?>" charset="UTF-8"></script>
</body>
</html>
