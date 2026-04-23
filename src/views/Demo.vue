<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 头部 -->
    <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div class="max-w-5xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <router-link
              to="/"
              class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-colors"
              title="返回待办"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </router-link>
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">演示中心</h1>
          </div>

          <div class="flex items-center gap-2">
            <router-link
              to="/calendar"
              class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-colors"
              title="日历"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </router-link>
            <router-link
              to="/settings"
              class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-colors"
              title="设置"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-4 py-6 space-y-8">
      <!-- Hero -->
      <section
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="grid md:grid-cols-2 gap-6 items-start">
          <div class="space-y-4">
            <div>
              <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                Todo 助手演示
              </h2>
              <p class="mt-3 text-gray-600 dark:text-gray-300">
                一页看懂待办应用能力：任务管理、智能分类、提醒通知、手势操作、数据导入导出等。
              </p>
            </div>

            <div class="flex flex-wrap gap-3">
              <button
                v-if="!demoMode"
                @click="loadDemoData"
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 5v14M5 12h14"
                  />
                </svg>
                加载演示数据
              </button>

              <button
                v-else
                @click="restoreBackup"
                class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                恢复我的数据
              </button>

              <button
                @click="resetPreview"
                class="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                重置预览筛选
              </button>
            </div>

            <div class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p>提示：在右侧预览区直接操作（编辑/完成/删除）；移动端可左右滑动。</p>
              <p class="hidden sm:block">
                演示数据不会自动覆盖你的真实数据：加载前会备份，恢复时可还原。
              </p>
            </div>
          </div>

          <!-- 预览（PC/移动两套展示效果） -->
          <div class="space-y-4">
            <!-- PC -->
            <div
              class="hidden md:block bg-white/70 dark:bg-gray-900/20 rounded-lg border border-gray-200/80 dark:border-gray-700/80 p-4"
            >
              <div class="flex items-center justify-between gap-3 mb-3">
                <h3 class="font-semibold text-gray-900 dark:text-gray-100">实时预览（PC）</h3>
                <div class="flex items-center gap-2">
                  <button
                    @click="showTaskForm = true"
                    class="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    title="新建任务"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-3 mb-4">
                <div class="relative flex-1 min-w-[240px]">
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="搜索任务..."
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <svg
                    class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                <select
                  v-model="statusFilter"
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="">全部状态</option>
                  <option value="pending">未完成</option>
                  <option value="completed">已完成</option>
                </select>

                <select
                  v-model="categoryFilter"
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="">全部分类</option>
                  <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>

                <select
                  v-model="priorityFilter"
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="">全部优先级</option>
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>

                <select
                  v-model="sortField"
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="createdAt">创建时间</option>
                  <option value="dueDate">截止时间</option>
                  <option value="priority">优先级</option>
                  <option value="title">标题</option>
                </select>

                <button
                  @click="toggleSortOrder"
                  class="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                  title="切换排序顺序"
                >
                  <svg
                    class="w-5 h-5 transition-transform"
                    :class="{ 'rotate-180': sortOrder === 'desc' }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
              </div>

              <div v-if="filteredTasks.length > 0" class="space-y-3">
                <TaskItem
                  v-for="task in filteredTasks"
                  :key="task.id"
                  :task="task"
                  @edit="handleEdit"
                  @add-subtask="handleAddSubtask"
                  @edit-subtask="handleEdit"
                />
              </div>

              <div
                v-else
                class="text-center py-10 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <svg
                  class="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">暂无任务</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  点击上方「加载演示数据」体验完整功能。
                </p>
              </div>
            </div>

            <!-- Mobile -->
            <div
              class="md:hidden bg-white/70 dark:bg-gray-900/20 rounded-lg border border-gray-200/80 dark:border-gray-700/80 p-4"
            >
              <div class="flex items-center justify-between gap-3 mb-3">
                <h3 class="font-semibold text-gray-900 dark:text-gray-100">实时预览（移动）</h3>
                <button
                  @click="showTaskForm = true"
                  class="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  title="新建任务"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>

              <div class="space-y-3">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索任务..."
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />

                <div class="grid grid-cols-2 gap-3">
                  <select
                    v-model="statusFilter"
                    class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  >
                    <option value="">状态</option>
                    <option value="pending">未完成</option>
                    <option value="completed">已完成</option>
                  </select>

                  <select
                    v-model="priorityFilter"
                    class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  >
                    <option value="">优先级</option>
                    <option value="high">高</option>
                    <option value="medium">中</option>
                    <option value="low">低</option>
                  </select>
                </div>

                <select
                  v-model="categoryFilter"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="">分类</option>
                  <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>

                <div class="flex items-center gap-3">
                  <select
                    v-model="sortField"
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  >
                    <option value="createdAt">排序：创建</option>
                    <option value="dueDate">排序：截止</option>
                    <option value="priority">排序：优先级</option>
                    <option value="title">排序：标题</option>
                  </select>

                  <button
                    @click="toggleSortOrder"
                    class="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                    title="切换排序顺序"
                  >
                    <svg
                      class="w-5 h-5 transition-transform"
                      :class="{ 'rotate-180': sortOrder === 'desc' }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="mt-4">
                <div v-if="filteredTasks.length > 0" class="space-y-3">
                  <TaskItem
                    v-for="task in filteredTasks"
                    :key="task.id"
                    :task="task"
                    @edit="handleEdit"
                    @add-subtask="handleAddSubtask"
                    @edit-subtask="handleEdit"
                  />
                </div>
                <div
                  v-else
                  class="text-center py-10 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                    暂无任务
                  </h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    点击上方「加载演示数据」体验。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 功能介绍（响应式：PC 两列 / 移动一列） -->
      <section class="space-y-4">
        <div class="flex items-end justify-between gap-3">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">各功能演示介绍</h3>
          <div class="hidden lg:flex text-sm text-gray-500 dark:text-gray-400">
            <span class="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700"
              >PC 更适合完整筛选与排序</span
            >
            <span class="ml-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700"
              >移动更适合手势与快速操作</span
            >
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <article
            class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5"
          >
            <h4 class="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
              <svg
                class="w-5 h-5 text-primary-600 dark:text-primary-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              用户系统与云同步
            </h4>
            <p class="mt-3 text-sm text-gray-600 dark:text-gray-300">
              支持手机号验证码登录/注册，登录后自动同步任务数据到云端，支持多设备登录。
            </p>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              首次进入应用会跳转到登录页面，未登录时仅本地存储，登录后自动开启云同步。
            </p>
          </article>

          <article
            class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5"
          >
            <h4 class="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
              <svg
                class="w-5 h-5 text-primary-600 dark:text-primary-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              个人中心
            </h4>
            <p class="mt-3 text-sm text-gray-600 dark:text-gray-300">
              支持修改昵称、头像、生日等个人信息，绑定微信/QQ/支付宝账号。
            </p>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              支持修改密码、账号注销等安全功能，注销后删除所有云端数据。
            </p>
          </article>

          <article
            class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5"
          >
            <div class="flex items-center justify-between gap-3">
              <h4 class="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                <svg
                  class="w-5 h-5 text-primary-600 dark:text-primary-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                任务管理
              </h4>
            </div>
            <p class="mt-3 text-sm text-gray-600 dark:text-gray-300">
              通过搜索、状态/分类/优先级筛选，以及创建时间/截止时间/优先级/标题排序，实现快速找到目标任务。
            </p>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              在演示预览区直接切换筛选项即可看到任务列表实时更新。
            </p>
          </article>

          <article
            class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5"
          >
            <h4 class="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
              <svg
                class="w-5 h-5 text-green-600 dark:text-green-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m7 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              进度与手势操作
            </h4>
            <p class="mt-3 text-sm text-gray-600 dark:text-gray-300">
              移动端支持左右滑动：向右完成、向左删除。任务完成后会降低显示透明度，便于观察进度。
            </p>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              子任务也会以独立复选框形式展示，并能同步完成状态。
            </p>
          </article>

          <article
            class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5"
          >
            <h4 class="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
              <svg
                class="w-5 h-5 text-blue-600 dark:text-blue-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              智能分类
            </h4>
            <p class="mt-3 text-sm text-gray-600 dark:text-gray-300">
              分类根据任务标题/描述关键词自动匹配，并在卡片上以标签形式展示（支持深色模式配色）。
            </p>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              演示数据包含「工作/学习/购物/健康」等分类示例，便于验证效果。
            </p>
          </article>

          <article
            class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5"
          >
            <h4 class="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
              <svg
                class="w-5 h-5 text-yellow-600 dark:text-yellow-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              提醒通知
            </h4>
            <p class="mt-3 text-sm text-gray-600 dark:text-gray-300">
              支持提前提醒（分钟）、重复类型（每天/每周/每月）与提醒时段配置。逾期任务支持二次提醒，重要任务可高频提醒。
            </p>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              提醒通过浏览器通知 + 应用内弹窗双通道推送。
            </p>
          </article>

          <article
            class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5"
          >
            <h4 class="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
              <svg
                class="w-5 h-5 text-cyan-600 dark:text-cyan-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              日历视图
            </h4>
            <p class="mt-3 text-sm text-gray-600 dark:text-gray-300">
              按月查看任务分布，点击日期可直接新建任务，点击任务卡片可编辑。已完成任务灰色展示，逾期任务高亮。
            </p>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              内置数据统计面板：可视化展示本日/本周/本月的任务完成进度。
            </p>
          </article>

          <article
            class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5"
          >
            <h4 class="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
              <svg
                class="w-5 h-5 text-purple-600 dark:text-purple-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h8m-8 4h8m-8-8h8M21 16V8a2 2 0 00-2-2H7a2 2 0 00-2 2v8m16 0a2 2 0 01-2 2H7a2 2 0 01-2-2m16 0z"
                />
              </svg>
              导入导出
            </h4>
            <p class="mt-3 text-sm text-gray-600 dark:text-gray-300">
              支持将当前任务与设置导出为 JSON 进行备份，也可从 JSON 导入覆盖现有数据。
            </p>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              下方「数据导入导出」区域提供一键操作入口。
            </p>
          </article>

          <article
            class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5"
          >
            <h4 class="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
              <svg
                class="w-5 h-5 text-gray-700 dark:text-gray-200"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              快捷键与编辑
            </h4>
            <p class="mt-3 text-sm text-gray-600 dark:text-gray-300">
              PC 端支持快捷键：`Ctrl/Cmd + N` 打开新建任务；在任务卡片上可点击编辑图标修改内容。
            </p>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              移动端以「触控点击 + 子任务复选框」为主，减少复杂操作成本。
            </p>
          </article>
        </div>
      </section>

      <!-- 导入导出 -->
      <section
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">数据导入导出</h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
              导出为 JSON，便于备份或迁移；导入将覆盖当前任务与设置，请谨慎操作。
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              @click="handleExport"
              class="flex-1 sm:flex-initial px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              导出数据
            </button>
            <label
              class="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center cursor-pointer"
            >
              导入数据
              <input type="file" accept=".json" class="hidden" @change="handleImport" />
            </label>
          </div>
        </div>
      </section>
    </main>

    <TaskForm
      v-if="showTaskForm"
      :task="editingTask"
      :parent-id="parentTaskId"
      @close="handleFormClose"
    />

    <!-- 快捷键提示（仅PC） -->
    <div
      v-if="showShortcuts"
      class="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 text-sm"
    >
      <h3 class="font-medium mb-2 text-gray-900 dark:text-gray-100">快捷键提示</h3>
      <ul class="space-y-1 text-gray-600 dark:text-gray-400">
        <li>
          <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Ctrl/Cmd + N</kbd> 新建任务
        </li>
        <li><kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Esc</kbd> 取消/关闭</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useKeyboardShortcut } from '@/composables/useKeyboardShortcut'

import TaskItem from '@/components/TaskItem.vue'
import TaskForm from '@/components/TaskForm.vue'

import {
  taskStore,
  filteredAndSortedTasks,
  updateSort,
  createTask,
  updateTask,
  deleteTasks,
} from '@/stores/taskStore'
import type { Task, TaskPriority, TaskStatus } from '@/types/task'

import { dayjs } from '@/utils/date'
import { downloadData, readDataFromFile, saveAppData } from '@/utils/storage'

const DEMO_BACKUP_KEY = 'todo_demo_backup'

const demoMode = ref(false)

onMounted(() => {
  demoMode.value = !!localStorage.getItem(DEMO_BACKUP_KEY)

  // 显示快捷键提示（仅PC）
  if (window.innerWidth >= 1024) {
    setTimeout(() => {
      showShortcuts.value = true
      setTimeout(() => {
        showShortcuts.value = false
      }, 5000)
    }, 2000)
  }
})

const showTaskForm = ref(false)
const editingTask = ref<Task | undefined>()
const parentTaskId = ref<string | undefined>()

const searchQuery = ref('')
const statusFilter = ref<TaskStatus | ''>('')
const categoryFilter = ref('')
const priorityFilter = ref<TaskPriority | ''>('')
const sortField = ref<'createdAt' | 'dueDate' | 'priority' | 'title'>('createdAt')
const sortOrder = ref<'asc' | 'desc'>('desc')
const showShortcuts = ref(false)

const categories = computed(() => taskStore.settings.categories)
const filteredTasks = computed(() => filteredAndSortedTasks.value)

watch(
  [statusFilter, categoryFilter, priorityFilter, searchQuery],
  ([status, category, priority, search]) => {
    taskStore.filter = {
      status: status || undefined,
      category: category || undefined,
      priority: priority || undefined,
      search: search || undefined,
    }
  },
  { immediate: true }
)

watch(
  [sortField, sortOrder],
  ([field, order]) => {
    updateSort({
      field,
      order,
    })
  },
  { immediate: true }
)

function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

function handleEdit(task: Task) {
  editingTask.value = task
  parentTaskId.value = undefined
  showTaskForm.value = true
}

function handleAddSubtask(task: Task) {
  editingTask.value = undefined
  parentTaskId.value = task.id
  showTaskForm.value = true
}

function handleFormClose() {
  showTaskForm.value = false
  editingTask.value = undefined
  parentTaskId.value = undefined
}

// 快捷键：Ctrl/Cmd + N 新建任务
useKeyboardShortcut(['Meta+n', 'Ctrl+n'], () => {
  if (!showTaskForm.value) {
    showTaskForm.value = true
    editingTask.value = undefined
    parentTaskId.value = undefined
  }
})

function resetPreview() {
  searchQuery.value = ''
  statusFilter.value = ''
  categoryFilter.value = ''
  priorityFilter.value = ''
  sortField.value = 'createdAt'
  sortOrder.value = 'desc'
}

function backupCurrentData() {
  // 由于 taskStore 不包含 version 字段，直接读取 localStorage 中的完整数据
  const raw = localStorage.getItem('todo_app_data')
  if (!raw) return
  localStorage.setItem(DEMO_BACKUP_KEY, raw)
}

function clearAllTasks() {
  const ids = taskStore.tasks.map(t => t.id)
  if (ids.length === 0) return
  deleteTasks(ids)
}

async function seedDemoTasks() {
  const now = dayjs()

  const overdueDueDate = now
    .subtract(3, 'day')
    .hour(9)
    .minute(0)
    .second(0)
    .millisecond(0)
    .toISOString()
  const dueSoonDueDate = now.add(1, 'day').hour(10).minute(0).second(0).millisecond(0).toISOString()
  const futureDueDate = now.add(7, 'day').hour(9).minute(0).second(0).millisecond(0).toISOString()

  const lastReminded = new Date().toISOString()

  // 1) 逾期任务：用于展示红色截止时间
  await createTask({
    title: '项目复盘会议',
    description: '整理报告、发送邮件并跟进下一步任务（演示逾期）',
    dueDate: overdueDueDate,
    priority: 'high',
    reminder: {
      enabled: true,
      advanceMinutes: 30,
      repeatType: 'none',
      lastReminded,
    },
  })

  // 2) 即将到期：用于展示黄色截止时间
  await createTask({
    title: '学习 Vue3 笔记',
    description: '阅读文档并记录笔记（演示即将到期）',
    dueDate: dueSoonDueDate,
    priority: 'medium',
    reminder: {
      enabled: true,
      advanceMinutes: 10,
      repeatType: 'daily',
      reminderTime: '23:59',
      lastReminded,
    },
  })

  // 3) 普通任务：用于展示默认样式
  await createTask({
    title: '购物下单清单',
    description: '买牛奶并下单，记录采购进度（演示分类）',
    dueDate: futureDueDate,
    priority: 'low',
    reminder: {
      enabled: false,
      advanceMinutes: 30,
      repeatType: 'none',
      reminderTime: '23:59',
      lastReminded,
    },
  })

  // 4) 已完成任务：用于展示透明度
  const completed = await createTask({
    title: '健康体检计划（已完成）',
    description: '提交资料并确认预约结果',
    dueDate: now.subtract(1, 'day').hour(10).minute(0).second(0).millisecond(0).toISOString(),
    priority: 'low',
    reminder: {
      enabled: false,
      advanceMinutes: 30,
      repeatType: 'none',
      lastReminded,
    },
  })
  updateTask(completed.id, { status: 'completed' })

  // 5) 子任务示例：用于展示子任务复选框与联动
  const parent = await createTask({
    title: '健康体检计划',
    description: '准备体检事项与材料（演示子任务）',
    dueDate: futureDueDate,
    priority: 'high',
    reminder: {
      enabled: true,
      advanceMinutes: 20,
      repeatType: 'weekly',
      reminderTime: '23:59',
      lastReminded,
    },
  })

  await createTask({
    parentId: parent.id,
    title: '预约体检时间',
    description: '选择合适的日期与时段',
    dueDate: futureDueDate,
    priority: 'medium',
    reminder: {
      enabled: false,
      advanceMinutes: 20,
      repeatType: 'none',
      lastReminded,
    },
  })

  await createTask({
    parentId: parent.id,
    title: '准备证件资料',
    description: '身份证、既往病历与相关报告',
    dueDate: futureDueDate,
    priority: 'low',
    reminder: {
      enabled: false,
      advanceMinutes: 20,
      repeatType: 'none',
      lastReminded,
    },
  })
}

async function loadDemoData() {
  if (demoMode.value) return
  if (!localStorage.getItem('todo_app_data')) {
    // 理论上不会发生：localStorage 一般由应用初始化提供
    localStorage.setItem(
      'todo_app_data',
      JSON.stringify({ version: '1.0.0', tasks: [], settings: taskStore.settings })
    )
  }

  // 备份真实数据后加载演示数据
  backupCurrentData()
  clearAllTasks()
  seedDemoTasks()

  demoMode.value = true
}

function restoreBackup() {
  const raw = localStorage.getItem(DEMO_BACKUP_KEY)
  if (!raw) return

  localStorage.removeItem(DEMO_BACKUP_KEY)
  saveAppData(JSON.parse(raw))

  demoMode.value = false
  window.location.reload()
}

function handleExport() {
  downloadData({
    version: '1.0.0',
    tasks: taskStore.tasks,
    settings: taskStore.settings,
  })
}

async function handleImport(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    const data = await readDataFromFile(file)
    if (confirm('导入数据将覆盖当前所有数据，确定要继续吗？')) {
      saveAppData(data)

      // 如果处在演示模式，恢复备份的意义不大：导入后直接离开演示模式
      localStorage.removeItem(DEMO_BACKUP_KEY)
      demoMode.value = false

      window.location.reload()
    }
  } catch (error) {
    alert('导入失败：' + (error as Error).message)
  } finally {
    // 允许重复导入同一个文件
    target.value = ''
  }
}
</script>