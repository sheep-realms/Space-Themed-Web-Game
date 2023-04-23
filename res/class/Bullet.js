/**
 * 子弹
 */
class Bullet {
    constructor() {
        this.name = 'bullet';
        // 来源
        this.origin = {
            uuid: undefined,        // 发射者
            pos: [0, 0]             // 发射位置
        };
        // 目标
        this.target = {
            uuid: undefined,        // 被攻击者
            aimPos: [0, 0],         // 发射时被攻击者位置
            distance: 0             // 发射时被攻击者与发射者距离
        }
        // 状态
        this.state = {
            distance: 0,            // 剩余距离
            fllghtDistance: 0,      // 飞行距离
        };
        // 属性
        this.attribute = {
            org_spd: 0,             // 发射者相对速度
            int_spd: 0,             // 初速度
            acc_spd: 0,             // 加速度
            max_spd: 0,             // 最大速度
            hit_rat: 0,             // 初始命中率
            min_rag: 0,             // 最小射程
            max_rag: 0              // 最大射程
        };
        // 伤害数据
        this.damageData = {
            damage: 0,
            type: 'bullet'
        };
    }
}