<template>
  <div class="px-5 py-4" v-if="admin">
    <!-- Header -->
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-base font-semibold text-white">
        Detalle del administrador
      </h2>
      <button
        class="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-700"
        @click="$emit('close')"
      >
        ✕
      </button>
    </div>

    <!-- Hero -->
    <div class="flex items-center gap-4 mb-5 pb-5 border-b border-slate-700/50">
      <img
        class="w-20 h-20 rounded-full object-cover ring-2 ring-slate-600 shadow-lg flex-shrink-0"
        :src="adminAvatar(admin)"
      />
      <div>
        <p class="text-white text-base font-semibold leading-tight">
          {{ admin.name }} {{ admin.lastName }}
        </p>
        <p class="text-slate-400 text-xs mt-0.5">{{ admin.position || "—" }}</p>
        <span
          class="inline-flex items-center gap-1.5 mt-2 text-xs px-2 py-0.5 rounded-full"
          :class="
            admin.state
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400'
          "
        >
          <span
            class="size-1.5 rounded-full"
            :class="admin.state ? 'bg-emerald-400' : 'bg-red-400'"
          />
          {{ admin.state ? "Activo" : "Inactivo" }}
        </span>
      </div>
    </div>

    <div class="space-y-4">
      <!-- Contacto -->
      <div>
        <p
          class="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2"
        >
          Contacto
        </p>
        <div class="bg-slate-800/50 rounded-xl divide-y divide-slate-700/50">
          <div class="flex items-center gap-3 px-3 py-2.5">
            <span class="text-sm flex-shrink-0">✉️</span>
            <div class="min-w-0 flex-1">
              <p class="text-xs text-slate-500">Correo</p>
              <p class="text-sm text-slate-200 truncate">
                {{ admin.email || "—" }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3 px-3 py-2.5">
            <span class="text-sm flex-shrink-0">📍</span>
            <div class="min-w-0 flex-1">
              <p class="text-xs text-slate-500">Dirección</p>
              <p class="text-sm text-slate-200">
                {{ admin.residentialAddress || "—" }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Personal + Sistema -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2"
          >
            Personal
          </p>
          <div class="bg-slate-800/50 rounded-xl divide-y divide-slate-700/50">
            <div class="flex items-center gap-2 px-3 py-2.5">
              <span class="text-sm flex-shrink-0">🪪</span>
              <div class="min-w-0 flex-1">
                <p class="text-xs text-slate-500">Documento</p>
                <p class="text-sm text-slate-200 truncate">
                  {{ admin.documentNumber || "—" }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 px-3 py-2.5">
              <span class="text-sm flex-shrink-0">🎂</span>
              <div class="min-w-0 flex-1">
                <p class="text-xs text-slate-500">Edad</p>
                <p class="text-sm text-slate-200">
                  {{ calculateAge(admin.birthday) }} años
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 px-3 py-2.5">
              <span class="text-sm flex-shrink-0">📆</span>
              <div class="min-w-0 flex-1">
                <p class="text-xs text-slate-500">Nacimiento</p>
                <p class="text-sm text-slate-200">
                  {{ formatDate(admin.birthday) }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2"
          >
            Sistema
          </p>
          <div class="bg-slate-800/50 rounded-xl divide-y divide-slate-700/50">
            <div class="flex items-center gap-2 px-3 py-2.5">
              <span class="text-sm flex-shrink-0">📅</span>
              <div class="min-w-0 flex-1">
                <p class="text-xs text-slate-500">Registro</p>
                <p class="text-sm text-slate-200">
                  {{ formatDate(admin.createdAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cargo -->
      <div>
        <p
          class="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2"
        >
          Cargo
        </p>
        <div class="bg-slate-800/50 rounded-xl divide-y divide-slate-700/50">
          <div class="flex items-center gap-3 px-3 py-2.5">
            <span class="text-sm flex-shrink-0">💼</span>
            <div class="min-w-0 flex-1">
              <p class="text-xs text-slate-500">Posición</p>
              <p class="text-sm text-slate-200">{{ admin.position || "—" }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 px-3 py-2.5">
            <span class="text-sm flex-shrink-0">🏢</span>
            <div class="min-w-0 flex-1">
              <p class="text-xs text-slate-500">Departamento</p>
              <p class="text-sm text-slate-200">
                {{ admin.department || "—" }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAvatarUrl } from "../../common/utils/avatar";
import type { Admin } from "../user.interfaces";

defineProps<{ admin: Admin | null }>();
defineEmits(["close"]);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const calculateAge = (birthday: string) => {
  const today = new Date();
  const birth = new Date(birthday);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const adminAvatar = (admin: Admin) =>
  getAvatarUrl(admin.photo, admin.name, admin.lastName);
</script>
