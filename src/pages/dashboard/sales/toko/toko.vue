<template>
  <div class="antialiased">

    <Sidebar/>
    <div class="page">

      <Header @change="_search" hint="Ketik nama toko"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Toko
                </h2>
              </div>

              <!-- <div class="col-auto">
                <div class="text-muted text-h5 mt-2">Login Pada {{auth.logged_at}}</div>
              </div> -->

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">

                    <div class="input-icon">
                      <span class="input-icon-addon"> <i class="fe fe-align-left"></i> </span> 
                      <select class="form-control" v-model="data_filter.per_page" @change="_get()" :disabled="loading || isExcelRequest">
                        <option :value="num" v-for="(num, i) in [10,50,100,999]" :key="i" v-html="num == 999 ? 'Semua' : num"/>
                      </select>
                    </div>

                  </div>

                  <div class="col-auto btn-group">
                    <button class="btn btn-white" v-html="ic('filter')" @click="triggerFilter"  :disabled="loading || isExcelRequest"> </button>
                    <button class="btn btn-outline-primary ml-3" @click="_createExcel"  :disabled="loading || isExcelRequest" 
                    v-html="isExcelRequest || loading ? spin() : ic('download')+' Export Excel'"> </button>
                    <button class="btn btn-outline-primary" @click="_location" :disabled="loading || isExcelRequest"> <i class="fe fe-map mr-2"></i> Lokasi Toko </button>
                    <button class="btn btn-primary" @click="_add"  :disabled="loading || isExcelRequest"> Tambah Toko </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>

          <Nodata v-if="!loading && data_laporan.data.length == 0"/>

          <div class="box" v-if="!loading && data_laporan.data.length > 0">
              <div class="card">
                <div class="table-responsive">
                  <table class="table table-vcenter table-hover card-table table-striped table-control">
                    <thead>
                      <tr class="text-muted">
                        <th>Comp</th>
                        <th>No Acc</th>
                        <th>Cust No</th>
                        <th>Nama Toko</th>
                        <th>Alamat</th>
                        <th>Tipe</th>
                        <th>Tipe Harga</th>
                        <th>Kelurahan / Desa</th>
                        <th>Kecamatan</th>
                        <th>Tim</th>
                        <th>Depo</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in data_laporan.data" :key="i" >
                        <td><span class="badge bg-blue-lt mr-2">{{row.kode_perusahaan}}</span></td>
                        <td>{{row.no_acc}}</td>
                        <td>{{row.cust_no}}</td>
                        <td>{{row.nama_toko}}</td>
                        <td>{{row.alamat}}</td>
                        <td>{{row.tipe}}</td>
                        <td>{{row.tipe_harga}}</td>
                        <td>{{row.kelurahan}}</td>
                        <td>{{row.kecamatan}}</td>
                        <td>{{row.nama_tim}}</td>
                        <td>{{row.nama_depo}}</td>
                        <td class="p-0 pos-relative">
                          <div class="btn-group option center">
                            <button class="btn btn-white btn-pill" @click="_detail(row)" v-html="ic('eye')"/>
                            <button class="btn btn-white btn-pill" @click="_edit(row)" v-html="ic('edit')"/>
                            <button class="btn btn-white btn-pill" @click="_clone(row.id)" v-html="ic('copy')"/>
                            <button class="btn btn-white btn-pill text-danger" @click="_delete(row.id)" v-html="ic('trash')"/>
                          </div>
                        </td>
                      </tr>
                    </tbody>

                  </table>
                </div>
              </div>
          </div>

           <b-pagination
          v-if="!loading && data_laporan.data.length"
          align="center"
          class="mt-5"
          :total-rows="data_laporan.meta.total"
          v-model="data_filter.page"
          v-on:input="_get"
          :per-page="data_filter.per_page" />

        </div>
      </div>

    </div>

    <LokasiToko
      :config.sync="location.config"
      :initData="location.data" :dismiss.sync="location.dismiss"
      :isSubmit.sync="location.isSubmit"
      @submit="location.action"
    />

    <FormToko
      :config.sync="form.config"
      :initData="form.data" :dismiss.sync="form.dismiss"
      :isSubmit.sync="form.isSubmit"
      @submit="form.action"
    />

    <Confirm :id.sync="confirm.id" :title.sync="confirm.title" :isSubmit.sync="confirm.isSubmit" @submit="confirm.action"/>

    <DetailToko
      :config.sync="detail.config"
      :initData="detail.data" :dismiss.sync="detail.dismiss"
      :isSubmit.sync="detail.isSubmit"
      @submit="detail.action"
    />

    <FormFilter/>

  </div>


</template>

<script>
import helper from "@/assets/js/helper.js";
import LokasiToko from "./modals/lokasi-toko.vue";
import FormToko from "./modals/form-toko.vue";
import DetailToko from "./modals/detail-toko.vue";
import FormFilter from "./modals/filter.vue";
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: "Toko",
  components: { LokasiToko, FormToko, DetailToko, FormFilter },

  data() {
    return {
        auth: {},

        location: {
          config: { view: false, title: null },
          data: null, isSubmit: false,
          action: () => {}
        },

        form: {
          config: { view: false, title: null },
          data: null, isSubmit: false,
          action: () => {}
        },

        confirm: {
          id: null, title: null, isSubmit: false, action: () => {}
        },

        detail: {
          config: { view: false, title: null },
          data: null, isSubmit: false,
          action: () => {}
        },
        filter: {
          config: { view: false, title: null },
          data: null, isSubmit: false,
          action: () => {}
        },

        isExcelRequest : false,

    };
  },

  mixins: [helper],
  computed: {
    ...mapState(['loading']),
    ...mapState('toko', {
      data_filter  : state => state.data_filter,
      data_laporan : state => state.data_laporan,
    }),
  },
  methods: {
      ...mapActions('toko', ['triggerFilter','getLaporan']),
      _get(params){
        this.getLaporan();
      },

      _add(){
        this.form.config = {view: true, title: 'Tambah Toko'}
        this.form.data = null
        this.form.action = (formData) => {

          this.axios.post("toko", formData).then(res => {
            this._get({silent: true})
            this.toast('Berhasil ditambahkan');

            this.form.config.view = false;
          }).catch( err => {
            this.onError(err);
            this.form.isSubmit = false;
          });
        }
      },

      _edit(data){
        this.form.config = {view: true, title: 'Edit Toko'}
        this.form.data = data
        this.form.action = (formData) => {
          this.axios.put("toko/"+data.id, formData).then(() => {
            this._get({silent: true})
            this.toast('Berhasil diperbarui');
            this.form.config.view = false;
          }).catch( err => {
            this.onError(err);
            this.form.isSubmit = false;
          });
        }
      },

      _clone(id){
        this.axios.post('toko/duplicate/'+id).then((res) => {
          this._get({silent: true})
          this.toast(res.data.message);
        }).catch( err => {
          this.onError(err);
          this.confirm.isSubmit = false
        });
      },

      _delete(id){
        this.confirm.id = id
        this.confirm.title = 'Yakin ingin menghapus data toko ini?'
        this.confirm.action = () => {

          this.axios.delete('toko/'+id).then(() => {
            this._get({silent: true})
            this.toast('Berhasil dihapus');
            this.confirm.id = null
          }).catch( err => {
            this.onError(err);
            this.confirm.isSubmit = false
          });

        }
      },

      _detail(data){
        this.detail.config = {view: true, title: 'Detail Toko'}
        this.detail.data = data
      },

      _pageChange(page){
        this.paginate.currentPage = page;
        this._get();
      },

      _search(keyword){
        var io = this.data_filter.tipe_keyword.indexOf("Keyword");

        if(io>-1){
          this.data_filter.keyword.splice(io, 1)
          this.data_filter.tipe_keyword.splice(io, 1)
        }

        this.data_filter.keyword.push(keyword);
        this.data_filter.tipe_keyword.push("Keyword");
        this._get()
      },

      _location(){
        this.location.config = {view: true, title: 'Lokasi Toko'}
      },
      _createExcel(){
        let per_page_res = this.data_filter.per_page; 
        this.isExcelRequest=true;
        this.data_filter.per_page = 'all';
        this.axios.get('toko',{params: this.data_filter}).then(res => {
          this.isExcelRequest = false;
          let data_res = res.data.data;
          let dataExcel = []
          for (let i = 0; i < data_res.length; i++) {
            let data = data_res[i]
            let res = {
              'Depo'            : data.nama_depo,
              'Kode Toko'       : data.no_acc,
              'Cust No'         : data.cust_no,
              'Nama Toko'       : data.nama_toko,
              'Tipe'            : data.tipe,
              'Tipe Desc'       : data.tipe_2,
              'Harga'           : data.tipe_harga,
              'Pemilik'         : data.pemilik,
              'Kelurahan'       : data.kelurahan,
              'Kecamatan'       : data.kecamatan,
              'Kabupaten'       : data.kabupaten,
              'Alamat'          : data.alamat,
              'Kode Pos'        : data.kode_pos,
              'Telp'            : data.telepon,
              'Tipe Pembayaran' : data.k_t,
              'TOP'             : data.top,
              'Limit'           : data.limit,
              'NPWP'            : data.npwp,
              'Nama PKP'        : data.nama_pkp,
              'Alamat PKP'      : data.alamat_pkp,
              'No KTP'          : data.no_ktp,
              'Nama KTP'        : data.nama_ktp,
              'Alamat KTP'      : data.alamat_ktp,
              'Tim'             : data.nama_tim,
              'Hari Kunjungan'  : data.hari,
              'Minggu Kunjungan': data.minggu,
              'Lock Order'      : data.lock_order,
            }
            dataExcel.push(res)
          }
          this.data_filter.per_page=per_page_res;
          this.createExcel({data: dataExcel, filename: 'Toko - '+this.dTime('datetime')})   
        }).catch( err => {
          this.isExcelRequest = false;
          this.onError(err)
      });
    }
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    this._get()
  }

};
</script>
