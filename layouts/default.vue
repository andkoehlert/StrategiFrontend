<template>
  <main class="relative min-h-screen bg-[#33536C]">
    <div class="min-h-screen w-full">
      <div class="mx-auto py-6 p-4 flex gap-6">
        
<!--         <AppMenusSidebar />
 -->        
        <div class="flex-1 bg-gradient-to-b from-[#004274] to-[#004274] p-4 rounded-xl">
          <slot />
        </div>

      </div>
    </div>
  </main>
</template>