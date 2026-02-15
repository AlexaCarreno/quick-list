import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { IGroup, INewGroupPayload } from "../interfaces/groups.interfaces";

export const useGroupStore = defineStore(
  "group",
  () => {
    const groups = ref<IGroup[]>([]);

    const group = ref<IGroup | null>(null);

    const setGroup = (newGroup: IGroup) => {
      group.value = newGroup;
    };

    const clearGroup = () => {
      group.value = null;
    };

    const setGroups = (dbGroups: IGroup[]) => {
      groups.value = dbGroups;
    };

    const addNewGroup = (group: INewGroupPayload) => {
      const newGroup: IGroup = {
        ...group,
        _id: crypto.randomUUID(),
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      groups.value.push(newGroup);
    };

    const activeGroups = computed(() =>
      groups.value.filter((group) => group.status === "active")
    );
    const archivedGroups = computed(() =>
      groups.value.filter((group) => group.status === "archived")
    );

    const updateGroup = (id: string, payload: INewGroupPayload) => {
      const idx = groups.value.findIndex((g) => g._id === id);

      if (idx !== -1) {
        groups.value[idx] = {
          ...groups.value[idx],
          ...payload,
          updatedAt: new Date(),
        };
      }
    };

    const setStatusGroup = (id: string, status: "active" | "archived") => {
      const idx = groups.value.findIndex((g) => g._id === id);
      if (idx !== -1) {
        groups.value[idx].status = status;
      }
    };

    return {
      //properties
      group,
      groups,

      //methods
      setGroups,
      activeGroups,
      archivedGroups,
      addNewGroup,
      updateGroup,
      setGroup,
      clearGroup,
      setStatusGroup,
    };
  },
  {
    persist: true,
  }
);
