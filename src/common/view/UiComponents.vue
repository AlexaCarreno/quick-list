<template>
    <div class="p-5  h-dvh bg-[#12151c] text-white"">
        <TeacherList :teachers="teachers" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import TeacherList from "../components/ui/TeacherList.vue";

export interface Teacher {
    _id: string
    userId: string
    name: string
    lastName: string
    email: string
    birthday: string // ISO date
    photo: string
    documentNumber: string
    residentialAddress: string
    professionalTitle: string
    professionalLicenseNumber: string
    state: boolean
    createdAt: string // ISO date
}

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
})

</script>

<style scoped></style>
