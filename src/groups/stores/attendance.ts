// stores/attendance.ts
import { defineStore } from "pinia";
import { ref } from "vue";

interface AssistanceEntry {
  studentId: string;
  present: boolean;
}

interface AssistanceRecord {
  groupId: string;
  assistance: AssistanceEntry[];
}

export const useAttendanceStore = defineStore(
  "attendance",
  () => {
    const records = ref<AssistanceRecord[]>([]);

    const addRecord = (newRecord: AssistanceRecord) => {
      const existingIndex = records.value.findIndex(
        (r) => r.groupId === newRecord.groupId
      );

      if (existingIndex !== -1) {
        // reemplaza si ya existe
        records.value[existingIndex] = newRecord;
      } else {
        records.value.push(newRecord);
      }
    };

    return {
      records,
      addRecord,
    };
  },
  { persist: true }
);
