<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="flex w-full h-full justify-center items-center">
    <div class="login-container">
      <div class="login-content-section">
        <div class="max-w-[432px] pt-21.25">
          <img class="mb-6 mx-auto" src="/img/payflow-logo-light.svg" />
          <h1 class="title text-white mb-10">Execute payments with control and peace of mind.</h1>
          <ul
            class="[&_li]:mb-2 text-white [&_li]:last:mb-0 mb-22.5 list-image-[url(/img/list-icon.svg)]"
          >
            <li class="small-body">
              Generate standard intakes and route them to the right approval flow.
            </li>
            <li class="small-body">
              Payflows payment processes with real-time notifications and maintain a comprehensive
              audit trail.
            </li>
            <li class="small-body">
              Pay from any source, to any domestic or international recipient at competitive rates,
              without ever leaving Payflows.
            </li>
          </ul>
        </div>
        <div class="w-full">
          <img src="/img/login-content-bg.png" alt="" />
        </div>
      </div>
      <div class="w-1/2 flex justify-center items-center">
        <div class="w-full h-auto max-w-[432px] flex flex-col justify-start items-start">
          <img src="/img/login-Icon.svg" class="mb-6" alt="login icon" />
          <h2 class="title text-foreground mb-1">Login</h2>
          <p class="body text-secondary mb-6">
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
                <a href="#" class="small-body font-semibold text-primary"> Forgot password? </a>
              </div>
              <Input id="password" type="password" placeholder="" />
            </div>

            <Button class="w-full">Login</Button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
