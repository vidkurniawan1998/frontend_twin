<template>
  <div class="antialiased">
    <Sidebar/>
    <div class="page">

      <Header @change="_search" hint="Ketik Nama Salesman"/>

      <div class="content">
        <div class="container">
          <!--header-->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Target Salesman
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
                    <button
                        class="btn btn-white"
                        v-html="ic('filter')"
                        @click="SET_FORM_FILTER(true)">
                    </button>
                    <div class="btn-group ml-3">
                      <button :disabled="loading" @click="download" class="btn btn-outline-primary" v-html="ic('download')+' Export Excel'" />
                      <button class="btn btn-primary" @click="$router.push({name: 'Tambah Target Salesman'})"> Tambah </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--box data-->
          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="request"/>
          <Nodata v-if="!request && target_salesman.data.length === 0"/>
          <div class="box" v-if="!request && target_salesman.data.length > 0">
            <div class="card">
              <div class="table-responsive">
                <table class="table card-table table-vcenter text-nowrap datatable">
                  <thead>
                  <tr>
                    <th>Comp</th>
                    <th>Depo</th>
                    <th>Salesman</th>
                    <th>Periode</th>
                    <th>Hari Kerja</th>
                    <th>Target</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(k, i) in target_salesman.data">
                    <td><span class="badge bg-blue-lt mr-2">{{k.kode_perusahaan}}</span></td>
                    <td><span class="badge bg-blue-lt mr-2">{{k.nama_depo}}</span></td>
                    <td>{{ k.tim }} - {{ k.nama_salesman }}</td>
                    <td>{{ k.periode }}</td>
                    <td>{{ k.hari_kerja }}</td>
                    <td>Rp {{ ribuan(k.target) }}</td>
                    <td>
                      <b-dropdown variant="link" size="lg" dropleft no-caret>
                        <template slot="button-content"> <i class="fe fe-more-vertical"></i></template>
                        <b-dropdown-item @click="editTargetSalesman(k.id)">Edit</b-dropdown-item>
                        <b-dropdown-item @click="deleteTargetSalesman(k.id)">Hapus</b-dropdown-item>
                      </b-dropdown>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <b-pagination
              v-if="typeof target_salesman.meta != 'undefined' && !loading && target_salesman.data.length > 0"
              align="center"
              class="mt-5"
              :total-rows="target_salesman.meta.total"
              v-model="page"
              :per-page="per_page" />
        </div>
      </div>
    </div>
    <FormFilter/>
    <FormUpdate/>
  </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import helper from "@/assets/js/helper";
import FormUpdate from "./modals/update";
import FormFilter from "./modals/filter";
export default {
  name: "kunjungan.vue",
  mixins: [helper],
  components: {FormUpdate, FormFilter},
  data() {
    return {
      keyword: '',
      filter: {
        config: { view: false, title: null },
        data: null, isSubmit: false,
        action: () => {}
      }
    }
  },
  computed: {
    ...mapState(['loading']),
    ...mapState('target_salesman', {
      target_salesman: state => state.target_salesman,
      per_page: state => state.per_page,
      request: state => state.request
    }),
    page: {
      get() {
        return this.$store.state.target_salesman.page
      },
      set(val) {
        this.$store.commit('target_salesman/SET_PAGE', val)
      }
    },
    per_page: {
      get() {
        return this.$store.state.target_salesman.per_page
      },
      set(val) {
        this.$store.commit('target_salesman/SET_PER_PAGE', val)
      }
    }
  },
  methods: {
    ...mapActions('target_salesman', ['getTargetSalesman', 'editTargetSalesman', 'removeTargetSalesman', 'downloadExcel']),
    ...mapMutations('target_salesman', ['SET_FORM_UPDATE', 'SET_FORM_FILTER']),
    deleteTargetSalesman(id) {
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
          this.removeTargetSalesman(id)
        }
      })
    },
    _search(keyword) {
      this.keyword = keyword
      this.getTargetSalesman({keyword: keyword})
    },
    download() {
      this.downloadExcel({}).then( res => {
        window.open(res, '_blank')
      })
    }
  },
  created() {
    this.getTargetSalesman({})
  },
  watch: {
    page() {
      this.getTargetSalesman({})
    },
    per_page() {
      this.getTargetSalesman({})
    }
  }
}
</script>

<style scoped>

</style>
