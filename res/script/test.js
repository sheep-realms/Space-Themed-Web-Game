// 创建玩家
let p1 = new Player();
// 初始化玩家
p1.create();

// 创建游戏
let game = new Game();
// 加入玩家
game.join(p1);

// 创建基建设施
let testbase2 = new Base();
// 修改设施属性
testbase2.attribute = {
    hp_max: 100,
    sld_max: 0,
    res_max: 0,
    col_max: 0,
    col_spd: 0,
    col_out_spd: 0,
    obs_max: 0,
    bs_min: 0,
    lis_max: 0,
    lis_min: 0
};

// 创建基建设施
let testbase = new Base();
// 修改设施属性
testbase.name = 'p1';
testbase.attribute = {
    hp_max: 0,
    sld_max: 0,
    res_max: 500,
    col_max: 50,
    col_spd: 2,
    col_out_spd: 4,
    obs_max: 0,
    bs_min: 0,
    lis_max: 0,
    lis_min: 0
};

// 安装设施
p1.setBase('produce', testbase);
p1.setBase('keel', testbase2);

// 设置地图资源总量
game.setResMax(5000);

ssui.loadScreen('gameMain');

game.on('playerStateUpdate', function(state, attribute) {
    stateUpdate('hp', state.hp, attribute.hp_max);
    stateUpdate('sld', state.sld, attribute.sld_max);
    stateUpdate('col', state.col, attribute.col_max);
    stateUpdate('res', state.res, attribute.res_max);

    if (state.col_sta == 1 || state.col == 0 || state.res >= attribute.res_max) {
        $('#progress-col').addClass('disable');
    } else {
        $('#progress-col').removeClass('disable');
    }
});

function stateUpdate(type, value, max) {
    $('#progress-' + type + ' .value').text(value);
    $('#progress-' + type + ' .max').text(max);
    if (max > 0) {
        $('#progress-' + type + ' .system-dashboard-progress-value').attr('style', `width: ${value / max * 100}%;`);
    } else {
        $('#progress-' + type + ' .system-dashboard-progress-value').attr('style', `width: 0%;`);
    }
}

$('#game-window').append(`<div id="echo-mini"></div>`)

$(document).on('click', '#progress-col:not(.disable)', function() {
    game.player[0].state.col_sta = 1;
});

core.system.broad.on('newMessage', function(msg) {
    // console.log($t('broad.' + msg.id, msg.data));
    $('#echo-mini').prepend(`<div class="echo-mini-item">
        <div class="echo-mini-item-box">
            <div class="echo-mini-item-content">${$t('broad.' + msg.id, msg.data)}</div>
        </div>
    </div>`)
});