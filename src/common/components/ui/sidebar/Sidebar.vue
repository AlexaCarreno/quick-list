<template>
    <div>
        <aside :class="[
            'fixed top-0 left-0 h-full flex flex-col bg-[#1a1d26] text-gray-100 shadow-xl transition-all duration-300 ease-in-out',

            isMobile
                ? [
                    'w-64 z-40',
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
                ]
                : ['z-40 justify-between', isSidebarOpen ? 'w-64' : 'w-16'],
        ]">
            <SidebarHeader v-if="!isMobile" :headerName="headerName" :isSidebarOpen="isSidebarOpen"
                :computedOpen="computedOpen" @toggleSidebar="toggleSidebar" />

            <SidebarMenu :menuItems="menuItems" :computedOpen="computedOpen" :isMobile="isMobile"
                @menuClick="handleMenuClick" />

            <SidebarUser v-if="!isMobile" :name="name" :email="email" :avatar="avatar" :computedOpen="computedOpen" />
        </aside>

        <!-- overlay mobile -->
        <div v-if="isMobile && isMobileMenuOpen" class="fixed inset-0 bg-black/40 z-30" @click="toggleSidebar"></div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";


import SidebarHeader from "./SidebarHeader.vue";
import SidebarMenu from "./SidebarMenu.vue";
import SidebarUser from "./SidebarUser.vue";
import { useNavigation } from "../../../composables/useNavigation";

const { menuItems } = useNavigation();

const props = defineProps({
    headerName: { type: String, required: true },
    isSidebarOpen: { type: Boolean, default: true },
    isMobile: { type: Boolean, default: false },
    isMobileMenuOpen: { type: Boolean, default: false },
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String },
});

const emit = defineEmits([
    "update:isSidebarOpen",
    "update:isMobile",
    "update:isMobileMenuOpen",
]);

const isSidebarOpen = ref(props.isSidebarOpen);
const isMobileMenuOpen = ref(props.isMobileMenuOpen);
const isMobile = ref(props.isMobile);

watch(isSidebarOpen, (val) => emit("update:isSidebarOpen", val));
watch(isMobile, (val) => emit("update:isMobile", val));
watch(isMobileMenuOpen, (val) => emit("update:isMobileMenuOpen", val));

const handleResize = () => {
    const mobile = window.innerWidth < 768;
    isMobile.value = mobile;

    if (!mobile) {
        isMobileMenuOpen.value = false;
    }
};

onMounted(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", handleResize);
});

const computedOpen = computed(() => {
    return isMobile.value ? isMobileMenuOpen.value : isSidebarOpen.value;
});

const toggleSidebar = () => {
    if (isMobile.value) {
        isMobileMenuOpen.value = !isMobileMenuOpen.value;
    } else {
        isSidebarOpen.value = !isSidebarOpen.value;
    }
};

const handleMenuClick = () => {
    if (isMobile.value) {
        isMobileMenuOpen.value = false;
    }
};
</script>