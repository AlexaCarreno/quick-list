<template>
  <EntityListLayout
    ref="layoutRef"
    :items="admins"
    :total="total"
    :loading="loading"
    :columns="columns"
    grid-template="3fr 1fr 1fr 1fr 1fr 1fr 1fr"
    :filters="filters"
    :filter-map="filterMap"
    default-filter="name"
    :class="$attrs.class"
    @query-change="$emit('query-change', $event)"
  >
    <template #header-actions>
      <button
        class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm w-full sm:w-auto"
        @click="openCreateAdmin"
      >
        + Crear administrador
      </button>
    </template>

    <!-- MOBILE -->
    <template #mobile="{ item, openDetail }">
      <div
        class="flex gap-x-4 justify-between items-center cursor-pointer"
        @click.stop="openDetail(item)"
      >
        <div class="flex gap-x-4 flex-1 min-w-0">
          <img
            class="size-12 rounded-full bg-slate-800 object-cover"
            :src="adminAvatar(item)"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-white">
              {{ item.name }} {{ item.lastName }}
            </p>
            <p class="text-xs text-slate-400 truncate">{{ item.email }}</p>
            <p class="text-xs text-slate-400 truncate">
              {{ item.position || "—" }}
            </p>
            <div class="mt-2 flex items-center gap-x-2">
              <span
                class="size-2 rounded-full"
                :class="item.state ? 'bg-emerald-500' : 'bg-red-500'"
              />
              <span class="text-xs text-slate-400">{{
                item.state ? "Activo" : "Inactivo"
              }}</span>
            </div>
          </div>
        </div>
        <div class="flex-shrink-0" @click.stop>
          <RowActions
            :open="activeActionsId === item._id"
            @toggle="toggleActions(item._id)"
            @close="closeActions"
            :actions="rowActions(item)"
          />
        </div>
      </div>
    </template>

    <template #user="{ item }">
      <div class="flex items-center gap-x-4 min-w-0">
        <img
          class="size-10 rounded-full bg-slate-800 object-cover"
          :src="adminAvatar(item)"
        />
        <div class="min-w-0">
          <p class="text-sm font-semibold text-white truncate">
            {{ item.name }} {{ item.lastName }}
          </p>
          <p class="text-xs text-slate-400 truncate">{{ item.email }}</p>
        </div>
      </div>
    </template>

    <template #documentNumber="{ item }">
      <p class="text-sm text-slate-300">{{ item.documentNumber || "—" }}</p>
    </template>

    <template #position="{ item }">
      <p class="text-sm text-slate-300">{{ item.position || "—" }}</p>
    </template>

    <template #department="{ item }">
      <p class="text-sm text-slate-300">{{ item.department || "—" }}</p>
    </template>

    <template #age="{ item }">
      <p class="text-sm text-slate-300">
        {{ calculateAge(item.birthday) }} años
      </p>
    </template>

    <template #state="{ item }">
      <div class="flex items-center gap-x-2">
        <span
          class="size-2 rounded-full"
          :class="item.state ? 'bg-emerald-500' : 'bg-red-500'"
        />
        <span class="text-sm text-slate-300">{{
          item.state ? "Activo" : "Inactivo"
        }}</span>
      </div>
    </template>

    <template #actions="{ item }">
      <div @click.stop>
        <RowActions
          :open="activeActionsId === item._id"
          @toggle="toggleActions(item._id)"
          @close="closeActions"
          :actions="rowActions(item)"
        />
      </div>
    </template>

    <template #drawer="{ item, close }">
      <AdminDetailContent :admin="item" @close="close" />
    </template>
  </EntityListLayout>

  <MyModal v-model:open="createModalOpen" size="lg" :closable="true">
    <AdminForm
      :on-submit="addAdmin"
      @success="onAdminCreated"
      @cancel="createModalOpen = false"
    />
  </MyModal>

  <MyModal v-model:open="editModalOpen" size="lg" :closable="true">
    <AdminEditForm
      v-if="adminToEdit"
      :admin="adminToEdit"
      :on-submit="updateAdmin"
      @success="onAdminUpdated"
      @cancel="editModalOpen = false"
    />
  </MyModal>

  <ConfirmModal
    :open="confirmOpen"
    :title="
      adminToToggle?.state
        ? 'Desactivar administrador'
        : 'Activar administrador'
    "
    :message="
      adminToToggle?.state
        ? `¿Seguro que deseas desactivar a ${adminToToggle?.name}? No podrá acceder al sistema.`
        : `¿Deseas activar a ${adminToToggle?.name}? Recuperará acceso al sistema.`
    "
    :confirm-label="adminToToggle?.state ? 'Desactivar' : 'Activar'"
    :variant="adminToToggle?.state ? 'danger' : 'success'"
    :loading="toggling"
    @confirm="handleToggleConfirm"
    @cancel="handleToggleCancel"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Admin } from "../user.interfaces";
import { getAvatarUrl } from "../../common/utils/avatar";
import { filterMap } from "../user.interfaces";

import RowActions from "../../common/components/ui/RowActions.vue";
import EntityListLayout from "../../common/tables/EntityListLayout.vue";
import MyModal from "../../common/components/modals/MyModal.vue";
import AdminForm from "./AdminForm.vue";
import AdminEditForm from "./AdminEditForm.vue";
import { useAdmins } from "../composable/useAdmins";
import AdminDetailContent from "./AdminDetailContent.vue";
import ConfirmModal from "./ConfirmModal.vue";

const layoutRef = ref<{ reset: () => void } | null>(null);

defineProps<{ admins: Admin[]; total: number; loading?: boolean }>();

const emit = defineEmits<{
  (e: "query-change", query: Record<string, any>): void;
}>();

const { addAdmin, editAdmin: updateAdmin, toggleState, toggling } = useAdmins();

const filters = [
  { label: "Nombre", value: "name" },
  { label: "Correo", value: "email" },
  { label: "Documento", value: "documentNumber" },
];

const columns = [
  { label: "Usuario", key: "user" },
  { label: "Documento", key: "documentNumber" },
  { label: "Cargo", key: "position" },
  { label: "Departamento", key: "department" },
  { label: "Edad", key: "age" },
  { label: "Estado", key: "state" },
  { label: "Actions", key: "actions" },
];

const activeActionsId = ref<string | null>(null);
const toggleActions = (id: string) => {
  activeActionsId.value = activeActionsId.value === id ? null : id;
};
const closeActions = () => {
  activeActionsId.value = null;
};

const rowActions = (admin: Admin) => [
  { label: "Editar", onClick: () => openEditAdmin(admin) },
  {
    label: admin.state ? "Desactivar" : "Activar",
    onClick: () => openToggleConfirm(admin),
  },
];

const calculateAge = (birthday: string): number => {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};
const adminAvatar = (admin: Admin) =>
  getAvatarUrl(admin.photo, admin.name, admin.lastName);

const createModalOpen = ref(false);
const openCreateAdmin = () => {
  createModalOpen.value = true;
};
const onAdminCreated = () => {
  createModalOpen.value = false;
  layoutRef.value?.reset();
};

const editModalOpen = ref(false);
const adminToEdit = ref<Admin | null>(null);
const openEditAdmin = (admin: Admin) => {
  adminToEdit.value = admin;
  editModalOpen.value = true;
};
const onAdminUpdated = () => {
  editModalOpen.value = false;
  adminToEdit.value = null;
  layoutRef.value?.reset();
};

const confirmOpen = ref(false);
const adminToToggle = ref<Admin | null>(null);

const openToggleConfirm = (admin: Admin) => {
  adminToToggle.value = admin;
  confirmOpen.value = true;
};

const handleToggleConfirm = async () => {
  if (!adminToToggle.value) return;
  await toggleState(adminToToggle.value._id);
  confirmOpen.value = false;
  adminToToggle.value = null;
  layoutRef.value?.reset();
};

const handleToggleCancel = () => {
  confirmOpen.value = false;
  adminToToggle.value = null;
};
</script>
