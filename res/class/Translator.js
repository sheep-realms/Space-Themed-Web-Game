class Translator {
    constructor(lang='zh_cn') {
        this.lang = lang;
        this.i18n = {};
    }

    output(key, variable={}) {
        let keys = key.split('.');
        let objI18n = this.i18n;
        for (const k of keys) {
            if (objI18n[k] == undefined) return key;
            objI18n = objI18n[k];
        }
        let t = objI18n;
        if (typeof t != 'string') return key;
        for (const v in variable) {
            let p = new RegExp('\{\s*'+v+'\s*\}', 'g');
            t = t.replace(p, variable[v]);
        }
        return t;
    }

    load(i18nList) {
        this.i18n = i18nList;
    }
}