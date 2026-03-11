<template>
    <transition name="fade">
        <div v-if="isUserMenuOpen" :class="[
            'absolute bottom-full mb-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden transition-all duration-300',
            computedOpen ? 'left-2 w-60' : 'left-2 w-48',
        ]" style="z-index: 60">
            <a href="#" class="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>

                <span>Profile</span>
            </a>

            <div class="border-t border-gray-700 my-1"></div>

            <a href="#" @click.prevent="openLogoutModal"
                class="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 text-red-400 transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7" />
                </svg>

                <span>Cerrar sesión</span>
            </a>
        </div>
    </transition>

    <MyModal v-model:open="logoutModal" size="sm">
        <div class="text-center space-y-4">

            <h2 class="text-lg font-semibold">
                Confirm Logout
            </h2>

            <p class="text-gray-400 text-sm">
                Are you sure you want to close your session?
            </p>

            <div class="flex justify-center gap-3 mt-4">
                <button @click="logoutModal = false" class="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600">
                    Cancel
                </button>

                <button @click="handleLogout" class="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600">
                    Logout
                </button>
            </div>

        </div>
    </MyModal>

</template>

<script setup lang="ts">

import MyModal from "../../modals/MyModal.vue"
import { useLogout } from '../../../composables/useLogout';
import { ref } from "vue";

const props = defineProps({
    isUserMenuOpen: Boolean,
    computedOpen: Boolean,
});

const { logout } = useLogout()

const logoutModal = ref(false)

const openLogoutModal = () => {
    logoutModal.value = true
}

const handleLogout = async () => {
    await logout()
    logoutModal.value = false
}

</script>