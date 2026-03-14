<!-- src/groups/components/GroupForm.vue -->
<template>
  <div class="text-white">
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-white">Nuevo grupo</h2>
      <p class="text-sm text-slate-400 mt-0.5">
        Los campos marcados con * son obligatorios
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-5" novalidate>
      <!-- Código + Materia -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Código de referencia"
          required
          :error="errors.referenceCode"
        >
          <input
            v-model="form.referenceCode"
            type="text"
            placeholder="Ej: E-195"
            :class="inputClass(errors.referenceCode)"
            @blur="validateField('referenceCode')"
          />
        </FormField>
        <FormField label="Asignatura" required :error="errors.subject">
          <input
            v-model="form.subject"
            type="text"
            placeholder="Ej: Cálculo Multivariable"
            :class="inputClass(errors.subject)"
            @blur="validateField('subject')"
          />
        </FormField>
      </div>

      <!-- Periodo + Color -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Periodo" required :error="errors.period">
          <input
            v-model="form.period"
            type="text"
            placeholder="Ej: 2026-1"
            :class="inputClass(errors.period)"
            @blur="validateField('period')"
          />
        </FormField>
        <FormField label="Color" required :error="errors.color">
          <div class="flex items-center gap-3">
            <input
              v-model="form.color"
              type="color"
              class="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
            />
            <input
              v-model="form.color"
              type="text"
              placeholder="#F54927"
              :class="inputClass(errors.color)"
              @blur="validateField('color')"
            />
          </div>
        </FormField>
      </div>

      <!-- Fecha inicio + Fecha fin -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Fecha de inicio" required :error="errors.startDate">
          <input
            v-model="form.startDate"
            type="date"
            :class="inputClass(errors.startDate)"
            @blur="validateField('startDate')"
          />
        </FormField>
        <FormField label="Fecha de fin" required :error="errors.endDate">
          <input
            v-model="form.endDate"
            type="date"
            :class="inputClass(errors.endDate)"
            @blur="validateField('endDate')"
          />
        </FormField>
      </div>

      <!-- Umbral mínimo -->
      <FormField label="Umbral mínimo de asistencia">
        <div class="flex items-center gap-3">
          <input
            v-model="form.minAttendanceThreshold"
            type="range"
            min="0"
            max="1"
            step="0.05"
            class="flex-1 accent-blue-500"
          />
          <span class="text-sm text-slate-300 w-12 text-right">
            {{ Math.round(form.minAttendanceThreshold * 100) }}%
          </span>
        </div>
      </FormField>

      <!-- Docente -->
      <FormField label="Docente">
        <div class="relative">
          <input
            v-model="teacherSearch"
            type="text"
            placeholder="Buscar docente por nombre..."
            :class="inputClass()"
            @input="onTeacherSearch"
            @blur="onTeacherBlur"
          />
          <!-- Dropdown resultados -->
          <div
            v-if="teacherResults.length > 0"
            class="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            <button
              v-for="teacher in teacherResults"
              :key="teacher._id"
              type="button"
              class="w-full px-3 py-2 text-left text-sm hover:bg-slate-700 transition"
              @mousedown.prevent="selectTeacher(teacher)"
            >
              <span class="text-white"
                >{{ teacher.name }} {{ teacher.lastName }}</span
              >
              <span class="text-slate-400 text-xs ml-2">{{
                teacher.email
              }}</span>
            </button>
          </div>
        </div>
        <!-- Teacher seleccionado -->
        <div
          v-if="selectedTeacher"
          class="mt-2 flex items-center justify-between bg-slate-800/50 rounded-lg px-3 py-2"
        >
          <span class="text-sm text-slate-200">
            {{ selectedTeacher.name }} {{ selectedTeacher.lastName }}
          </span>
          <button
            type="button"
            class="text-slate-400 hover:text-red-400 text-xs"
            @click="clearTeacher"
          >
            ✕
          </button>
        </div>
      </FormField>

      <!-- Horarios -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-medium text-slate-300">Horarios</label>
          <button
            type="button"
            class="text-xs text-blue-400 hover:text-blue-300"
            @click="addSchedule"
          >
            + Agregar horario
          </button>
        </div>

        <div class="space-y-2">
          <div
            v-for="(schedule, index) in form.schedules"
            :key="index"
            class="grid grid-cols-4 gap-2 bg-slate-800/50 rounded-lg p-3 relative"
          >
            <!-- Día -->
            <select v-model="schedule.dayOfWeek" :class="inputClass()">
              <option value="">Día</option>
              <option value="monday">Lunes</option>
              <option value="tuesday">Martes</option>
              <option value="wednesday">Miércoles</option>
              <option value="thursday">Jueves</option>
              <option value="friday">Viernes</option>
              <option value="saturday">Sábado</option>
            </select>

            <!-- Hora inicio -->
            <input
              v-model="schedule.startTime"
              type="text"
              placeholder="6:00"
              :class="inputClass()"
            />

            <!-- Hora fin -->
            <input
              v-model="schedule.endTime"
              type="text"
              placeholder="7:30"
              :class="inputClass()"
            />

            <!-- Jornada -->
            <div class="flex items-center gap-2">
              <select v-model="schedule.shift" :class="inputClass()">
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
              <button
                type="button"
                class="text-red-400 hover:text-red-300 text-sm flex-shrink-0"
                @click="removeSchedule(index)"
              >
                ✕
              </button>
            </div>
          </div>

          <p
            v-if="form.schedules.length === 0"
            class="text-xs text-slate-500 text-center py-3"
          >
            Sin horarios. Haz clic en "+ Agregar horario"
          </p>
        </div>
      </div>

      <!-- Error general -->
      <p
        v-if="submitError"
        class="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
      >
        {{ submitError }}
      </p>

      <!-- Acciones -->
      <div class="flex flex-col-reverse sm:flex-row gap-3 pt-1">
        <button
          type="button"
          class="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm transition"
          :disabled="loading"
          @click="$emit('cancel')"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
          />
          {{ loading ? "Guardando..." : "Crear grupo" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import FormField from "../../common/components/inputs/FormField.vue";
import { getTeachers } from "../../users/api/teachersApi";
import type { CreateGroupPayload } from "../api/groupsApi";
import type { DayOfWeek, Shift } from "../interfaces/groups.interfaces";

const props = defineProps<{
  onSubmit: (payload: CreateGroupPayload) => Promise<any>;
}>();

const emit = defineEmits<{
  (e: "success"): void;
  (e: "cancel"): void;
}>();

const form = reactive({
  referenceCode: "",
  subject: "",
  period: "",
  color: "#3B82F6",
  startDate: "",
  endDate: "",
  minAttendanceThreshold: 0.8,
  schedules: [] as {
    dayOfWeek: DayOfWeek | "";
    startTime: string;
    endTime: string;
    shift: Shift;
  }[],
});

const loading = ref(false);
const submitError = ref("");

// Docente
const teacherSearch = ref("");
const teacherResults = ref<
  { _id: string; name: string; lastName: string; email: string }[]
>([]);
const selectedTeacher = ref<{
  _id: string;
  name: string;
  lastName: string;
  email: string;
} | null>(null);

let searchTimeout: ReturnType<typeof setTimeout>;
const onTeacherSearch = () => {
  clearTimeout(searchTimeout);
  if (!teacherSearch.value.trim()) {
    teacherResults.value = [];
    return;
  }
  searchTimeout = setTimeout(async () => {
    const res = await getTeachers({
      nameContains: teacherSearch.value,
      limit: 5,
    });
    if (res.success) {
      teacherResults.value = res.data.teachers.map((t: any) => ({
        _id: t.userId,
        name: t.name,
        lastName: t.lastName,
        email: t.email,
      }));
    }
  }, 300);
};

const onTeacherBlur = () => {
  setTimeout(() => (teacherResults.value = []), 200);
};

const selectTeacher = (teacher: typeof selectedTeacher.value) => {
  selectedTeacher.value = teacher;
  teacherSearch.value = "";
  teacherResults.value = [];
};

const clearTeacher = () => {
  selectedTeacher.value = null;
  teacherSearch.value = "";
};

// Horarios
const addSchedule = () => {
  form.schedules.push({
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    shift: "AM",
  });
};

const removeSchedule = (index: number) => {
  form.schedules.splice(index, 1);
};

// Validación
const errors = reactive<Record<string, string>>({
  referenceCode: "",
  subject: "",
  period: "",
  color: "",
  startDate: "",
  endDate: "",
});

const requiredFields = [
  "referenceCode",
  "subject",
  "period",
  "color",
  "startDate",
  "endDate",
];

const validateField = (field: string) => {
  errors[field] = "";
  if (!form[field as keyof typeof form].toString().trim()) {
    errors[field] = "Este campo es obligatorio";
    return false;
  }
  return true;
};

const validateAll = () => {
  let valid = true;
  for (const field of requiredFields) {
    if (!validateField(field)) valid = false;
  }
  return valid;
};

// Submit
const handleSubmit = async () => {
  submitError.value = "";
  if (!validateAll()) return;

  const payload: CreateGroupPayload = {
    referenceCode: form.referenceCode.trim(),
    subject: form.subject.trim(),
    period: form.period.trim(),
    color: form.color,
    startDate: form.startDate,
    endDate: form.endDate,
    minAttendanceThreshold: form.minAttendanceThreshold,
    schedules: form.schedules
      .filter((s) => s.dayOfWeek)
      .map((s) => ({
        dayOfWeek: s.dayOfWeek as DayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        shift: s.shift,
      })),
  };

  if (selectedTeacher.value) {
    payload.teacherId = selectedTeacher.value._id;
  }

  try {
    loading.value = true;
    await props.onSubmit(payload);
    emit("success");
  } catch (err: any) {
    submitError.value = err?.message ?? "Ocurrió un error al crear el grupo";
  } finally {
    loading.value = false;
  }
};

const inputClass = (error?: string) =>
  [
    "w-full bg-slate-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 transition",
    error
      ? "border-red-500 focus:ring-red-500"
      : "border-slate-700 focus:ring-blue-500",
  ].join(" ");
</script>
