<template>
  <div class="error-page">
    
      <div class="error-404 text-center">
        
        <div class="mb-4"> 
          <img :src="asset('404.png')" alt="" height="250" class="mb-5">

          <div class="my-2">
            <h1 class="text-muted my-4" style="line-height: 17px; letter-spacing: 3px">404 - NOT FOUND </h1>
            <div>Halaman yang Anda cari tidak ditemukan atau sudah dihapus, coba halaman lain. </div>
            <div class="m-0 text-muted">Butuh bantuan? Hubungi TIM IT Support.</div>
          </div>

        </div>
        <button @click="$router.go(-1)" class="btn btn-outline-primary btn-pill"> <i class="fe fe-chevron-left mr-2"></i> Kembali Ke Halaman Sebelumnya </button>
        <div class="my-3"> &copy; 2020 &bull; PT Jangkar Teknologi Indonesia </div>

        
      </div>
      
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
export default {
  name: '404', mixins: [helper]
};
</script>

<style src="./Error.scss" lang="scss" scoped />
