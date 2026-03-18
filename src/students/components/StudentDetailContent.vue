<template>
  <div class="px-5 py-4" v-if="student">
    <!-- Header -->
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-base font-semibold text-white">Detalle del estudiante</h2>
      <button
        class="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-700"
        @click="$emit('close')"
      >
        ✕
      </button>
    </div>

    <!-- Hero -->
    <div class="flex items-center gap-4 mb-5 pb-5 border-b border-slate-700/50">
      <img
        class="w-20 h-20 rounded-full object-cover ring-2 ring-slate-600 shadow-lg flex-shrink-0"
        :src="studentAvatar(student)"
      />
      <div>
        <p class="text-white text-base font-semibold leading-tight">
          {{ student.name }} {{ student.lastName }}
        </p>
        <p class="text-slate-400 text-xs mt-0.5">{{ student.career }}</p>
        <span
          class="inline-flex items-center gap-1.5 mt-2 text-xs px-2 py-0.5 rounded-full"
          :class="
            student.state
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400'
          "
        >
          <span
            class="size-1.5 rounded-full"
            :class="student.state ? 'bg-emerald-400' : 'bg-red-400'"
          />
          {{ student.state ? "Activo" : "Inactivo" }}
        </span>
      </div>
    </div>

    <div class="space-y-4">
      <!-- Contacto -->
      <div>
        <p
          class="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2"
        >
          Contacto
        </p>
        <div class="bg-slate-800/50 rounded-xl divide-y divide-slate-700/50">
          <div class="flex items-center gap-3 px-3 py-2.5">
            <span class="text-sm flex-shrink-0">✉️</span>
            <div class="min-w-0 flex-1">
              <p class="text-xs text-slate-500">Correo</p>
              <p class="text-sm text-slate-200 truncate">
                {{ student.email || "—" }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3 px-3 py-2.5">
            <span class="text-sm flex-shrink-0">📱</span>
            <div class="min-w-0 flex-1">
              <p class="text-xs text-slate-500">Teléfono</p>
              <p class="text-sm text-slate-200">{{ student.phone || "—" }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 px-3 py-2.5">
            <span class="text-sm flex-shrink-0">📍</span>
            <div class="min-w-0 flex-1">
              <p class="text-xs text-slate-500">Dirección</p>
              <p class="text-sm text-slate-200">
                {{ student.residentialAddress || "—" }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Personal + Sistema -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2"
          >
            Personal
          </p>
          <div class="bg-slate-800/50 rounded-xl divide-y divide-slate-700/50">
            <div class="flex items-center gap-2 px-3 py-2.5">
              <span class="text-sm flex-shrink-0">🪪</span>
              <div class="min-w-0 flex-1">
                <p class="text-xs text-slate-500">Documento</p>
                <p class="text-sm text-slate-200 truncate">
                  {{ student.documentNumber || "—" }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 px-3 py-2.5">
              <span class="text-sm flex-shrink-0">🎂</span>
              <div class="min-w-0 flex-1">
                <p class="text-xs text-slate-500">Edad</p>
                <p class="text-sm text-slate-200">
                  {{ calculateAge(student.birthday) }} años
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 px-3 py-2.5">
              <span class="text-sm flex-shrink-0">📆</span>
              <div class="min-w-0 flex-1">
                <p class="text-xs text-slate-500">Nacimiento</p>
                <p class="text-sm text-slate-200">
                  {{ formatDate(student.birthday) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p
            class="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2"
          >
            Sistema
          </p>
          <div class="bg-slate-800/50 rounded-xl divide-y divide-slate-700/50">
            <div class="flex items-center gap-2 px-3 py-2.5">
              <span class="text-sm flex-shrink-0">📅</span>
              <div class="min-w-0 flex-1">
                <p class="text-xs text-slate-500">Registro</p>
                <p class="text-sm text-slate-200">
                  {{ formatDate(student.createdAt) }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 px-3 py-2.5">
              <span class="text-sm flex-shrink-0">🧠</span>
              <div class="min-w-0 flex-1">
                <p class="text-xs text-slate-500">Facial</p>
                <p
                  class="text-sm"
                  :class="
                    localHasFaceProfile ? 'text-emerald-400' : 'text-amber-400'
                  "
                >
                  {{ localHasFaceProfile ? "Registrado" : "Pendiente" }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reconocimiento facial -->
      <div>
        <p
          class="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2"
        >
          Reconocimiento facial
        </p>
        <div
          class="bg-slate-800/50 rounded-xl p-4 border"
          :class="
            localHasFaceProfile
              ? 'border-emerald-500/20'
              : 'border-amber-500/20'
          "
        >
          <!-- Estado y progreso -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="text-lg">🧠</span>
              <div>
                <p class="text-sm text-white font-medium">
                  {{
                    localHasFaceProfile
                      ? "Rostro registrado"
                      : "Sin registro facial"
                  }}
                </p>
                <p class="text-xs text-slate-400">
                  {{ embeddingsCount }} de {{ maxEmbeddings }} fotos registradas
                </p>
              </div>
            </div>
            <!-- Indicador de progreso -->
            <div class="flex gap-1">
              <div
                v-for="i in maxEmbeddings"
                :key="i"
                class="size-2.5 rounded-full"
                :class="
                  i <= embeddingsCount ? 'bg-emerald-400' : 'bg-slate-600'
                "
              />
            </div>
          </div>

          <!-- Barra de progreso -->
          <div class="w-full bg-slate-700 rounded-full h-1.5 mb-3">
            <div
              class="h-1.5 rounded-full transition-all duration-300"
              :class="
                embeddingsCount === maxEmbeddings
                  ? 'bg-emerald-400'
                  : 'bg-amber-400'
              "
              :style="{ width: `${(embeddingsCount / maxEmbeddings) * 100}%` }"
            />
          </div>

          <!-- Botones -->
          <div class="flex gap-2">
            <button
              v-if="embeddingsCount < maxEmbeddings"
              class="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white transition flex items-center justify-center gap-2"
              :class="
                localHasFaceProfile
                  ? 'bg-blue-600 hover:bg-blue-500'
                  : 'bg-amber-600 hover:bg-amber-500'
              "
              @click="faceModalOpen = true"
            >
              📷 {{ localHasFaceProfile ? "Agregar foto" : "Registrar rostro" }}
            </button>
            <button
              v-if="localHasFaceProfile"
              class="px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 text-sm transition"
              @click="handleDeleteFaceProfile"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <!-- Académico -->
      <div>
        <p
          class="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2"
        >
          Académico
        </p>
        <div class="bg-slate-800/50 rounded-xl divide-y divide-slate-700/50">
          <div class="flex items-center gap-3 px-3 py-2.5">
            <span class="text-sm flex-shrink-0">🎓</span>
            <div class="min-w-0 flex-1">
              <p class="text-xs text-slate-500">Carrera</p>
              <p class="text-sm text-slate-200">{{ student.career || "—" }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 px-3 py-2.5">
            <span class="text-sm flex-shrink-0">📚</span>
            <div class="min-w-0 flex-1">
              <p class="text-xs text-slate-500">Semestre</p>
              <p class="text-sm text-slate-200">
                Semestre {{ student.semester }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal registrar rostro -->
  <MyModal v-model:open="faceModalOpen" size="md" :closable="true">
    <div class="text-white">
      <h2 class="text-lg font-semibold mb-1">
        {{ localHasFaceProfile ? "Agregar foto facial" : "Registrar rostro" }}
      </h2>
      <p class="text-xs text-slate-400 mb-4">
        Sube una foto clara del estudiante. El rostro debe ser visible y bien
        iluminado. ({{ embeddingsCount }}/{{ maxEmbeddings }} fotos registradas)
      </p>

      <div class="flex flex-col items-center gap-3 mb-4">
        <div
          class="size-32 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden cursor-pointer hover:border-amber-500 transition"
          @click="triggerFileInput"
        >
          <img
            v-if="photoPreview"
            :src="photoPreview"
            class="w-full h-full object-cover"
          />
          <span v-else class="text-4xl">🧠</span>
        </div>
        <button
          type="button"
          class="text-amber-400 hover:text-amber-300 text-xs underline"
          @click="triggerFileInput"
        >
          {{ photoPreview ? "Cambiar foto" : "Seleccionar foto" }}
        </button>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onFileChange"
        />
      </div>

      <p
        v-if="submitError"
        class="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-3"
      >
        {{ submitError }}
      </p>

      <div class="flex gap-3">
        <button
          class="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm transition"
          @click="faceModalOpen = false"
        >
          Cancelar
        </button>
        <button
          class="flex-1 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-sm font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
          :disabled="!photoFile || registering"
          @click="handleRegisterFace"
        >
          <span
            v-if="registering"
            class="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
          />
          {{ registering ? "Registrando..." : "Registrar" }}
        </button>
      </div>
    </div>
  </MyModal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { getAvatarUrl } from "../../common/utils/avatar";
import type { Student } from "../student.interfaces";
import MyModal from "../../common/components/modals/MyModal.vue";
import {
  deleteStudentFaceProfile,
  getStudentFaceStatus,
  registerStudentFace,
} from "../studentApi";

const props = defineProps<{ student: Student | null }>();
const emit = defineEmits(["close", "face-registered"]);

const faceModalOpen = ref(false);
const photoFile = ref<File | null>(null);
const photoPreview = ref<string | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const registering = ref(false);
const submitError = ref("");

// Estado facial
const localHasFaceProfile = ref(props.student?.hasFaceProfile ?? false);
const embeddingsCount = ref(0);
const maxEmbeddings = ref(3);
const loadingFaceStatus = ref(false);

const loadFaceStatus = async () => {
  if (!props.student) return;
  loadingFaceStatus.value = true;
  try {
    const res = await getStudentFaceStatus(props.student._id);
    if (res.success) {
      embeddingsCount.value = res.data.embeddings_count;
      maxEmbeddings.value = res.data.max_embeddings;
      localHasFaceProfile.value = res.data.has_face_profile;
    }
  } finally {
    loadingFaceStatus.value = false;
  }
};

watch(
  () => props.student,
  (s) => {
    if (s) {
      localHasFaceProfile.value = s.hasFaceProfile ?? false;
      loadFaceStatus();
    }
  },
  { immediate: true },
);

const triggerFileInput = () => fileInputRef.value?.click();

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  photoFile.value = file;
  photoPreview.value = URL.createObjectURL(file);
};

const handleRegisterFace = async () => {
  if (!photoFile.value || !props.student) return;
  submitError.value = "";
  registering.value = true;

  try {
    const formData = new FormData();
    formData.append("photo", photoFile.value);

    const res = await registerStudentFace(props.student._id, formData);

    if (!res.success) {
      submitError.value =
        res.error?.message || "No se pudo registrar el rostro.";
      return;
    }

    embeddingsCount.value = res.data.embeddings_count;
    localHasFaceProfile.value = true;
    faceModalOpen.value = false;
    photoFile.value = null;
    photoPreview.value = null;
    emit("face-registered");
  } catch (err: any) {
    submitError.value = err?.message ?? "Error al registrar el rostro.";
  } finally {
    registering.value = false;
  }
};

const handleDeleteFaceProfile = async () => {
  if (!props.student) return;
  const res = await deleteStudentFaceProfile(props.student._id);
  if (res.success) {
    embeddingsCount.value = 0;
    localHasFaceProfile.value = false;
    emit("face-registered");
  }
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const calculateAge = (birthday: string): number => {
  const today = new Date();
  const birth = new Date(birthday);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const studentAvatar = (student: Student) =>
  getAvatarUrl(student.photo, student.name, student.lastName);
</script>
