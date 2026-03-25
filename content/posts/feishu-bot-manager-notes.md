---
title: "飞书机器人配置笔记（原文存档）"
date: "2026-03-25"
tags: ["Feishu", "OpenClaw", "笔记", "Vercel"]
section: "飞书集成"
order: 1
description: "记录如何创建 OpenClaw 专用飞书机器人、绑定 agent、验证是否已成功写入网站并推送到 Vercel。"
---

# 流程
1. 安装feishu-bot-manage skills
2. 详情参考文档[配置机器人](https://leochens.feishu.cn/wiki/DsF6waD85iiOwgkGYl7ckTOJnoh)有安装zip文件下载下来
3. 这个链接创建一个openclaw专用的飞书机器人，这个机器人会把权限和回调自动配置好。你只需要输入名称和选个头像就行了[配置机器人](https://open.feishu.cn/page/openclaw?form=multiAgent)
4. openclaw 直接对话
```
帮我调用skills创建一个[名字] agent并配置飞书机器人：
APP ID：cli_a9361104747b1bdd #步骤三获取
App Secret：xxxG5TTdxi4Jyx0xOFTekkzZFY6sry. #步骤三获取的
```

可能出现问题：运行完成后出现网关断开,但是网关断开直接就已经配置好了agent和飞书机器人直接把网关安装回来就好
运行命令：
```
openclaw gateway install
```

# 验证方法
终端验证agent是否存在
```
openclaw agents list
```
登陆飞书与创建好的机器人进行对话是否成功将这篇文章写入网站并推送到vercel
