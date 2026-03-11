<template>
  <main>
    <RouterView />
    <MyAlert :visible="visible" :title="title" :message="message" :type="type" @close="closeAlert" />
  </main>
</template>
<script setup lang="ts">
import { } from "vue";
import { useAlert } from "./common/alerts/useMyAlert";
import MyAlert from "./common/alerts/MyAlert.vue";

const { visible, title, message, type, closeAlert } = useAlert();

</script>
<style scoped></style>
