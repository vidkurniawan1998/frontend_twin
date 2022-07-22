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
              <div class="col-12 form-group">
                <label for="depo" class="form-label">Nama Depo</label>
                <selectize
                    id="depo"
                    v-model="dataFilter.id_depo"
                    data-placeholder="Pilih Depo"
                    required
                    :disabled="loading">
                  <option :value="d.id" v-for="(d, i) in depos" :key="i">
                    {{d.nama_depo}} - {{ d.perusahaan.kode_perusahaan }}
                  </option>
                </selectize>
              </div>
            </div>

            <div class="row">
              <div class="col-12 form-group">
                <label for="principal" class="form-label">Pilih Principal</label>
                <selectize
                    id="principal"
                    v-model="dataFilter.id_principal"
                    data-placeholder="Pilih Principal"
                    required
                    :disabled="loading">
                  <option :value="d.id" v-for="(d, i) in principal" :key="i"> {{d.nama_principal}}</option>
                </selectize>
              </div>
            </div>

            <div class="row">
              <div class="col-6 form-group">
                <label for="start-date" class="form-label">Mulai Tanggal</label>
                <input id="start-date" type="date" class="form-control" required v-model="dataFilter.start_date" :max="dataFilter.end_date">
              </div>

              <div class="col-6 form-group">
                <label for="end-date" class="form-label">Sampai Tanggal</label>
                <input id="end-date" type="date" class="form-control" required v-model="dataFilter.end_date" :max="dateTime('ymd')">
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

      depos: [], principal: [],

      dataFilter: {
        id_principal: '',
        id_depo: [],
        start_date: this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
      },

    };
  },
  computed: {
    ...mapState(['loading'])
  },
  methods: {
    ...mapActions('principal', ['getListPrincipal']),
    ...mapActions('depo', ['getListDepo']),
    close() {
      this.$emit("update:config", { view: false });
    },

    _getDepo(){
      this.getListDepo({}).then( res => {
        this.depos = res
      })
    },

    _getPrincipal() {
      this.getListPrincipal({}).then( res => {
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
          if(this.depos.length == 0) this._getDepo()
          if(this.principal.length == 0) this._getPrincipal()
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },
    initData: function(data) { }
  }
};
</script>
