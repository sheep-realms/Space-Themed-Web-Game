class Entity {
    constructor(name = 'entity') {
        this.name = name;
        this.pos = [0, 0];
        this.feature = {
            noDamage: false,
            noDestroy: false
        }
    }

    teleport(pos) {
        return this.pos = pos;
    }
}