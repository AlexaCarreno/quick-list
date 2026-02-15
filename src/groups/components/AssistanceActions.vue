<template>
  <div class="flex flex-col sm:flex-row gap-3 mt-6">
    <button
      class="border border-blue-400 px-4 py-2 rounded hover:bg-blue-900 transition"
      @click="showCamera = true"
    >
      🕒 real time assistance
    </button>
    <button
      class="border border-blue-400 px-4 py-2 rounded hover:bg-blue-900 transition"
    >
      📷 Image-based assistance
    </button>
  </div>

  <CamRecognition
    v-if="showCamera"
    :groupId="groupId"
    @close="showCamera = false"
    @result="handleAssistanceResult"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import CamRecognition from "./CamRecognition.vue";
import { useAttendanceStore } from "../stores/attendance";
const showCamera = ref(false);
const { groupId } = defineProps<{ groupId: string }>(); // puedes reemplazarlo por una prop o estado dinámico

const attendanceStore = useAttendanceStore();

const handleAssistanceResult = (data: {
  groupId: string;
  assistance: { studentId: string; present: boolean }[];
}) => {
  attendanceStore.addRecord(data);
};
</script>
