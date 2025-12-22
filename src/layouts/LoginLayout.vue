<template>
  <div class="flex w-full h-full justify-center items-center">
    <div class="login-container">
      <div class="md:w-1/2 login-content-section">
        <div class="w-full max-w-[432px] pt-10 lg:pt-21.25">
          <img class="mb-6 mx-auto" src="/img/payflow-logo-light.svg" />
          <slot name="contentSlot"></slot>
        </div>
        <div class="w-full">
          <slot name="imageSlot"></slot>
        </div>
      </div>
      <div class="md:w-1/2 px-4 lg:px-0 py-10 lg:py-0 flex justify-center items-center">
        <div class="w-full h-auto max-w-[432px] flex flex-col justify-start items-start">
          <slot name="formSlot"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
