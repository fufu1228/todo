# CloudBase 云函数部署指南

## 一、环境准备

### 1. 注册并开通 CloudBase

1. 访问 [腾讯云 CloudBase 控制台](https://console.cloud.tencent.com/tcb)
2. 使用微信扫码或 QQ 登录
3. 点击「新建环境」，选择：
   - **计费模式**：按量计费（有免费额度，毕设演示完全够用）
   - **环境名称**：如 `todo-dev`
4. 创建完成后，在环境概览页面记录 **环境 ID**（格式如 `todo-xxx`）

### 2. 创建数据库集合

1. 在 CloudBase 控制台左侧菜单点击「数据库」
2. 点击「添加集合」，创建以下集合：
   - `tasks` - 任务数据集合
   - `users` - 用户数据集合
3. 权限设置选择「仅创建者可读写」（确保用户只能操作自己的数据）

### 3. 开启匿名登录

1. 在 CloudBase 控制台左侧菜单点击「登录授权」
2. 找到「匿名登录」，点击「启用」
3. 这样用户无需注册即可使用同步功能

### 4. 开启手机号登录（可选，用于用户注册登录）

1. 在 CloudBase 控制台左侧菜单点击「登录授权」
2. 找到「手机号登录」，点击「启用」
3. 需要配置短信服务：
   - 在「短信服务」中创建签名和模板
   - 在 CloudBase「短信配置」中关联模板
4. 或者在开发测试阶段，使用开发模式（验证码直接返回）

---

## 二、部署云函数

### 方式一：通过 CloudBase CLI 部署（推荐）

```bash
# 1. 全局安装 CloudBase CLI
npm install -g @cloudbase/cli

# 2. 登录腾讯云
cloudbase login

# 3. 进入项目根目录
cd /path/to/todo

# 4. 初始化 CloudBase 配置（会生成 cloudbaserc.json）
cloudbase init

# 5. 部署云函数
cloudbase functions:deploy tasks
```

### 方式二：通过控制台手动部署

1. 在 CloudBase 控制台左侧菜单点击「云函数」
2. 点击「新建云函数」，函数名称填 `tasks`
3. 运行环境选择 `Nodejs 16.17`（或更高版本）
4. 将 `cloudfunctions/tasks/index.js` 的内容粘贴到在线编辑器
5. 将 `cloudfunctions/tasks/package.json` 的内容也粘贴进去
6. 点击「部署」

### 云函数代码说明

#### tasks 云函数

云函数位于 `cloudfunctions/tasks/index.js`，支持以下操作：

| action        | 说明                 | data 参数          |
| ------------- | -------------------- | ------------------ |
| `list`        | 获取当前用户所有任务 | 无                 |
| `create`      | 创建任务             | `{ taskData }`     |
| `update`      | 更新任务             | `{ id, updates }`  |
| `delete`      | 删除任务             | `{ id }`           |
| `batchDelete` | 批量删除             | `{ ids }`          |
| `sync`        | 全量同步（覆盖云端） | `{ tasks: [...] }` |

每个操作都会自动关联当前用户的 `userId`（来自匿名登录的 openId 或自定义登录的 customUserId），确保数据隔离。

#### user 云函数

云函数位于 `cloudfunctions/user/index.js`，支持以下操作：

| action       | 说明           | data 参数                    |
| ------------ | -------------- | ---------------------------- |
| `sendCode`   | 发送手机验证码 | `{ phone }`                 |
| `login`      | 手机号登录     | `{ phone, code }`           |
| `register`   | 手机号注册     | `{ phone, code }`           |
| `getUser`    | 获取当前用户   | 无                           |

### 部署云函数

```bash
# 部署 tasks 云函数
cloudbase functions:deploy tasks

# 部署 user 云函数
cloudbase functions:deploy user

# 或者一次性部署所有云函数
cloudbase functions:deploy
```

---

## 三、前端配置

### 1. 环境 ID 配置

在设置页面的「云端同步」区域填入你的 CloudBase 环境 ID，点击「立即同步」即可开始同步。

环境 ID 会自动保存到 localStorage，下次打开自动生效。

### 2. SDK 已安装

`@cloudbase/js-sdk` 已在 `package.json` 中声明，`npm install` 时会自动安装。

### 3. 核心文件

| 文件                            | 说明                                                 |
| ------------------------------- | ---------------------------------------------------- |
| `src/utils/cloudSync.ts`        | 云端同步核心逻辑，封装了登录、拉取、上传、合并等操作 |
| `src/views/Settings.vue`        | 设置页中的云端同步 UI                                |
| `cloudfunctions/tasks/index.js` | 云函数代码（需部署到 CloudBase）                     |

---

## 四、同步策略

本项目采用 **本地优先（Local-First）** 策略：

1. **日常操作**：所有增删改都写入 LocalStorage，保证离线可用
2. **手动同步**：用户在设置页点击「立即同步」时：
   - 从云端拉取任务列表
   - 本地优先合并（保留本地修改，补充云端新增任务）
   - 将合并后的全量数据上传到云端
3. **强制上传**：用本地数据完全覆盖云端（适合换设备后首次同步）
4. **跨设备**：在另一台设备登录同一环境后，点击同步即可拉取数据

---

## 五、常见问题

### Q: 匿名登录的数据会丢失吗？

A: 匿名登录的用户 ID 由 CloudBase 分配并持久化，只要不清除浏览器缓存，同一设备的匿名 ID 不会变。建议后续接入邮箱登录实现更稳定的身份识别。

### Q: 云函数调用失败怎么办？

A: 检查以下几点：

- 环境 ID 是否正确
- 云函数是否已部署成功
- 匿名登录是否已开启
- 数据库集合 `tasks` 是否已创建

### Q: 免费额度够用吗？

A: CloudBase 免费额度包含：

- 云函数调用：每月 40 万次
- 数据库读操作：每月 50 万次
- 数据库写操作：每月 20 万次
- 存储：5GB

对于毕设演示和个人使用完全足够。
