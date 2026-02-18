import { computed } from "vue";
import { usePermissionStore } from "../stores/permissionsStore";
import { NAVIGATION_ITEMS } from "../config/navigation.config";

export function useNavigation() {
  const permissionStore = usePermissionStore();

  const menuItems = computed(() => {
    return NAVIGATION_ITEMS.filter(
      (item) =>
        item.showInMenu !== false &&
        permissionStore.can(item.resource, item.action),
    );
  });

  return {
    menuItems,
  };
}
