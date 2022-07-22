<template>
  <div class="antialiased">
    <Sidebar/>
    <div class="page">

      <Header hint="Ketik nama reference"/>

      <div class="content">
        <div class="container">
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Reference
                </h2>
              </div>
              <div class="col-auto">
                <!--filter button-->
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
          <Skeleton type="table" :length="10" class="mt-3 bg-white" v-if="loading"></Skeleton>
          <Nodata v-if="!loading && references.data.length == 0"/>
          <div class="box" v-if="!loading && references.data.length > 0">
            <div class="card">
              <div class="table-responsive">
                <table class="table table-vcenter table-hover card-table table-striped table-control">
                  <thead>
                    <tr class="text-muted">
                      <th class="v-center">No</th>
                      <th class="v-center">Kode Reference</th>
                      <th>Nilai Reference</th>
                      <th>Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in references.data">
                      <td>{{ getTableNumber(i) }}</td>
                      <td>{{ row.code }}</td>
                      <td>{{ row.value }}</td>
                      <td>{{ row.notes }}</td>
                      <td class="p-0 pos-relative">
                        <div class="btn-group option center">
                          <button class="btn btn-white btn-pill" @click="showForm('Edit Data', row.id)" v-html="ic('edit')"/>
                          <button class="btn btn-white btn-pill text-danger" @click="deleteReference(row.id)" v-html="ic('trash')"/>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FormReference/>
  </div>
</template>

<script>
import helper from "@/assets/js/helper";
import {mapActions, mapMutations, mapState} from "vuex";
import FormReference from './modals/Form'
export default {
  name: "reference",
  components: { FormReference },
  mixins: [helper],
  data() {
    return {
      keyword: ''
    }
  },
  computed: {
    ...mapState(['loading']),
    ...mapState('reference', {
      references : state => state.references,
      per_page: state => state.per_page
    }),
    page: {
      get() {
        return this.$store.state.reference.page
      },
      set(val) {
        this.$store.commit('reference/SET_PAGE', val)
      }
    },
    per_page: {
      get() {
        return this.$store.state.reference.per_page
      },
      set(val) {
        this.$store.commit('reference/SET_PER_PAGE', val)
      }
    }
  },
  methods: {
    ...mapActions('reference', ['getReferences', 'editReference', 'removeReference']),
    ...mapMutations('reference', ['SET_FORM', 'SET_FORM_TITLE', 'CLEAR_FORM']),
    showForm(val, edit = null) {
      this.CLEAR_FORM()
      this.SET_FORM(true)
      this.SET_FORM_TITLE(val)
      if (edit) {
        this.editReference(edit)
      }
    },
    getTableNumber(i) {
      if (this.per_page == 'all') {
        return i+1
      }

      return (this.references.meta.current_page - 1) * this.per_page + i + 1
    },
    deleteReference(id) {
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
          this.removeReference(id)
        }
      })
    },
  },
  created() {
    this.getReferences();
  },
  watch: {
    page() {
      this.getReferences(this.keyword)
    },
    per_page() {
      this.getReferences(this.keyword)
    },
    keyword() {
      this.getReferences(this.keyword)
    }
  }
}
</script>
