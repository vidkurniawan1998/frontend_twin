<template>
  <div class="antialiased">
    <Sidebar/>
    <div class="page">

      <Header hint="Ketik code option" @change="_search"/>

      <div class="content">
        <div class="container">
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Select Option
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
          <Nodata v-if="!loading && options.data.length == 0"/>
          <div class="box" v-if="!loading && options.data.length > 0">
            <div class="card">
              <div class="table-responsive">
                <table class="table table-vcenter table-hover card-table table-striped table-control">
                  <thead>
                  <tr class="text-muted">
                    <th class="v-center">No</th>
                    <th class="v-center">Kode</th>
                    <th>Nilai</th>
                    <th>Teks</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(row, i) in options.data">
                    <td>{{ getTableNumber(i) }}</td>
                    <td>{{ row.code }}</td>
                    <td>{{ row.value }}</td>
                    <td>{{ row.text }}</td>
                    <td class="p-0 pos-relative">
                      <div class="btn-group option center">
                        <button class="btn btn-white btn-pill" @click="showForm('Edit Data', row.id)" v-html="ic('edit')"/>
                        <button class="btn btn-white btn-pill text-danger" @click="deleteOption(row.id)" v-html="ic('trash')"/>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <b-pagination
              v-if="typeof options.meta != 'undefined' && !loading && options.data.length > 0"
              align="center"
              class="mt-5"
              :total-rows="options.meta.total"
              v-model="page"
              :per-page="per_page" />
        </div>
      </div>
    </div>
    <FormOption/>
  </div>
</template>

<script>
import helper from "@/assets/js/helper";
import {mapActions, mapMutations, mapState} from "vuex";
import FormOption from './modals/Form'
export default {
  name: "select-option",
  components: { FormOption },
  mixins: [helper],
  data() {
    return {
      keyword: ''
    }
  },
  computed: {
    ...mapState(['loading']),
    ...mapState('option', {
      options : state => state.options,
      per_page: state => state.per_page
    }),
    page: {
      get() {
        return this.$store.state.option.page
      },
      set(val) {
        this.$store.commit('option/SET_PAGE', val)
      }
    },
    per_page: {
      get() {
        return this.$store.state.option.per_page
      },
      set(val) {
        this.$store.commit('option/SET_PER_PAGE', val)
      }
    }
  },
  methods: {
    ...mapActions('option', ['getOptions', 'editOption', 'removeOption']),
    ...mapMutations('option', ['SET_FORM', 'SET_FORM_TITLE', 'CLEAR_FORM']),
    showForm(val, edit = null) {
      this.CLEAR_FORM()
      this.SET_FORM(true)
      this.SET_FORM_TITLE(val)
      if (edit) {
        this.editOption(edit)
      }
    },
    getTableNumber(i) {
      if (this.per_page === 'all') {
        return i+1
      }

      return (this.options.meta.current_page - 1) * this.per_page + i + 1
    },
    deleteOption(id) {
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
          this.removeOption(id)
        }
      })
    },
    _search(keyword) {
      this.getOptions(keyword)
    }
  },
  created() {
    this.getOptions();
  },
  watch: {
    page() {
      this.getOptions(this.keyword)
    },
    per_page() {
      this.getOptions(this.keyword)
    }
  }
}
</script>
