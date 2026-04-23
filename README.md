# 基于Vue3的轻量型多端个人代办助手

一个功能完整、轻量级的个人任务管理应用，基于Vue3 + Vite构建，支持PC端和移动端。

## ✨ 功能特性

### 👤 用户系统
- 📱 **手机号登录**：支持手机号验证码登录/注册
- ☁️ **多设备同步**：登录后自动同步任务数据到云端
- 👤 **个人中心**：修改昵称、头像、生日等个人信息
- 🔗 **账号绑定**：支持绑定微信、QQ、支付宝
- 🔒 **账号安全**：支持修改密码、账号注销

### 📋 任务管理
- ✅ **基础操作**：支持任务的增删改查
- 🏷️ **任务属性**：标题、描述、截止时间、优先级（高/中/低）
- 🔄 **状态管理**：任务状态切换（未完成/已完成）
- 📊 **任务拆分**：支持子任务创建、编辑、删除，自动计算父任务完成进度
- 🔍 **筛选功能**：按状态、分类、优先级筛选，支持搜索

### 🔔 智能提醒
- ⏰ **普通提醒**：截止时间前自定义提前量提醒
- 🔁 **重复提醒**：支持每日/每周/每月重复提醒
- ⚠️ **逾期提醒**：逾期任务高亮显示，支持二次提醒
- 📱 **浏览器通知**：使用Web Notification API推送提醒

### 📱 多端适配
- 💻 **响应式布局**：完美适配PC端、平板、手机
- 👆 **手势操作**：移动端支持左滑删除、右滑标记完成
- ⌨️ **快捷键**：PC端支持Enter新建任务、Esc取消操作
- 🌓 **主题切换**：支持浅色/深色/跟随系统主题

### 💾 数据管理
- 💿 **本地存储**：基于localStorage实现数据持久化
- ☁️ **自动云同步**：任务变更自动同步到云端（需登录）
- 📤 **数据导出**：支持JSON格式导出备份
- 📥 **数据导入**：支持从JSON文件导入数据
- 🔒 **数据安全**：版本化管理，防止数据丢失

### ⚙️ 个性化设置
- 🎨 **主题定制**：浅色/深色/自动主题切换
- 📊 **列表排序**：支持按截止时间/优先级/创建时间/标题排序
- 🔧 **默认设置**：可配置默认优先级、默认提醒时间

## 🛠️ 技术栈

### 核心框架
- **Vue 3.4+** - 渐进式JavaScript框架，采用Composition API
- **Vite 5+** - 下一代前端构建工具，极速开发体验
- **TypeScript** - 类型安全的JavaScript超集

### UI框架
- **Tailwind CSS 3.4+** - 实用优先的CSS框架，原子化CSS
- **Headless UI** - 无样式组件库（本项目采用自定义组件）

### 工具库
- **Vue Router 4+** - Vue.js官方路由管理器
- **Day.js** - 轻量级日期处理库（2KB，替代moment.js）
- **@vueuse/core** - Vue Composition API工具集合

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **TypeScript** - 类型检查

## 📦 项目结构

```
todo/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 资源文件
│   ├── components/        # 公共组件
│   │   ├── TaskItem.vue   # 任务项组件
│   │   ├── TaskForm.vue   # 任务表单组件
│   │   └── CategoryTag.vue # 分类标签组件
│   ├── composables/       # 组合式函数
│   │   ├── useReminder.ts # 提醒逻辑
│   │   ├── useTheme.ts    # 主题逻辑
│   │   ├── useGesture.ts  # 手势操作
│   │   └── useKeyboardShortcut.ts # 快捷键
│   ├── stores/            # 状态管理
│   │   └── taskStore.ts   # 任务状态
│   ├── utils/             # 工具函数
│   │   ├── date.ts        # 日期处理
│   │   ├── storage.ts     # 存储工具
│   │   ├── cloudSync.ts   # 云同步
│   │   ├── category.ts    # 分类算法
│   │   ├── reminder.ts    # 提醒算法
│   │   └── llm.ts         # AI 分类
│   ├── types/             # TypeScript类型定义
│   │   └── task.ts        # 任务类型
│   ├── views/             # 页面组件
│   │   ├── Home.vue       # 首页
│   │   ├── Login.vue      # 登录页
│   │   ├── Profile.vue    # 个人中心
│   │   ├── Calendar.vue   # 日历视图
│   │   ├── Settings.vue   # 设置页
│   │   └── Demo.vue       # 演示页
│   ├── router/            # 路由配置
│   │   └── index.ts
│   ├── App.vue            # 根组件
│   ├── main.ts            # 入口文件
│   └── style.css          # 全局样式
├── cloudfunctions/        # 云函数
│   ├── tasks/             # 任务云函数
│   └── user/              # 用户云函数
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── cloudbaserc.json
└── README.md
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
npm install
```

如果你在当前设备使用 `npm install` 失败，可优先使用 Yarn：

```bash
yarn install
```

建议固定项目级镜像源（已在仓库内配置）：
- npm：`.npmrc` -> `https://registry.npmmirror.com/`
- yarn：`.yarnrc.yml` -> `npmRegistryServer: "https://registry.npmmirror.com"`

### 开发运行

```bash
npm run dev
```

或使用 Yarn：

```bash
yarn dev
```

应用将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
npm run build
```

或使用 Yarn：

```bash
yarn build
```

构建产物将输出到 `dist` 目录

### 预览生产版本

```bash
npm run preview
```

或使用 Yarn：

```bash
yarn preview
```

## 📖 使用指南

### 创建任务
1. 点击"新建任务"按钮
2. 填写任务标题（必填）
3. 可选填写描述、截止时间、优先级、分类
4. 配置提醒设置（可选）
5. 点击"创建"保存

### 编辑任务
- 点击任务卡片右上角的编辑图标
- 或双击任务卡片（PC端）

### 完成任务
- 点击任务前的复选框
- 移动端：右滑任务卡片

### 删除任务
- 点击任务卡片右上角的删除图标
- 移动端：左滑任务卡片
- 批量删除：选中多个任务后点击"批量删除"

### 创建子任务
1. 点击父任务卡片上的"添加子任务"按钮
2. 填写子任务标题和其他信息
3. 点击"创建"保存

### 编辑子任务
- 点击子任务右侧的编辑图标

### 删除子任务
- 点击子任务右侧的删除图标

### 子任务完成状态
- 当所有子任务都完成时，父任务会自动标记为完成
- 当有子任务未完成时，父任务会自动标记为未完成

### 数据备份
1. 进入"设置"页面
2. 点击"导出数据"下载JSON备份文件
3. 需要恢复时，点击"导入数据"选择备份文件

## 🎯 核心功能实现

### 1. 响应式布局适配
使用Tailwind CSS的响应式工具类实现多端适配：
- `sm:` - 640px+ (手机横屏)
- `md:` - 768px+ (平板)
- `lg:` - 1024px+ (PC)
- `xl:` - 1280px+ (大屏)

### 2. 数据持久化
基于localStorage实现数据存储：
- 数据结构：`{ version, tasks, settings }`
- 自动保存：每次操作后自动保存到localStorage
- 版本管理：支持数据迁移和升级

### 3. 智能提醒算法
- 轮询检查：每分钟检查一次任务提醒
- 提醒策略：
  - 普通事项：截止时间前N分钟提醒
  - 重复事项：按周期重复提醒
  - 逾期事项：高亮显示，支持二次提醒
- 浏览器通知：使用Web Notification API

### 4. 任务自动分类算法
基于关键词匹配的自动分类：
- 关键词权重匹配
- 支持自定义分类规则
- 可手动调整分类

### 5. 手势操作
移动端触摸手势实现：
- 左滑删除：滑动距离超过阈值触发删除
- 右滑完成：滑动距离超过阈值触发完成
- 平滑动画：使用CSS transform实现滑动效果

## 🔧 配置说明

### 主题配置
在 `tailwind.config.js` 中配置主题色：
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // 自定义主色调
      }
    }
  }
}
```

### 分类规则配置
在 `src/stores/taskStore.ts` 的 `defaultSettings` 中配置：
```typescript
categoryRules: {
  工作: ['会议', '项目', '报告'],
  学习: ['课程', '作业', '考试'],
  // ...
}
```

## 📝 开发规范

### 代码风格
- 使用ESLint进行代码检查
- 使用Prettier进行代码格式化
- 遵循Vue 3 Composition API最佳实践

### 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建/工具链相关

## 🐛 已知问题

1. 批量选择功能需要进一步完善UI交互

## 🔮 未来计划

- [ ] 任务标签系统
- [ ] 任务附件上传
- [ ] 任务评论功能
- [ ] 数据统计图表
- [ ] PWA支持（离线使用）
- [ ] 多语言支持
- [ ] 任务模板功能

## 📄 许可证

MIT License

## 👨‍💻 作者

毕业设计项目 - 基于Vue3的轻量型多端个人代办助手

## 🙏 致谢

- [Vue.js](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Day.js](https://day.js.org/)
- [VueUse](https://vueuse.org/)