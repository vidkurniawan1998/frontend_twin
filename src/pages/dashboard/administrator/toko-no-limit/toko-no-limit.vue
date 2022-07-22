<template>
  <div class="antialiased">
    <Sidebar/>

    <div class="page">

      <Header hint="Ketik nama toko"/>

      <div class="content">
        <div class="container">
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Whitelist Outlet
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
                    <button class="btn btn-primary" @click="showForm('Tambah Data')"> Tambah </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>
          <Nodata v-if="!loading && toko_no_limits.data.length == 0"/>
          <div class="box" v-if="!loading && toko_no_limits.data.length > 0">
            <div class="card">
              <div class="table-responsive">
                <table class="table table-vcenter table-hover card-table table-striped table-control">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Toko</th>
                      <th>Tipe</th>
                      <th>Depo</th>
                      <th>Dibuat</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(row, i) in toko_no_limits.data">
                    <td>{{ getTableNumber(i) }}</td>
                    <td>{{ row.no_acc }} - {{ row.nama_toko }}</td>
                    <td>{{ row.tipe.toUpperCase() }}</td>
                    <td>{{ row.depo }}</td>
                    <td>{{ row.created_at }}</td>
                    <td class="p-0 pos-relative">
                      <div class="btn-group option center">
                        <button class="btn btn-white btn-pill text-danger" @click="deleteTokoNoLimit(row.id)" v-html="ic('trash')"/>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <b-pagination
              v-if="typeof toko_no_limits.meta != 'undefined' && !loading && toko_no_limits.data.length > 0"
              align="center"
              class="mt-5"
              :total-rows="toko_no_limits.meta.total"
              v-model="page"
              :per-page="per_page" />
        </div>
      </div>
    </div>
    <FormTokoNoLimit/>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import FormTokoNoLimit from './modals/Form'
import helper from "@/assets/js/helper.js";
export default {
  name: "TokoNoLimit",
  components: { FormTokoNoLimit },
  mixins: [helper],
  data() {
    return {
      keyword: ''
    }
  },
  computed: {
    ...mapState(['loading']),
    ...mapState('toko_no_limit', {
      toko_no_limits : state => state.toko_no_limits,
      per_page: state => state.per_page
    }),
    page: {
      get() {
        return this.$store.state.toko_no_limit.page
      },
      set(val) {
        this.$store.commit('toko_no_limit/SET_PAGE', val)
      }
    },
    per_page: {
      get() {
        return this.$store.state.toko_no_limit.per_page
      },
      set(val) {
        this.$store.commit('toko_no_limit/SET_PER_PAGE', val)
      }
    }
  },
  methods: {
    ...mapActions('toko_no_limit', ['getTokoNoLimits', 'editTokoNoLimit', 'removeTokoNoLimit']),
    ...mapMutations('toko_no_limit', ['SET_FORM', 'SET_FORM_TITLE', 'CLEAR_FORM']),
    showForm(val, edit = null) {
      this.CLEAR_FORM()
      this.SET_FORM(true)
      this.SET_FORM_TITLE(val)
      if (edit) {
        this.editTokoNoLimit(edit)
      }
    },
    getTableNumber(i) {
      if (this.per_page == 'all') {
        return i+1
      }

      return (this.toko_no_limits.meta.current_page - 1) * this.per_page + i + 1
    },
    deleteTokoNoLimit(id) {
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
          this.removeTokoNoLimit(id)
        }
      })
    }
  },
  created() {
    this.getTokoNoLimits();
  },
  watch: {
    page() {
      this.getTokoNoLimits(this.keyword)
    },
    per_page() {
      this.getTokoNoLimits(this.keyword)
    },
    keyword() {
      this.getTokoNoLimits(this.keyword)
    }
  }
}
</script>

<style scoped>
.v-center {
  vertical-align: middle;
}
</style>
