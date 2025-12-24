<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import router, { PATHS } from '@/router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const handleLogout = () => {
  authStore.setUnauthenticated()
  router.push(PATHS.LOGIN)
}
</script>

<template>
  <div class="h-svh w-svw flex flex-col justify-center items-center">
    <h2 class="title-text mb-4">
      Wellcome! <span class="text-primary">{{ authStore.user?.name }}</span>
    </h2>

    <Button @click="handleLogout" variant="secondary" class=""> Signout </Button>
  </div>
</template>
