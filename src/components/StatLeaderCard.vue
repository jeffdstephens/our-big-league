<script setup>
defineProps({
  label: { type: String, required: true },
  leaders: { type: Array, default: () => [] },
  valueClass: { type: String, default: 'text-gray-600' },
  getLogoUrl: { type: Function, required: true }
})
</script>

<template>
  <div v-if="leaders.length" class="bg-white rounded-lg shadow-md p-4 border border-gray-200">
    <div class="text-sm text-gray-500 mb-2">
      {{ label }}<span v-if="leaders.length > 1" class="text-gray-400"> (tied)</span>
    </div>
    <div class="flex flex-col gap-2">
      <div v-for="entry in leaders" :key="entry.team.id" class="flex items-center gap-3">
        <img
          v-if="getLogoUrl(entry.team.logo)"
          :src="getLogoUrl(entry.team.logo)"
          :alt="entry.team.name"
          class="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div class="font-bold">{{ entry.team.name }}</div>
          <div :class="['text-lg font-semibold', valueClass]">{{ entry.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
