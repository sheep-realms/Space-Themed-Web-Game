/**
 * 实体
 */
class Entity {
    constructor(name = 'entity') {
        this.name = name;
        this.pos = [0, 0];
        this.feature = {
            noDamage: false,
            noDestroy: false
        }
    }

    /**
     * 传送到指定位置
     * @param {Array} pos 坐标
     * @returns {Array} 坐标
     */
    teleport(pos) {
        return this.pos = pos;
    }
}