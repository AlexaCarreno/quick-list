<template>
  <div class="text-white">
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-white">Nuevo estudiante</h2>
      <p class="text-sm text-slate-400 mt-0.5">
        Los campos marcados con * son obligatorios
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-5" novalidate>
      <!-- FOTO -->
      <div class="flex flex-col items-center gap-3">
        <div class="relative group">
          <div
            class="size-24 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden cursor-pointer transition hover:border-blue-500"
            @click="triggerFileInput"
          >
            <img
              v-if="photoPreview"
              :src="photoPreview"
              class="w-full h-full object-cover"
              alt="Foto del estudiante"
            />
            <span v-else class="text-3xl text-slate-500">📷</span>
          </div>
          <button
            v-if="photoPreview"
            type="button"
            class="absolute -top-1 -right-1 size-5 bg-red-500 hover:bg-red-400 rounded-full text-xs flex items-center justify-center"
            @click="removePhoto"
          >
            ✕
          </button>
        </div>
        <div class="flex gap-2 text-xs">
          <button
            type="button"
            class="text-blue-400 hover:text-blue-300 underline"
            @click="triggerFileInput"
          >
            {{ photoPreview ? "Cambiar foto" : "Subir foto" }}
          </button>
          <span v-if="photoPreview" class="text-slate-600">|</span>
          <button
            v-if="photoPreview"
            type="button"
            class="text-slate-400 hover:text-slate-300 underline"
            @click="removePhoto"
          >
            Quitar
          </button>
        </div>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onFileChange"
        />
      </div>

      <!-- Nombre + Apellido -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Nombre" required :error="errors.name">
          <input
            v-model="form.name"
            type="text"
            placeholder="Ej: Angie"
            :class="inputClass(errors.name)"
            @blur="validateField('name')"
          />
        </FormField>
        <FormField label="Apellido" required :error="errors.lastName">
          <input
            v-model="form.lastName"
            type="text"
            placeholder="Ej: Carreño"
            :class="inputClass(errors.lastName)"
            @blur="validateField('lastName')"
          />
        </FormField>
      </div>

      <!-- Email -->
      <FormField label="Correo electrónico" required :error="errors.email">
        <input
          v-model="form.email"
          type="email"
          placeholder="Ej: angie@gmail.com"
          :class="inputClass(errors.email)"
          @blur="validateField('email')"
        />
      </FormField>

      <!-- Documento + Fecha -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Número de documento"
          required
          :error="errors.documentNumber"
        >
          <input
            v-model="form.documentNumber"
            type="text"
            placeholder="Ej: 1007438965"
            :class="inputClass(errors.documentNumber)"
            @blur="validateField('documentNumber')"
          />
        </FormField>
        <FormField
          label="Fecha de nacimiento"
          required
          :error="errors.birthday"
        >
          <input
            v-model="form.birthday"
            type="date"
            :class="inputClass(errors.birthday)"
            @blur="validateField('birthday')"
          />
        </FormField>
      </div>

      <!-- Carrera + Semestre -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Carrera" required :error="errors.career">
          <input
            v-model="form.career"
            type="text"
            placeholder="Ej: Ingeniería de Sistemas"
            :class="inputClass(errors.career)"
            @blur="validateField('career')"
          />
        </FormField>
        <FormField label="Semestre" required :error="errors.semester">
          <input
            v-model="form.semester"
            type="number"
            min="1"
            max="12"
            placeholder="Ej: 6"
            :class="inputClass(errors.semester)"
            @blur="validateField('semester')"
          />
        </FormField>
      </div>

      <!-- Teléfono -->
      <FormField label="Teléfono">
        <input
          v-model="form.phone"
          type="text"
          placeholder="Opcional"
          :class="inputClass()"
        />
      </FormField>

      <!-- Dirección -->
      <FormField label="Dirección residencial">
        <input
          v-model="form.residentialAddress"
          type="text"
          placeholder="Opcional"
          :class="inputClass()"
        />
      </FormField>

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
          {{ loading ? "Guardando..." : "Crear estudiante" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import FormField from "../../common/components/inputs/FormField.vue";

const props = defineProps<{
  onSubmit: (formData: FormData) => Promise<any>;
}>();

const emit = defineEmits<{
  (e: "success"): void;
  (e: "cancel"): void;
}>();

const form = reactive({
  name: "",
  lastName: "",
  email: "",
  documentNumber: "",
  birthday: "",
  career: "",
  semester: "",
  phone: "",
  residentialAddress: "",
});

const photoFile = ref<File | null>(null);
const photoPreview = ref<string | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const loading = ref(false);
const submitError = ref("");

const errors = reactive<Record<string, string>>({
  name: "",
  lastName: "",
  email: "",
  documentNumber: "",
  birthday: "",
  career: "",
  semester: "",
});

const requiredFields = [
  "name",
  "lastName",
  "email",
  "documentNumber",
  "birthday",
  "career",
  "semester",
];

const validateField = (field: string) => {
  errors[field] = "";

  if (
    requiredFields.includes(field) &&
    !String(form[field as keyof typeof form]).trim()
  ) {
    errors[field] = "Este campo es obligatorio";
    return false;
  }
  if (
    field === "email" &&
    form.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  ) {
    errors[field] = "Ingresa un correo válido";
    return false;
  }
  if (field === "semester" && form.semester) {
    const s = Number(form.semester);
    if (isNaN(s) || s < 1 || s > 12) {
      errors[field] = "Debe ser un semestre entre 1 y 12";
      return false;
    }
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

const triggerFileInput = () => fileInputRef.value?.click();

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  photoFile.value = file;
  photoPreview.value = URL.createObjectURL(file);
};

const removePhoto = () => {
  photoFile.value = null;
  photoPreview.value = null;
  if (fileInputRef.value) fileInputRef.value.value = "";
};

const handleSubmit = async () => {
  submitError.value = "";
  if (!validateAll()) return;

  const formData = new FormData();
  formData.append("name", form.name.trim());
  formData.append("lastName", form.lastName.trim());
  formData.append("email", form.email.trim());
  formData.append("documentNumber", form.documentNumber.trim());
  formData.append("birthday", form.birthday);
  formData.append("career", form.career.trim());
  formData.append("semester", form.semester);

  if (form.phone.trim()) formData.append("phone", form.phone.trim());
  if (form.residentialAddress.trim()) {
    formData.append("residentialAddress", form.residentialAddress.trim());
  }
  if (photoFile.value) formData.append("photo", photoFile.value);

  try {
    loading.value = true;
    await props.onSubmit(formData);
    emit("success");
  } catch (err: any) {
    submitError.value =
      err?.message ?? "Ocurrió un error al crear el estudiante";
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
