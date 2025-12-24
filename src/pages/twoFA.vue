<script setup lang="ts">
import { getNewOtpMock, verifyOtp } from '@/APi/Api'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import LoginLayout from '@/layouts/LoginLayout.vue'
import router, { PATHS } from '@/router'
import { useAuthStore } from '@/stores/authStore'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'vue-input-otp'
import { toast } from 'vue-sonner'

const otpMaxLength = ref(6)
const otp = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const authStore = useAuthStore()
const otpRemainingSeconds = ref(0)
let timerId: number | null = null

//wen OTP blocked keep on the page but logouted -> refresh to login
onBeforeMount(() => {
  if (authStore.isOTPLocked) {
    authStore.setUnauthenticated()
    router.push(PATHS.LOGIN)
  }
})

//like useEffect
const otpErrorMessage = computed(() => {
  const attemptsLeft = authStore.getOtpAtteptsRemaining

  if (authStore.isOTPLocked) {
    //max reached blocked
    return 'You have reached the maximum OTP attempts. Please try again after 30 minutes.'
  }

  if (attemptsLeft > 0) {
    return `Invalid code. ${attemptsLeft} attempts left.`
  }

  return errorMessage
})

//auto submit OTP
watch(otp, async (newOtp) => {
  if (newOtp.length === 6 && !isLoading.value && otpRemainingSeconds.value <= 0) {
    try {
      handleSubmitOTP()
    } catch (error) {
      console.error('OTP verification error==>', error)
    }
  }
})

const handleSubmitOTP = async () => {
  try {
    if (authStore.passCode && otp.value) {
      isLoading.value = true
      errorMessage.value = ''

      const res = await verifyOtp({ pass_code: authStore.passCode, code: otp.value })

      if (res?.success) {
        const { token, user } = res.data
        authStore.setAuthenticated(token, user)
        toast.success('OTP verified. Redirecting to dashboard')
        router.push(PATHS.DASHBOARD)
      } else {
        if (res.error.code == 'INVALID_2FA' && !authStore.isOTPLocked) {
          errorMessage.value = res?.error.message
          //attempt
          handleOTPAttempt()
        } else {
          errorMessage.value = res.error.message
        }
      }
      isLoading.value = false
    }
  } catch (error) {
    console.error('SignSubmit error ==>', error)
  }
}

const nextOtpTimeDiff = () => {
  if (!authStore.lastOtpAttemptTime) return 0
  if (authStore.isOTPLocked) return 0

  const nowTime = Date.now()
  const otpLef = (nowTime - (authStore.lastOtpAttemptTime || 0)) / 1000
  if (otpLef > 30) return 0
  return Math.round(30 - otpLef) // this 30 will be from store // env //feature Flag
}

function startCountdown(maxSeconds: number) {
  stopCountdown()

  otpRemainingSeconds.value = maxSeconds

  const tick = () => {
    if (otpRemainingSeconds.value <= 0) {
      stopCountdown()
      return
    }

    otpRemainingSeconds.value -= 1
    timerId = setTimeout(tick, 1000)
  }

  //it starts the timer 1st time
  timerId = setTimeout(tick, 1000)
}

const handleOTPAttempt = () => {
  authStore.handleOtp()
  const remaining = nextOtpTimeDiff()

  if (remaining > 0) {
    startCountdown(remaining)
  } else {
    stopCountdown()
  }
}

function stopCountdown() {
  if (timerId) {
    clearTimeout(timerId)
    timerId = null
  }
}

const handleNewOtpRequest = async () => {
  try {
    isLoading.value = true
    otp.value = ''
    await getNewOtpMock() //this is just for delay
    isLoading.value = false
  } catch (error) {
    console.error('getOTPError', error)
  }
}

const handleBacktoLogin = () => {
  authStore.setUnauthenticated()
  router.push(PATHS.LOGIN)
}

const isButtonDisabled = computed(
  () =>
    otpRemainingSeconds.value > 0 ||
    authStore.isOTPLocked ||
    otp.value.length < 6 ||
    isLoading.value,
)
</script>

<template>
  <LoginLayout>
    <template #contentSlot>
      <h1 class="title-text max-w-full px-4 lg:px-0 text-white mb-10">
        Spend your time analysing data, not gathering it.
      </h1>
      <ul
        class="text-white pl-6 mx-4 [&_li]:mb-2 [&_li]:last:mb-0 list-image-[url(/img/list-icon.svg)]"
      >
        <li class="body-text-small">
          Import, clean, and enrich data from all your accounts, payment providers and corporate
          card programs.
        </li>
        <li class="body-text-small">Always know what’s happening with a 360 view of your cash.</li>
        <li class="body-text-small">
          Customize your analytical axes and filters by any of them to share insights.
        </li>
        <li class="body-text-small">
          Make informed business decisions with beautiful and dynamic reports.
        </li>
      </ul>
    </template>
    <template #imageSlot>
      <img src="/img/2fa-bg.png" class="w-full h-full object-cover" alt="" />
    </template>

    <template #formSlot>
      <Button @click="handleBacktoLogin" type="button" variant="secondary" class="mb-8">
        <img src="/img/arrow-left.svg" alt="" />
        Back
      </Button>

      <img src="/img/Padlock.svg" alt="" class="max-w-full mb-6" />

      <h2 class="title-text mb-1">Two-factor authentication</h2>

      <p class="body-text text-light mb-6">
        Enter the code sent to 06******28 to confirm your identity.
      </p>

      <div class="w-full">
        <InputOTP
          v-model="otp"
          :maxlength="6"
          :pattern="REGEXP_ONLY_DIGITS_AND_CHARS"
          class="w-full flex justify-center gap-0 mb-1"
          :disabled="isLoading"
        >
          <InputOTPGroup
            v-for="n in otpMaxLength"
            :key="n"
            :class="n === 3 ? 'me-4 lg:me-8' : 'me-2 lg:me-4'"
          >
            <InputOTPSlot class="title-text-large p-4 h-12 lg:h-19 w-10 lg:w-14" :index="n - 1" />
          </InputOTPGroup>
        </InputOTP>

        <label v-show="errorMessage" class="text-error body-text-small">
          {{ otpErrorMessage }}
        </label>

        <Button
          @click="handleNewOtpRequest"
          variant="secondary"
          class="w-full mt-6"
          :class="!isButtonDisabled && 'text-foreground!'"
          :disabled="isButtonDisabled"
        >
          <img
            v-show="isLoading"
            :src="isButtonDisabled ? '/img/spinner.svg' : '/img/spinner-white.svg'"
            alt=""
            class="size-4 animate-spin"
          />
          Resend code {{ otpRemainingSeconds > 0 ? otpRemainingSeconds : '' }}</Button
        >
      </div>
    </template>
  </LoginLayout>
</template>

<style scoped></style>
