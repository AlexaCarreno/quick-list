<!-- src/groups/components/GroupInfoTab.vue -->
<template>
  <div class="flex flex-col min-h-0">
    <!-- Skeleton -->
    <div v-if="loading" class="space-y-4">
      <div
        v-for="i in 4"
        :key="i"
        class="h-10 bg-slate-700 rounded animate-pulse"
      />
    </div>

    <div v-else-if="group" class="space-y-5">
      <!-- Card info -->
      <div
        class="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 relative"
      >
        <button
          v-if="!editing"
          class="absolute top-4 right-4 text-slate-400 hover:text-white transition"
          @click="startEditing"
        >
          ✏️
        </button>

        <!-- MODO LECTURA -->
        <div v-if="!editing" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-slate-500 mb-1">Código de referencia</p>
            <p class="text-sm text-white">{{ group.referenceCode }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 mb-1">Asignatura</p>
            <p class="text-sm text-white">{{ group.subject }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 mb-1">Periodo</p>
            <p class="text-sm text-white">{{ group.period }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 mb-1">Color</p>
            <div class="flex items-center gap-2">
              <div
                class="size-5 rounded-full"
                :style="{ backgroundColor: group.color }"
              />
              <p class="text-sm text-white">{{ group.color }}</p>
            </div>
          </div>
          <div>
            <p class="text-xs text-slate-500 mb-1">Fecha inicio</p>
            <p class="text-sm text-white">{{ formatDate(group.startDate) }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 mb-1">Fecha fin</p>
            <p class="text-sm text-white">{{ formatDate(group.endDate) }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 mb-1">Umbral mínimo</p>
            <p class="text-sm text-white">
              {{ Math.round(group.minAttendanceThreshold * 100) }}%
            </p>
          </div>
          <div>
            <p class="text-xs text-slate-500 mb-1">Estado</p>
            <div class="flex items-center gap-2">
              <span
                class="size-2 rounded-full"
                :class="
                  group.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                "
              />
              <p class="text-sm text-white">
                {{ group.status === "active" ? "Activo" : "Inactivo" }}
              </p>
            </div>
          </div>
        </div>

        <!-- MODO EDICIÓN -->
        <form v-else @submit.prevent="handleSave" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Código de referencia"
              required
              :error="errors.referenceCode"
            >
              <input
                v-model="form.referenceCode"
                type="text"
                :class="inputClass(errors.referenceCode)"
                @blur="validateField('referenceCode')"
              />
            </FormField>
            <FormField label="Asignatura" required :error="errors.subject">
              <input
                v-model="form.subject"
                type="text"
                :class="inputClass(errors.subject)"
                @blur="validateField('subject')"
              />
            </FormField>
            <FormField label="Periodo" required :error="errors.period">
              <input
                v-model="form.period"
                type="text"
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
                  :class="inputClass(errors.color)"
                  @blur="validateField('color')"
                />
              </div>
            </FormField>
            <FormField label="Fecha inicio" required :error="errors.startDate">
              <input
                v-model="form.startDate"
                type="date"
                :class="inputClass(errors.startDate)"
                @blur="validateField('startDate')"
              />
            </FormField>
            <FormField label="Fecha fin" required :error="errors.endDate">
              <input
                v-model="form.endDate"
                type="date"
                :class="inputClass(errors.endDate)"
                @blur="validateField('endDate')"
              />
            </FormField>
            <FormField label="Umbral mínimo">
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
              <div
                v-if="selectedTeacher"
                class="mt-2 flex items-center justify-between bg-slate-800/50 rounded-lg px-3 py-2"
              >
                <span class="text-sm text-slate-200"
                  >{{ selectedTeacher.name }}
                  {{ selectedTeacher.lastName }}</span
                >
                <button
                  type="button"
                  class="text-slate-400 hover:text-red-400 text-xs"
                  @click="clearTeacher"
                >
                  ✕ Quitar
                </button>
              </div>
            </FormField>

            <FormField label="Estado">
              <select v-model="form.status" :class="inputClass()">
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </FormField>
          </div>

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
                class="grid grid-cols-4 gap-2 bg-slate-800/50 rounded-lg p-3"
              >
                <select v-model="schedule.dayOfWeek" :class="inputClass()">
                  <option value="">Día</option>
                  <option value="monday">Lunes</option>
                  <option value="tuesday">Martes</option>
                  <option value="wednesday">Miércoles</option>
                  <option value="thursday">Jueves</option>
                  <option value="friday">Viernes</option>
                  <option value="saturday">Sábado</option>
                </select>
                <input
                  v-model="schedule.startTime"
                  type="text"
                  placeholder="6:00"
                  :class="inputClass()"
                />
                <input
                  v-model="schedule.endTime"
                  type="text"
                  placeholder="7:30"
                  :class="inputClass()"
                />
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

          <!-- Acciones -->
          <div class="flex gap-3 pt-2">
            <button
              type="button"
              class="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm transition"
              :disabled="saving"
              @click="cancelEditing"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
              :disabled="saving"
            >
              <span
                v-if="saving"
                class="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
              />
              {{ saving ? "Guardando..." : "Guardar cambios" }}
            </button>
          </div>
        </form>
      </div>

      <!-- Docente -->
      <div class="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
        <p
          class="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3"
        >
          Docente asignado
        </p>
        <div v-if="group.teacherId" class="flex items-center gap-3">
          <div
            class="size-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold text-sm"
          >
            {{ group.teacherId.name.charAt(0)
            }}{{ group.teacherId.lastName.charAt(0) }}
          </div>
          <div>
            <p class="text-sm text-white font-medium">
              {{ group.teacherId.name }} {{ group.teacherId.lastName }}
            </p>
            <p class="text-xs text-slate-400">{{ group.teacherId.email }}</p>
          </div>
        </div>
        <p v-else class="text-sm text-slate-500">Sin docente asignado</p>
      </div>

      <!-- Horarios -->
      <div class="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
        <p
          class="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3"
        >
          Horarios
        </p>
        <div v-if="group.schedules.length > 0" class="space-y-2">
          <div
            v-for="(schedule, i) in group.schedules"
            :key="i"
            class="flex items-center gap-3 text-sm"
          >
            <span class="text-slate-400 capitalize w-24">{{
              translateDay(schedule.dayOfWeek)
            }}</span>
            <span class="text-white"
              >{{ schedule.startTime }} - {{ schedule.endTime }}</span
            >
            <span
              class="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300"
              >{{ schedule.shift }}</span
            >
          </div>
        </div>
        <p v-else class="text-sm text-slate-500">Sin horarios registrados</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import FormField from "../../common/components/inputs/FormField.vue";
import { useGroups } from "../composables/useGroups";
import type {
  Group,
  ISchedule,
  TeacherOption,
} from "../interfaces/groups.interfaces";
import { getTeachers } from "../../users/api/teachersApi";

const props = defineProps<{
  group: Group | null;
  loading?: boolean;
}>();

const emit = defineEmits<{ (e: "updated"): void }>();

const { editGroup, updating: saving } = useGroups();
const editing = ref(false);

const form = reactive({
  referenceCode: "",
  subject: "",
  period: "",
  color: "",
  startDate: "",
  endDate: "",
  minAttendanceThreshold: 0.8,
  status: "active" as "active" | "inactive",
  schedules: [] as {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    shift: string;
  }[],
});

const teacherSearch = ref("");
const teacherResults = ref<TeacherOption[]>([]);
const selectedTeacher = ref<TeacherOption | null>(null);

const loadForm = (g: Group) => {
  form.referenceCode = g.referenceCode;
  form.subject = g.subject;
  form.period = g.period;
  form.color = g.color;
  form.startDate = g.startDate.toString().split("T")[0];
  form.endDate = g.endDate.toString().split("T")[0];
  form.minAttendanceThreshold = g.minAttendanceThreshold;
  form.status = g.status;
  form.schedules = g.schedules.map((s) => ({ ...s }));
  if (g.teacherId) {
    selectedTeacher.value = {
      _id: g.teacherId._id,
      name: g.teacherId.name,
      lastName: g.teacherId.lastName,
      email: g.teacherId.email,
    };
  } else {
    selectedTeacher.value = null;
  }
};

watch(
  () => props.group,
  (g) => {
    if (g) loadForm(g);
  },
  { immediate: true },
);

const startEditing = () => {
  if (props.group) loadForm(props.group);
  editing.value = true;
};

const cancelEditing = () => {
  editing.value = false;
};

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

const handleSave = async () => {
  if (!validateAll() || !props.group) return;
  const res = await editGroup(props.group._id, {
    ...form,
    schedules: form.schedules.filter((s) => s.dayOfWeek) as ISchedule[],
    teacherId: selectedTeacher.value?._id ?? null,
  });
  if (res?.success) {
    editing.value = false;
    emit("updated");
  }
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const translateDay = (day: string) => {
  const map: Record<string, string> = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
  };
  return map[day] ?? day;
};

const inputClass = (error?: string) =>
  [
    "w-full bg-slate-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 transition",
    error
      ? "border-red-500 focus:ring-red-500"
      : "border-slate-700 focus:ring-blue-500",
  ].join(" ");

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
const selectTeacher = (teacher: TeacherOption) => {
  selectedTeacher.value = teacher;
  teacherSearch.value = "";
  teacherResults.value = [];
};
const clearTeacher = () => {
  selectedTeacher.value = null;
  teacherSearch.value = "";
};
</script>
