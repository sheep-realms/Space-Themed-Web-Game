class Mixer {
    constructor() {
        this.core = undefined;
        this.audioDB = [];
    }

    find(name) {
        return this.audioDB.find(function(e) {
            return e.name == name
        });
    }

    play(name, volume = undefined, rate = undefined) {
        let obj = this.find(name);
        if (obj == undefined) return undefined;
        let a = new Audio(obj.path);

        if (volume != undefined) {
            a.volume = volume
        } else if (obj?.volume != undefined) {
            a.volume = obj.volume
        } else {
            a.volume = 1;
        };

        if (rate != undefined) {
            a.playbackRate = rate
        } else if (obj?.rate != undefined) {
            a.playbackRate = obj.rate
        } else {
            a.playbackRate = 1;
        };
        
        a.onended = function () {delete this};
        a.play();
    }
}

let mixer = new Mixer();

core.moduleLoad('mixer', mixer);

loader.load('res/data/sound.json', 'res.data.sound');

resources.onInput('res.data.sound', function(value) {
    mixer.audioDB = value;
});