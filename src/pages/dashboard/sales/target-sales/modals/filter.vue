<template>
  <div v-if="form">
    <div
        class="modal fade"
        :class="form ? 'show' : ''"
        style="display: block"
        tabindex="-1"
        role="dialog"
        aria-hidden="true"
        @click="dismiss ? $event.target.classList.contains('modal') ? SET_FORM_FILTER(false) : true : true"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Filter</h5>
            <button type="button" class="close" @click="SET_FORM_FILTER(false)" v-html="loading ? spin() : ic('close')"/>
          </div>
          <div class="modal-body pt-3">
            <div class="row">
              <div class="form-group col-12">
                <label for="perusahaan" class="form-label">Perusahaan</label>
                <selectize
                    id="perusahaan"
                    v-model="filter.id_perusahaan"
                    data-placeholder="Pilih Perusahaan"
                    required @input="_getDepo($event)"
                    :disabled="loading">
                  <option :value="d.id" v-for="(d, i) in perusahaan" :key="i"> {{d.nama_perusahaan}}</option>
                </selectize>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-12">
                <label for="depo" class="form-label">Nama Depo</label>
                <selectize
                    id="depo"
                    v-model="filter.id_depo"
                    @input="_getSalesman"
                    data-placeholder="Pilih Depo" required :disabled="loading" :settings="selectizeConfig">
                  <option :value="d.id" v-for="(d, i) in depos" :key="i"> {{d.nama_depo}}</option>
                </selectize>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-12">
                <label for="salesman" class="form-label">Nama Salesman</label>
                <selectize
                    :settings="selectizeConfig"
                    id="salesman"
                    v-model="filter.id_salesman"
                    data-placeholder="Pilih Salesman" required :disabled="loading">
                  <option :value="d.id" v-for="(d, i) in salesman" :key="i"> {{d.nama_salesman}} ({{d.tim}}) </option>
                </selectize>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-6">
                <label class="form-label" for="mulai-tanggal">Mulai Tanggal</label>
                <input type="date" id="mulai-tanggal" class="form-control" v-model="filter.mulai_tanggal">
              </div>
              <div class="form-group col-6">
                <label class="form-label" for="sampai-tanggal">Sampai Tanggal</label>
                <input type="date" id="sampai-tanggal" class="form-control" v-model="filter.sampai_tanggal">
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
                type="button"
                class="btn btn-white"
                @click="cancel"
                v-html="'Tutup'" />
            <button
                type="button"
                @click="applyFilter"
                :disabled="loading"
                class="btn btn-primary" v-html="'Ok'" />
          </div>

        </div>
      </div>
    </div>

    <div class="modal-backdrop fade" :class="form ? 'show' : ''" />
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import {mapActions, mapMutations, mapState} from "vuex";

export default {
  name: "Modal",
  mixins: [helper],

  data() {
    return {
      dismiss: {default: true},
      perusahaan: [],
      depos: [],
      salesman: [],
      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },
    };
  },
  computed: {
    ...mapState(['loading']),
    ...mapState('target_salesman', {
      form: state => state.form_filter,
      filter: state => state.filter
    })
  },
  methods: {
    ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
    ...mapActions('depo', ['getListDepo']),
    ...mapActions('salesman', ['getListSalesman']),
    ...mapActions('target_salesman', ['getTargetSalesman']),
    ...mapMutations('target_salesman', ['SET_FORM_FILTER']),
    _getPerusahaan() {
      this.getListPerusahaanByAccess({}).then( res => {
        this.perusahaan = res
      })
    },
    _getDepo() {
      this.getListDepo({id_perusahaan: this.filter.id_perusahaan, filter: false}).then( res => {
        this.depos = res
      })
    },
    _getSalesman() {
      this.getListSalesman({depo: this.filter.id_depo}).then( res => {
        this.salesman = res
      })
    },
    cancel() {
      this.SET_FORM_FILTER(false)
    },
    applyFilter() {
      this.SET_FORM_FILTER(false)
      this.getTargetSalesman(this.filter)
    }
  },
  watch: {
    form(newVal, oldVal) {
      if (newVal === true) {
        if (this.perusahaan.length === 0) this._getPerusahaan()
        if (this.depos.length === 0) this._getDepo()
        if (this.salesman.length === 0) this.getListSalesman()
      }
    }
  }
};
</script>
