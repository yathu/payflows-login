<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import LoginLayout from '@/layouts/LoginLayout.vue'
import { ref } from 'vue'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'

import { FormField } from '@/components/ui/form'
import { signIn } from '@/APi/Api'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { PATHS } from '@/router'

const router = useRouter()
const authStore = useAuthStore()

const isPasswordVisible = ref(false)
const loading = ref(false)

const togglePassword = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

//in production will be in seprate file
const formSchema = toTypedSchema(
  z.object({
    email: z.string().min(2).max(50).email(),
    password: z.string().min(5).max(12),
  }),
)

const { handleSubmit, meta } = useForm({
  validationSchema: formSchema,
  initialValues: {
    email: '',
    password: '',
  },
})

const onSubmit = handleSubmit(async (data) => {
  console.log(data)
  loading.value = true
  const res = await signIn(data)

  if (res?.success) {
    authStore.setLoginOnlySuccess(res?.data?.pass_code)
    router.push(PATHS.TWOFA)
  } else {
    console.log(res)
  }
  loading.value = false
})
</script>

<template>
  <LoginLayout>
    <template #contentSlot>
      <h1 class="title-text max-w-full px-4 lg:px-0 text-white mb-10">
        Execute payments with control and peace of mind.
      </h1>
      <ul
        class="text-white mb-10 lg:mb-22.5 pl-6 mx-4 [&_li]:mb-2 [&_li]:last:mb-0 list-image-[url(/img/list-icon.svg)]"
      >
        <li class="body-text-small">
          Generate standard intakes and route them to the right approval flow.
        </li>
        <li class="body-text-small">
          Payflows payment processes with real-time notifications and maintain a comprehensive audit
          trail.
        </li>
        <li class="body-text-small">
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
      <h2 class="title-text text-foreground mb-1">Login</h2>
      <p class="body-text text-light mb-6">
        Don’t have an account? <a class="text-primary" href="#">Sign up</a>
      </p>

      <Alert class="bg-warning-100 py-2 px-3 border-0 mb-6">
        <AlertDescription class="body-text text-warning-700 flex gap-2">
          <img src="/img/info.svg" alt="info icon" class="" />

          This email and password pair doesn’t match any known account.
        </AlertDescription>
      </Alert>

      <form
        id="loginForm"
        @submit="onSubmit"
        class="w-full [&_label]:after:content-['*'] [&_label]:after:text-red-500 flex flex-col gap-6"
      >
        <FormField v-slot="{ field }" name="email">
          <div class="grid w-full items-center gap-1.5">
            <Label for="email">Email</Label>
            <Input v-bind="field" id="email" type="email" placeholder="Email" />
          </div>
        </FormField>

        <FormField v-slot="{ field }" name="password">
          <div class="grid w-full items-center gap-1.5">
            <div class="flex justify-between items-center">
              <Label for="password">Password</Label>
              <a href="#" class="body-text-small font-semibold text-primary"> Forgot password? </a>
            </div>
            <div class="relative">
              <Input
                v-bind="field"
                class=""
                id="password"
                :type="isPasswordVisible ? 'text' : 'password'"
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
        </FormField>

        <Button
          :variant="!meta.valid ? 'secondary' : 'default'"
          class="w-full"
          type="submit"
          form="loginForm"
          :disabled="!meta.valid || loading"
        >
          <img v-show="loading" src="/img/spinner-white.svg" alt="" class="size-4 animate-spin" />
          Login</Button
        >
      </form>
    </template>
  </LoginLayout>
</template>

<style scoped></style>
