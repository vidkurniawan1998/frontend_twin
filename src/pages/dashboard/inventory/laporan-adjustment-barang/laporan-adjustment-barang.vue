<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">
      
      <Header hint="Cari" v-on:change="search"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Laporan Adjustment Barang
                </h2>
              </div>

              <div class="col-auto">

                 <div class="row">
                  <!-- <div class="col-auto px-0">
                    <div class="input-icon">
                          <span class="input-icon-addon">
                            <i class="fe fe-align-left"></i>
                          </span>
                      <select
                          class="form-control"
                          v-model="data_filter.per_page"
                          :disabled="loading"
                          v-on:input="getLaporan()">
                        <option
                            :value="num"
                            v-for="(num, i) in [10,50,100,'all']"
                            :key="i" v-html="num === 'all' ? 'Semua' : num"/>
                      </select>
                    </div>
                  </div> -->
                  <div class="col-auto">
                    <button class="btn btn-white" v-html="ic('filter')+' Filter'" @click="data_filter.form=true; isFilter=true"> </button>
                  </div>
                </div>

              </div>
            </div>
          </div>


          <div class="alert alert-info" v-if="!loading && data_laporan.data.length == 0">
            <i class="fe fe-info mr-2"></i> Pilih filter untuk memuat data adjustment Barang
          </div>
          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>
          <Nodata v-if="!loading && data_laporan.data.length == 0 && isFilter"/> 

          <div class="text-center my-6" v-if="!loading && data_laporan.data.length > 0">
            <img :src="asset('doc.png')" alt="" style="width: 200px; opacity: .5" />
            <h3 class="my-3" v-html="data_laporan.data.length + ' Data'"></h3>

            <div class="btn-group">
              <button class="btn btn-outline-primary" @click="createPdf">Export PDF</button>
              <button
                class="btn btn-primary"
                @click="createExcel"
                :disabled="isExcelRequest"
                v-html="isExcelRequest ? spin() : ic('download') + ' Export Excel'"
              ></button>
            </div>
          </div>
        </div>
      </div>


    <FormFilter/> 
    </div>

  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import $axios from "@/api";
import helper from "@/assets/js/helper.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import FormFilter from "./modals/filter.vue";
export default {
  name: "LaporanAdjustmentBarang",
  components: { FormFilter },
  mixins: [helper],
  computed:{
    ...mapState(['loading']),
    ...mapState('adjustment_barang', {
      data_filter : state => state.data_filter,
      data_laporan : state=> state.data_laporan,
    }),
  },
  data(){
    return{
    	isExcelRequest : false,
      isFilter : false,
    }
  },

  methods:{
    ...mapActions('adjustment_barang', ['getLaporan']),
    search(keyword){
        this.data_filter.keyword = keyword
        this.getLaporan()
    },
    createExcel() {
      window.open(this.data_laporan.file, '_blank')
    },

    createPdf() {
      let doc = new jsPDF("p"),
      user = JSON.parse(localStorage.user);
      let styles = { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0 };

      // title
      doc.autoTable(this.pdfHeader(""));

      let header = [["No. Adjustment", "Gudang", "Kode", "Nama Barang", "Dus/Pcs"]],
        temp = [];

      let total = 0,
        total_pcs = 0;
      for (let i = 0; i < this.data_laporan.data.length; i++) {
        let data = this.data_laporan.data[i];
        temp.push(data.no_adjustment);
        temp.push(data.nama_gudang);
        temp.push(data.kode_barang);
        temp.push(data.nama_barang);
        temp.push(data.qty_adj + "/" + data.pcs_adj);

        header.push(temp);
        temp = [];

        total += parseInt(data.qty_adj);
        total_pcs += parseInt(data.pcs_adj);
      }

      temp.push("");
      temp.push("");
      temp.push("");
      temp.push("TOTAL");
      temp.push(total + "/" + total_pcs);
      header.push(temp);

      styles["cellPadding"] = 2;

      doc.autoTable({
        // body
        theme: "grid",
        styles: styles,
        margin: { top: 10, left: 10, right: 10 },
        body: header,
      });

      this.pdfDownload([doc.output()]);
    },

  
  },
  created(){
  	this.getLaporan();
  },
};
</script>
