<template>
  <div>
    <!-- Botón para agregar estudiante -->
    <button
      @click="openForm = true"
      class="border border-blue-400 bg-gray-800 px-4 py-2 rounded hover:bg-blue-900 transition mt-5"
    >
      + agregar estudiante
    </button>

    <!-- Tabla de estudiantes -->
    <ReusableTable
      :columns="[
        'DNI',
        'Nombre',
        'Apellidos',
        'Edad',
        'Email',
        'Celular',
        'Estado',
      ]"
      :rows="
        students.map((s) => ({
          _id: s._id,
          DNI: s.dni,
          Nombre: s.name,
          Apellidos: s.lastName,
          Edad: s.birthday ? calculateAge(s.birthday) : '-',
          Email: s.email,
          Celular: s.phone,
          Estado: s.status,
        }))
      "
      @selection-change="handleSelection"
      @edit-student="openEditModal"
    />

    <!-- Botón para eliminar seleccionados -->
    <button
      class="mt-4 px-4 py-2 border border-red-600 hover:bg-red-700 text-white rounded"
      :disabled="selectedStudentIds.length === 0"
      @click="deleteSelected"
    >
      Eliminar seleccionados ({{ selectedStudentIds.length }})
    </button>

    <!-- Modal de Crear/Editar Estudiante -->
    <MyModal v-model:open="openForm" size="md" closable>
      <template #default>
        <h3 class="text-lg font-semibold mb-4">
          {{ editingStudent ? "Editar estudiante" : "Crear estudiante" }}
        </h3>
        <StudentForm
          :initial-values="editingStudent"
          @submit="handleSubmit"
          @cancel="closeModal"
        />
      </template>
    </MyModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useAlert } from "../../common/alerts/useMyAlert";
import MyModal from "../../common/modals/MyModal.vue";
import ReusableTable from "../../common/tables/ReusableTable.vue";
import { useStudent } from "../composables/useStudent";
import { useStudentStore } from "../stores/studentStore";
import { calculateAge } from "../utils/calculate-age";
import StudentForm from "./StudentForm.vue";

const props = defineProps<{ groupId: string }>();

const { showAlert } = useAlert();
const openForm = ref(false);
const editingStudent = ref<any | null>(null);
const selectedStudentIds = ref<string[]>([]);

const studentsStore = useStudentStore();
const students = computed(() => studentsStore.computedStudents);
const { createStudent, loadStudentsFromDB, deleteManyStudents, updateStudent } =
  useStudent(showAlert);

// Cargar datos al montar
onMounted(async () => {
  await loadStudentsFromDB(props.groupId);
});

// Abrir modal para edición
function openEditModal(id: string) {
  const student = students.value.find((s) => s._id === id);
  if (student) {
    editingStudent.value = { ...student };
    openForm.value = true;
  }
}

// Cerrar modal y limpiar datos
function closeModal() {
  openForm.value = false;
  editingStudent.value = null;
}

// Crear o actualizar estudiante
async function handleSubmit(payload: FormData) {
  if (editingStudent.value) {
    // 🟢 Asegúrate de enviar el FormData y no solo el ID
    await updateStudent(props.groupId, editingStudent.value._id, payload);
  } else {
    await createStudent(props.groupId, payload);
  }

  closeModal();
}

// Obtener los seleccionados
function handleSelection(ids: string[]) {
  selectedStudentIds.value = ids;
}

// Eliminar seleccionados
async function deleteSelected() {
  if (selectedStudentIds.value.length === 0) return;

  if (confirm("¿Estás seguro de eliminar los estudiantes seleccionados?")) {
    await deleteManyStudents(props.groupId, selectedStudentIds.value);
    selectedStudentIds.value = [];
  }
}
</script>
