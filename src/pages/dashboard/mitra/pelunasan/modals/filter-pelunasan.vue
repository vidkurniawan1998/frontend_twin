<template xmlns="http://www.w3.org/1999/html">
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
            <button
                type="button"
                class="close"
                @click="close()"
                v-html="loading ? spin() : ic('close')"/>
          </div>

            <div class="modal-body pt-3">
              <!--perusahaan-->
              <div class="row">
                <div class="col-6 form-group">
                  <label class="form-label" for="perusahaan">Perusahaan</label>
                  <selectize
                      data-placeholder="Pilih Perusahaan"
                      id="perusahaan"
                      v-model="dataFilter.id_perusahaan"
                      :disabled="loading"
                      @input="_getDepo($event)"
                  >
                    <option :value="row.id" v-for="(row, i) in perusahaan" :key="i">
                      {{ row.nama_perusahaan }}
                    </option>
                  </selectize>
                </div>

                <div class="col-6 form-group">
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

              <div class="form-group">
                <label for="salesman" class="form-label">Salesman</label>
                <selectize
                    id="salesman"
                    v-model="dataFilter.id_salesman"
                    data-placeholder="Pilih Salesman"
                    :disabled="loading">
                  <option :value="'all'"> Semua Tim </option>
                  <option :value="d.id" v-for="(d, i) in salesman" :key="i"> {{d.nama_salesman}} ({{d.tim}}) </option>
                </selectize>
              </div>

              <div class="row">
                <div class="col-6 form-group">
                  <label for="tipe" class="form-label">Tipe</label>
                  <selectize id="tipe" v-model="dataFilter.tipe" data-placeholder="Pilih Tipe">
                    <option
                        :value="d" v-for="(d, i) in ['semua','tunai','bilyet_giro','transfer','saldo_retur','lainnya']"
                        :key="i"> {{d}}
                    </option>
                  </selectize>
                </div>

                <div class="col-6 form-group">
                  <label class="form-label">Status</label>
                  <selectize
                      v-model="dataFilter.status" data-placeholder="Pilih Status">
                    <option :value="d" v-for="(d, i) in ['semua','waiting','approved','rejected']" :key="i"> {{d}}</option>
                  </selectize>
                </div>
              </div>

              <!-- Mitra -->
              <div class="row">
                <div class="col-12 form-group">
                  <label for="mitra" class="form-label">Mitra</label>
                  <selectize
                      id="mitra"
                      v-model="dataFilter.id_mitra"
                      data-placeholder="Pilih mitra"
                      :disabled="loading"
                      required>
                    <option value="exclude">Exclude Mitra</option>
                    <option value="include">Include Mitra</option>
                    <option :value="d.id" v-for="(d, i) in mitra" :key="d.id"> {{d.kode_mitra}} - {{ d.perusahaan }}</option>
                  </selectize>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-6">
                  <label class="form-label">Tanggal Mulai</label>
                  <input type="date" class="form-control" v-model="dataFilter.start_date">
                </div>

                <div class="form-group col-6">
                  <label class="form-label">Tanggal Akhir</label>
                  <input type="date" class="form-control" v-model="dataFilter.end_date">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Tanggal Jatuh Tempo BG
                  <span class="form-label-description text-primary cursor-pointer"
                        @click="dataFilter.date_bg = ''">Reset Input</span>
                </label>
                <input type="date" class="form-control" v-model="dataFilter.date_bg">
              </div>

            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
              <button type="submit" class="btn btn-primary" @click="submit" v-html="'OK'" />
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
import Form from "@/pages/dashboard/master/salesman/modals/form-salesman";

export default {
  name: "Modal",
  components: {Form},
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

      salesman: [], depos: [], perusahaan: [], mitra: [],

      dataFilter: {
        id_perusahaan: '',
        id_salesman: 'all',
        tipe: '',
        status: '',
        start_date: this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        date_bg: '',
        depo: [],
        id_mitra: '1',
      },
    };
  },
  computed: {
    ...mapState(['loading'])
  },
  methods: {
    ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
    ...mapActions('depo', ['getListDepoByUser']),
    ...mapActions('salesman', ['getListSalesman']),
    ...mapActions('mitra', ['getListMitra']),
    close() {
      this.$emit("update:config", { view: false });
    },

    _getPerusahaan() {
      this.getListPerusahaanByAccess({}).then( res => {
        this.perusahaan = res
      })
    },
    _getSalesman(){
      this.getListSalesman({depo: this.dataFilter.depo}).then( res => {
        this.salesman = res
      })
    },
    _getDepo(){
      this.getListDepoByUser({id_perusahaan: this.dataFilter.id_perusahaan}).then( res => {
        this.depos = res
      })
    },
    _getMitra() {
      this.getListMitra().then( res => {
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
          if(this.perusahaan.length == 0) this._getPerusahaan()
          if(this.depos.length == 0) this._getDepo()
          if(this.salesman.length == 0) this._getSalesman()
          if(this.mitra.length == 0) this._getMitra()
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

<style lang="scss" src="../pelunasan.scss" scoped/>
