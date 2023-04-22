function launcherMsg(message, id='') {
    $('#game-launcher-page').append(`<p data-id="${id}">${message}</p>`);
}

function launcherMsgForId(message, id) {
    $(`#game-launcher-page>p[data-id="${id}"]`).text(message);
}

function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (typeof(callback) != "undefined") {
        if (script.readyState) {
            script.onreadystatechange = function() {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            script.onload = function() {
                callback();
            };
        }
    };
    script.src = url;
    document.body.appendChild(script);
}

function loadStyle(filepath) {
    $('head').append(`<link rel="stylesheet" href="res/style/${filepath}.css">`);
};

let translator = new Translator();

function $t(key, variable={}) {
    return translator.output(key, variable);
}

let loadList = [
    {
        name: 'Core',
        className: 'core',
        type: 'load_class',
        path: 'res/class/Core.js'
    }, {
        name: 'Game',
        className: 'game',
        type: 'load_class',
        path: 'res/class/Game.js'
    }, {
        name: 'Entity',
        className: 'entity',
        type: 'load_class',
        path: 'res/class/Entity.js'
    }, {
        name: 'Player',
        className: 'player',
        type: 'load_class',
        path: 'res/class/Player.js'
    }, {
        name: 'Base',
        className: 'base',
        type: 'load_class',
        path: 'res/class/Base.js'
    }, {
        name: 'Waypoint',
        className: 'waypoint',
        type: 'load_class',
        path: 'res/class/Waypoint.js'
    }, {
        name: 'Mixer',
        className: 'mixer',
        type: 'load_class',
        path: 'res/class/Mixer.js'
    }, {
        name: 'SSUIComponent',
        className: 'ssui-component',
        type: 'load_class',
        path: 'res/class/SSUIComponent.js'
    }, {
        name: 'SSUIScreen',
        className: 'ssui-screen',
        type: 'load_class',
        path: 'res/class/SSUIScreen.js'
    }, {
        name: 'SSUIScreen',
        type: 'test',
        path: 'res/script/test.js'
    }
];

let loadNow = {};

let dataList = [
    {
        key: 'sound',
        path: 'sound.json'
    }, {
        key: 'base.produce',
        path: 'base/produce.json'
    }
];

let stylesheet = [
    'SSUI',
    'echo'
];

let loadingTimer = 0;

function loadListRun() {
    loadNow = loadList.shift();
    switch (loadNow.type) {
        case 'load_class':
            launcherMsg($t('ui.launcher.load_class', {name: loadNow.name}), 'load-class-' + loadNow.className);
            loadScript(loadNow.path, function() {
                launcherMsgForId($t('ui.launcher.load_class_done', {name: loadNow.name}), 'load-class-' + loadNow.className);
                loadListRun();
            });
            break;
    
        default:
            clearTimeout(loadingTimer);
            loadScript(loadNow.path);

            $('script[src="Launcher.js"]').remove();
            break;
    }
}

resources.onInput('lang.zh_cn', function() {
    translator.load(resources.getRes('lang.zh_cn'));
    document.title = $t('ui.game.title');
    launcherMsg($t('ui.launcher.loaded_i18n'));

    stylesheet.forEach(e => {
        loadStyle(e);
    });
    
    loadListRun();
});

resources.onInput('res.data.base.produce', function() {
    
});

$(document).ready(function() {
    ssui.newPage('game-launcher-page');

    if (location.origin == 'file://') {
        launcherMsg('Deployment Error: Same-origin Policy.');
        launcherMsg("'file://' is not an origin that can run this program.");
        return;
    }

    launcherMsg('Base resource loaded.');
    launcherMsg('I18N module loading...');

    loadingTimer = setTimeout(function() {
        launcherMsg('The loading time is too long. We recommend that you deploy this project locally.');
    }, 30000);

    loader.load('lang/zh_cn.json', 'lang.zh_cn');
    loader.load('res/data/base/produce.json', 'res.data.base.produce');
});
