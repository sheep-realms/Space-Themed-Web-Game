# 某个太空主题的网页游戏（未命名）
这是一个以太空航行为主题的网页小游戏，游戏目前的开发进度为：刚刚起步。

## 文件结构
```
doc/ - 开发文档
lang/ - 本地化
lib/ - 支持库
res/ - 资源
├ audio/ - 音频
│ ├ music/ - 音乐
│ └ se/ - 音效
├ class/ - 类
├ cursor/ - 鼠标指针
├ data/ - 数据
│ ├ arms/ - 武器
│ ├ base/ - 基建设施
│ ├ map/ - 地图
│ └ sound.json - 音频数据
├ image/ - 图像
│ └ icon/ - 图标
├ script/ - 脚本
└ style/ - 样式表
index.html - 首页
Launcher.js - 启动器
```

## 类
| 类名 | 继承 | 描述 |
| - | - | - |
| Base | | 【游戏】基建设施 |
| Bullet | | 【游戏】子弹（非实体） |
| Bot | Player | 【游戏】机器玩家 |
| Core | | 【系统】系统核心 |
| Entity | | 【游戏】实体 |
| Game | | 【游戏】游戏对局 |
| Mixer | | 【系统】混音器 |
| Player | Entity | 【游戏】玩家 |
| Resources | | 【系统】资源管理 |
| Loader | | 【系统】加载器 |
| SSUI | | 【系统】SSUI |
| SSUIComponent | | 【系统】SSUI 组件 |
| SSUIScreen | | 【系统】SSUI 画面 |
| Translator | | 【系统】本地化 |
| Waypoint | Entity | 【游戏】路径点 |