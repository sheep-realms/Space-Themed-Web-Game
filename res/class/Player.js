/**
 * 玩家
 */
class Player {
    constructor() {
        // 玩家名称
        this.name = "player";
        // 是否为AI
        this.isAI = false;
        // 玩家坐标
        this.pos = [0, 0];
        // 玩家状态
        this.state = {
            hp: 0,          // 血量
            sld: 0,         // 护盾
            res: 0,         // 资源
            col: 0,         // 采集中的资源
            col_sta: 0,     // 采集状态
        };
        // 玩家属性
        this.attribute = {
            hp_max: 0,      // 最大血量
            sld_max: 0,     // 最大护盾
            res_max: 0,     // 资源上限
            col_max: 0,     // 单次采集上限
            col_spd: 0,     // 采集速度
            col_out_spd: 0, // 资源回收速度
            obs_min: 0,     // 强制观测距离
            obs_max: 0,     // 最大观测距离
            lis_min: 0,     // 强制侦听距离
            lis_max: 0,     // 最大侦听距离
            rpr_spd: 0,     // 维修速度
            mov_spd: 0      // 移动速度
        };
        // 基建设施
        this.base = {
            keel: {},       // 龙骨
            produce: {},    // 生产设施
            scanner: {},    // 雷达和扫描器
            shield: {}      // 护盾发生器
        };
        // 武器装备
        this.arms = {
            main: [],       // 主炮
            second: [],     // 副炮
            uav: []         // 无人机
        };
        // 状态效果
        this.effect = [];
        // 广播消息CD时间
        this.broadCd = {};
        // 统计信息
        this.statistics = {
            survivalTick: 0,    // 生存时间
            colCount: 0         // 资源采集量
        };
        // 攻击目标
        this.target = [];
        // 路径点
        this.waypoint = [];
        this.game = {};
    }

    /**
     * 创建玩家
     */
    create() {
        this.state.hp = 100;
        this.state.hp_max = 100;
        this.state.res = 0;
        this.state.res_max = 500;
        this.state.col = 0;
        this.state.col_max = 50;
    }

    /**
     * 更新玩家状态
     * @param {Number} [mode = 0] 是否按百分比更新玩家HP
     * @returns {Object} 更新后的玩家状态
     */
    updateAttribute(mode = 0) {
        let hp_max_old = this.attribute.hp_max;
        this.attribute = {
            hp_max: 0,
            sld_max: 0,
            res_max: 0,
            col_max: 0,
            col_spd: 0,
            col_out_spd: 0,
            obs_min: 0,
            obs_max: 0,
            lis_min: 0,
            lis_max: 0,
            rpr_spd: 0,
            mov_spd: 0
        };

        for (let b in this.base) {
            if (Object.hasOwnProperty.call(this.base, b)) {
                if (JSON.stringify(this.base[b]) != '{}') {
                    for (let a in this.attribute) {
                        if (Object.hasOwnProperty.call(this.attribute, a)) {
                            if (this.base[b].attribute[a] != undefined) this.attribute[a] += this.base[b].attribute[a];
                        }
                    }
                }
            }
        }

        if (mode == 0 && hp_max_old != this.attribute.hp_max) {
            this.state.hp = Math.round(this.state.hp / hp_max_old * this.attribute.hp_max);
        }

        return this.attribute;
    }

    /**
     * 设置基建设施
     * @param {String} type 设施类型
     * @param {Object} baseObj 设施对象
     * @returns {Object} 设置后的设施数据
     */
    setBase(type, baseObj) {
        this.base[type] = baseObj;
        this.updateAttribute(1)
        return this.base;
    }

    /**
     * 回收资源
     * @param {Number} value 回收资源数量 
     * @returns {Object} 反馈结果
     */
    actionResIn(value) {
        let r = 0;
        let isFull = false;
        if (this.state.res + value <= this.attribute.res_max) {
            this.state.res += value;
        } else {
            r = this.state.res + value - this.attribute.res_max;
            this.state.res = this.attribute.res_max;
            isFull = true;
        }
        return {
            now: this.state.res,
            overflow: r,
            full: isFull
        }
    }

    /**
     * 采集资源
     * @param {Number} [efficiency = 1] 采集效率
     * @returns {Number} 采集到的资源数量
     */
    actionCol(efficiency = 1) {
        if (this.state.col_sta == 0 && efficiency <= 0) return 0;
        let col_spd = Math.ceil(this.attribute.col_spd * efficiency);
        let c = 0;
        if (this.state.col_sta == 0) {
            if (this.state.col <= this.attribute.col_max) {
                this.state.col += col_spd;
                c = col_spd;
                if (this.state.col >= this.attribute.col_max) {
                    c -= this.state.col - this.attribute.col_max;
                    this.state.col = this.attribute.col_max;
                    if (this.state.res < this.attribute.res_max) {
                        this.state.col_sta = 1;
                    }
                };
            }
        } else if (this.state.col_sta == 1) {
            let r;
            if (this.state.col > this.attribute.col_out_spd) {
                this.state.col -= this.attribute.col_out_spd;
                r = this.actionResIn(this.attribute.col_out_spd);
            } else if (this.state.col <= this.attribute.col_out_spd) {
                r = this.actionResIn(this.state.col);
                this.state.col = 0;
                this.state.col_sta = 0;
            }
            if (r.overflow > 0) {
                this.state.col += r.overflow;
                this.state.col_sta = 0;
            }
        }
        return c;
    }

    /**
     * 开始建造
     * @param {String} [slot = ''] 设施槽位
     * @param {Object} [data = {}] 设施数据
     */
    actionBuildBase(slot = '', data = {}) {
        this.base[slot].build(data);
        this.sendBroad('equip_building_up', {
            name: $t(`base.produce.${this.base[slot].name}.name`),
            name2: $t(`base.produce.${data.name}.name`)
        });
        this.game.playSound('event.building');
    }

    /**
     * 建造设施
     */
    actionBuilding() {
        // if (this.base.keel?.buildData?.onBuild) res += this.base.keel.building();
        if (this.base.produce?.buildData?.onBuild) {
            let data = this.base.produce.building(this.state.res);
            this.state.res -= data.res;
            if (data.state == 'complate') {
                this.updateAttribute();
                this.sendBroad('equip_build_up', {name: $t(`base.produce.${data.name}.name`)});
            };
            if (data.state == 'pause') this.sendBroad('res_lack_build');
        };
    }

    /**
     * 发送广播
     * @param {String} id 广播ID
     * @param {Object} [data = {}] 额外数据
     * @param {String} [to = 'self'] 收件对象
     * @returns {void}
     */
    sendBroad(id, data = {}, to = 'self') {
        if (this.broadCd[id] != undefined) return;
        let cd = core.system.broad.getCd(id);
        if (cd > 0) {
            this.broadCd[id] = cd;
        }
        core.system.broad.send(id, data, 'system', to);
    }

    /**
     * 更新广播CD时间
     */
    broadCdUpdate() {
        for (let a in this.broadCd) {
            this.broadCd[a]--;
            if (this.broadCd[a] <= 0) delete this.broadCd[a];
        }
    }

    /**
     * 玩家移动
     * @param {Number} angle 角度
     * @param {Number} [distance] 移动距离
     * @returns {Array}
     */
    move(angle, distance = this.attribute.mov_spd) {
        if (distance <= 0) return this.pos;
        if (angle >= 360 || angle <= -360) return; 
        let x = this.pos[0];
        let y = this.pos[1];

        switch (angle) {
            case 0:
                x += distance;
                break;
                
            case 90:
            case -270:
                y += distance;
                break;
            
            case 180:
            case -180:
                x -= distance;
                break;

            case 270:
            case -90:
                y -= distance;
                break;
        
            default:
                let dx = Math.cos(angle * Math.PI/180) * distance + x;
                let dy = Math.sin(angle * Math.PI/180) * distance + y;
                return this.pos = [dx, dy];
        }
        
        return this.pos = [x, y];
    }

    /**
     * 玩家移动到指定位置
     * @param {Array} pos 坐标
     * @param {Number} [distance] 移动距离
     * @returns {Array}
     */
    moveTo(pos, distance = this.attribute.mov_spd) {
        if (distance <= 0) return this.pos;
        let d = this.game.getDistance(this.pos, pos);
        if (distance > d) distance = d;
        let radian = Math.atan2(pos[1] - this.pos[1], pos[0] - this.pos[0]);
        let angle = 180 / Math.PI * radian;
        return this.move(angle, distance);
    }

    /**
     * 玩家移动到指定路径点
     * @param {Waypoint} waypoint 路径点对象
     * @param {Number} [distance] 距离
     * @returns {Array}
     */
    moveToWaypoint(waypoint, distance = this.attribute.mov_spd) {
        return this.moveTo(waypoint.pos, distance);
    }
}

/**
 * 机器玩家
 */
class Bot extends Player {
    constructor() {
        // 玩家名称
        this.name = "bot";
        // 是否为AI
        this.isAI = true;
        // AI行为
        this.action = {};
    }
}