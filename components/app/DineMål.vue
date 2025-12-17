<template>
  <div class="flex p-10 text-white flex-row bg-[#002847] rounded-xl justify-between">
    <div>
      <h2>
<h2>
  DINE MÅL <br /> {{ year }}
</h2>
      </h2>
    </div>

    <span class="border-right"></span>

    <div>
      <h2>
        AFREGNET SALDO <br/>
        <span class="gold-text">{{ totalamount }} kr</span>
      </h2>
    </div>

    <span class="border-right"></span>

    <div>
      <h2>
        UDSTÅENDE TIDSREGISTREING <br/>
        <span class="gold-text">{{ udståendetids }} kr</span>
      </h2>
    </div>

    <span class="border-right"></span>

    <div>
      <h2>
        TOTAL POTIENALE <br/>
        <span class="gold-text">{{ totalPotienale }} kr</span>
      </h2>
    </div>
  </div>
</template>

<script setup>
defineProps({
  totalamount: Number,
  udståendetids: Number,
  totalPotienale: Number,
  year: Number
})
</script>

<style scoped>
.border-right {
  border-right: 1px solid #7d7d7d;
}
</style>
