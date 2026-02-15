<template>
  <main>
    <RouterView />
    <MyAlert
      v-if="alert.visible"
      :visible="visible"
      :title="title"
      :message="message"
      :type="type"
      @close="alert.closeAlert"
    />
  </main>
</template>
<script setup lang="ts">
import { computed, watch } from "vue";
import { useAlert } from "./common/alerts/useMyAlert";
import MyAlert from "./common/alerts/MyAlert.vue";

const alert = useAlert();

const visible = computed(() => alert.visible.value);
const title = computed(() => alert.title.value);
const message = computed(() => alert.message.value);
const type = computed(() => alert.type.value);

watch(
  () => alert.visible.value,
  (val) => {
    if (val) {
      setTimeout(() => {
        alert.closeAlert();
      }, 1600);
    }
  }
);
</script>
<style scoped></style>
