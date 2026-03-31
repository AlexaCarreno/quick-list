<template>
  <div class="inset-0 bg-[#0a0c14] text-white flex flex-col">
    <!-- Header -->
    <div
      class="flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur-sm flex-shrink-0 z-10"
    >
      <div class="flex items-center gap-3">
        <button
          class="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition"
          @click="handleCancel"
        >
          ← Cancelar
        </button>
        <div class="hidden sm:block">
          <p class="text-sm font-semibold text-white">
            {{ session?.startTime }} - {{ session?.endTime }}
          </p>
          <p class="text-xs text-slate-400">
            SESIÓN ACTIVA · {{ formatDate(session?.date ?? "") }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- Contador -->
        <div
          class="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1.5"
        >
          <span class="text-sm font-bold text-emerald-400">{{
            presentCount
          }}</span>
          <span class="text-slate-500 text-sm">/</span>
          <span class="text-sm text-slate-300">{{
            session?.totalExpected ?? 0
          }}</span>
        </div>
        <!-- Finalizar -->
        <button
          class="hidden md:flex bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 disabled:opacity-50"
          @click="handleFinish"
        >
          ✓ Ver resumen de sesión
        </button>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="flex-1 min-h-0 flex flex-col md:flex-row">
      <!-- Cámara -->
      <div class="relative flex-1 min-h-0 bg-black">
        <!-- Indicador REC -->
        <div class="absolute top-4 left-4 z-10 flex items-center gap-2">
          <div
            class="flex items-center gap-1.5 bg-black/50 rounded-full px-3 py-1"
          >
            <span class="size-2 rounded-full bg-red-500 animate-pulse" />
            <span class="text-xs font-medium text-white">REC</span>
          </div>
          <!-- Hora -->
          <div class="bg-black/50 rounded-full px-3 py-1">
            <span class="text-xs text-white">{{ currentTime }}</span>
          </div>
        </div>

        <!-- Contador mobile -->
        <div class="absolute top-4 right-4 z-10 md:hidden">
          <div class="bg-black/50 rounded-full px-3 py-1">
            <span class="text-sm font-bold text-emerald-400">{{
              presentCount
            }}</span>
            <span class="text-slate-400 text-sm"
              >/{{ session?.totalExpected ?? 0 }}</span
            >
          </div>
        </div>

        <!-- Video -->
        <video
          ref="videoRef"
          autoplay
          playsinline
          muted
          class="w-full h-full object-cover"
        />

        <!-- Canvas para dibujar bounding boxes -->
        <canvas
          ref="canvasRef"
          class="absolute inset-0 w-full h-full pointer-events-none"
        />

        <!-- Mensaje si no hay cámara -->
        <div
          v-if="!cameraActive"
          class="absolute inset-0 flex flex-col items-center justify-center text-slate-500"
        >
          <p class="text-4xl mb-3">📷</p>
          <p class="text-sm">{{ cameraError || "Iniciando cámara..." }}</p>
        </div>
      </div>

      <!-- Lista de estudiantes (desktop: lado derecho, mobile: abajo) -->
      <div
        class="md:w-80 flex flex-col bg-slate-900 border-l border-slate-700/50"
      >
        <!-- Header lista -->
        <div class="px-4 py-3 border-b border-slate-700/50 flex-shrink-0">
          <p
            class="text-xs font-semibold uppercase tracking-widest text-slate-500"
          >
            Estudiantes del grupo
          </p>
          <p class="text-xs text-slate-400 mt-0.5">
            {{ presentCount }} de {{ students.length }} detectados
          </p>
          <!-- Barra progreso -->
          <div class="w-full bg-slate-700 rounded-full h-1 mt-2">
            <div
              class="h-1 rounded-full bg-blue-400 transition-all duration-300"
              :style="{
                width: `${students.length > 0 ? (presentCount / students.length) * 100 : 0}%`,
              }"
            />
          </div>
        </div>

        <!-- Lista scrollable -->
        <div class="flex-1 overflow-y-auto">
          <div
            v-for="record in students"
            :key="record._id"
            class="flex items-center gap-3 px-4 py-2.5 border-b border-slate-800/50"
          >
            <div
              class="size-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              :class="avatarClass(record.status)"
            >
              {{ record.studentId.name.charAt(0)
              }}{{ record.studentId.lastName.charAt(0) }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm text-white truncate">
                {{ record.studentId.name }} {{ record.studentId.lastName }}
              </p>
              <p class="text-xs text-slate-500">
                {{ record.studentId.documentNumber }}
              </p>
            </div>
            <span
              class="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
              :class="statusClass(record.status)"
            >
              {{ statusLabel(record.status) }}
            </span>
          </div>
        </div>

        <!-- Botón finalizar mobile -->
        <div
          class="md:hidden px-4 py-3 flex-shrink-0 border-t border-slate-700/50"
        >
          <button
            class="w-full bg-emerald-600 hover:bg-emerald-500 px-4 py-3 rounded-xl text-sm font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
            @click="handleFinish"
          >
            ✓ Ver resumen de sesión
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAttendance } from "../composable/useAttendance";

const route = useRoute();
const router = useRouter();
const attendanceId = computed(() => route.params.attendanceId as string);

const { session, students, fetchSessionById, fetchStudents, recognize } =
  useAttendance();

// Refs de cámara
const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const cameraActive = ref(false);
const cameraError = ref("");
let stream: MediaStream | null = null;

// Polling
let pollingInterval: ReturnType<typeof setInterval> | null = null;
let isProcessing = false;

// Hora actual
const currentTime = ref("");
let clockInterval: ReturnType<typeof setInterval> | null = null;

const presentCount = computed(
  () =>
    students.value.filter((s) => s.status === "present" || s.status === "late")
      .length,
);

// Iniciar cámara
const startCamera = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" }, // cámara trasera en móvil
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      cameraActive.value = true;
    }
  } catch (err) {
    cameraError.value = "No se pudo acceder a la cámara";
    console.error(err);
  }
};

// Capturar frame y enviarlo al backend
const captureAndRecognize = async () => {
  if (isProcessing || !videoRef.value || !cameraActive.value) return;
  if (!canvasRef.value) return;

  isProcessing = true;

  try {
    const video = videoRef.value;
    const canvas = canvasRef.value;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dibujar frame en canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir a blob comprimido
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.7);
    });

    if (!blob) return;

    // Enviar al backend
    const result = await recognize(attendanceId.value, blob);

    if (result?.recognized && result.student_id) {
      // Dibujar feedback visual en canvas
      drawRecognitionFeedback(ctx, canvas.width, canvas.height, true);
    }
  } finally {
    isProcessing = false;
  }
};

const drawRecognitionFeedback = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  recognized: boolean,
) => {
  ctx.strokeStyle = recognized ? "#10b981" : "#ef4444";
  ctx.lineWidth = 4;
  ctx.strokeRect(width * 0.25, height * 0.1, width * 0.5, height * 0.8);
  setTimeout(() => {
    ctx.clearRect(0, 0, width, height);
  }, 800);
};

const handleCancel = async () => {
  stopAll();
  router.back();
};

const handleFinish = async () => {
  stopAll();
  router.push({
    name: "attendance-detail",
    params: { id: attendanceId.value },
  });
};

const stopAll = () => {
  if (pollingInterval) clearInterval(pollingInterval);
  if (clockInterval) clearInterval(clockInterval);
  if (stream) stream.getTracks().forEach((t) => t.stop());
};

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    present: "Presente",
    absent: "Ausente",
    late: "Tardanza",
    excused: "Justificado",
  };
  return map[status] ?? status;
};

const statusClass = (status: string) => {
  const map: Record<string, string> = {
    present: "bg-emerald-500/10 text-emerald-400",
    absent: "bg-slate-700 text-slate-400",
    late: "bg-amber-500/10 text-amber-400",
    excused: "bg-blue-500/10 text-blue-400",
  };
  return map[status] ?? "bg-slate-700 text-slate-400";
};

const avatarClass = (status: string) => {
  const map: Record<string, string> = {
    present: "bg-emerald-500/20 text-emerald-400",
    absent: "bg-slate-700 text-slate-400",
    late: "bg-amber-500/20 text-amber-400",
    excused: "bg-blue-500/20 text-blue-400",
  };
  return map[status] ?? "bg-slate-700 text-slate-400";
};

const formatDate = (date: string) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const updateClock = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

onMounted(async () => {
  await fetchSessionById(attendanceId.value);
  await fetchStudents(attendanceId.value, { limit: 1000, offset: 0 });
  await startCamera();

  // Polling cada 2.5 segundos
  pollingInterval = setInterval(captureAndRecognize, 2500);

  // Reloj
  updateClock();
  clockInterval = setInterval(updateClock, 1000);
});

onUnmounted(() => stopAll());
</script>
