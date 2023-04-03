class SSUI {
    constructor($baseDOM) {
        this.$baseDOM = $baseDOM;
        this.component = {};
        this.screen = {};
    }

    domAdd($sel, html) {
        $($sel).append(html);
    }

    domRep($sel, html) {
        $($sel).html(html);
    }

    setupComponent(obj) {
        this.component[obj.name] = obj;
    }

    setupComponents(objList = []) {
        objList.forEach(obj => {
            this.setupComponent(obj);
        });
    }

    setupScreen(obj) {
        this.screen[obj.name] = obj;
    }

    setupScreens(objList = []) {
        objList.forEach(obj => {
            this.setupScreen(obj);
        });
    }

    newPage(id = '', strClass = '') {
        this.domRep(this.$baseDOM, `<div ${id ? `id="${id}"` : ''} ${strClass ? `id="${strClass}"` : ''}></div>`);
    }

    newScreen(html = '') {
        this.domRep(this.$baseDOM, html);
    }

    loadScreen(name) {
        this.newScreen(this.screen[name]?.compose());
    }
}

let ssui = new SSUI('#game-window');