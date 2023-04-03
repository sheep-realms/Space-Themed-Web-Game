/**
 * 游戏核心：存放全局变量与方法
 */
class Core {
    constructor() {
        this.style = {};
        
        this.style.load = function(filepath) {
            $('head').append(`<link rel="stylesheet" href="res/style/${filepath}.css">`);
        };

        this.system = {
            broad: {
                broadList: [],
                broadCd: [
                    'res_lack',
                    'res_lack_attack',
                    'res_lack_build'
                ],
                event: {
                    newMessage: function() {}
                }
            }
        };

        this.system.broad.on = function(eventName, action = function() {}) {
            if (typeof action != 'function') return;
            return this.event[eventName] = action;
        }

        this.system.broad.send = function(id, data = {}, from = 'system', to = '') {
            if (to.search(/^(all|team|self|none)$/g) == -1) to = 'none';
            let msg = {
                id: id,
                data: data,
                from: from,
                to: to
            };
            this.broadList.push(msg);
            if (to != 'none') this.event.newMessage(msg);
            return msg;
        }

        this.system.broad.getCd = function(id) {
            if (this.broadCd.indexOf(id) != -1) {
                return 120;
            } else {
                return 0;
            }
        }
    }
}

let core = new Core();