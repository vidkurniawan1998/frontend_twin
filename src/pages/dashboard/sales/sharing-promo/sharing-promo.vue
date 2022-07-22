<template>
  <div class="antialiased">
    <Sidebar/>

    <div class="page">

      <Header hint="Ketik nama promo"/>

      <div class="content">
        <div class="container">
          <div class="page-header">
              <div class="row d-flex justify-content-between">
                <div class="col-auto">
                  <h2 class="page-title">
                    Sharing Promo
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
                        <button class="btn btn-primary mr-3" @click="downloadExcel()" v-html="ic('download')+' Export Excel'"/>
                        <button class="btn btn-primary" @click="showForm('Tambah Data')"> Tambah </button>
                      </div>
                  </div>
                </div>
              </div>
          </div>
          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"/>
          <Nodata v-if="!loading && sharing_promos.data.length == 0"/>
          <div class="box" v-if="!loading && sharing_promos.data.length > 0">
            <div class="card">
              <div class="table-responsive">
                <table class="table table-vcenter table-hover card-table table-striped table-control">
                  <thead>
                    <tr class="text-muted">
                      <th rowspan="2" class="text-center v-center">No</th>
                      <th width="20%" rowspan="2" class="text-center v-center">Promo</th>
                      <th colspan="2" class="text-center">Disk. Persen</th>
                      <th colspan="2" class="text-center">Disk. Rupiah</th>
                      <th colspan="2" class="text-center">Barang Extra</th>
                    </tr>
                    <tr>
                      <th>Distributor</th>
                      <th>Principal</th>
                      <th>Distributor</th>
                      <th>Principal</th>
                      <th>Distributor</th>
                      <th>Principal</th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr v-for="(row, i) in sharing_promos.data">
                        <td>{{ getTableNumber(i) }}</td>
                        <td>{{ row.proposal != '' ? `${row.proposal} - `:'' }} {{ row.nama_promo }}</td>
                        <td>{{ row.persen_dist }}</td>
                        <td>{{ row.persen_principal }}</td>
                        <td>{{ row.nominal_dist }}</td>
                        <td>{{ row.nominal_principal }}</td>
                        <td>{{ row.extra_dist }}</td>
                        <td>{{ row.extra_principal }}</td>
                        <td class="p-0 pos-relative">
                          <div class="btn-group option center">
                            <button class="btn btn-white btn-pill" @click="showForm('Edit Data', row.id)" v-html="ic('edit')"/>
                            <button class="btn btn-white btn-pill text-danger" @click="deleteSharingPromo(row.id)" v-html="ic('trash')"/>
                          </div>
                        </td>
                      </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <b-pagination
              v-if="typeof sharing_promos.meta != 'undefined' && !loading && sharing_promos.data.length > 0"
              align="center"
              class="mt-5"
              :total-rows="sharing_promos.meta.total"
              v-model="page"
              :per-page="per_page" />
        </div>
      </div>
    </div>
    <FormSharingPromo/>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import FormSharingPromo from './modals/Form'
import helper from "@/assets/js/helper.js";
export default {
  name: "SharingPromo",
  components: { FormSharingPromo },
  mixins: [helper],
  data() {
      return {
        keyword: ''
      }
  },
  computed: {
    ...mapState(['loading']),
    ...mapState('sharing_promo', {
      sharing_promos : state => state.sharing_promos,
      per_page: state => state.per_page
    }),
    page: {
      get() {
        return this.$store.state.sharing_promo.page
      },
      set(val) {
        this.$store.commit('sharing_promo/SET_PAGE', val)
      }
    },
    per_page: {
      get() {
        return this.$store.state.sharing_promo.per_page
      },
      set(val) {
        this.$store.commit('sharing_promo/SET_PER_PAGE', val)
      }
    }
  },
  methods: {
    ...mapActions('sharing_promo', ['getSharingPromos', 'editSharingPromo', 'removeSharingPromo']),
    ...mapMutations('sharing_promo', ['SET_FORM', 'SET_FORM_TITLE', 'CLEAR_FORM']),
    showForm(val, edit = null) {
      this.CLEAR_FORM()
      this.SET_FORM(true)
      this.SET_FORM_TITLE(val)
      if (edit) {
        this.editSharingPromo(edit)
      }
    },
    getTableNumber(i) {
      if (this.per_page == 'all') {
        return i+1
      }

      return (this.sharing_promos.meta.current_page - 1) * this.per_page + i + 1
    },
    deleteSharingPromo(id) {
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
          this.removeSharingPromo(id)
        }
      })
    },
    downloadExcel()
    {
      let dataExcel = []
      let i = 1
      for (let dt of this.sharing_promos.data ) {
        let excel = {
          'No' : i++,
          'No Proposal' : dt.proposal,
          'Nama Promo' : dt.nama_promo,
          'Disk. Persen Distributor': dt.persen_dist,
          'Disk. Persen Principal': dt.persen_principal,
          'Disk. Nominal Distributor' : dt.nominal_dist,
          'Disk. Nominal Principal': dt.nominal_principal,
          'Barang Extra Distributor' : dt.extra_dist,
          'Barang Extra Principal' : dt.extra_principal
        }

        dataExcel.push(excel)
      }

      this.createExcel({data: dataExcel, filename: 'data-sharing-promo'}, true)
    }
  },
  created() {
    this.getSharingPromos();
  },
  watch: {
    page() {
      this.getSharingPromos(this.keyword)
    },
    per_page() {
      this.getSharingPromos(this.keyword)
    },
    keyword() {
      this.getSharingPromos(this.keyword)
    }
  }
}
</script>

<style scoped>
  .v-center {
    vertical-align: middle;
  }
</style>
