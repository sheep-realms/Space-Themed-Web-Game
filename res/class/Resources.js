class Resources {
    constructor() {
        this.res = {};
        this.event = {
            input: {}
        };
    }

    input(path, value) {
        this.res[path] = value;
        if (this.event.input[path] != undefined && typeof this.event.input[path] == 'function') {
            this.event.input[path]();
        }
    }

    onInput(path, action = function() {}) {
        this.event.input[path] = action;
    }

    getRes(path) {
        return this.res[path];
    }

    newRes(path) {
        return new Object(this.res[path]);
    }
}

let resources = new Resources();

class Loader {
    constructor() {
        this.rootPath = location.href;
        this.loadResList = [
            {
                path: 'lang/en.json',
                res: 'lang.en'
            },
            {
                path: 'lang/ja_jp.json',
                res: 'lang.ja_jp'
            },
            {
                path: 'lang/zh_cn.json',
                res: 'lang.zh_cn'
            },
        ];
    }

    load(path, res, rootPath=this.rootPath) {
        $.getJSON(rootPath + path, function(data) {resources.input(res, data);})
    }
}

let loader = new Loader();