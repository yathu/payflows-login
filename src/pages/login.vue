<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ref } from 'vue'
import LoginLayout from '@/layouts/LoginLayout.vue'

const isPasswordVisible = ref(false)

const togglePassword = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>

<template>
  <LoginLayout>
    <template #contentSlot>
      <h1 class="text-title max-w-full px-4 lg:px-0 text-white mb-10">
        Execute payments with control and peace of mind.
      </h1>
      <ul
        class="text-white mb-10 lg:mb-22.5 pl-6 mx-4 [&_li]:mb-2 [&_li]:last:mb-0 list-image-[url(/img/list-icon.svg)]"
      >
        <li class="text-small-body">
          Generate standard intakes and route them to the right approval flow.
        </li>
        <li class="text-small-body">
          Payflows payment processes with real-time notifications and maintain a comprehensive audit
          trail.
        </li>
        <li class="text-small-body">
          Pay from any source, to any domestic or international recipient at competitive rates,
          without ever leaving Payflows.
        </li>
      </ul>
    </template>
    <template #imageSlot>
      <img src="/img/login-content-bg.png" class="md:max-w-10/12" alt="" />
    </template>

    <template #formSlot>
      <img src="/img/login-Icon.svg" class="mb-6" alt="login icon" />
      <h2 class="text-title text-foreground mb-1">Login</h2>
      <p class="text-body text-light mb-6">
        Don’t have an account? <a class="text-primary" href="#">Sign up</a>
      </p>
      <form
        class="w-full [&_label]:after:content-['*'] [&_label]:after:text-red-500 flex flex-col gap-6"
      >
        <div class="grid w-full items-center gap-1.5">
          <Label for="email">Email</Label>
          <Input id="email" type="email" placeholder="Email" />
        </div>
        <div class="grid w-full items-center gap-1.5">
          <div class="flex justify-between items-center">
            <Label for="password">Password</Label>
            <a href="#" class="text-small-body font-semibold text-primary"> Forgot password? </a>
          </div>
          <div class="relative">
            <Input
              class=""
              id="password"
              :type="isPasswordVisible ? 'text' : 'password'"
              placeholder=""
            />
            <Button
              type="button"
              variant="ghost"
              class="px-3 hover:bg-transparent absolute right-0 top-1/2 -translate-y-1/2"
              @click="togglePassword"
            >
              <img
                class="max-w-fit"
                :src="isPasswordVisible ? '/img/eye-off.svg' : '/img/eye-on.svg'"
                alt=""
              />
            </Button>
          </div>
        </div>
        <Button class="w-full">Login</Button>
      </form>
    </template>
  </LoginLayout>
</template>

<style scoped></style>
