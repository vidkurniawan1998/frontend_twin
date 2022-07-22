<template>
  <div class="antialiased">
    <Sidebar/>

    <div class="page">
      <Header hint="Ketik nama perusahaan"/>
      <div class="content">
        <div class="container">
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Perusahaan
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
                            :key="i" v-html="num == 'all' ? 'Semua' : num"/>
                      </select>
                    </div>
                  </div>
                  <!--button & option-->
                  <div class="col-auto">
                    <button
                        class="btn btn-primary"
                        @click="showForm('Tambah Data')"> Tambah </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>
          <Nodata v-if="!loading && perusahaans.data.length == 0"/>
          <div class="box" v-if="!loading && perusahaans.data.length > 0">
            <div class="card">
              <div class="table-responsive">
                <table class="table table-vcenter table-hover card-table table-striped table-control">
                  <thead>
                    <tr class="text-muted">
                      <th>No</th>
                      <th>Kode Perusahaaan</th>
                      <th>Nama Perusahaan</th>
                      <th>NPWP</th>
                      <th>Nama Pkp</th>
                      <th>Alamat Pkp</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in perusahaans.data">
                      <td>{{ getTableNumber(i) }}</td>
                      <td>{{ row.kode_perusahaan }}</td>
                      <td>{{ row.nama_perusahaan }}</td>
                      <td>{{ row.npwp }}</td>
                      <td>{{ row.nama_pkp }}</td>
                      <td>{{ row.alamat_pkp }}</td>
                      <td class="p-0 pos-relative">
                        <div class="btn-group option center">
                          <button class="btn btn-white btn-pill" @click="showForm('Edit Data', row.id)" v-html="ic('edit')"/>
                          <button class="btn btn-white btn-pill text-danger" @click="deletePerusahaan(row.id)" v-html="ic('trash')"/>
                        </div>
                      </td>
                    <tr/>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <b-pagination
              v-if="typeof perusahaans.meta != 'undefined' && !loading && perusahaans.data.length > 0"
              align="center"
              class="mt-5"
              :total-rows="perusahaans.meta.total"
              v-model="page"
              :per-page="per_page" />
        </div>
      </div>
    </div>
    <FormPerusahaan/>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import FormPerusahaan from "./modals/Form";
import helper from "@/assets/js/helper.js";
export default {
  name: "perusahaan.vue",
  components: { FormPerusahaan },
  mixins: [helper],
  data() {
    return {
      keyword: ''
    }
  },
  computed: {
    ...mapState(['loading']),
    ...mapState('perusahaan', {
      perusahaans : state => state.perusahaans,
      per_page: state => state.per_page
    }),
    page: {
      get() {
        return this.$store.state.perusahaan.page
      },
      set(val) {
        this.$store.commit('perusahaan/SET_PAGE', val)
      }
    },
    per_page: {
      get() {
        return this.$store.state.perusahaan.per_page
      },
      set(val) {
        this.$store.commit('perusahaan/SET_PER_PAGE', val)
      }
    }
  },
  methods: {
    ...mapActions('perusahaan', ['getPerusahaans', 'editPerusahaan', 'removePerusahaan']),
    ...mapMutations('perusahaan', ['SET_FORM', 'SET_FORM_TITLE', 'CLEAR_FORM']),
    showForm(val, edit = null) {
      this.CLEAR_FORM()
      this.SET_FORM(true)
      this.SET_FORM_TITLE(val)
      if (edit) {
        this.editPerusahaan(edit)
      }
    },
    getTableNumber(i) {
      if (this.per_page == 'all') {
        return i+1
      }

      return (this.perusahaans.meta.current_page - 1) * this.per_page + i + 1
    },
    deletePerusahaan(id) {
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
          this.removePerusahaan(id)
        }
      })
    },
  },
  created() {
    this.getPerusahaans()
  },
  watch: {
    page() {
      this.getPerusahaans(this.keyword)
    },
    per_page() {
      this.getPerusahaans(this.keyword)
    },
    keyword() {
      this.getPerusahaans(this.keyword)
    }
  }
}
</script>

<style scoped>
  .v-center {
    vertical-align: middle;
  }
</style>
