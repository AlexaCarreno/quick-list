// composables/useUserMenu.ts
import { ref, onMounted, onBeforeUnmount } from "vue";

export function useUserMenu() {
  const isOpen = ref(false);
  const menuRef = ref<HTMLElement | null>(null);
  const buttonRef = ref<HTMLElement | null>(null);

  function toggleMenu() {
    isOpen.value = !isOpen.value;
  }

  function closeMenu() {
    isOpen.value = false;
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node;
    if (!isOpen.value || !menuRef.value || !buttonRef.value) return;
    if (menuRef.value.contains(target) || buttonRef.value.contains(target))
      return;
    isOpen.value = false;
  }

  onMounted(() => document.addEventListener("mousedown", handleClickOutside));
  onBeforeUnmount(() =>
    document.removeEventListener("mousedown", handleClickOutside),
  );

  return { isOpen, toggleMenu, closeMenu, menuRef, buttonRef };
}
