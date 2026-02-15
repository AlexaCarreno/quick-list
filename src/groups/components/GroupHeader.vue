<template>
  <div
    class="bg-gray-800 border border-blue-500 p-3 rounded-md text-sm sm:text-base flex flex-col lg:flex-row lg:items-center relative"
  >
    <!-- Contenido principal -->
    <div class="flex flex-col lg:flex-row lg:justify-between flex-1">
      <p class="mb-2 lg:mb-0 lg:flex-1 lg:text-center">
        <strong>Institución:</strong> {{ institution }}
      </p>
      <p class="mb-2 lg:mb-0 lg:flex-1 lg:text-center">
        <strong>Materia:</strong> {{ subject }}
      </p>
      <p class="lg:flex-1 lg:text-center">
        <strong>Curso:</strong> {{ code }}
      </p>
    </div>

    <!-- Botones en desktop (arriba a la derecha) -->
    <div class="hidden lg:flex absolute right-3 top-3 space-x-2">
      <button
        @click="toggleArchive"
        class="text-xs text-gray-200 border border-blue-500 rounded px-2 py-1 hover:bg-sky-500 hover:text-white"
      >
        {{ isArchived ? "Activar" : "Archivar" }}
      </button>
      <button
        @click="openEditor = true"
        class="text-gray-200 hover:text-sky-500"
      >
        <Edit class="w-5 h-5" />
      </button>
    </div>

    <!-- Botones en mobile (visibles y bien posicionados) -->
    <div class="flex lg:hidden justify-end mt-3 space-x-3">
      <button
        @click="toggleArchive"
        class="text-xs text-blue-400 border border-blue-500 rounded px-2 py-1 hover:bg-blue-500 hover:text-white"
      >
        {{ isArchived ? "Activate" : "Archive" }}
      </button>
      <button
        @click="openEditor = true"
        class="text-gray-200 hover:text-sky-500"
      >
        <Edit class="w-5 h-5" />
      </button>
    </div>

    <!-- Modal con formulario de edición -->
    <MyModal v-model:open="openEditor" size="md" closable>
      <template #default>
        <h3 class="text-lg font-semibold mb-4">Editar grupo</h3>
        <CreateGroup
          :institutionName="institution"
          :subject="subject"
          :referenceCode="code"
          @submit="handleUpdate"
          @cancel="openEditor = false"
        />
      </template>
    </MyModal>
  </div>
</template>

<script setup lang="ts">
import { Edit } from "lucide-vue-next";
import { ref } from "vue";
import MyModal from "../../common/modals/MyModal.vue";
import { useGroups } from "../composables/useGroups";
import type { INewGroupPayload } from "../interfaces/groups.interfaces";
import CreateGroup from "./CreateGroup.vue";
import { useAlert } from "../../common/alerts/useMyAlert";

// Alert system
const alert = useAlert();

// Props del componente
const props = defineProps<{
  id: string;
  institution: string;
  subject: string;
  code: string;
  status: "active" | "archived";
}>();

// Estado de editor y archivo
const openEditor = ref(false);
const isArchived = ref(props.status === "archived");

// Composable de edición
const { editGroup, changeStatus } = useGroups(alert.showAlert);

// Enviar cambios de formulario
function handleUpdate(payload: INewGroupPayload) {
  openEditor.value = false;
  editGroup(props.id, payload);
}

// Cambiar entre "archived" y "active"
async function toggleArchive() {
  const newStatus = isArchived.value ? "active" : "archived";
  try {
    await changeStatus(props.id, newStatus);
    isArchived.value = !isArchived.value;
    alert.showAlert(
      isArchived.value ? "Grupo archivado ✅" : "Grupo activado ✅"
    );
  } catch (err) {
    alert.showAlert("Failed to update group status");
  }
}
</script>
