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
                  Pelunasan
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
                    <button class="btn btn-white mr-3" v-html="ic('filter')" @click="triggerFilter"> </button>
                    <div class="btn-group">
                      <button class="btn btn-outline-primary" :disabled="isExcelRequest" v-on:click="exportExcel" v-html="isExcelRequest ? spin() : ic('download')+' Export Excel'"> </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>

          <Nodata v-if="!loading && data_laporan.data.length == 0"/> 

          <div class="box" v-if="!loading && data_laporan.data.length > 0">
              <div class="card">
                <div class="table-respon sive">

                  <table class="table table-vcenter table-hover card-table table-striped">

                    <thead>
                      <tr class="text-muted">
                        <th>No Invoice</th>
                        <th>Principal</th>
                        <th>Jatuh Tempo</th>
                        <th>Total</th>
                        <th>Jumlah Pembayaran</th>
                        <th>Sisa</th>
                        <th style="text-align: center;">Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in data_laporan.data" :key="i" :class="row.tanggal_jatuh_tempo > 0 ? 'text-danger' : 'text-dark'">
                        <td>
                          <span class="click-able" @click="detail_pelunasan(row)" :class="row.tanggal_jatuh_tempo > 0 ? 'text-danger' : 'text-dark'">
                            {{row.no_invoice == null ? '' : row.no_invoice}}
                          </span>
                        </td>
                        <td>
                          {{row.nama_principal}}
                        </td>
                        <td>
                          {{row.tanggal_jatuh_tempo}}
                        </td>
                        <td>
                          Rp {{row.total_pembelian | currency }}
                        </td>
                        <td>
                          Rp {{row.total_pembayaran | currency }}
                        </td>
                        <td>
                          Rp {{(row.total_pembelian-row.total_pembayaran) | currency }}
                        </td>
                        <td v-if="row.status_lunas=='lunas'"><span class="bg-success badge w-100">Lunas</span></td>
                        <td v-else><span class="bg-danger badge w-100">Belum Lunas</span></td>
                        <td class="p-0">
                          <b-dropdown variant="link" size="lg" dropleft no-caret>
                            <template slot="button-content"> <i class="fe fe-more-vertical"></i> </template>
                            <b-dropdown-item @click.native="detail_pelunasan(row)">Rincian</b-dropdown-item>
                          </b-dropdown>
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
              v-on:input="get_laporan"
              :per-page="data_filter.per_page" />
          <DetailPelunasan/>
          <FormFilter/>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import helper from "@/assets/js/helper.js";
import DetailPelunasan from "./modals/detail-pelunasan.vue";
import FormFilter from "./modals/filter.vue";
// import FormPelunasan from "./modals/form-pelunasan.vue";

export default {
  components: { DetailPelunasan, FormFilter },

  data() {
    return {
      isExcelRequest : false,
    }
  },

  mixins: [helper],  
  computed:{
    ...mapState(['loading']),
    ...mapState('pelunasan_pembelian', {
      data_detail : state => state.data_detail,
      data_filter : state => state.data_filter,
      detail_item : state => state.detail_item,
      data_laporan: state => state.data_laporan,
    }),
  },
  methods: {
    ...mapActions('pelunasan_pembelian', ['get_laporan','get_detail_pelunasan','triggerFilter']),
    search(keyword) {
      this.data_filter.keyword = keyword;
      this.get_laporan();
    },
    detail_pelunasan(data){
      this.data_detail.id_faktur_pembelian = data['id_faktur_pembelian'];
      this.get_detail_pelunasan(data['id_faktur_pembelian']);
      this.data_detail.data = [
        data['no_invoice'],
        data['nama_principal'],
        data['nama_perusahaan'],
        data['nama_depo'],
        data['tanggal_invoice'],
        data['tanggal_jatuh_tempo'],
        this.ribuan(data['total_pembelian'] | this.currency),
        this.ribuan(data['total_pembayaran'] | this.currency),
        this.ribuan((data['total_pembelian']-data['total_pembayaran']) | this.currency),
        data['status_lunas']
      ];
      this.data_detail.form = true;
    },
    exportExcel(){
      this.isExcelRequest = true;

      this.axios.get("pelunasan_pembelian/get/report_pelunasan_excel",{params: this.data_filter}).then(res => {
        window.open(res.data)
        this.isExcelRequest = false;
        this.isExport = false;

      }).catch( err => {
        this.loading = false
        this.onError(err)
      });
    },
  },

  mounted(){

  },

  created(){
    this.get_laporan();
  },  


};
</script>
