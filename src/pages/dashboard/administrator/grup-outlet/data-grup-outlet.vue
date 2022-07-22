<template>
  <div class="antialiased">
    <Sidebar/>

    <div class="page">
      <Header hint="Cari nama grup/toko" @change="getTokoLogistiks($event)"/>
      <div class="content">
        <div class="container">
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Data Grup Toko Logistik
                </h2>
              </div>
              <div class="col-auto">
                  <button
                      class="btn btn-primary"
                      @click="$router.push({name: 'Tambah Grup Toko'})"> Tambah
                  </button>
              </div>
            </div>
          </div>
          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"></Skeleton>
          <Nodata v-if="!loading && grup_toko_logistiks.data.length == 0"/>
          <div class="box" v-if="!loading && grup_toko_logistiks.data.length > 0">
            <div class="card">
              <div class="table-responsive">
                <table class="table table-vcenter table-hover card-table table-striped table-control">
                  <thead>
                    <tr class="text-muted">
                      <th>No</th>
                      <th>Nama Grup</th>
                      <th>Toko</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in grup_toko_logistiks.data" :key="i">
                      <td>{{ getTableNumber(i) }}</td>
                      <td>
                        {{ row.nama_grup }}
                      </td>
                      <td>
                        <span v-for="(toko, l) in row.toko" :key="l"
                              class="badge bg-blue-lt mr-2">
                          {{ toko.perusahaan }} - {{ toko.no_acc }} - {{ toko.nama_toko }}
                          <i class="la la-lg la-ban" style="cursor: pointer" @click="deleteTokoFromGrup(toko.id)"></i>
                        </span>
                      </td>
                      <td class="p-0 pos-relative">
                        <div class="btn-group option center">
                          <button
                              class="btn btn-white btn-pill"
                              @click="showForm('Edit Data', row)"
                              v-html="ic('edit')"/>
                          <button
                              @click="deleteGrupLogistik(row.id)"
                              class="btn btn-white btn-pill text-danger"
                              v-html="ic('trash')"/>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <b-pagination
              v-if="typeof grup_toko_logistiks.meta != 'undefined' && !loading && grup_toko_logistiks.data.length > 0"
              align="center"
              class="mt-5"
              :total-rows="grup_toko_logistiks.meta.total"
              v-model="page"
              :per-page="per_page" />
        </div>
      </div>
    </div>
    <FormNamaGrup/>
  </div>
</template>

<script>
import helper from "@/assets/js/helper";
import {mapActions, mapMutations, mapState} from "vuex";
import FormNamaGrup from './modals/Form';
export default {
  name: "data-grup-outlet.vue",
  mixins: [helper],
  components: {FormNamaGrup},
  data() {
    return {
      keyword: ''
    }
  },
  computed: {
    ...mapState(['loading']),
    ...mapState('grup_toko_logistik', {
      grup_toko_logistiks: state => state.grup_toko_logistiks,
      per_page: state => state.per_page
    }),
    page: {
      get() {
        return this.$store.state.grup_toko_logistik.page
      },
      set(val) {
        this.$store.commit('grup_toko_logistik/SET_PAGE', val)
      }
    },
    per_page: {
      get() {
        return this.$store.state.grup_toko_logistik.per_page
      },
      set(val) {
        this.$store.commit('grup_toko_logistik/SET_PER_PAGE', val)
      }
    }
  },
  methods: {
    ...mapActions('grup_toko_logistik', ['getTokoLogistiks', 'removeTokoFromGrup', 'removeGrupLogistik']),
    ...mapMutations('grup_toko_logistik', ['SET_FORM', 'SET_FORM_TITLE', 'CLEAR_FORM', 'SET_FORM_VALUE']),
    showForm(title, row) {
      this.CLEAR_FORM()
      this.SET_FORM(true)
      this.SET_FORM_TITLE(title)
      this.SET_FORM_VALUE(row)
    },
    getTableNumber(i) {
      if (this.per_page == 'all') {
        return i+1
      }

      return (this.grup_toko_logistiks.meta.current_page - 1) * this.per_page + i + 1
    },
    deleteTokoFromGrup(id) {
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
          this.removeTokoFromGrup(id)
        }
      })
    },
    deleteGrupLogistik(id) {
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
          this.removeGrupLogistik(id)
        }
      })
    }
  },
  created() {
    this.getTokoLogistiks()
  },
  watch: {
    page() {
      this.getTokoLogistiks(this.keyword)
    },
    per_page() {
      this.getTokoLogistiks(this.keyword)
    },
    keyword() {
      this.getTokoLogistiks(this.keyword)
    }
  }
}
</script>

<style scoped></style>