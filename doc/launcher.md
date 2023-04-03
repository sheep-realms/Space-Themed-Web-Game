# 启动器
启动顺序为：
| 事件 | 备注 |
| - | - |
| 加载 SSUI | 游戏所使用的 UI 基本库 |
| 加载 Resources | 资源管理库 |
| 加载 Translator | 本地化库 |
| 加载 Launcher | 启动器 |
| DOM 加载完毕，游戏画面出现，Launcher 接管启动流程 ||
| 加载 Core | 游戏全局变量与方法库 |
| 加载 Game | 游戏本体 |
| 加载 Player | 玩家对象 |
| 加载 Base | 基建设施对象 |
| 加载 SSUIComponent | SSUI 组件库 |
| 加载 SSUIScreen | SSUI 视图库 |
| 加载完毕，主程序接管后续业务逻辑 ||