<template>
  <span :class="categoryColor" class="px-2 py-1 rounded text-xs font-medium">
    {{ category }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getCategoryColor } from '@/utils/category'
import { taskStore } from '@/stores/taskStore'

interface Props {
  category: string
}

const props = defineProps<Props>()

const categoryColor = computed(() => getCategoryColor(props.category, taskStore.settings.categoryColors))
</script>
