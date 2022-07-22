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
        <div class="modal-content" style="height: 500px;">
          <div class="modal-header">
            <h5 class="modal-title">{{config.title == null ? '&nbsp;' : config.title}}</h5>
            <button type="button" class="close" @click="close()" v-html="loading ? spin() : ic('close')"/>
          </div>
          <div class="modal-body pt-3">
            <div class="row">
              <div class="form-group col-12">
                <label for="perusahaan" class="form-label">Perusahaan</label>
                <selectize
                    id="perusahaan"
                    v-model="dataFilter.perusahaan"
                    data-placeholder="Pilih Perusahaan"
                    :disabled="loading"
                    @input="_getDepo($event)">
                  <option :value="row.id" v-for="(row, i) in perusahaan" :key="i">
                    {{row.nama_perusahaan}}
                  </option>
                </selectize>
              </div>
            </div>

            <div class="row">
              <div class="col-12 form-group">
                <label for="depo" class="form-label">Depo</label>
                <selectize
                    id="depo"
                    v-model="dataFilter.depo"
                    data-placeholder="Pilih Depo"
                    :settings="selectizeConfig"
                    required
                    :disabled="loading">
                  <option :value="row.id" v-for="(row, i) in depos" :key="i">
                    {{row.nama_depo}}
                  </option>
                </selectize>
              </div>
            </div>

            <div class="form-group">
              <label for="principal" class="form-label">Principal</label>
              <selectize @input="_getBrand($event)" id="principal" v-model="dataFilter.id_principal" data-placeholder="Pilih Principal" :disabled="loading">
                <option :value="d.id" v-for="(d, i) in principal" :key="i"> {{ d.nama_principal }}</option>
              </selectize>
            </div>

            <div class="row">
              <div class="form-group">
                <label for="pilih-brand" class="form-label">Pilih Brand</label>
                <selectize id="pilih-brand" v-model="dataFilter.id_brand" data-placeholder="Pilih brand" :disabled="loading">
                  <option :value="d.id" v-for="(d, i) in brands" :key="i">
                    {{ d.nama_brand }}
                  </option>
                </selectize>
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
import helper from "@/assets/js/helper.js"
import {mapActions, mapState} from "vuex"
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

      perusahaan: [],depos:[],brands:[],principal:[],
      dataFilter: {
        perusahaan: 'all',
        id_principal : 'all',
        id_brand: 'all',
        depo: 'all'
      }
    }
  },

  computed: {
    ...mapState(['loading'])
  },

  methods: {
    ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
    ...mapActions('depo', ['getListDepo']),
    ...mapActions('brand', ['getListBrand']),
    ...mapActions('principal', ['getListPrincipal']),
    _getPerusahaan() {
      this.getListPerusahaanByAccess({}).then( res => {
        this.perusahaan = res
      })
    },

    _getListPrincipal(id){
      this.getListPrincipal({id_perusahaan: id}).then( res => {
        this.principal = res
      })
    },

    _getDepo(id = ''){
      this.getListDepo({filter: false, id_perusahaan: id}).then( res => {
        this.depos = []
        this.depos = res
        this._getListPrincipal(id)
      })
    },

    _getBrand(id_principal){
      console.log('2testing')
      this.getListBrand({filter: false, perPage: 'all', id_perusahaan: this.dataFilter.id_perusahaan, id_principal:id_principal}).then( res => {
        this.brands = res;
      })
    },

    close() {
      this.$emit("update:config", { view: false });
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
          if(this.perusahaan.length == 0) this._getPerusahaan()
          if(this.depos.length === 0) this._getDepo()
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    initData: function(data) { },
  }
}
</script>
