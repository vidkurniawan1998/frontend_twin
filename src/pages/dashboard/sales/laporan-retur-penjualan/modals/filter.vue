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
                  <label class="form-label">Nama Depo</label>
                  <selectize
                      v-model="dataFilter.depo"
                      data-placeholder="Pilih Depo"
                      required :disabled="loading"
                      :settings="selectizeConfig">
                    <option :value="d.id" v-for="(d, i) in depos" :key="i"> {{d.nama_depo}}</option>
                  </selectize>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-12">
                  <label for="principal" class="form-label">Nama Principal</label>
                  <selectize
                      id="principal"
                      v-model="dataFilter.id_principal"
                      data-placeholder="Pilih Principal"
                      required
                      :disabled="loading"
                      :settings="selectizeConfig">
                    <option :value="d.id" v-for="(d, i) in principal" :key="i"> {{d.nama_principal}}</option>
                  </selectize>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-12">
                  <label class="form-label">Nama Salesman</label>
                  <selectize
                      v-model="dataFilter.id_salesman"
                      data-placeholder="Pilih Salesman"
                      required :disabled="loading">
                    <option :value="d.id" v-for="(d, i) in salesman" :key="i"> {{d.nama_salesman}} ({{d.tim}}) </option>
                  </selectize>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-6">
                  <label class="form-label">Kategori Barang</label>
                  <label class="form-check form-check-inline" v-for="(x, i) in ['all','bs','baik']" :key="i">
                    <input class="form-check-input" type="radio" name="kategori" :value="x" v-model="dataFilter.kategori">
                    <span class="form-check-label" v-html="x"/>
                  </label>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-12">
                  <label class="form-label">Status</label>
                  <label class="form-check form-check-inline" v-for="(d, i) in ['all','approved','claimed']" :key="i">
                    <input class="form-check-input" type="radio" name="status" :value="d" v-model="dataFilter.status">
                    <span class="form-check-label" v-html="d"/>
                  </label>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-6">
                  <label class="form-label">Mulai Tanggal</label>
                  <input type="date" class="form-control" required v-model="dataFilter.start_date" :max="dataFilter.end_date">
                </div>

                <div class="form-group col-md-6">
                  <label class="form-label">Sampai Tanggal</label>
                  <input type="date" class="form-control" required v-model="dataFilter.end_date" :max="dateTime('ymd')">
                </div>
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

      request: true,
      gudang: [], depos: [], salesman: [], perusahaan: [], principal: [],

      dataFilter: {
        id_perusahaan: '',
        id_salesman: 'all',
        kategori: 'all',
        status: 'approved',
        start_date: this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
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
    ...mapActions('principal', ['getListPrincipal']),
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

      this._getListPrincipal()
    },

    _getListPrincipal(){
      this.getListPrincipal({id_perusahaan: this.dataFilter.id_perusahaan}).then( res => {
        this.principal = res
      })
    },
    submit(){
      this.$emit("submit", this.dataFilter);
      this.close()
    }
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
          if(this.principal.length === 0) this._getListPrincipal()
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

