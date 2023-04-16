class Mixer {
    constructor() {
        this.audioDB = {
            warship_listened: "/res/audio/se/warship_listened.ogg"
        };
    }

    play(name, volume = 1, rate = 1) {
        let a = new Audio(this.audioDB[name]);
        a.volume = volume;
        a.playbackRate = rate;
        a.play();
    }
}

let mixer = new Mixer();