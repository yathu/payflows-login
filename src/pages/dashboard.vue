<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import router, { PATHS } from '@/router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const handleLogout = ()=>{
  authStore.setUnauthenticated()
  router.push(PATHS.LOGIN);
}
</script>



<template>
  <div class="h-svh w-svw flex flex-col justify-center items-center">
    <h2 class="title-text">Wellcome! {{ authStore.user?.name }}</h2>

    <Button @click="handleLogout" variant="default" class=""> Signout </Button>
  </div>
</template>
