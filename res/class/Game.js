/**
 * 游戏本体：每一场游戏所创建的对象
 */
class Game {
    constructor() {
        this.name = "space";
        this.core = undefined;
        this.loopTimer = 0;
        this.player = [];
        this.waypoint = [];
        this.map = {
            gamerule: {
                scarce_resources: false
            },
            resources: {
                res: 0,
                res_max: 0,
                col_efficiency: 0
            }
        };
        this.statistics = {
            gameTick: 0
        };
        this.entity = [];
        this.event = {
            playerStateUpdate: function() {}
        };
    }

    /**
     * 绑定事件
     * @param {String} eventName 事件名称
     * @param {Function} action 方法
     * @returns {Function} 绑定的方法
     */
    on(eventName, action = function() {}) {
        if (typeof action != 'function') return;
        return this.event[eventName] = action;
    }

    /**
     * 主循环
     */
    mainLoop() {
        this.statistics.gameTick++;
        
        for (let p of this.player) {
            // 更新玩家广播CD
            if (p.boradCd != {}) p.broadCdUpdate();

            // 玩家采集资源
            this.delRes(p.actionCol(this.map.resources.col_efficiency));
            // console.log(`map_res: ${this.map.resources.res}, P1_col: ${p.state.col}, P1_res: ${p.state.res}, map_res%: ${this.map.resources.res / this.map.resources.res_max}`);
            
            // 玩家建造建筑
            p.actionBuilding();
        }

        this.event.playerStateUpdate(this.player[0].state, this.player[0].attribute);
    }

    /**
     * 加入实体
     * @param {Entity} entity 实体对象
     */
    addEntity(entity) {
        entity.UUID = this.getUUID();
        entity.game = this;
        this.entity.push(entity);
    }

    /**
     * 通过 UUID 查找实体
     * @param {String} uuid UUID
     * @returns {Entity} 实体对象
     */
    findEntity(uuid) {
        return this.entity.find(function(e) {
            return e.UUID == uuid;
        });
    }

    newPlayer() {
        return false;
    }

    /**
     * 加入玩家
     * @param {Player} player 玩家对象
     */
    join(player) {
        this.player.push(player);
        this.addEntity(player);
    }

    addWaypoint(waypoint) {
        this.waypoint.push(waypoint);
        this.addEntity(waypoint);
    }

    getWaypointPos(id) {
        return this.waypoint.find(function(e) {
            return e.id == id;
        }).pos;
    }

    /**
     * 开始游戏
     */
    start() {
        this.loopTimer = setInterval(this.mainLoop.bind(this), 250);
    }

    /**
     * 测算距离
     * @param {Array<Number>} pos1 坐标1
     * @param {Array<Number>} pos2 坐标2
     * @returns 测算结果
     */
    getDistance(pos1 = [0, 0], pos2 = [0, 0]) {
        let dx = Math.abs(pos1[0] - pos2[0]);
        let dy = Math.abs(pos1[1] - pos2[1]);
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }

    /**
     * 测算实体距离
     * @param {Entity} entity1 实体1
     * @param {Entity} entity2 实体2
     * @returns 测算结果
     */
    getPlayerDistance(entity1, entity2) {
        return this.getDistance(entity1.pos, entity2.pos);
    }

    /**
     * 设置资源总量
     * @param {Number} value 资源总量
     * @returns 资源总量
     */
    setResMax(value) {
        this.map.resources.res = value;
        this.map.resources.col_efficiency = 1;
        return this.map.resources.res_max = value;
    }

    /**
     * 移除资源
     * @param {Number} value 移除的资源数量
     * @returns 移除后的剩余数量
     */
    delRes(value) {
        this.map.resources.res -= value;
        if (this.map.resources.res < 0) this.map.resources.res = 0;

        let res_per = this.map.resources.res / this.map.resources.res_max;

        if (!this.map.gamerule.scarce_resources) {
            if (this.map.resources.res <= 0) {
                if (this.map.resources.col_efficiency != 0.25) {
                    this.setColEfficiency(0.25);
                    core.system.broad.send('res_overall_lack_3', {}, 'system', 'all');
                }
            } else if (res_per < 0.15) {
                if (this.map.resources.col_efficiency != 0.5) {
                    this.setColEfficiency(0.5);
                    core.system.broad.send('res_overall_lack_2', {}, 'system', 'all');
                }
            } else if (res_per < 0.5) {
                if (this.map.resources.col_efficiency != 0.75) {
                    this.setColEfficiency(0.75);
                    core.system.broad.send('res_overall_lack_1', {}, 'system', 'all');
                }
            } else if (res_per <= 1.15) {
                if (this.map.resources.col_efficiency != 1) this.setColEfficiency(1);
            } else if (res_per <= 1.5) {
                if (this.map.resources.col_efficiency != 1.25) this.setColEfficiency(1.25);
            } else if (res_per <= 2) {
                if (this.map.resources.col_efficiency != 1.5) this.setColEfficiency(1.5);
            } else {
                if (this.map.resources.col_efficiency != 2) this.setColEfficiency(2);
            }
        } else {
            if (this.map.resources.res <= 0) {
                if (this.map.resources.col_efficiency != 0) {
                    this.setColEfficiency(0);
                    core.system.broad.send('res_overall_lack_3', {}, 'system', 'all');
                }
            } else if (res_per < 0.15) {
                if (this.map.resources.col_efficiency != 0.15) {
                    this.setColEfficiency(0.15);
                    core.system.broad.send('res_overall_lack_2', {}, 'system', 'all');
                }
            } else if (res_per < 0.25) {
                if (this.map.resources.col_efficiency != 0.25) this.setColEfficiency(0.25);
            } else if (res_per < 0.5) {
                if (this.map.resources.col_efficiency != 0.5) {
                    this.setColEfficiency(0.5);
                    core.system.broad.send('res_overall_lack_1', {}, 'system', 'all');
                }
            } else if (res_per < 0.75) {
                if (this.map.resources.col_efficiency != 0.75) this.setColEfficiency(0.75);
            } else {
                if (this.map.resources.col_efficiency != 1) this.setColEfficiency(1);
            }
        }

        return this.map.resources.res; 
    }

    /**
     * 设置资源采集效率
     * @param {Number} value 采集效率
     * @returns 设置后的采集效率
     */
    setColEfficiency(value) {
        return this.map.resources.col_efficiency = value;
    }

    /**
     * 播放音频
     * @param {String} name 音频ID
     * @param {Number} [volume = undefined] 音量
     * @param {Number} [rate = undefined] 播放速度
     */
    playSound(name, volume = undefined, rate = undefined) {
        this.core.playSound(name, volume, rate);
    };

    /**
     * 生成 UUID
     * @returns UUID
     */
    getUUID() {
        let timestamp = new Date().getTime();
        let perforNow = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0;
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let random = Math.random() * 16;
            if (timestamp > 0) {
                random = (timestamp + random) % 16 | 0;
                timestamp = Math.floor(timestamp / 16);
            } else {
                random = (perforNow + random) % 16 | 0;
                perforNow = Math.floor(perforNow / 16);
            }
            return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16);
        });
    };
}