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
                <label class="form-label">Depo</label>
                <selectize v-model="dataFilter.depo" data-placeholder="Pilih Depo" :settings="selectizeConfig" required :disabled="loading">
                  <option :value="row.id" v-for="(row, i) in depos" :key="i">
                    {{row.nama_depo}}
                  </option>
                </selectize>
              </div>

              <div class="form-group">
                <label for="driver" class="form-label">Pilih Driver</label>
                <selectize id="driver" v-model="dataFilter.id_driver" data-placeholder="Pilih Driver" required>
                  <option value="all"> Semua Tim </option>
                  <option :value="d.id" v-for="(d, i) in driver" :key="i"> {{d.nama_driver}} [{{ d.kode_perusahaan }}] </option>
                </selectize>
              </div>

              <div class="row">
                <div class="col-6">
                  <div class="form-group">
                    <label for="tanggal-mulai" class="form-label">Mulai Tanggal</label>
                    <input id="tanggal-mulai" type="date" class="form-control" required v-model="dataFilter.start_date" :max="dataFilter.end_date">
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-group">
                    <label for="tanggal-sampai" class="form-label">Sampai Tanggal</label>
                    <input id="tanggal-sampai" type="date" class="form-control" required v-model="dataFilter.end_date" :min="dataFilter.start_date">
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="tipe-pembayaran" class="form-label">Tipe Pembayaran</label>
                <selectize id="tipe-pembayaran" v-model="dataFilter.tipe_pembayaran" data-placeholder="Tipe Pembaayaran">
                  <option value="all"> semua </option>
                  <option :value="d" v-for="(d, i) in ['cash','credit']" :key="i"> {{d}} </option>
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

      driver: [], depos:[],

      dataFilter: {
        status: 'delivered',
        id_driver: 'all',
        start_date: this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        tipe_pembayaran: 'all',
        depo:[]
      },

    };
  },

  computed: {
    ...mapState(['loading'])
  },

  methods: {
    ...mapActions('driver', ['getListDriver']),
    ...mapActions('depo', ['getListDepo']),
    close() {
      this.$emit("update:config", { view: false });
    },

    _getDepo(){
      this.getListDepo({filter: false}).then( res => {
        this.depos = res
      })
    },

    _getDriver(){
      this.getListDriver(this.dataFilter.depo).then( res => {
        this.driver = res
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
          if(this.driver.length === 0) this._getDriver()
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

  },
  mounted: function () {
    this.$watch('dataFilter.depo', function (value) {
      this._getDriver();
    }, {deep:true})
  }
};
</script>

<style lang="scss" src="../delivery_report.scss" scoped/>
