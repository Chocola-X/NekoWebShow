// 多语言配置文件
const translations = {
    'en': {
        // 通用文本
        'pageTitle': 'NEKOPARA Character E-mote Gallery',
        'loading': 'Loading...',
        'by': 'By:',
        'githubProject': 'Github Project:',
        
        // 角色名称
        'chocola': 'Chocola',
        'vanilla': 'Vanilla',
        'azuki': 'Azuki',
        'coconut': 'Coconut',
        'maple': 'Maple',
        'cinnamon': 'Cinnamon',
        'milk': 'Milk',
        'fraise': 'Fraise',
        
        // 服装类型
        'casual': 'Casual',
        'dress': 'Dress',
        'lolita': 'Lolita',
        'maid': 'Maid',
        'pajama': 'Pajama',
        'santa': 'Santa',
        'winter': 'Winter',
        'wintermaid': 'Wintermaid',
        'yukata': 'Yukata',
        'teenage': 'Teenage',
        'koneko': 'Koneko',
        
        // SEO描述
        'seoDescription': 'A project that displays NEKOPARA character E-mote dynamic illustrations in the browser, can be used as desktop dynamic wallpaper.',
        'characterPageSuffix': 'This page features the character: {character}',
        
        // 语言选择器
        'language': 'Language',
        'english': 'English',
        'chineseSimplified': '简体中文',
        'chineseTraditional': '繁體中文',
        'japanese': '日本語'
    },
    
    'zh-CN': {
        // 通用文本
        'pageTitle': '猫娘乐园角色E-mote图鉴',
        'loading': '加载中...',
        'by': '作者：',
        'githubProject': 'Github项目：',
        
        // 角色名称
        'chocola': '巧克力',
        'vanilla': '香草',
        'azuki': '红豆',
        'coconut': '椰子',
        'maple': '枫',
        'cinnamon': '桂',
        'milk': '牛奶',
        'fraise': '草莓',
        
        // 服装类型
        'casual': '日常',
        'dress': '礼服',
        'lolita': '洛丽塔',
        'maid': '女仆',
        'pajama': '睡衣',
        'santa': '圣诞',
        'winter': '冬季',
        'wintermaid': '冬季女仆',
        'yukata': '浴衣',
        'teenage': '少女',
        'koneko': '小猫',
        
        // SEO描述
        'seoDescription': '一个可以在浏览器中展示猫娘乐园角色E-mote动态立绘的项目，可以用做桌面动态壁纸。',
        'characterPageSuffix': '本页面的角色为 {character}',
        
        // 语言选择器
        'language': '语言',
        'english': 'English',
        'chineseSimplified': '简体中文',
        'chineseTraditional': '繁體中文',
        'japanese': '日本語'
    },
    
    'zh-TW': {
        // 通用文本
        'pageTitle': '貓娘樂園角色E-mote圖鑑',
        'loading': '載入中...',
        'by': '作者：',
        'githubProject': 'Github專案：',
        
        // 角色名称
        'chocola': '巧克力',
        'vanilla': '香草',
        'azuki': '紅豆',
        'coconut': '椰子',
        'maple': '楓',
        'cinnamon': '桂',
        'milk': '牛奶',
        'fraise': '草莓',
        
        // 服装类型
        'casual': '日常',
        'dress': '禮服',
        'lolita': '洛麗塔',
        'maid': '女僕',
        'pajama': '睡衣',
        'santa': '聖誕',
        'winter': '冬季',
        'wintermaid': '冬季女僕',
        'yukata': '浴衣',
        'teenage': '少女',
        'koneko': '小貓',
        
        // SEO描述
        'seoDescription': '一個可以在瀏覽器中展示貓娘樂園角色E-mote動態立繪的專案，可以用做桌面動態壁紙。',
        'characterPageSuffix': '本頁面的角色為 {character}',
        
        // 语言选择器
        'language': '語言',
        'english': 'English',
        'chineseSimplified': '简体中文',
        'chineseTraditional': '繁體中文',
        'japanese': '日本語'
    },
    
    'ja': {
        // 通用文本
        'pageTitle': 'ネコぱらキャラクターE-mote図鑑',
        'loading': '読み込み中...',
        'by': '作者：',
        'githubProject': 'Githubプロジェクト：',
        
        // 角色名称
        'chocola': 'ショコラ',
        'vanilla': 'バニラ',
        'azuki': 'アズキ',
        'coconut': 'ココナツ',
        'maple': 'メイプル',
        'cinnamon': 'シナモン',
        'milk': 'ミルク',
        'fraise': 'フレーズ',
        
        // 服装类型
        'casual': 'カジュアル',
        'dress': 'ドレス',
        'lolita': 'ロリータ',
        'maid': 'メイド',
        'pajama': 'パジャマ',
        'santa': 'サンタ',
        'winter': 'ウィンター',
        'wintermaid': 'ウィンターメイド',
        'yukata': '浴衣',
        'teenage': 'ティーンエイジ',
        'koneko': '子猫',
        
        // SEO描述
        'seoDescription': 'ブラウザでネコぱらキャラクターのE-mote動的イラストを表示できるプロジェクトで、デスクトップの動的壁紙として使用できます。',
        'characterPageSuffix': 'このページのキャラクターは {character} です',
        
        // 语言选择器
        'language': '言語',
        'english': 'English',
        'chineseSimplified': '簡体中文',
        'chineseTraditional': '繁體中文',
        'japanese': '日本語'
    }
};

// 语言管理类
class LanguageManager {
    constructor() {
        this.currentLang = this.getSavedLanguage() || this.detectBrowserLanguage();
        this.characterName = this.extractCharacterName();
        this.characterCostume = this.extractCharacterCostume();
    }
    
    // 检测浏览器语言
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        
        // 支持的语言
        const supportedLangs = ['en', 'zh-CN', 'zh-TW', 'ja'];
        
        // 检查是否完全匹配
        if (supportedLangs.includes(browserLang)) {
            return browserLang;
        }
        
        // 检查基础语言代码
        if (supportedLangs.includes(langCode)) {
            return langCode;
        }
        
        // 中文特殊处理
        if (browserLang.startsWith('zh')) {
            if (browserLang.includes('TW') || browserLang.includes('HK') || browserLang.includes('MO')) {
                return 'zh-TW';
            }
            return 'zh-CN';
        }
        
        // 默认英语
        return 'en';
    }
    
    // 获取保存的语言设置
    getSavedLanguage() {
        return localStorage.getItem('nekoWebShowLanguage');
    }
    
    // 保存语言设置
    saveLanguage(lang) {
        localStorage.setItem('nekoWebShowLanguage', lang);
        this.currentLang = lang;
    }
    
    // 提取角色名称
    extractCharacterName() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        // 从文件名提取角色名称
        const characterMap = {
            'chocola': 'chocola',
            'vanilla': 'vanilla',
            'azuki': 'azuki',
            'coconut': 'coconut',
            'maple': 'maple',
            'cinnamon': 'cinnamon',
            'milk': 'milk',
            'fraise': 'fraise'
        };
        
        for (const [key, value] of Object.entries(characterMap)) {
            if (filename.includes(key)) {
                return value;
            }
        }
        
        return null; // 首页或未知角色
    }
    
    // 提取角色服装
    extractCharacterCostume() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        // 从文件名提取服装类型
        const costumeMap = {
            'casual': 'casual',
            'dress': 'dress',
            'lolita': 'lolita',
            'maid': 'maid',
            'pajama': 'pajama',
            'santa': 'santa',
            'winter': 'winter',
            'wintermaid': 'wintermaid',
            'yukata': 'yukata',
            'teenage': 'teenage',
            'koneko': 'koneko'
        };
        
        for (const [key, value] of Object.entries(costumeMap)) {
            if (filename.includes(key)) {
                return value;
            }
        }
        
        return null; // 首页或未知服装
    }
    
    // 获取翻译
    get(key, params = {}) {
        const langData = translations[this.currentLang] || translations['en'];
        let text = langData[key] || translations['en'][key] || key;
        
        // 替换参数
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        
        return text;
    }
    
    // 获取完整页面标题
    getPageTitle() {
        const baseTitle = this.get('pageTitle');
        
        if (this.characterName && this.characterCostume) {
            const characterName = this.get(this.characterName);
            const costumeName = this.get(this.characterCostume);
            return `${baseTitle} - ${characterName} ${costumeName}`;
        }
        
        return baseTitle;
    }
    
    // 获取SEO描述
    getSeoDescription() {
        const baseDescription = this.get('seoDescription');
        
        if (this.characterName) {
            const characterName = this.get(this.characterName);
            const suffix = this.get('characterPageSuffix', { character: characterName });
            return `${baseDescription} ${suffix}`;
        }
        
        return baseDescription;
    }
    
    // 切换语言
    switchLanguage(lang) {
        if (translations[lang]) {
            this.saveLanguage(lang);
            this.applyTranslations();
            return true;
        }
        return false;
    }
    
    // 应用翻译到页面
    applyTranslations() {
        // 更新页面标题
        document.title = this.getPageTitle();
        
        // 更新html lang属性
        document.documentElement.lang = this.currentLang;
        
        // 更新所有带有data-i18n属性的元素
        this.updateI18nElements();
        
        // 更新meta描述
        this.updateMetaDescription();
    }
    
    // 更新所有带有data-i18n属性的元素
    updateI18nElements() {
        // 查找所有带有data-i18n属性的元素
        const i18nElements = document.querySelectorAll('[data-i18n]');
        
        i18nElements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const paramsAttr = element.getAttribute('data-i18n-params');
            let params = {};
            
            if (paramsAttr) {
                try {
                    params = JSON.parse(paramsAttr);
                } catch (e) {
                    console.error('Failed to parse i18n params:', e);
                }
            }
            
            const translation = this.get(key, params);
            
            // 特殊处理链接元素
            if (element.tagName === 'A' && element.hasAttribute('href') && element.getAttribute('href') !== '#') {
                // 保留链接，只更新文本
                element.textContent = translation;
            } else if (element.hasAttribute('data-i18n-html')) {
                // 处理HTML内容
                element.innerHTML = translation;
            } else if (element.classList.contains('infotext')) {
                // 特殊处理infotext元素，保留链接
                this.updateInfotextElement(element, key, params);
            } else {
                // 普通文本内容
                element.textContent = translation;
            }
        });
        
        // 特殊处理菜单项（包含▾符号的）
        const menuLabels = document.querySelectorAll('.menu-item > .label[data-i18n]');
        menuLabels.forEach(label => {
            const key = label.getAttribute('data-i18n');
            const translation = this.get(key);
            label.textContent = `${translation} ▾`;
        });
    }
    
    // 更新infotext元素，保留链接
    updateInfotextElement(element, key, params) {
        const link = element.querySelector('a');
        if (!link) {
            element.textContent = this.get(key, params);
            return;
        }
        
        const href = link.getAttribute('href');
        const text = link.textContent;
        
        // 根据key决定如何更新
        if (key === 'by' && params.author) {
            element.innerHTML = `${this.get(key)}<a href="${href}" target="_blank">${params.author}</a>`;
        } else if (key === 'githubProject' && params.project) {
            element.innerHTML = `${this.get(key)}<a href="${href}" target="_blank">${params.project}</a>`;
        } else {
            element.innerHTML = `${this.get(key, params)}<a href="${href}" target="_blank">${text}</a>`;
        }
    }
    

    
    // 更新meta描述
    updateMetaDescription() {
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = this.getSeoDescription();
    }
    
    // 创建语言选择器
    createLanguageSelector() {
        const languageSelector = document.createElement('div');
        languageSelector.className = 'menu-item language-selector';
        languageSelector.innerHTML = `
            <span class="label" data-i18n="language">Language ▾</span>
            <div class="dropdown language-dropdown">
                <a href="#" data-lang="en" data-i18n="english">English</a>
                <a href="#" data-lang="zh-CN" data-i18n="chineseSimplified">简体中文</a>
                <a href="#" data-lang="zh-TW" data-i18n="chineseTraditional">繁體中文</a>
                <a href="#" data-lang="ja" data-i18n="japanese">日本語</a>
            </div>
        `;
        
        // 更新语言选择器标签
        this.updateLanguageSelectorLabel(languageSelector);
        
        // 添加点击事件
        languageSelector.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = languageSelector.querySelector('.language-dropdown');
            document.querySelectorAll('.dropdown.open').forEach(dd => {
                if (dd !== dropdown) dd.classList.remove('open');
            });
            dropdown.classList.toggle('open');
        });
        
        // 添加语言选择事件
        languageSelector.querySelectorAll('.language-dropdown a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = link.getAttribute('data-lang');
                this.switchLanguage(lang);
                this.updateLanguageSelectorLabel(languageSelector);
            });
        });
        
        return languageSelector;
    }
    
    // 获取当前语言名称
    getCurrentLanguageName() {
        const languageNames = {
            'en': 'English',
            'zh-CN': '简体中文',
            'zh-TW': '繁體中文',
            'ja': '日本語'
        };
        return languageNames[this.currentLang] || 'English';
    }
    
    // 更新语言选择器标签
    updateLanguageSelectorLabel(selector) {
        const label = selector.querySelector('.label');
        if (label) {
            // 语言选择器标签会通过data-i18n属性自动更新
            // 我们只需要确保应用翻译
            this.updateI18nElements();
        }
    }
}

// 创建全局语言管理器实例
window.languageManager = new LanguageManager();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 应用翻译
    window.languageManager.applyTranslations();
    
    // 添加语言选择器到菜单栏
    const topbar = document.getElementById('topbar');
    if (topbar) {
        const languageSelector = window.languageManager.createLanguageSelector();
        const infotextDivs = topbar.querySelectorAll('.infotext');
        if (infotextDivs.length > 0) {
            topbar.insertBefore(languageSelector, infotextDivs[0]);
        } else {
            topbar.appendChild(languageSelector);
        }
    }
});
