<template>
  <div class="antialiased">
    <Sidebar/>
    <div class="page">

      <Header @change="_search" hint="Ketik Nama Toko"/>

      <div class="content">
        <div class="container">
          <!--header-->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Laporan Salesman
                </h2>
              </div>

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">
                    <div class="input-icon">
                          <span class="input-icon-addon">
                            <i class="fe fe-align-left"></i>
                          </span>
                      <select
                          class="form-control"
                          v-model="per_page"
                          :disabled="loading">
                        <option
                            :value="num"
                            v-for="(num, i) in [10,50,100,'all']"
                            :key="i" v-html="num === 'all' ? 'Semua' : num"/>
                      </select>
                    </div>
                  </div>
                  <div class="col-auto">
                    <button class="btn btn-white" v-html="ic('filter')" @click="_filter"> </button>
                  </div>
                  <div class="col-auto">
                    <button class="btn btn-primary" @click="download()" :disabled="loading" v-html="ic('download')+' Export Excel'"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--box data-->
          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="request"/>
          <Nodata v-if="!request && kunjungan.data.length === 0"/>
          <div class="box" v-if="!request && kunjungan.data.length > 0">
            <div class="card">
              <div class="table-responsive">
                <table class="table card-table table-vcenter text-nowrap datatable">
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Salesman</th>
                      <th>Toko</th>
                      <th>Status</th>
                      <th>Posisi</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(k, i) in kunjungan.data">
                      <td>{{ k.tanggal }}</td>
                      <td>
                        <div class="flex-fill">
                          <div class="font-weight-medium">{{ k.salesman }}</div>
                          <div class="text-muted"><a href="#" class="text-reset">TIM: {{ k.tim }}</a></div>
                        </div>
                      </td>
                      <td>
                        <div class="flex-fill">
                          <div class="font-weight-medium">{{ k.no_acc }} - {{ k.nama_toko }}</div>
                          <div class="text-muted">
                            <a href="#" class="text-reset">{{ k.alamat }}</a>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                            class="badge me-1"
                            :class="{'bg-success': k.status === 'order', 'bg-danger': k.status === 'tidak order', 'bg-warning': k.status === 'tutup' }"
                            style="vertical-align: middle"
                        >
                        </span> {{ k.status }}
                      </td>
                      <td>
                        <a :href="`https://www.google.com/maps/search/?api=1&query=${k.latitude},${k.longitude}`">
                          Lat: {{ k.latitude }} <br> Lang: {{ k.longitude }}
                        </a>
                      </td>
                      <td>
                        <b-dropdown variant="link" size="lg" dropleft no-caret>
                          <template slot="button-content"> <i class="fe fe-more-vertical"></i></template>
                          <b-dropdown-item @click="deleteKunjunganSales(k.id)">Hapus</b-dropdown-item>
                        </b-dropdown>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <b-pagination
              v-if="typeof kunjungan.meta != 'undefined' && !loading && kunjungan.data.length > 0"
              align="center"
              class="mt-5"
              :total-rows="kunjungan.meta.total"
              v-model="page"
              :per-page="per_page" />
        </div>
      </div>
    </div>
    <FormFilter
        :config.sync="filter.config"
        :initData="filter.data"
        :dismiss.sync="filter.dismiss"
        :isSubmit.sync="filter.isSubmit"
        @submit="filter.action"
    />
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import helper from "@/assets/js/helper";
import FormFilter from "./modals/filter-kunjungan";
export default {
  name: "kunjungan.vue",
  mixins: [helper],
  components: {FormFilter},
  data() {
    return {
      keyword: '',
      filter: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      },
      dataFilter: {
        id_perusahaan: '',
        id_salesman: 'all',
        start_date: this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        status: 'all',
        depo: []
      },
    }
  },
  computed: {
    ...mapState(['loading']),
    ...mapState('kunjungan', {
      kunjungan: state => state.kunjungan,
      per_page: state => state.per_page,
      request: state => state.request
    }),
    page: {
      get() {
        return this.$store.state.kunjungan.page
      },
      set(val) {
        this.$store.commit('kunjungan/SET_PAGE', val)
      }
    },
    per_page: {
      get() {
        return this.$store.state.kunjungan.per_page
      },
      set(val) {
        this.$store.commit('kunjungan/SET_PER_PAGE', val)
      }
    }
  },
  methods: {
    ...mapActions('kunjungan', ['getKunjungan', 'removeKunjunganSales', 'downloadExcel']),
    ...mapActions('option', ['getOptionsByCode']),
    deleteKunjunganSales(id) {
      this.$swal({
        title: 'Kamu Yakin?',
        text: 'Tidakan ini akan menghapus data secara permanen!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Iya, Lanjutkan!'
      }).then( (result) => {
        if (result.value) {
          this.removeKunjunganSales(id)
        }
      })
    },
    _filter(){
      this.filter.config = {view: true, title: 'Filter'}
      this.filter.action = (formData) => {
        for (const key in formData) {
          this.dataFilter[key] = formData[key]
        }
        this.dataFilter.keyword = this.keyword
        this.getKunjungan(this.dataFilter)
      }
    },
    _search(keyword) {
      this.keyword = keyword
      this.getKunjungan({keyword: keyword})
    },
    download() {
      this.downloadExcel(this.dataFilter).then( res => {
        window.open(res, '_blank')
      })
    }
  },
  created() {
    this.getKunjungan({})
  },
  watch: {
    page() {
      this.getKunjungan({})
    },
    per_page() {
      this.getKunjungan({})
    }
  }
}
</script>

<style scoped>

</style>
