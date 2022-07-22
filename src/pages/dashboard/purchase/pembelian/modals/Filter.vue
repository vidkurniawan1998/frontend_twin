<template>
  <div v-if="form">
    <div class="modal fade"
         tabindex="-1"
         style="display: block"
         role="dialog" v-if="form"
         :class="form ? 'show' : ''"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ filter_title }}</h5>
            <button type="button" class="close" @click="form = false" v-html="ic('close')"/>
          </div>
          <form v-on:submit.prevent="saveData()">
            <div class="modal-body default">
              <div class="row">
                <div class="col-12 form-group">
                  <label class="form-label" for="perusahaan">Perusahaan</label>
                  <selectize
                      data-placeholder="Pilih Perusahaan"
                      id="perusahaan"
                      v-model="dataFilter.id_perusahaan"
                      :disabled="loading"
                      @input="_getPrincipal($event)"
                      :settings="selectizeConfig"
                  >
                    <option :value="row.id" v-for="(row, i) in perusahaan" :key="i">
                      {{ row.nama_perusahaan }}
                    </option>
                  </selectize>
                </div>
              </div>
              <div class="row">
                <div class="col-12 form-group">
                  <label for="principal" class="form-label">Nama Principal</label>
                  <selectize
                      id="principal"
                      v-model="dataFilter.id_principal"
                      data-placeholder="Pilih Principal"
                      :disabled="loading"
                      :settings="selectizeConfig">
                    <option :value="d.id" v-for="(d, i) in principal" :key="i"> {{d.nama_principal}}</option>
                  </selectize>
                </div>
              </div>
              <div class="row">
                <div class="col-12 form-group">
                  <label for="status" class="form-label">Pilih Status</label>
                  <selectize v-model="dataFilter.status" data-placeholder="Pilih Status" id="status">
                    <option :value="d.v" v-for="(d, i) in [{l: 'Semua', v: 'all'},{l: 'Belum Lunas', v: 'belum_lunas'},{l: 'Lunas', v: 'lunas'},{l: 'Over Due', v: 'over_due'}]" :key="i"> {{d.l}} </option>
                  </selectize>
                </div>
              </div>
              <div class="row">
                <div class="col-12 form-group">
                  <label for="tanggal" class="form-label">Tanggal</label>
                  <input type="date" class="form-control" required v-model="dataFilter.due_date" :max="dateTime('ymd')" id="tanggal">
                </div>
              </div>
            </div>
            <div class="modal-footer pt-2">
              <button
                  @click="form = false"
                  type="button"
                  class="btn btn-white"
                  v-html="'Tutup'" />
              <button
                  :disabled="loading"
                  type="submit"
                  class="btn btn-primary"
                  v-html="'Simpan'"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" :class="form ? 'show' : ''" />
  </div>
</template>

<script>
import helper from "@/assets/js/helper";
import {mapActions, mapState} from "vuex";

export default {
  name: "FormReference",
  mixins: [helper],
  props: ['keyword'],
  data() {
    return {
      perusahaan: [],
      principal: [],
      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },
    }
  },
  computed: {
    ...mapState(['errors', 'loading']),
    ...mapState('faktur_pembelian', {
      filter_title: state => state.filter_title,
      filter: state => state.filter,
      dataFilter: state => state.dataFilter
    }),
    form: {
      get() {
        return this.$store.state.faktur_pembelian.filter
      },
      set(val) {
        return this.$store.commit('faktur_pembelian/SET_FILTER', val)
      }
    }
  },
  methods: {
    ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
    ...mapActions('principal', ['getListPrincipal']),
    ...mapActions('faktur_pembelian', ['getFakturs']),
    saveData() {
      this.getFakturs(this.keyword)
    },
    _getPerusahaan() {
      this.getListPerusahaanByAccess({}).then( res => {
        this.perusahaan = res
      })
    },
    _getPrincipal(id) {
      this.getListPrincipal({id_perusahaan: id}).then( res => {
        this.principal = res
      })
    }
  },
  watch: {
    form: function () {
      if(this.perusahaan.length === 0) this._getPerusahaan()
    }
  }
}
</script>

<style scoped>

</style>