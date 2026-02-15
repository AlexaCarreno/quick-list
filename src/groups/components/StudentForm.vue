<template>
  <div>
    <form @submit.prevent="submitForm" class="space-y-3">
      <!-- Campos básicos -->
      <input
        v-model="form.dni"
        type="text"
        placeholder="Documento identidad"
        class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white"
      />
      <input
        v-model="form.name"
        type="text"
        placeholder="Nombres"
        class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white"
      />
      <input
        v-model="form.lastName"
        type="text"
        placeholder="Apellidos"
        class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white"
      />
      <DatePicker v-model="form.birthday" :required="true" />
      <input
        v-model="form.email"
        type="email"
        placeholder="Email"
        class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white"
      />
      <input
        v-model="form.phone"
        type="tel"
        placeholder="Teléfono"
        class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white"
      />

      <!-- Cámara moderna -->
      <div
        class="relative w-full max-w-xs mx-auto aspect-square border border-gray-600 rounded overflow-hidden bg-black"
      >
        <!-- Video -->
        <video
          v-show="!form.image"
          ref="video"
          autoplay
          playsinline
          class="w-full h-full object-cover"
        ></video>

        <!-- Imagen capturada -->
        <img
          v-show="form.image"
          :src="form.image"
          class="w-full h-full object-cover"
        />

        <!-- Botón rotar cámara solo si hay más de una -->
        <button
          v-if="videoActive && !form.image && multipleCameras"
          type="button"
          @click="rotateCamera"
          class="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full text-lg z-10"
          title="Rotar cámara"
        >
          ↻
        </button>

        <!-- Botón tomar foto -->
        <button
          v-if="videoActive && !form.image"
          type="button"
          @click="captureImage"
          class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition z-10"
        >
          <div class="bg-red-500 w-12 h-12 rounded-full"></div>
        </button>

        <!-- Botón para volver a tomar la foto -->
        <button
          v-if="form.image"
          @click="retakeImage"
          type="button"
          class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 hover:bg-yellow-400 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl z-10"
        >
          ↺
        </button>

        <!-- Flash efecto -->
        <div
          v-show="flashActive"
          class="absolute inset-0 bg-white opacity-50 z-20 transition-opacity duration-200"
        ></div>
      </div>

      <!-- Cargar archivo -->
      <label
        class="cursor-pointer px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 text-sm text-white mt-2 inline-block"
      >
        📁 Cargar
        <input
          type="file"
          accept="image/*"
          @change="handleFileUpload"
          class="hidden"
        />
      </label>

      <!-- Botones de acción -->
      <div class="flex justify-end gap-2">
        <button
          type="button"
          @click="handleCancel"
          class="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="px-4 py-2 rounded bg-blue-900 hover:bg-sky-600 text-white"
        >
          Guardar
        </button>
      </div>

      <!-- Canvas oculto -->
      <canvas ref="canvas" class="hidden"></canvas>
    </form>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  toRef,
  onMounted,
  onUnmounted,
  type Ref,
  watch,
} from "vue";
import DatePicker from "../../common/inputs/DatePicker.vue";
import { useAlert } from "../../common/alerts/useMyAlert";
import type { Person } from "../interfaces/student.interfaces";

const props = defineProps<{
  initialValues?: Partial<Person> | null;
}>();

const { showAlert } = useAlert();
const emit = defineEmits<{
  (e: "submit", payload: FormData): void;
  (e: "cancel"): void;
}>();

const form = ref<Person>({
  _id: "",
  groupId: "",
  dni: "",
  birthday: new Date(),
  name: "",
  lastName: "",
  email: "",
  phone: "",
  image: "",
  status: "active",
});

watch(
  () => props.initialValues,
  (newVal) => {
    if (newVal) {
      form.value._id = newVal._id ?? "";
      form.value.groupId = newVal.groupId ?? "";
      form.value.dni = newVal.dni ?? "";
      form.value.name = newVal.name ?? "";
      form.value.lastName = newVal.lastName ?? "";
      form.value.email = newVal.email ?? "";
      form.value.phone = newVal.phone ?? "";
      form.value.status = newVal.status ?? "active";

      if (newVal.birthday) {
        form.value.birthday = new Date(newVal.birthday);
      }

      if (newVal.image) {
        form.value.image = `http://localhost:3000/${newVal.image.replace(
          "./",
          ""
        )}`;
      } else {
        form.value.image = "";
      }
    } else {
      Object.assign(form.value, {
        _id: "",
        groupId: "",
        dni: "",
        birthday: new Date(),
        name: "",
        lastName: "",
        email: "",
        phone: "",
        image: "",
        status: "active",
      });
    }
  },
  { immediate: true }
);

const imageRef = toRef(form.value, "image") as Ref<string>;

// Cámara
const video = ref<HTMLVideoElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const videoActive = ref(false);
let stream: MediaStream | null = null;
let currentFacing: "user" | "environment" = "environment";
const multipleCameras = ref(false);
const flashActive = ref(false);

// Detectar cantidad de cámaras disponibles
async function checkCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter((d) => d.kind === "videoinput");
    multipleCameras.value = videoInputs.length > 1;
  } catch (error) {
    console.warn("No se pudo enumerar cámaras", error);
  }
}

// Abrir cámara
async function openCamera(facing: "user" | "environment" = "environment") {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: facing } },
    });
    currentFacing = facing;
    if (video.value) {
      video.value.srcObject = stream;
      videoActive.value = true;
    }
  } catch (error: any) {
    console.error("No se pudo abrir la cámara", error);
    if (error.name === "NotAllowedError") {
      showAlert("Permiso denegado: por favor permite el acceso a la cámara.");
    } else {
      showAlert("No se pudo acceder a la cámara. Intenta otra vez.");
    }
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
  videoActive.value = false;
}

// Rotar cámara
function rotateCamera() {
  stopCamera();
  const newFacing = currentFacing === "user" ? "environment" : "user";
  openCamera(newFacing);
}

// Capturar imagen con efecto flash
function captureImage() {
  if (!video.value || !canvas.value) return;
  const context = canvas.value.getContext("2d");
  if (!context) return;
  canvas.value.width = video.value.videoWidth;
  canvas.value.height = video.value.videoHeight;
  context.drawImage(video.value, 0, 0);
  imageRef.value = canvas.value.toDataURL("image/png");

  // Flash efecto
  flashActive.value = true;
  setTimeout(() => {
    flashActive.value = false;
  }, 150);

  stopCamera();
}

function clearImage() {
  imageRef.value = "";
}

function retakeImage() {
  clearImage();
  openCamera(currentFacing);
}

function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    imageRef.value = reader.result as string;
  };
  reader.readAsDataURL(file);
}

const isFormValid = computed(() => {
  return (
    form.value.dni.trim() &&
    form.value.name.trim() &&
    form.value.lastName.trim() &&
    form.value.birthday instanceof Date &&
    !isNaN(form.value.birthday.getTime()) &&
    form.value.email.trim() &&
    form.value.phone.trim()
  );
});

function base64ToBlob(base64: string): Blob {
  const parts = base64.split(",");
  const mime = parts[0].match(/:(.*?);/)?.[1] || "";
  const binary = atob(parts[1]);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mime });
}

function submitForm() {
  if (!isFormValid.value) {
    showAlert("Por favor complete todos los campos.");
    return;
  }

  const formData = new FormData();
  formData.append("dni", form.value.dni);
  formData.append("name", form.value.name);
  formData.append("lastName", form.value.lastName);
  formData.append("birthday", form.value.birthday.toISOString());
  formData.append("email", form.value.email);
  formData.append("phone", form.value.phone);

  if (form.value.image) {
    if (form.value.image.startsWith("data:image")) {
      const blob = base64ToBlob(form.value.image);
      formData.append("image", blob, "captured-image.png");
    } else {
      formData.append("image", form.value.image as any);
    }
  }

  emit("submit", formData);
}

function handleCancel() {
  stopCamera();
  emit("cancel");
}

// Inicialización
onMounted(() => {
  checkCameras();
  openCamera(currentFacing);
});

onUnmounted(() => {
  stopCamera();
});
</script>
