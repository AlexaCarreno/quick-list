<template>
  <div class="camera-container">
    <video ref="video" autoplay playsinline muted class="video"></video>
    <div class="buttons">
      <button @click="startRecognition" :disabled="loading">
        {{ loading ? "Reconociendo..." : "Iniciar Asistencia" }}
      </button>
      <button v-if="loading" @click="stopRecognition" class="stop-btn">
        Detener
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  groupId: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (
    e: "result",
    payload: {
      groupId: string;
      assistance: { studentId: string; present: boolean }[];
    }
  ): void;
}>();

// Estado
const recognizedData = ref<{ studentId: string; present: boolean }[]>([]);
const video = ref<HTMLVideoElement | null>(null);
const loading = ref(false);
let stream: MediaStream | null = null;
let intervalId: number | null = null;

// Funciones cámara
const startCamera = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (video.value) {
      video.value.srcObject = stream;
    }
  } catch (err) {
    console.error("No se pudo acceder a la cámara", err);
  }
};

const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    stream = null;
  }
};

// Captura un frame del video
const captureFrame = (): string | null => {
  if (!video.value) return null;

  const canvas = document.createElement("canvas");
  canvas.width = video.value.videoWidth;
  canvas.height = video.value.videoHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.drawImage(video.value, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg");
};

// Inicia reconocimiento facial
const startRecognition = () => {
  loading.value = true;

  intervalId = window.setInterval(async () => {
    const image = captureFrame();
    if (!image) return;

    try {
      const response = await fetch("http://localhost:8000/recognize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ group_id: props.groupId, image }),
      });

      if (response.ok) {
        const data = await response.json();
        // data.assistance = [{ studentId, present }]
        for (const entry of data.assistance as {
          studentId: string;
          present: boolean;
        }[]) {
          const alreadyAdded = recognizedData.value.some(
            (e) => e.studentId === entry.studentId
          );
          if (!alreadyAdded) {
            recognizedData.value.push(entry);
          }
        }
      } else {
        console.error("Error al reconocer rostro");
      }
    } catch (err) {
      console.error("Error de red en reconocimiento", err);
    }
  }, 1000);
};

// Detiene el reconocimiento
const stopRecognition = () => {
  loading.value = false;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  stopCamera();

  emit("result", {
    groupId: props.groupId,
    assistance: recognizedData.value,
  });

  emit("close");
};

onMounted(startCamera);
onUnmounted(stopRecognition);
</script>

<style scoped>
.camera-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
}

.video {
  width: 100%;
  max-width: 600px;
  border-radius: 8px;
}

.buttons {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #3b82f6;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.stop-btn {
  background-color: #dc2626;
}
</style>
