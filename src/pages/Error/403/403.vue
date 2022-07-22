<template>
  <div class="error-page">
    
      <div class="error-404 text-center">
        
        <div class="mb-4"> 
          <img :src="asset('403.png')" alt="" height="250" class="mb-5">

          <div class="my-2">
            <h1 class="text-muted my-4" style="line-height: 17px; letter-spacing: 3px">403 - FORBIDDEN </h1>
            <div>Anda tidak memiliki akses untuk dapat melihat halaman ini </div>
            <div class="m-0 text-muted">Butuh bantuan? Hubungi TIM IT Support.</div>
          </div>

        </div>
        <button @click="$router.go(-2)" class="btn btn-outline-primary btn-pill"> <i class="fe fe-chevron-left mr-2"></i> Kembali Ke Halaman Sebelumnya </button>
        <div class="my-3"> &copy; 2020 &bull; PT Jangkar Teknologi Indonesia </div>

        
      </div>
      
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
export default {
  name: '403', mixins: [helper]
};
</script>

<style src="../Error.scss" lang="scss" scoped />
