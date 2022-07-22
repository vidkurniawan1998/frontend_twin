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
                  <label class="form-label" for="perusahaan">Perusahaan</label>
                  <selectize
                      data-placeholder="Pilih Perusahaan"
                      id="perusahaan"
                      v-model="dataFilter.id_perusahaan"
                      :disabled="loading"
                      required
                      @input="_getDepo($event)"
                  >
                    <option :value="row.id" v-for="(row, i) in perusahaan" :key="i">
                      {{ row.nama_perusahaan }}
                    </option>
                  </selectize>
                </div>
              </div>

              <!--depo-->
              <div class="row">
                <div class="col-12 form-group">
                  <label class="form-label">Depo</label>
                  <selectize
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

              <!--salesman-->
              <div class="row">
                <div class="col-12 form-group">
                  <label for="salesman" class="form-label">Pilih Salesman</label>
                  <selectize
                      v-model="dataFilter.id_salesman"
                      data-placeholder="Pilih Salesman"
                      id="salesman"
                      :disabled="loading"
                      required>
                    <option value="all"> Semua Tim </option>
                    <option :value="d.id" v-for="(d, i) in salesman" :key="i"> {{d.nama_salesman}} ({{d.tim}}) </option>
                  </selectize>
                </div>
              </div>

              <!--tanggal-->
              <div class="row">
                <div class="col-6 form-group">
                  <label for="tanggal-awal" class="form-label">Mulai Tanggal</label>
                  <input type="date" class="form-control" id="tanggal-awal" required v-model="dataFilter.start_date" :max="dataFilter.end_date">
                </div>
                <div class="col-6 form-group">
                  <label for="tanggal-akhir" class="form-label">Sampai Tanggal</label>
                  <input type="date" class="form-control" id="tanggal-akhir" required v-model="dataFilter.end_date" :min="dataFilter.start_date">
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
              <button type="button" class="btn btn-primary" @click="submit" :disabled="loading" v-html="'OK'" />
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

      salesman: [], depos:[], perusahaan: [],
      
      dataFilter: {
        id_perusahaan: 'all',
        id_salesman: 'all',
        start_date: this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        depo:[]
      },
    };
  },

  computed: {
    ...mapState(['loading'])
  },

  methods: {
    ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
    ...mapActions('depo', ['getListDepo']),
    ...mapActions('salesman', ['getListSalesman']),
    close() {
      this.$emit("update:config", { view: false });
    },
    _getPerusahaan() {
      this.getListPerusahaanByAccess({}).then( res => {
        this.perusahaan = res
      })
    },
    _getDepo(id = null){
      this.getListDepo({filter: false, id_perusahaan: id}).then( res => {
        this.depos = res
      })
    },
    _getSalesman(){
      this.getListSalesman(
      {
        id_perusahaan: this.dataFilter.id_perusahaan,
        depo: this.dataFilter.depo
      }).then( res => {
        this.salesman = res
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
          if(this.perusahaan.length === 0) this._getPerusahaan()
          if(this.salesman.length === 0) this._getSalesman()
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
    this.$watch('dataFilter', function (value) {
      this._getSalesman();
    }, {deep:true})
  }
};
</script>

<style lang="scss" src="../retur_report.scss" scoped/>
