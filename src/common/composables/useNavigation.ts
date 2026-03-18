import { computed } from "vue";
import { NAVIGATION_ITEMS } from "../config/navigation.config";
import { usePermissionStore } from "../stores/permissionsStore";

export function useNavigation() {
  const permissionStore = usePermissionStore();

  const menuItems = computed(() => {
    return NAVIGATION_ITEMS.filter((item) => {
      if (item.showInMenu === false) return false;
      if (item.roles && !permissionStore.hasAnyRole(item.roles)) return false;
      return permissionStore.can(item.resource, item.action);
    });
  });

  return {
    menuItems,
  };
}
