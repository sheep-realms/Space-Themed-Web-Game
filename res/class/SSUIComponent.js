class SSUIComponent {
    constructor(name, html = function() {}) {
        this.name = name;
        this.html = html;
    }
}

const SSUIPanel = new SSUIComponent('panel', function(content = '', data = {}) {
    return `<div${data?.id ? ` id="${data.id}"` : ''} class="system-panel${data?.class ? ` ${data.class}` : ''}">${content}</div>`;
});

const SSUITopbar = new SSUIComponent('topbar', function(content = '') {
    return SSUIPanel.html(content, {
        id: 'system-topbar'
    });
});

const SSUIBottombar = new SSUIComponent('bottombar', function(content = '') {
    return SSUIPanel.html(content, {
        id: 'system-bottombar'
    });
});

const SSUIContent = new SSUIComponent('content', function(content = '', data = {}) {
    return `<div id="system-content"${data?.class ? ` class="${data.class}"` : ''}">${content}</div>`;
});

const SSUIContentLeft = new SSUIComponent('content', function(content = '', data = {}) {
    return `<div id="system-content-left"${data?.class ? ` class="${data.class}"` : ''}">${content}</div>`;
});

const SSUIContentRight = new SSUIComponent('content', function(content = '', data = {}) {
    return `<div id="system-content-right"${data?.class ? ` class="${data.class}"` : ''}">${content}</div>`;
});

const SSUIDashboardProgress = new SSUIComponent('dashboardProgress', function(title, value, max, data = {}) {
    let width = value / max * 100;
    return `<div${data?.id ? ` id="${data.id}"` : ''} class="system-dashboard-progress">
        <div class="system-dashboard-progress-title">${title}</div>
        <div class="system-dashboard-progress-content">
            <div class="system-dashboard-progress-bg">
                <div class="system-dashboard-progress-value" style="width: ${width}%;"></div>
                <div class="system-dashboard-progress-text">
                    <span class="value">${value}</span>
                    <span class="max">${max}</span>
                </div>
            </div>
        </div>
    </div>`;
});

const SSUIDashboard = new SSUIComponent('dashboard', function() {
    return SSUIPanel.html(
        SSUIDashboardProgress.html('STR', 80, 100, {id: 'progress-hp'}) +
        SSUIDashboardProgress.html('SLD', 20, 100, {id: 'progress-sld'}) +
        SSUIDashboardProgress.html('COL', 100, 100, {id: 'progress-col'}) +
        SSUIDashboardProgress.html('RES', 100, 100, {id: 'progress-res'})
    , {
        id: 'system-dashboard'
    });
});

const SSUITabPage = new SSUIComponent('tabPage', function(tabdata = [], data = {}) {
    let before = `<div class="system-tabpage"><div class="system-tabpage-tab">`;
    let after = `</div></div>`
    let content = '';
    tabdata.forEach(e => {
        content += `<span class="system-tabpage-tab-item">${e.title}</span>`
    });
    return before + content + after;
});

const SSUIBuildMenu = new SSUIComponent('buildMenu', function() {
    return SSUIPanel.html(
        SSUITabPage.html(
            [
                {title: $t('ui.game.build_menu.overview')},
                {title: $t('ui.game.build_menu.base')},
                {title: $t('ui.game.build_menu.arms_main')},
                {title: $t('ui.game.build_menu.arms_second')},
                {title: $t('ui.game.build_menu.arms_uav')}
            ]
        )
    , {
        id: 'system-build'
    });
});

ssui.setupComponents([
    SSUIPanel,
    SSUITopbar,
    SSUIBottombar,
    SSUIContent,
    SSUIContentLeft,
    SSUIContentRight,
    SSUIDashboardProgress,
    SSUIDashboard,
    SSUITabPage,
    SSUIBuildMenu
]);