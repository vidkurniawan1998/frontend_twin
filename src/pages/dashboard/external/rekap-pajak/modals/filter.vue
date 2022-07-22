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

            <div class="form-group">
              <label for="nama-depo" class="form-label">Nama Depo</label>
              <selectize
                  id="nama-depo"
                  v-model="dataFilter.depo"
                  data-placeholder="Pilih Depo"
                  required
                  :disabled="loading"
                  :settings="selectizeConfig">
                <option :value="d.id" v-for="(d, i) in depos" :key="i"> {{d.nama_depo}}</option>
              </selectize>
            </div>

            <div class="form-group">
              <label for="mulai-tanggal" class="form-label">Mulai Tanggal</label>
              <input
                  id="mulai-tanggal"
                  type="date"
                  class="form-control"
                  required
                  v-model="dataFilter.start_date"
                  :max="dataFilter.end_date">
            </div>

            <div class="form-group">
              <label for="sampai-tanggal" class="form-label">Sampai Tanggal</label>
              <input
                  id="sampai-tanggal"
                  type="date"
                  class="form-control"
                  required
                  v-model="dataFilter.end_date"
                  :max="dateTime('ymd')">
            </div>

            <div class="form-group">
              <label for="mitra" class="form-label">Mitra</label>
              <selectize
                  :disabled="loading"
                  id="mitra"
                  v-model="dataFilter.id_mitra"
                  data-placeholder="Pilih mitra" required>
                <option :value="`exclude`">Exclude Mitra</option>
                <option :value="`include`">Include Mitra</option>
                <option :value="d.id" v-for="(d, i) in mitra" :key="d.id"> {{d.kode_mitra}} - {{ d.perusahaan }}</option>
              </selectize>
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

      depos: [], salesman: [], mitra: [],

      dataFilter: {
        depo: [],
        start_date: this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        id_mitra: 'exclude'
      },

    };
  },
  computed: {
    ...mapState(['loading'])
  },
  methods: {
    ...mapActions('mitra', ['getListMitra']),
    ...mapActions('depo', ['getListDepoByUser']),
    close() {
      this.$emit("update:config", { view: false });
    },
    _getDepo(){
      this.getListDepoByUser({}).then( res => {
        this.depos = res
      })
    },
    _getMitra(){
      this.getListMitra({}).then( res => {
        this.mitra = res
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
          if(this.mitra.length == 0) this._getMitra()
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
