<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 头部 -->
    <header class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center gap-4">
          <router-link
            to="/"
            class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </router-link>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">个人中心</h1>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="max-w-4xl mx-auto px-4 py-6">
      <!-- 用户信息卡片 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="flex items-center gap-6">
          <!-- 头像 -->
          <div class="relative">
            <div class="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <span class="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {{ userStore.user?.phone?.slice(-4) || '未登录' }}
              </span>
            </div>
            <button
              @click="showAvatarDialog = true"
              class="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ userInfo.nickname || '用户' + (userStore.user?.phone?.slice(-4) || '') }}
            </h2>
            <p class="text-gray-500 dark:text-gray-400">{{ userStore.user?.phone }}</p>
            <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">用户ID: {{ userStore.user?.userId }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <!-- 账号信息 -->
        <section class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">账号信息</h2>
          <div class="space-y-4">
            <!-- 昵称 -->
            <div class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div>
                <p class="text-gray-700 dark:text-gray-300">昵称</p>
                <p class="text-sm text-gray-500">{{ userInfo.nickname || '未设置' }}</p>
              </div>
              <button
                @click="showNicknameDialog = true"
                class="text-primary-600 dark:text-primary-400 hover:underline"
              >
                修改
              </button>
            </div>
            <!-- 生日 -->
            <div class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div>
                <p class="text-gray-700 dark:text-gray-300">生日</p>
                <p class="text-sm text-gray-500">{{ userInfo.birthday || '未设置' }}</p>
              </div>
              <button
                @click="showBirthdayDialog = true"
                class="text-primary-600 dark:text-primary-400 hover:underline"
              >
                {{ userInfo.birthday ? '修改' : '设置' }}
              </button>
            </div>
            <!-- 性别 -->
            <div class="flex items-center justify-between py-3">
              <div>
                <p class="text-gray-700 dark:text-gray-300">性别</p>
                <p class="text-sm text-gray-500">{{ genderText }}</p>
              </div>
              <button
                @click="showGenderDialog = true"
                class="text-primary-600 dark:text-primary-400 hover:underline"
              >
                {{ userInfo.gender ? '修改' : '设置' }}
              </button>
            </div>
            <!-- 修改密码 -->
            <div class="flex items-center justify-between py-3">
              <div>
                <p class="text-gray-700 dark:text-gray-300">登录密码</p>
                <p class="text-sm text-gray-500">定期修改密码保护账号安全</p>
              </div>
              <button
                @click="showPasswordDialog = true"
                class="text-primary-600 dark:text-primary-400 hover:underline"
              >
                修改
              </button>
            </div>
          </div>
        </section>

        <!-- 账号绑定 -->
        <section class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">账号绑定</h2>
          <div class="space-y-4">
            <!-- 微信 -->
            <div class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.024-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-gray-700 dark:text-gray-300">微信</p>
                  <p class="text-sm text-gray-500">{{ userInfo.wechat ? '已绑定' : '未绑定' }}</p>
                </div>
              </div>
              <button
                @click="bindWechat"
                :class="userInfo.wechat ? 'text-gray-400' : 'text-primary-600 dark:text-primary-400'"
                class="hover:underline"
              >
                {{ userInfo.wechat ? '已绑定' : '绑定' }}
              </button>
            </div>
            <!-- QQ -->
            <div class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.6c1.324 0 2.4 1.076 2.4 2.4s-1.076 2.4-2.4 2.4S9.6 7.324 9.6 6 10.676 3.6 12 3.6zm4.8 9.6c0 2.652-2.652 4.8-4.8 4.8s-4.8-2.148-4.8-4.8c0-1.176.432-2.256 1.152-3.096L7.2 12l1.608-1.608c.768.6 1.656.936 2.592.936 1.632 0 3.168-.936 3.912-2.4h2.688c-.6 2.172-2.52 3.672-4.8 3.672z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-gray-700 dark:text-gray-300">QQ</p>
                  <p class="text-sm text-gray-500">{{ userInfo.qq ? '已绑定' : '未绑定' }}</p>
                </div>
              </div>
              <button
                @click="showQQDialog = true"
                :class="userInfo.qq ? 'text-gray-400' : 'text-primary-600 dark:text-primary-400'"
                class="hover:underline"
              >
                {{ userInfo.qq ? '已绑定' : '绑定' }}
              </button>
            </div>
            <!-- 支付宝 -->
            <div class="flex items-center justify-between py-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.422 20.751c-.461-.406-2.222-.857-4.402-.857-3.272 0-5.953 1.697-8.106 4.355-1.856 2.296-2.854 4.635-2.854 6.464 0 .456.037.855.11 1.193.073.337.18.6.32.788.14.187.31.302.511.349.2.046.467.037.8-.028.333-.065.714-.187 1.143-.365.429-.178.929-.445 1.5-.801.571-.356 1.214-.788 1.93-1.296.716-.508 1.513-1.088 2.392-1.738.879-.65 1.87-1.367 2.973-2.152 1.103-.785 2.29-1.632 3.56-2.543 1.27-.91 2.55-1.885 3.84-2.925l-1.68-1.107c-1.314 1.044-2.65 2.02-4.007 2.928-1.358.908-2.73 1.783-4.116 2.625-1.386.842-2.77 1.71-4.152 2.604-.69.447-1.38.908-2.07 1.382-.69.474-1.365.935-2.027 1.383-.331.224-.662.433-.993.628-.33.195-.644.352-.943.472-.299.12-.564.187-.796.202-.232.015-.42-.009-.564-.075-.144-.065-.248-.163-.312-.295a.86.86 0 01-.104-.415c-.018-.143-.009-.306.028-.49.037-.184.103-.404.197-.66.094-.257.219-.546.375-.868.156-.322.35-.673.583-1.053.233-.38.514-.787.844-1.222.33-.434.714-.907 1.152-1.418.877-1.022 1.92-2.16 3.13-3.413 1.21-1.254 2.566-2.548 4.07-3.883 1.503-1.336 3.115-2.66 4.835-3.972 1.72-1.313 3.53-2.56 5.43-3.743l-1.416-1.654c-1.833 1.134-3.617 2.335-5.35 3.603-1.734 1.268-3.4 2.493-5.002 3.675-1.601 1.183-3.142 2.4-4.622 3.65-1.48 1.25-2.862 2.533-4.145 3.85a46.494 46.494 0 01-3.37 3.835c-.947.938-1.856 1.704-2.726 2.3-.87.595-1.688.93-2.455 1.005-.767.075-1.45-.122-2.048-.594-.598-.471-.932-1.166-1.002-2.084-.07-.918.177-1.945.743-3.08.566-1.134 1.45-2.404 2.652-3.81 1.202-1.406 2.706-3.01 4.514-4.812 1.807-1.801 3.91-3.777 6.307-5.926l-1.498-1.63c-2.475 2.213-4.674 4.274-6.597 6.18-1.924 1.907-3.572 3.656-4.945 5.247-1.372 1.592-2.457 2.993-3.254 4.203-.797 1.21-1.212 2.167-1.244 2.872-.031.705.117 1.22.445 1.546.328.326.803.462 1.425.408.622-.054 1.413-.315 2.373-.783.96-.468 2.11-1.123 3.45-1.964 1.34-.84 2.883-1.802 4.63-2.884 1.746-1.082 3.73-2.254 5.95-3.514 2.22-1.26 4.61-2.508 7.17-3.743l1.654 1.538z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-gray-700 dark:text-gray-300">支付宝</p>
                  <p class="text-sm text-gray-500">{{ userInfo.alipay ? '已绑定' : '未绑定' }}</p>
                </div>
              </div>
              <button
                @click="showAlipayDialog = true"
                :class="userInfo.alipay ? 'text-gray-400' : 'text-primary-600 dark:text-primary-400'"
                class="hover:underline"
              >
                {{ userInfo.alipay ? '已绑定' : '绑定' }}
              </button>
            </div>
          </div>
        </section>

        <!-- 数据管理 -->
        <section class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">数据管理</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div>
                <p class="text-gray-700 dark:text-gray-300">数据导出</p>
                <p class="text-sm text-gray-500">导出所有任务和设置到本地</p>
              </div>
              <button
                @click="handleExport"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                导出
              </button>
            </div>
            <div class="flex items-center justify-between py-3">
              <div>
                <p class="text-gray-700 dark:text-gray-300">数据导入</p>
                <p class="text-sm text-gray-500">从本地文件导入数据</p>
              </div>
              <label class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                <input type="file" accept=".json" @change="handleImport" class="hidden" />
                导入
              </label>
            </div>
          </div>
        </section>

        <!-- VIP 会员 -->
        <section class="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-sm p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold">VIP 会员</h2>
              <p class="text-sm opacity-90">开通会员享受更多特权</p>
            </div>
            <button
              @click="showVipDialog = true"
              class="px-4 py-2 bg-white text-orange-500 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
            >
              立即开通
            </button>
          </div>
        </section>

        <!-- 注销账号 -->
        <section class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-red-200 dark:border-red-900 p-6">
          <h2 class="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">危险操作</h2>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-700 dark:text-gray-300">注销账号</p>
              <p class="text-sm text-gray-500">删除所有数据且无法恢复</p>
            </div>
            <button
              @click="handleDeleteAccount"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              注销
            </button>
          </div>
        </section>

        <!-- 退出登录 -->
        <button
          @click="handleLogout"
          class="w-full py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          退出登录
        </button>
      </div>
    </main>

    <!-- 昵称修改弹窗 -->
    <div v-if="showNicknameDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">修改昵称</h3>
        <input
          v-model="nicknameInput"
          type="text"
          maxlength="20"
          placeholder="请输入新昵称"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <div class="flex gap-3 mt-4">
          <button
            @click="showNicknameDialog = false"
            class="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
          >
            取消
          </button>
          <button
            @click="saveNickname"
            class="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 生日修改弹窗 -->
    <div v-if="showBirthdayDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">设置生日</h3>
        <input
          v-model="birthdayInput"
          type="date"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <div class="flex gap-3 mt-4">
          <button
            @click="showBirthdayDialog = false"
            class="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
          >
            取消
          </button>
          <button
            @click="saveBirthday"
            class="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 性别修改弹窗 -->
    <div v-if="showGenderDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">设置性别</h3>
        <div class="space-y-3">
          <label class="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
            <input type="radio" v-model="genderInput" value="male" class="w-5 h-5 text-primary-600" />
            <span class="text-gray-700 dark:text-gray-300">男</span>
          </label>
          <label class="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
            <input type="radio" v-model="genderInput" value="female" class="w-5 h-5 text-primary-600" />
            <span class="text-gray-700 dark:text-gray-300">女</span>
          </label>
          <label class="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
            <input type="radio" v-model="genderInput" value="" class="w-5 h-5 text-primary-600" />
            <span class="text-gray-700 dark:text-gray-300">保密</span>
          </label>
        </div>
        <div class="flex gap-3 mt-4">
          <button
            @click="showGenderDialog = false"
            class="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
          >
            取消
          </button>
          <button
            @click="saveGender"
            class="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 密码修改弹窗 -->
    <div v-if="showPasswordDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">修改密码</h3>
        <div class="space-y-3">
          <input
            v-model="oldPassword"
            type="password"
            placeholder="当前密码"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <input
            v-model="newPassword"
            type="password"
            placeholder="新密码"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="确认新密码"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <p v-if="passwordError" class="text-red-500 text-sm mt-2">{{ passwordError }}</p>
        <div class="flex gap-3 mt-4">
          <button
            @click="showPasswordDialog = false"
            class="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
          >
            取消
          </button>
          <button
            @click="savePassword"
            class="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 头像修改弹窗 -->
    <div v-if="showAvatarDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">选择头像</h3>
        <div class="grid grid-cols-4 gap-3">
          <button
            v-for="i in 8"
            :key="i"
            @click="selectAvatar(i)"
            :class="selectedAvatar === i ? 'ring-2 ring-primary-500' : ''"
            class="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ i }}</span>
          </button>
        </div>
        <div class="flex gap-3 mt-4">
          <button
            @click="showAvatarDialog = false"
            class="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
          >
            取消
          </button>
          <button
            @click="saveAvatar"
            class="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- QQ绑定弹窗 -->
    <div v-if="showQQDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">绑定QQ</h3>
        <input
          v-model="qqInput"
          type="text"
          placeholder="请输入QQ号"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <div class="flex gap-3 mt-4">
          <button
            @click="showQQDialog = false"
            class="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
          >
            取消
          </button>
          <button
            @click="saveQQ"
            class="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            绑定
          </button>
        </div>
      </div>
    </div>

    <!-- 支付宝绑定弹窗 -->
    <div v-if="showAlipayDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">绑定支付宝</h3>
        <input
          v-model="alipayInput"
          type="text"
          placeholder="请输入支付宝账号"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <div class="flex gap-3 mt-4">
          <button
            @click="showAlipayDialog = false"
            class="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
          >
            取消
          </button>
          <button
            @click="saveAlipay"
            class="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            绑定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { taskStore, setUser } from '@/stores/taskStore'
import { logout, getCurrentUser } from '@/utils/cloudSync'
import { downloadData, readDataFromFile, saveAppData } from '@/utils/storage'
import { callFunction } from '@/utils/cloudSync'

const router = useRouter()

const userStore = taskStore

// 用户扩展信息
const userInfo = reactive({
  nickname: '',
  birthday: '',
  gender: '',
  avatar: 1,
  wechat: '',
  qq: '',
  alipay: '',
})

// 性别显示文本
const genderText = computed(() => {
  const map: Record<string, string> = {
    male: '男',
    female: '女',
  }
  return map[userInfo.gender] || '未设置'
})

// 弹窗状态
const showNicknameDialog = ref(false)
const showBirthdayDialog = ref(false)
const showGenderDialog = ref(false)
const showPasswordDialog = ref(false)
const showAvatarDialog = ref(false)
const showQQDialog = ref(false)
const showAlipayDialog = ref(false)
const showVipDialog = ref(false)

// 输入值
const nicknameInput = ref('')
const birthdayInput = ref('')
const genderInput = ref('')
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordError = ref('')
const selectedAvatar = ref(1)
const qqInput = ref('')
const alipayInput = ref('')

// 加载用户信息
onMounted(async () => {
  await loadUserInfo()
})

async function loadUserInfo() {
  try {
    const res = await callFunction('user', { action: 'getUserInfo' })
    if (res.success && res.data) {
      userInfo.nickname = res.data.nickname || ''
      userInfo.birthday = res.data.birthday || ''
      userInfo.gender = res.data.gender || ''
      userInfo.avatar = res.data.avatar || 1
      userInfo.wechat = res.data.wechat || ''
      userInfo.qq = res.data.qq || ''
      userInfo.alipay = res.data.alipay || ''
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

// 保存昵称
async function saveNickname() {
  try {
    const res = await callFunction('user', {
      action: 'updateUserInfo',
      data: { nickname: nicknameInput.value },
    })
    if (res.success) {
      userInfo.nickname = nicknameInput.value
      showNicknameDialog.value = false
    }
  } catch (error) {
    console.error('保存昵称失败:', error)
  }
}

// 保存生日
async function saveBirthday() {
  try {
    const res = await callFunction('user', {
      action: 'updateUserInfo',
      data: { birthday: birthdayInput.value },
    })
    if (res.success) {
      userInfo.birthday = birthdayInput.value
      showBirthdayDialog.value = false
    }
  } catch (error) {
    console.error('保存生日失败:', error)
  }
}

// 保存性别
async function saveGender() {
  try {
    const res = await callFunction('user', {
      action: 'updateUserInfo',
      data: { gender: genderInput.value },
    })
    if (res.success) {
      userInfo.gender = genderInput.value
      showGenderDialog.value = false
    }
  } catch (error) {
    console.error('保存性别失败:', error)
  }
}

// 保存密码
async function savePassword() {
  passwordError.value = ''
  if (!oldPassword.value) {
    passwordError.value = '请输入当前密码'
    return
  }
  if (!newPassword.value || newPassword.value.length < 6) {
    passwordError.value = '新密码至少6位'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = '两次密码不一致'
    return
  }

  try {
    const res = await callFunction('user', {
      action: 'changePassword',
      data: { oldPassword: oldPassword.value, newPassword: newPassword.value },
    })
    if (res.success) {
      alert('密码修改成功')
      showPasswordDialog.value = false
      oldPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
    } else {
      passwordError.value = res.message
    }
  } catch (error) {
    passwordError.value = (error as Error).message
  }
}

// 选择头像
function selectAvatar(index: number) {
  selectedAvatar.value = index
}

// 保存头像
async function saveAvatar() {
  try {
    const res = await callFunction('user', {
      action: 'updateUserInfo',
      data: { avatar: selectedAvatar.value },
    })
    if (res.success) {
      userInfo.avatar = selectedAvatar.value
      showAvatarDialog.value = false
    }
  } catch (error) {
    console.error('保存头像失败:', error)
  }
}

// 保存QQ
async function saveQQ() {
  if (!qqInput.value) return
  try {
    const res = await callFunction('user', {
      action: 'updateUserInfo',
      data: { qq: qqInput.value },
    })
    if (res.success) {
      userInfo.qq = qqInput.value
      showQQDialog.value = false
      qqInput.value = ''
    }
  } catch (error) {
    console.error('绑定QQ失败:', error)
  }
}

// 保存支付宝
async function saveAlipay() {
  if (!alipayInput.value) return
  try {
    const res = await callFunction('user', {
      action: 'updateUserInfo',
      data: { alipay: alipayInput.value },
    })
    if (res.success) {
      userInfo.alipay = alipayInput.value
      showAlipayDialog.value = false
      alipayInput.value = ''
    }
  } catch (error) {
    console.error('绑定支付宝失败:', error)
  }
}

// 绑定微信（扫码）
async function bindWechat() {
  alert('微信绑定功能开发中，敬请期待')
}

// 退出登录
async function handleLogout() {
  if (confirm('确定要退出登录吗？')) {
    await logout()
    setUser(null)
    router.replace('/login')
  }
}

// 注销账号
async function handleDeleteAccount() {
  if (!confirm('确定要注销账号吗？此操作不可恢复！')) return
  if (!confirm('注销后所有数据将被永久删除，确定继续？')) return

  try {
    const res = await callFunction('user', { action: 'deleteAccount' })
    if (res.success) {
      await logout()
      setUser(null)
      // 清除本地数据
      localStorage.clear()
      alert('账号已注销')
      router.replace('/login')
    } else {
      alert(res.message || '注销失败')
    }
  } catch (error) {
    alert((error as Error).message)
  }
}

// 导出数据
function handleExport() {
  downloadData({
    version: '1.0.0',
    tasks: taskStore.tasks,
    settings: taskStore.settings,
  })
}

// 导入数据
async function handleImport(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    const data = await readDataFromFile(file)
    if (confirm('导入数据将覆盖当前所有数据，确定要继续吗？')) {
      saveAppData(data)
      window.location.reload()
    }
  } catch (error) {
    alert('导入失败：' + (error as Error).message)
  }
}
</script>