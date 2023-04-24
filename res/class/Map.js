/**
 * 地图
 */
class Map {
    constructor() {
        // 地图名称
        this.name = 'map';
        // 边界信息
        this.border = {
            minSize: 1000,                  // 最小边界
            maxSize: 1256,                  // 最大边界
            overflowSpeed: 0                // 边界外移动速度比率
        };
        // 游戏规则
        this.gamerule = {
            scarce_resources: false         // 稀缺资源
        };
        // 资源信息
        this.resources = {
            res: 0,                         // 现存资源
            res_max: 0,                     // 资源总量
            col_efficiency: 0               // 采集效率
        };
        // 实体
        this.entity = [];
        // 触发器
        this.trigger = [];
    }
}