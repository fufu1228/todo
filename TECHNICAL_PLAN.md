# 基于Vue3的轻量型多端个人代办助手 - 技术方案

## 一、项目概述

本项目是一个基于Vue3的轻量型多端个人代办助手，旨在提供高效、便捷的任务管理体验。项目采用纯前端技术栈，无需后端支持，数据存储在浏览器本地。

## 二、技术栈选型

### 2.1 核心框架
- **Vue 3.4+**：采用Composition API，提供更好的TypeScript支持和性能优化
- **Vite 5+**：快速构建工具，提供极速的开发体验和HMR

### 2.2 UI框架选型对比

| 框架 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| Element Plus | 组件丰富、文档完善、企业级 | 体积较大、样式定制复杂 | 中后台系统 |
| Ant Design Vue | 设计规范、组件全面 | 体积大、学习曲线陡 | 企业级应用 |
| Naive UI | 轻量、TypeScript友好 | 生态相对较小 | 中小型项目 |
| **Headless UI + Tailwind CSS** | **极轻量、高度定制、现代化** | **需要自己设计样式** | **个人项目、定制化需求** |

**最终选择：Headless UI + Tailwind CSS**
- 理由：项目强调"轻量型"，需要高度定制化UI，Tailwind CSS提供原子化CSS，打包体积小，符合项目定位

### 2.3 状态管理选型

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| Pinia | 轻量、TypeScript友好、Vue3官方推荐 | 生态相对较新 | Vue3项目 |
| Vuex | 成熟稳定、生态丰富 | 体积较大、API复杂 | Vue2/3项目 |
| **Composition API (ref/reactive)** | **零依赖、简单直接** | **复杂状态管理需手动封装** | **中小型项目** |

**最终选择：Composition API + 自定义Store**
- 理由：项目规模适中，使用Composition API足够，避免引入额外依赖，保持轻量

### 2.4 路由管理
- **Vue Router 4+**：Vue3官方路由，支持Composition API

### 2.5 日期时间处理
- **Day.js**：轻量级日期库（2KB），API简洁，替代moment.js
- 对比：moment.js体积大（70KB+），day.js体积小且API兼容

### 2.6 图标库
- **Heroicons**：Tailwind官方图标库，SVG格式，体积小，风格统一

### 2.7 构建工具
- **Vite**：快速构建、HMR、原生ESM支持
- **TypeScript**：类型安全，提升代码质量（可选，但推荐）

### 2.8 代码规范
- **ESLint**：代码质量检查
- **Prettier**：代码格式化
- **Stylelint**：CSS代码规范

## 三、项目架构设计

### 3.1 目录结构
```
todo/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 资源文件（图片、样式等）
│   ├── components/        # 公共组件
│   │   ├── TaskItem.vue   # 任务项组件
│   │   ├── TaskForm.vue   # 任务表单组件
│   │   ├── CategoryTag.vue # 分类标签组件
│   │   └── ...
│   ├── composables/       # 组合式函数
│   │   ├── useTasks.ts    # 任务管理逻辑
│   │   ├── useReminder.ts # 提醒逻辑
│   │   ├── useCategory.ts # 分类逻辑
│   │   ├── useStorage.ts  # 存储逻辑
│   │   └── useTheme.ts    # 主题逻辑
│   ├── stores/            # 状态管理
│   │   └── taskStore.ts   # 任务状态
│   ├── utils/             # 工具函数
│   │   ├── date.ts        # 日期处理
│   │   ├── storage.ts     # 存储工具
│   │   ├── reminder.ts    # 提醒算法
│   │   └── category.ts    # 分类算法
│   ├── types/             # TypeScript类型定义
│   │   └── task.ts        # 任务类型
│   ├── views/             # 页面组件
│   │   ├── Home.vue       # 首页
│   │   ├── Settings.vue   # 设置页
│   │   └── ...
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### 3.2 数据模型设计

#### 任务数据结构
```typescript
interface Task {
  id: string;                    // 唯一标识
  title: string;                  // 标题
  description?: string;           // 描述
  dueDate?: string;              // 截止时间（ISO格式）
  priority: 'high' | 'medium' | 'low'; // 优先级
  status: 'pending' | 'completed'; // 状态
  category?: string;             // 分类
  parentId?: string;             // 父任务ID（子任务）
  subtasks?: Task[];            // 子任务列表
  reminder?: ReminderConfig;    // 提醒配置
  createdAt: string;            // 创建时间
  updatedAt: string;            // 更新时间
}

interface ReminderConfig {
  enabled: boolean;              // 是否启用
  advanceMinutes: number;        // 提前分钟数
  repeatType?: 'daily' | 'weekly' | 'monthly' | 'none'; // 重复类型
  reminderTime?: string;         // 提醒时段（HH:mm）
  lastReminded?: string;         // 上次提醒时间
}
```

### 3.3 核心模块设计

#### 3.3.1 任务管理模块
- **CRUD操作**：基于Composition API封装useTasks组合函数
- **状态管理**：使用reactive创建响应式任务列表
- **子任务处理**：递归结构，支持无限层级（实际限制2层）
- **子任务操作**：支持子任务的编辑、删除，以及子任务完成状态对父任务的自动影响

#### 3.3.2 智能提醒模块
- **提醒策略**：
  - 普通事项：截止时间前N分钟提醒
  - 重复事项：按周期（日/周/月）重复提醒
  - 逾期事项：超过截止时间后高亮显示，支持二次提醒
- **实现方式**：使用setInterval轮询检查（每分钟），或使用Web Notification API

#### 3.3.3 任务自动分类模块
- **分类规则**：基于关键词匹配
- **预设分类**：工作、学习、生活、购物、健康等
- **算法设计**：关键词权重匹配，支持自定义规则

#### 3.3.4 多端适配模块
- **响应式设计**：Tailwind CSS断点系统（sm/md/lg/xl）
- **移动端优化**：
  - 触摸手势：使用@vueuse/gesture或自定义实现
  - 底部导航：移动端固定底部导航栏
- **PC端优化**：
  - 快捷键：使用@vueuse/core的useKeyboardShortcut
  - 侧边栏：PC端显示侧边栏导航

#### 3.3.5 本地存储模块
- **存储策略**：localStorage + JSON序列化
- **数据结构**：单一key存储所有任务数据
- **数据迁移**：版本号管理，支持数据升级

#### 3.3.6 个性化设置模块
- **主题系统**：CSS变量 + Tailwind dark模式
- **排序功能**：支持多字段排序（时间、优先级、创建时间）

## 四、关键技术实现

### 4.1 响应式布局适配
- **方案**：Tailwind CSS响应式工具类
- **断点**：
  - sm: 640px（手机横屏）
  - md: 768px（平板）
  - lg: 1024px（PC）
  - xl: 1280px（大屏）

### 4.2 数据持久化
- **存储键**：`todo_app_data`
- **数据结构**：`{ version: string, tasks: Task[], settings: Settings }`
- **更新策略**：每次操作后自动保存

### 4.3 智能提醒算法
```typescript
// 提醒检查逻辑
function checkReminders(tasks: Task[]) {
  const now = dayjs();
  tasks.forEach(task => {
    if (!task.reminder?.enabled || task.status === 'completed') return;
    
    const dueDate = dayjs(task.dueDate);
    const remindTime = dueDate.subtract(task.reminder.advanceMinutes, 'minute');
    
    // 检查是否需要提醒
    if (now.isAfter(remindTime) && !isRecentlyReminded(task)) {
      triggerReminder(task);
    }
  });
}
```

### 4.4 任务自动分类算法
```typescript
// 关键词匹配分类
function autoCategorize(title: string, description?: string): string {
  const keywords = {
    '工作': ['会议', '项目', '报告', '邮件', '客户'],
    '学习': ['课程', '作业', '考试', '阅读', '笔记'],
    '生活': ['购物', '缴费', '维修', '清洁'],
    // ...
  };
  
  const text = `${title} ${description || ''}`.toLowerCase();
  let maxScore = 0;
  let category = '其他';
  
  Object.entries(keywords).forEach(([cat, words]) => {
    const score = words.reduce((sum, word) => 
      sum + (text.includes(word) ? 1 : 0), 0
    );
    if (score > maxScore) {
      maxScore = score;
      category = cat;
    }
  });
  
  return category;
}
```

## 五、开发计划

### 阶段一：项目初始化（1天）
1. 创建Vite项目
2. 配置Tailwind CSS、TypeScript
3. 搭建基础目录结构
4. 配置ESLint、Prettier

### 阶段二：核心功能开发（3-4天）
1. 任务CRUD功能
2. 状态管理
3. 子任务功能
4. 本地存储

### 阶段三：高级功能开发（2-3天）
1. 智能提醒
2. 自动分类
3. 个性化设置

### 阶段四：多端适配（2天）
1. 响应式布局
2. 手势操作
3. 快捷键支持

### 阶段五：优化与测试（1-2天）
1. 性能优化
2. 用户体验优化
3. 功能测试

## 六、技术亮点与创新点

1. **轻量级架构**：零后端依赖，纯前端实现
2. **智能分类算法**：基于关键词的自动分类，可扩展
3. **多端适配**：一套代码适配PC和移动端
4. **数据安全**：支持导入导出，防止数据丢失
5. **用户体验**：手势操作、快捷键、主题切换

## 七、论文写作要点

### 7.1 技术选型理由
- 详细对比各技术方案的优劣
- 说明选择理由，体现技术深度

### 7.2 关键技术实现
- 响应式布局适配原理
- localStorage数据持久化策略
- 智能提醒算法设计
- 任务自动分类算法

### 7.3 创新点
- 轻量级架构设计
- 多端适配方案
- 智能分类算法优化

## 八、参考文献方向

1. Vue3官方文档与最佳实践
2. 响应式设计相关论文
3. 任务管理应用设计模式
4. 前端性能优化相关研究
5. 用户体验设计相关文献