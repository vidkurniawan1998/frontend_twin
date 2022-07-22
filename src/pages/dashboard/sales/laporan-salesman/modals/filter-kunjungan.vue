<template>
  <div v-if="backdrop">
    <div
        class="modal fade"
        :class="modal.open ? 'show' : ''"
        style="display: block"
        tabindex="-1"
        role="dialog"
        aria-hidden="true"
        @click="dismiss ? $event.target.classList.contains('modal') ? close() : true : true"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">{{config.title == null ? '&nbsp;' : config.title}}</h5>
            <button type="button" class="close" @click="close()" v-html="loading ? spin() : ic('close')"/>
          </div>

          <div class="modal-body pt-3">
            <div class="row">
              <div class="form-group col-md-12">
                <label for="perusahaan" class="form-label">Perusahaan</label>
                <selectize
                    id="perusahaan"
                    v-model="dataFilter.id_perusahaan"
                    data-placeholder="Pilih Perusahaan"
                    required @input="_getDepo($event)"
                    :disabled="loading">
                  <option :value="d.id" v-for="(d, i) in perusahaan" :key="i"> {{d.nama_perusahaan}}</option>
                </selectize>
              </div>
            </div>

            <div class="row">
              <div class="form-group col-md-12">
                <label for="depo" class="form-label">Nama Depo</label>
                <selectize
                    id="depo"
                    v-model="dataFilter.depo"
                    @input="_getSalesman"
                    data-placeholder="Pilih Depo" required :disabled="loading" :settings="selectizeConfig">
                  <option :value="d.id" v-for="(d, i) in depos" :key="i"> {{d.nama_depo}}</option>
                </selectize>
              </div>
            </div>

            <div class="row">
              <div class="form-group col-md-12">
                <label for="salesman" class="form-label">Nama Salesman</label>
                <selectize
                    id="salesman"
                    v-model="dataFilter.id_salesman"
                    data-placeholder="Pilih Salesman" required :disabled="loading">
                  <option :value="d.id" v-for="(d, i) in salesman" :key="i"> {{d.nama_salesman}} ({{d.tim}}) </option>
                </selectize>
              </div>
            </div>

            <div class="row">
              <div class="form-group col-md-6">
                <label for="tanggal-mulai" class="form-label">Mulai Tanggal</label>
                <input id="tanggal-mulai" type="date" class="form-control" required v-model="dataFilter.start_date" :max="dataFilter.end_date">
              </div>

              <div class="form-group col-md-6">
                <label for="tanggal-selesai" class="form-label">Sampai Tanggal</label>
                <input id="tanggal-selesai" type="date" class="form-control" required v-model="dataFilter.end_date" :max="dateTime('ymd')">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Status</label>
              <label class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="status" :value="`all`" v-model="dataFilter.status">
                <span class="form-check-label" v-html="`All`"/>
              </label>
              <label class="form-check form-check-inline" v-for="(d, i) in status" :key="i">
                <input class="form-check-input" type="radio" name="status" :value="d.value" v-model="dataFilter.status">
                <span class="form-check-label" v-html="d.text"/>
              </label>
            </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
            <button type="button" class="btn btn-primary" @click="submit" v-html="'OK'" />
          </div>

        </div>
      </div>
    </div>

    <div class="modal-backdrop fade" :class="modal.open ? 'show' : ''" />
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import {mapActions, mapState} from "vuex";

export default {
  name: "Modal",
  props: {
    config: {
      default: {
        view: false,
        title: "Modal Title"
      }
    },
    initData: null,
    isSubmit: {default: false},
    dismiss: {default: true}
  },

  mixins: [helper],

  data() {
    return {
      backdrop: false,
      modal: {
        open: false,
        formNav: 0
      },

      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },

      depos: [], salesman: [], perusahaan: [], principal:[],
      status: [],

      dataFilter: {
        id_perusahaan: '',
        id_salesman: 'all',
        start_date: this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        status: 'all',
        depo: []
      },
    };
  },

  computed: {
    ...mapState(['loading']),
  },

  methods: {
    ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
    ...mapActions('depo', ['getListDepo']),
    ...mapActions('salesman', ['getListSalesman']),
    ...mapActions('option', ['getOptionsByCode']),
    close() {
      this.$emit("update:config", { view: false });
    },

    _getListPerusahaan() {
      this.getListPerusahaanByAccess().then( res => {
        this.perusahaan = res
      })
    },

    _getSalesman(){
      this.getListSalesman({depo: this.dataFilter.depo}).then( res => {
        this.salesman = res
      })
    },

    _getDepo(id){
      this.getListDepo({id_perusahaan: id}).then( res => {
        this.depos = res
      })
    },

    _getOptionByCode() {
      this.getOptionsByCode('call')
      .then( res => {
        this.status = res
      })
    },

    submit(){
      this.$emit("submit", this.dataFilter);
      this.close()
    },
  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
          if(this.perusahaan.length === 0) this._getListPerusahaan()
          if(this.salesman.length === 0) this._getSalesman()
          if(this.depos.length === 0) this._getDepo()
          if(this.status.length === 0) this._getOptionByCode()
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    initData: function(data) { },

  },
  mounted: function () {
    this.$watch('dataFilter.depo', function (value) {
      this._getSalesman();
    }, {deep:true})
  }
};
</script>

