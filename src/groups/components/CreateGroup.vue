<template>
  <div>
    <form @submit.prevent="submitForm" class="space-y-3">
      <input
        v-model="form.institutionName"
        type="text"
        placeholder="Institución "
        class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white"
      />
      <input
        v-model="form.subject"
        type="text"
        placeholder="Materia"
        class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white"
      />
      <input
        v-model="form.referenceCode"
        type="text"
        placeholder="curso"
        class="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white"
      />

      <div class="flex justify-end gap-2">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
        >
          cancelar
        </button>
        <button
          type="submit"
          class="px-4 py-2 rounded bg-blue-900 hover:bg-sky-600"
        >
          guardar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { INewGroupPayload } from "../interfaces/groups.interfaces";
import { useAlert } from "../../common/alerts/useMyAlert";


// Props
const props = defineProps({
  institutionName: { type: String, default: "" },
  subject: { type: String, default: "" },
  referenceCode: { type: String, default: "" },
});

// Emits
const emit = defineEmits<{
  (e: "submit", payload: INewGroupPayload): void;
  (e: "cancel"): void;
}>();

const alert = useAlert();

const form = ref<INewGroupPayload>({
  institutionName: props.institutionName,
  subject: props.subject,
  referenceCode: props.referenceCode,
});

const isFormValid = computed(
  () =>
    form.value.institutionName.trim() !== "" &&
    form.value.subject.trim() !== "" &&
    form.value.referenceCode.trim() !== ""
);

function submitForm() {
  if (isFormValid.value) {
    emit("submit", { ...form.value });
  } else {
    alert.showAlert("Formulario incompleto", "info");
  }
}
</script>
