<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import LoginLayout from '@/layouts/LoginLayout.vue'
import { ref } from 'vue'

const otpMaxLength = ref(6)
</script>

<template>
  <LoginLayout>
    <template #contentSlot>
      <h1 class="text-title max-w-full px-4 lg:px-0 text-white mb-10">
        Spend your time analysing data, not gathering it.
      </h1>
      <ul
        class="text-white mb-10 lg:mb-22.5 pl-6 mx-4 [&_li]:mb-2 [&_li]:last:mb-0 list-image-[url(/img/list-icon.svg)]"
      >
        <li class="text-small-body">
          Import, clean, and enrich data from all your accounts, payment providers and corporate
          card programs.
        </li>
        <li class="text-small-body">Always know what’s happening with a 360 view of your cash.</li>
        <li class="text-small-body">
          Customize your analytical axes and filters by any of them to share insights.
        </li>
        <li class="text-small-body">
          Make informed business decisions with beautiful and dynamic reports.
        </li>
      </ul>
    </template>
    <template #imageSlot>
      <img src="/img/2fa-bg.png" class="md:max-w-10/12" alt="" />
    </template>

    <template #formSlot>
      <Button variant="secondary" class="mb-8">
        <img src="/img/arrow-left.svg" alt="" />
        Back
      </Button>

      <img src="/img/Padlock.svg" alt="" class="max-w-full mb-6" />

      <h2 class="text-title mb-1">Two-factor authentication</h2>

      <p class="text-body text-light mb-6">
        Enter the code sent to 06******28 to confirm your identity.
      </p>

      <form class="w-full">
        <InputOTP :maxlength="6" class="w-full gap-0">
          <InputOTPGroup v-for="n in otpMaxLength" :key="n" :class="n === 3 ? 'me-8' : 'me-4'">
            <InputOTPSlot class="text-large-title p-4 h-19 w-14" :index="n - 1" />
          </InputOTPGroup>
        </InputOTP>

        <Button variant="secondary" class="w-full mt-6 text-foreground" disabled
          >Resend code</Button
        >
      </form>
    </template>
  </LoginLayout>
</template>

<style scoped></style>
