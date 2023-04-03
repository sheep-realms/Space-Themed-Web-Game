class SSUIScreen {
    constructor(name, html = []) {
        this.name = name;
        this.html = html;
    }

    compose() {
        return this.html.join('');
    }
}

const SSUIScreenGameMain = new SSUIScreen('gameMain', [
    SSUITopbar.html(),
    SSUIContent.html(
        SSUIContentLeft.html() + 
        SSUIContentRight.html(
            SSUIDashboard.html() + 
            SSUIBuildMenu.html()
        )
    ),
    SSUIBottombar.html()
]);

ssui.setupScreens([
    SSUIScreenGameMain
]);