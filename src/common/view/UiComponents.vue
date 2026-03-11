<template>
    <div class="pl-5 pr-5 sm:pt-3 md:p-5  text-white"">
        <TeacherList :teachers="teachers" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import TeacherList from "../components/ui/TeacherList.vue";
import type { Teacher } from "../../users/user.interfaces";

// export interface Teacher {
//     _id: string
//     userId: string
//     name: string
//     lastName: string
//     email: string
//     birthday: string // ISO date
//     photo: string
//     documentNumber: string
//     residentialAddress: string
//     professionalTitle: string
//     professionalLicenseNumber: string
//     state: boolean
//     createdAt: string // ISO date
// }

const teachers = ref<Teacher[]>([

])

onMounted(async () => {
    // Ejemplo: datos del backend
    teachers.value = [
        {
            _id: "698a5a2663b79cc7ea5b0b10",
            userId: "698a5a2663b79cc7ea5b0b0d",
            name: "Angie Alexandra",
            lastName: "Carreño Bayona",
            email: "correo@gmail.com",
            birthday: new Date("2004-04-12T00:00:00.000Z"),
            photo: "/storage/users/8ee0fc51-8fdb-49f9-869d-a291fa65821f.jpeg",
            documentNumber: "1007438902",
            residentialAddress: "Cra 15 #16-05",
            professionalTitle: "Ingeniería de Sistemas",
            professionalLicenseNumber: "1234643135",
            state: true,
            createdAt: new Date("2026-02-09T22:05:26.542Z")
        },
        {
            _id: "2",
            userId: "u2",
            name: "Carlos Andrés",
            lastName: "Gómez Pérez",
            email: "carlos@gmail.com",
            birthday: new Date("1995-08-20T00:00:00.000Z"),
            photo: "/storage/users/8ee0fc51-8fdb-49f9-869d-a291fa65821f.jpeg",
            documentNumber: "1020304050",
            residentialAddress: "Calle 45 #12-30",
            professionalTitle: "Licenciatura en Matemáticas",
            professionalLicenseNumber: "987654321",
            state: false,
            createdAt: new Date("2026-02-10T10:15:00.000Z")
        },
    ]
})

</script>

<style scoped></style>
