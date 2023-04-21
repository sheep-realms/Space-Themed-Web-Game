/**
 * 设施
 */
class Base {
    constructor() {
        this.name = "base";
        this.cost = 0;
        this.attribute = {
            hp_max: 0,
            sld_max: 0,
            res_max: 0,
            col_max: 0,
            col_spd: 0,
            col_out_spd: 0,
            obs_max: 0,
            bs_min: 0,
            lis_max: 0,
            lis_min: 0,
            rpr_spd: 0,
            mov_spd: 0
        };
        this.buildData = {};
    }

    /**
     * 开始建造
     * @param {Object} baseData 设施信息
     */
    build(baseData) {
        this.buildData = {
            onBuild: true,
            buildingTick: 0,
            buildingCount: baseData.build_time,
            inCost: Math.floor(baseData.cost / baseData.build_time),
            investedCost: 0,
            remainingCost: baseData.cost,
            base: baseData
        };
    }

    /**
     * 施工
     * @param {Number} pres 玩家当前资源数量
     * @returns {Object} 反馈结果
     */
    building(pres) {
        let res = 0;
        if (this.buildData.buildingTick + 1 >= this.buildData.buildingCount) {
            res = this.buildData.remainingCost;
            if (res > pres) {
                return {
                    name: this.buildData.base.name,
                    state: 'pause',
                    res: 0
                };
            }
            this.buildData.buildingTick++;
            this.name = this.buildData.base.name;
            this.cost = this.buildData.base.cost;
            this.attribute = this.buildData.base.attribute;
            this.buildData = {};
            console.log(`build complate!`);
            return {
                name: this.name,
                state: 'complate',
                res: res
            };
        } else {
            res = this.buildData.inCost;
            if (res > pres) {
                return {
                    name: this.buildData.base.name,
                    state: 'pause',
                    res: 0
                };
            }
            this.buildData.buildingTick++;
            this.buildData.investedCost += res;
            this.buildData.remainingCost -= res;
            console.log(`building: ${this.buildData.buildingTick}/${this.buildData.buildingCount}`);
            return {
                name: this.buildData.base.name,
                state: 'building',
                res: res
            };
        }
    }
}