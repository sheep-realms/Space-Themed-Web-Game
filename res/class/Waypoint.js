class Waypoint extends Entity {
    constructor(pos = [0, 0], id = 'waypoint') {
        super('waypoint');
        this.id = id;
        this.pos = pos;
        this.attribute = {
            hp_max: 0,
            sld_max: 0,
            obs_min: 0,
            obs_max: 0,
        };
    }
}