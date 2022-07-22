<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">

      <Header @keyup="" id="keyword" hint="Ketik nama barang"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Laporan Suggest Order
                </h2> 
              </div>

              <!-- <div class="col-auto">
                <div class="text-muted text-h5 mt-2">Login Pada {{auth.logged_at}}</div>
              </div> -->

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">

                  </div>

                  <div class="col-auto">
                    <button class="btn btn-white" v-html="ic('filter')+' Filter'" @click="triggerFilter"> </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>
          <Nodata v-if="!loading && data_laporan.length == 0 && data_filter.request"/>
          <div class="alert alert-info" v-if="!data_filter.request && !loading && data_laporan.length == 0">
            <i class="fe fe-info mr-2"></i> Pilih filter untuk memuat suggest order
          </div>
          <div class="text-center my-6" v-if="!loading && data_laporan.length > 0">

            <img :src="asset('doc.png')" alt="" style="width: 200px; opacity: .5">
            <h3 class="my-3" v-html="data_laporan.length+' Data'"></h3>

            <div class="btn-group">
              <button class="btn btn-primary" @click="_createExcel">Export Excel</button>
            </div>

          </div>

        </div>
      </div>

    </div>

    <FormFilter/>

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import FormFilter from "./modals/filter.vue";
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: "LaporanSuggestStock",
  components: { FormFilter },

  data() {
    return {
      isFilter : false,
      data : []
    };
  },

  mixins: [helper],
  computed:{
    ...mapState(['loading']),
    ...mapState('suggest_order', {
      data_filter  : state => state.data_filter,
      data_laporan : state => state.data_laporan  
    }),
  },

  methods: {
      ...mapActions('suggest_order', ['triggerFilter','getLaporan']),
      _decimal(num){
        let str = Math.round(num * 100) / 100
        str = str || 0
        str = isFinite(str) ? str : 0
        return str.toString().replace('.',',').replace(' ','')
      },
      _getAfterWeek(i,savl,stt){
        return (parseFloat(savl)-(parseFloat(stt)*i))/(parseFloat(stt)*(i+1))
        //return this._decimal((parseFloat(savl)-(parseFloat(stt)*i)))+'/'+this._decimal((parseFloat(stt)*(i+1)))
      },
      _getSuggestOrder(i,savl,stt){
        let savl_new = (parseFloat(savl)-(parseFloat(stt)*i))
        let stt_new  = (parseFloat(stt)*(i+1))
        let res      = (10*stt_new)-savl_new
        return this._getAfterWeek(i,savl,stt)>0 ? 0 : (res)
      },
      _decimalExp(num){
        num = parseFloat(num)
        num = num || 0
        num = isFinite(num) ? num : 0
        return num
      },
      _numColumn(num){
        let s = '', t;
        while (num > 0) {
          t = (num - 1) % 26;
          s = String.fromCharCode(65 + t) + s;
          num = (num - t)/26 | 0;
        }
        return s || undefined;
      },
      _createExcel(){
        let dataExcel = []

        let buffer = this.data_filter.buffer > 0 ? parseFloat(this.data_filter.buffer) : 10
        let rule   = this.data_filter.rule > 0 ? parseFloat(this.data_filter.rule) : 5.5
        let tipe   = this.data_filter.tipe == '' ? 'Day' : this.data_filter.tipe
        let range  = parseFloat(this.data_filter.parameter_prediksi)

        buffer = tipe == 'Week' ? parseFloat(buffer/rule) : buffer 
        rule   = tipe == 'Week' ? parseFloat(rule/rule) : rule 

        for (let i = 0; i < this.data_laporan.length; i++) {
          let data = this.data_laporan[i]
          let pivot =i+2
          let res = {
              'Principal'        : data.nama_principal,
              'Brand'            : data.nama_brand,
              'Barang'           : data.nama_barang,
              'Harga'            : parseFloat(data.harga)
            }

            res['STT / '+tipe] = parseFloat(data.stt/rule)
            res['Stock avl']   = parseFloat(data.savl/rule),
            res['SC'+tipe[0]+'( Minggu : '+this.data_filter.minggu+' )']  = {f : '(F'+pivot+')/(E'+pivot+')'}  

            for (var k = 0; k < range; k++) {
              let sub = k+1
              let cell = '0'
              for (var m = 0; m < k; m++) {
                cell = cell+'+'+this._numColumn(8+range+k-1-(1*m))+pivot
              }
              res['SC'+tipe[0]+sub] = {f : '(F'+pivot+'-(E'+pivot+'*'+sub+')+'+cell+')/(E'+pivot+')'} 
            }
            for (var j = 0; j < range; j++) {
              let sub        = j+1
              let cell       = '0'
              let cell_param = this._numColumn(8+j)
              for (var m = 0; m < j; m++) {
                cell = cell+'+'+this._numColumn(8+range+j-1-(1*m))+pivot
              }
              res['SO'+tipe[0]+sub] = {f : 'IF('+cell_param+pivot+'<=0, (E'+pivot+'*('+parseFloat(sub+1)+'+'+buffer+'))-(F'+pivot+'+'+cell+'), 0)'}
            }
            for (var l = 0; l < range; l++) {
              let sub        = l+1
              let cell = this._numColumn(8+range+l)+pivot
              res['SO'+tipe[0]+sub+'_val'] = {f : 'D'+pivot+'*'+cell}
            }
            dataExcel.push(res)
        }
        this.createExcel({data: dataExcel, filename: 'lapora-suggest-order - '+this.data_filter.due_date})   
      }
  },

  mounted(){
    //this._get();
  },

};
</script>
<style type="text/css">
  table.floatThead-table {
    border-top: none;
    border-bottom: none;
    background-color: #fff;
  }
</style>
