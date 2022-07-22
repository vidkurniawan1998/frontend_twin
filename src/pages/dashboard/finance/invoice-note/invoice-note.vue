<template>
  <div class="antialiased">

    <Sidebar/>

    <div class="page">

      <Header hint="Cari pelunasan"  @change="search"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Invoice Note
                </h2>
              </div>

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">
                    <div class="input-icon">
                      <span class="input-icon-addon"> <i class="fe fe-align-left"></i> </span>
                      <select class="form-control" v-model="data_filter.per_page" @change="get_laporan()" :disabled="loading">
                        <option :value="num" v-for="(num, i) in [10,50,100,999]" :key="i" v-html="num === 999 ? 'Semua' : num"/>
                      </select>
                    </div>
                  </div>

                  <div class="col-auto">
                    <button class="btn btn-white mr-3" v-html="ic('filter')" @click="data_filter.form=true"> </button>
                    <div class="btn-group">            <!-- add button -->
                      <div class="btn-group ml-3">
                        <button class="btn btn-primary" @click="$router.push({name: 'Form Invoice Note'})"> Tambah </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>
          <Nodata v-if="!loading && data_laporan.data.length == 0"/> 
          <div class="box" v-if="!loading && data_laporan.data.length>0">
              <div class="card">
                <div class="table-respon sive">
                  <table class="table table-vcenter table-hover card-table table-striped">

                    <thead>
                      <tr class="text-muted">
                        <th>No</th>
                        <th>No Invoice</th>
                        <th>Cust No</th>
                        <th>Tanggal Req</th>
                        <th>Toko</th>
                        <th>Telp</th>
                        <th>Alamat</th>
                        <th>Keterangan</th>
                        <th>Alasan</th>
                        <th></th>
                        <th class="pos-relative">
                          <label class="form-check" style="position: absolute; top: 4px; right: 10px">
                            <input class="form-check-input" type="checkbox" :checked="data_laporan.data.length == data_form.id_active.length" @click="checkUncheck">
                            <span class="form-check-label"></span>
                          </label>
                        </th> 
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="(row, i) in data_laporan.data">
                        <tr @click="check(row.id)">
                          <td>{{ getTableNumber(i) }}</td>
                          <td>
                             <span :class="row.status == 'dikunjungi' ? 'text-blue' : 'text-red'">{{ row.no_invoice }}</span>
                          </td>
                          <td>{{ row.cust_no }}</td>
                          <td>{{ row.tanggal_req }}</td>
                          <td>{{ row.nama_toko }}</td>
                          <td>{{ row.telepon }}</td>
                          <td>{{ row.alamat }}</td>
                          <td>{{ row.keterangan }}</td>
                          <td>{{ row.keterangan_reschedule }}</td>
                          <td>
                            <b-dropdown variant="link" size="lg" dropleft no-caret>
                              <template slot="button-content"> <i class="fe fe-more-vertical"></i> </template>
                               <b-dropdown-item @click="$router.push({name: 'Form Invoice Note'}); data_form.id_active=[row.id]">Edit</b-dropdown-item>
                              <b-dropdown-item @click="deleteItem(row.id)">Hapus</b-dropdown-item>
                            </b-dropdown>
                          </td>
                          <td class="text-right pos-relative">
                            <label class="form-check"  @click="check(row.id)"" style="position: absolute; top: 50%; transform: translate(0, -50%); right: 10px">
                              <input class="form-check-input" type="checkbox" :value="row.id" v-model="data_form.id_active">
                              <span class="form-check-label"></span>
                            </label>
                          </td>
                        </tr>
                        <template v-if="showDetail(row.id)">
                          <tr v-for="(detail, j) in row.riwayat" class="bg-light fade-in-table">
                            <td></td>
                            <td>
                             <span :class="detail.status == 'dikunjungi' ? 'text-blue' : 'text-red'">{{ row.no_invoice }}</span>                            
                            </td>
                            <td>{{ row.cust_no }}</td>
                            <td>{{ detail.tanggal }}</td>
                            <td>{{ row.nama_toko }}</td>
                            <td>{{ row.telepon }}</td>
                            <td>{{ row.alamat }}</td>
                            <td>{{ detail.keterangan }}</td>
                            <td>{{ detail.keterangan_reschedule }}</td>
                            <td></td>
                            <td class="text-right pos-relative">
                              <label class="form-check" style="position: absolute; top: 50%; transform: translate(0, -50%); right: 10px">
                                <input class="form-check-input" type="checkbox" disabled>
                                <span class="form-check-label"></span>
                              </label>
                            </td>
                          </tr>
                        </template>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>
          </div>
          <div style="text-align: right;">
            <transition-group name="slide-fade-y">
              <button class="btn btn-secondary btn-fixed btn-pill-left" v-on:click="$router.push({name: 'Form Invoice Note'});" :key="1" v-if="data_form.id_active.length > 0" :disabled="loading"> <i class="la la-lg la la-edit mr-1"></i> Reschedule
              </button>
              <button class="btn btn-primary btn-fixed btn-pill-right" v-on:click="setKunjungan" :key="2" v-if="data_form.id_active.length > 0" :disabled="loading"> <i class="la la-lg la la-automobile mr-1"></i> Dikunjungi
              </button>
            </transition-group>
          </div>
          <b-pagination
              v-if="!loading && data_laporan.data.length"
              align="center"
              class="mt-5"
              :total-rows="data_laporan.meta.total"
              v-model="data_filter.page"
              v-on:input="get_laporan"
              :per-page="data_filter.per_page" />
          <Confirm :id.sync="confirm.id" :title.sync="confirm.title" :isSubmit.sync="confirm.isSubmit" @submit="confirm.action"/>
          <FormFilter/>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import helper from "@/assets/js/helper.js";
import FormFilter from "./modals/filter.vue";

export default {
  components: { FormFilter},
  data() {
    return {
      confirm: {
        id: null, title: null, isSubmit: false, action: () => {}
      },
    }
  },

  mixins: [helper],  
  computed:{
    ...mapState(['loading']),
    ...mapState('invoice_note', {
      data_form      : state => state.data_form,
      data_filter    : state => state.data_filter,
      data_laporan   : state => state.data_laporan,
    }),
  },
  methods: {
    ...mapActions('invoice_note', ['get_laporan']),
    search(keyword) {
       this.data_filter.keyword = keyword;
       this.get_laporan();
    },
    getTableNumber(i) {
      if (this.data_filter.per_page === 'all') {
        return i+1
      }

      return (this.data_laporan.meta.current_page - 1) * this.data_filter.per_page + i + 1
    },
    deleteItem(id){
      this.confirm.id = id
      this.confirm.title = 'Yakin ingin menghapus note ini?'
      this.confirm.action = () => {

        this.axios.delete('invoice_note/'+id).then(() => {
          this.toast('Berhasil dihapus');
          this.confirm.id = null
          this.get_laporan();
        }).catch( err => {
          this.onError(err);
        });
      }
    },
    checkUncheck(){
      if(this.data_form.id_active.length != this.data_laporan.data.length){
        this.data_form.id_active = []

        for (let i = 0; i < this.data_laporan.data.length; i++) {
          let item = this.data_laporan.data[i]
          this.data_form.id_active.push(item.id)
        }
      }else{
        this.data_form.id_active = []
      }
    },
    check(id){
      let io = this.data_form.id_active.indexOf(id)

      if(this.data_form.id_active.indexOf(id) > -1){
        this.data_form.id_active.splice(io, 1)
      }else{
        this.data_form.id_active.push(id)
      }
    },
    setKunjungan(){
      let payload = this.data_form.id_active;
      let url = '/invoice_note/kunjungan';
      this.axios.put(url, payload).then(res => {
        this.toast('Status Telah Diubah');
        this.get_laporan();
        this.data_form.id_active = [];
      }).catch( err => {
        this.onError(err);
      });
    },
    showDetail(id){
      let exists = this.data_form.id_active.find(x => x === id);
      if(exists){
        return true;
      }
      return false;
    },
  },

  mounted(){

  },

  created(){
    this.data_filter.status='belum_dikunjungi';
    this.get_laporan();
  },  


};
</script>
<style type="text/css" scoped>
  .btn-pill-left{
    border-top-left-radius: 20px 20px; 
    border-bottom-left-radius: 20px 20px; 
    border-top-right-radius: 0px 0px; 
    border-bottom-right-radius: 0px 0px;
  }
  .btn-pill-right{
    border-top-left-radius: 0px 0px; 
    border-bottom-left-radius: 0px 0px; 
    border-top-right-radius: 20px 20px; 
    border-bottom-right-radius: 20px 20px;
  }
  .fade-in-table {
  animation: fadeIn 1s;
    -webkit-animation: fadeIn 1s;
    -moz-animation: fadeIn 1s;
    -o-animation: fadeIn 1s;
    -ms-animation: fadeIn 1s;
  }
  @keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }

  @-moz-keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }

  @-webkit-keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }

  @-o-keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }

  @-ms-keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }
</style>