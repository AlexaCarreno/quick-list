<template>
  <div class="h-full flex flex-col pl-5 pr-5 sm:pt-3 md:p-5 text-white">

    <!-- Tabs -->
    <div class="flex gap-2 mb-4 flex-shrink-0">
      <button :class="activeTab === 'teachers' ? activeClass : inactiveClass" @click="activeTab = 'teachers'">
        Teachers
      </button>
      <button :class="activeTab === 'admins' ? activeClass : inactiveClass" @click="activeTab = 'admins'">
        Admins
      </button>
    </div>

    <!-- Contenido según tab activo -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="activeTab === 'teachers'">
        <TeacherList :teachers="teachers" />
      </div>
      <div v-else>
        <AdminList :admins="admins" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

import TeacherList from "../../common/components/ui/TeacherList.vue";
import type { Teacher } from "../../common/view/UiComponents.vue";
import type { Admin } from "../../common/components/ui/AdminList.vue";
import AdminList from "../../common/components/ui/AdminList.vue";



const activeTab = ref<"teachers" | "admins">("teachers");

// Clases simples para tabs
const activeClass = "px-4 py-2 bg-blue-600 rounded";
const inactiveClass = "px-4 py-2 bg-slate-700 rounded";

// Datos de ejemplo
const teachers = ref<Teacher[]>([]);
const admins = ref<Admin[]>([]);

onMounted(() => {
  // Simula fetch del backend
  teachers.value = [
    {
      _id: "698a5a2663b79cc7ea5b0b10",
      userId: "698a5a2663b79cc7ea5b0b0d",
      name: "Angie Alexandra",
      lastName: "Carreño Bayona",
      email: "correo@gmail.com",
      birthday: "2004-04-12T00:00:00.000Z",
      photo: "/storage/users/8ee0fc51-8fdb-49f9-869d-a291fa65821f.jpeg",
      documentNumber: "1007438902",
      residentialAddress: "Cra 15 #16-05",
      professionalTitle: "Ingeniería de Sistemas",
      professionalLicenseNumber: "1234643135",
      state: true,
      createdAt: "2026-02-09T22:05:26.542Z"
    },
    {
      _id: "2",
      userId: "u2",
      name: "Carlos Andrés",
      lastName: "Gómez Pérez",
      email: "carlos@gmail.com",
      birthday: "1995-08-20T00:00:00.000Z",
      photo: "/storage/users/8ee0fc51-8fdb-49f9-869d-a291fa65821f.jpeg",
      documentNumber: "1020304050",
      residentialAddress: "Calle 45 #12-30",
      professionalTitle: "Licenciatura en Matemáticas",
      professionalLicenseNumber: "987654321",
      state: false,
      createdAt: "2026-02-10T10:15:00.000Z"
    },
    {
      _id: "3",
      userId: "u3",
      name: "Laura",
      lastName: "Martínez Ruiz",
      email: "laura@gmail.com",
      birthday: "1990-02-11T00:00:00.000Z",
      photo: "/storage/users/8ee0fc51-8fdb-49f9-869d-a291fa65821f.jpeg",
      documentNumber: "1122334455",
      residentialAddress: "Av 3 #20-10",
      professionalTitle: "Psicología",
      professionalLicenseNumber: "456789123",
      state: true,
      createdAt: "2026-02-11T14:30:00.000Z"
    },
    {
      _id: "4",
      userId: "u4",
      name: "Angie Alexandra",
      lastName: "Carreño Bayona",
      email: "correo@gmail.com",
      birthday: "2004-04-12T00:00:00.000Z",
      photo: "/storage/users/8ee0fc51-8fdb-49f9-869d-a291fa65821f.jpeg",
      documentNumber: "1007438902",
      residentialAddress: "Cra 15 #16-05",
      professionalTitle: "Ingeniería de Sistemas",
      professionalLicenseNumber: "1234643135",
      state: true,
      createdAt: "2026-02-09T22:05:26.542Z"
    },
    {
      _id: "5",
      userId: "u5",
      name: "Carlos Andrés",
      lastName: "Gómez Pérez",
      email: "carlos@gmail.com",
      birthday: "1995-08-20T00:00:00.000Z",
      photo: "/storage/users/8ee0fc51-8fdb-49f9-869d-a291fa65821f.jpeg",
      documentNumber: "1020304050",
      residentialAddress: "Calle 45 #12-30",
      professionalTitle: "Licenciatura en Matemáticas",
      professionalLicenseNumber: "987654321",
      state: false,
      createdAt: "2026-02-10T10:15:00.000Z"
    },
    {
      _id: "6",
      userId: "u6",
      name: "Laura",
      lastName: "Martínez Ruiz",
      email: "laura@gmail.com",
      birthday: "1990-02-11T00:00:00.000Z",
      photo: "/storage/users/8ee0fc51-8fdb-49f9-869d-a291fa65821f.jpeg",
      documentNumber: "1122334455",
      residentialAddress: "Av 3 #20-10",
      professionalTitle: "Psicología",
      professionalLicenseNumber: "456789123",
      state: true,
      createdAt: "2026-02-11T14:30:00.000Z"
    }
  ]

  admins.value = [
    {
      _id: "a1",
      userId: "admin1",
      name: "Andrés Felipe",
      lastName: "Gómez",
      email: "admin@gmail.com",
      state: true,
      createdAt: "2026-02-12T12:00:00.000Z"
    },
    {
      _id: "a2",
      userId: "admin2",
      name: "Laura",
      lastName: "Martínez",
      email: "laura.admin@gmail.com",
      state: false,
      createdAt: "2026-02-10T08:00:00.000Z"
    }
  ];
})
</script>

<style scoped>
/* Puedes refinar con Tailwind si quieres */
</style>
