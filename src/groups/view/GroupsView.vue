<template>
  <AppContainer>
    <!-- Encabezado de grupos con botón “add group +” -->
    <section class="mb-4 section-h">
      <div class="flex justify-end mb-2">
        <button
          @click="isAddGroupModalOpen = true"
          class="text-sm sm:text-base bg-blue-900 border border-blue-400 px-3 py-1 rounded-md text-gray-200 hover:bg-sky-600 transition whitespace-nowrap"
        >
          crear grupo +
        </button>
      </div>

      <!-- Toggle Groups -->
      <div
        class="cursor-pointer hover:bg-gray-800 px-2 py-2 rounded-md transition w-full mb-4"
        @click="showGroups = !showGroups"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span>👥</span>
            <h2 class="text-xl font-semibold">Grupos activos</h2>
          </div>
          <span class="text-xl text-gray-400">
            {{ showGroups ? "▾" : "▸" }}
          </span>
        </div>
        <div class="w-full border-t border-gray-600 mt-2"></div>
      </div>

      <transition name="fade">
        <div
          v-show="showGroups"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          <GroupCard
            v-for="(group, index) in activeGroups"
            :key="index"
            :id="group._id"
            :title="group.institutionName"
            :subject="group.subject"
            :code="group.referenceCode"
            border="sky"
            @click="clickInGroup(group)"
          />
        </div>
      </transition>
    </section>

    <!-- Archived -->
    <section class="mt-8">
      <div
        class="relative mb-2 cursor-pointer hover:bg-gray-800 px-2 py-2 rounded-md transition mb-4"
        @click="showArchived = !showArchived"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span>📂</span>
            <h2 class="text-xl font-semibold">Grupos archivados</h2>
          </div>
          <span class="text-xl text-gray-400">
            {{ showArchived ? "▾" : "▸" }}
          </span>
        </div>
        <div class="w-full border-t border-gray-600 mt-2"></div>
      </div>

      <transition name="fade">
        <div
          v-show="showArchived"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          <GroupCard
            v-for="(group, index) in archivedGroups"
            :key="index"
            :id="group._id"
            :title="group.institutionName"
            :subject="group.subject"
            :code="group.referenceCode"
            border="blue"
            @click="clickInGroup(group)"
          />
        </div>
      </transition>
    </section>

    <!-- Modal crear nuevo grupo -->
    <MyModal v-model:open="isAddGroupModalOpen" size="md" :closable="true">
      <div class="space-y-4">
        <h3 class="text-xl font-semibold text-center">Crear grupo</h3>
        <CreateGroup
          @submit="handleCreateGroup"
          @cancel="() => (isAddGroupModalOpen = false)"
        />
      </div>
    </MyModal>
  </AppContainer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import AppContainer from "../../common/layouts/AppContainer.vue";
import MyModal from "../../common/modals/MyModal.vue";
import CreateGroup from "../components/CreateGroup.vue";
import GroupCard from "../components/GroupCard.vue";
import { useGroups } from "../composables/useGroups";
import type { INewGroupPayload, IGroup } from "../interfaces/groups.interfaces";
import { useRouter } from "vue-router";
import { useGroupStore } from "../stores/groupStore";
import { useAlert } from "../../common/alerts/useMyAlert";

// router
const router = useRouter();

// group store
const groupStore = useGroupStore();
const activeGroups = computed(() => groupStore.activeGroups);
const archivedGroups = computed(() => groupStore.archivedGroups);

//alert

const { showAlert } = useAlert();

//composable
const { addNewGroup, loadGroupsFromDb } = useGroups(showAlert);

// component props
const showGroups = ref(true);
const showArchived = ref(false);
const isAddGroupModalOpen = ref(false);

onMounted(async () => {
  await loadGroupsFromDb();
});

// Cuando CreateGroup emite 'submit'
function handleCreateGroup(data: INewGroupPayload) {
  addNewGroup(data);
  isAddGroupModalOpen.value = false;
}

// redirect handler
const clickInGroup = (group: IGroup) => {
  groupStore.setGroup(group);
  router.push({ name: "GroupDetail", params: { id: group?._id } });
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.section-h {
  height: 400px;
  max-height: 500px;
}
</style>
