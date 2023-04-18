class Mixer {
    constructor() {
        this.core = undefined;
        this.audioDB = {
            building: "/res/audio/se/building.ogg",
            warship_listened: "/res/audio/se/warship_listened.ogg"
        };
    }

    play(name, volume = 1, rate = 1) {
        let a = new Audio(this.audioDB[name]);
        a.volume = volume;
        a.playbackRate = rate;
        a.onended = function () {delete this;};
        a.play();
    }
}

let mixer = new Mixer();

core.moduleLoad('mixer', mixer);