# 轻量型多端个人待办助手 - 系统架构图

## 1. 系统总体架构图

```mermaid
graph TB
    subgraph 用户层
        U1[用户 PC端/移动端]
    end

    subgraph 前端层 Vue3
        F1[身份认证模块]
        F2[任务管理模块]
        F3[智能提醒模块]
        F4[任务自动分类模块]
        F5[多端适配模块]
        F6[数据持久化与云同步模块]
        F7[个性化设置模块]
        F8[日历视图模块]
        F9[个人中心模块]
    end

    subgraph 本地存储
        L1[(localStorage)]
    end

    subgraph 云服务层 CloudBase
        subgraph 云函数
            CF1[user 云函数]
            CF2[tasks 云函数]
        end
        subgraph 云数据库
            DB1[(users 集合)]
            DB2[(tasks 集合)]
        end
    end

    U1 -->|HTTPS| F1
    U1 -->|HTTPS| F2
    U1 -->|HTTPS| F8
    U1 -->|HTTPS| F9

    F1 -->|调用| CF1
    F2 -->|调用| CF2
    F6 -->|调用| CF2
    F9 -->|调用| CF1

    CF1 -->|读写| DB1
    CF2 -->|读写| DB2

    F2 -->|直接读写| L1
    F6 -->|直接读写| L1
    F7 -->|直接读写| L1

    F1 -.->|触发| F3
    F2 -.->|触发| F4
    F2 -.->|触发| F6
```

## 2. 功能结构图（简约版）

```mermaid
graph TD
    A[轻量型多端个人待办助手]
    A --> B[用户子系统]
    A --> C[后端服务]

    B --> B1[身份认证]
    B --> B2[任务管理]
    B --> B3[智能提醒]
    B --> B4[自动分类]
    B --> B5[多端适配]
    B --> B6[数据同步]
    B --> B7[个性化设置]
    B --> B8[日历视图]
    B --> B9[个人中心]

    C --> C1[user云函数]
    C --> C2[tasks云函数]

    C1 --> C1a[注册/登录]
    C1 --> C1b[用户信息管理]

    C2 --> C2a[任务CRUD]
    C2 --> C2b[批量操作]
```

## 3. 实体关系图（ER图）

```mermaid
erDiagram
    USER ||--o{ TASK : owns
    USER {
        string userId PK "手机号，唯一标识"
        string phone "手机号"
        string password "密码SHA256加密"
        string nickname "昵称"
        string birthday "生日"
        string gender "性别"
        int avatar "头像编号1-8"
        string qq "QQ号"
        string alipay "支付宝账号"
        string wechat "微信号"
        datetime createdAt "创建时间"
        datetime updatedAt "更新时间"
    }
    TASK {
        string _id PK "云数据库自动生成"
        string userId FK "所属用户ID"
        string id "前端任务ID"
        string title "任务标题"
        string description "任务描述"
        string dueDate "截止日期"
        boolean isAllDay "是否全天"
        string priority "优先级 high/medium/low"
        string status "状态 pending/completed"
        string category "分类"
        string parentId "父任务ID"
        array subtasks "子任务列表"
        object reminder "提醒配置"
        datetime createdAt "创建时间"
        datetime updatedAt "更新时间"
    }
```

### 实体说明

| 实体 | 说明 | 主键 |
|------|------|------|
| USER | 用户实体，手机号作为唯一标识 | userId |
| TASK | 任务实体，属于某个用户 | _id（云数据库生成） |

### 关系说明

| 关系 | 类型 | 说明 |
|------|------|------|
| USER owns TASK | 一对多 | 一个用户可拥有多个任务，每个任务只属于一个用户 |

## 3. 数据流向图

```mermaid
sequenceDiagram
    participant U as 用户
    participant F as 前端 Vue3
    participant L as localStorage
    participant CF as 云函数
    participant DB as 云数据库

    U->>F: 打开应用
    F->>L: 读取本地数据
    F-->>U: 显示本地任务

    alt 已登录用户
        F->>CF: 调用 sync/list
        CF->>DB: 查询云端任务
        DB-->>CF: 返回任务列表
        CF-->>F: 返回云端数据
        F->>L: 合并/覆盖本地数据
        F-->>U: 更新显示
    end

    U->>F: 创建/修改任务
    F->>L: 保存到本地
    F-->>U: 即时反馈
    F->>F: 标记待同步 debounce 5秒
    F->>CF: 自动同步到云端
    CF->>DB: 写入数据库

    U->>F: 切换设备登录
    F->>CF: 手机号+密码登录
    CF->>DB: 验证用户
    CF-->>F: 返回登录凭证
    F->>CF: 拉取云端任务
    CF->>DB: 查询用户任务
    DB-->>CF: 返回任务列表
    CF-->>F: 返回云端数据
    F->>L: 覆盖本地数据
    F-->>U: 显示同步后任务
```

## 4. 模块依赖关系图

```mermaid
graph LR
    subgraph 核心模块
        A[taskStore 状态管理]
        B[cloudSync 云同步]
        C[storage 本地存储]
    end

    subgraph 视图层
        V1[Home.vue 首页]
        V2[Calendar.vue 日历]
        V3[Settings.vue 设置]
        V4[Profile.vue 个人中心]
        V5[Login.vue 登录]
    end

    subgraph 功能模块
        M1[reminder 提醒服务]
        M2[classifier 分类器]
        M3[notification 通知]
    end

    A --> C
    B --> A
    B --> C

    V1 --> A
    V1 --> B
    V2 --> A
    V3 --> C
    V4 --> B
    V5 --> B

    M1 --> A
    M2 --> A
    M3 --> M1
```

## 5. 部署架构图

```mermaid
graph TB
    subgraph 开发环境
        D1[本地开发服务器 Vite]
        D2[云函数本地调试]
        D3[Git 版本控制]
    end

    subgraph 腾讯云 CloudBase
        subgraph 静态托管
            S1[前端构建产物 dist]
            S2[CDN 加速]
        end
        subgraph 云开发环境
            E1[云函数 user]
            E2[云函数 tasks]
            E3[数据库 users]
            E4[数据库 tasks]
            E5[自定义登录 鉴权]
        end
    end

    subgraph 用户访问
        U1[PC 浏览器]
        U2[手机浏览器]
        U3[微信内置浏览器]
    end

    D1 -->|构建| S1
    D2 -->|部署| E1
    D2 -->|部署| E2

    U1 -->|HTTPS| S2
    U2 -->|HTTPS| S2
    U3 -->|HTTPS| S2
    S2 --> S1
    S1 -->|API 调用| E1
    S1 -->|API 调用| E2
    E1 --> E3
    E2 --> E4
    E1 --> E5
```

---

## 使用说明

1. **查看架构图**：将上述 Mermaid 代码复制到以下工具查看：
   - [Mermaid Live Editor](https://mermaid.live/)
   - VS Code + Mermaid 插件
   - GitHub/GitLab Markdown 预览

2. **导出图片**：在 Mermaid Live Editor 中可导出 PNG/SVG/PDF 格式

3. **修改维护**：如需调整架构，直接编辑本文档中的 Mermaid 代码
