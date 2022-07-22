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
            <h5 class="modal-title">{{config.title === null ? '&nbsp;' : config.title}}</h5>
            <button type="button" class="close" @click="close()" v-html="loading ? spin() : ic('close')"/>
          </div>

            <div class="modal-body pt-3">
              <!--perusahaan-->
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
                  <selectize v-model="dataFilter.depo" data-placeholder="Pilih Depo" :settings="selectizeConfig" required :disabled="loading">
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
                      required
                      :disabled="loading"
                      id="salesman">
                    <option value="all"> Semua Tim </option>
                    <option :value="d.id" v-for="(d, i) in salesman" :key="i"> {{d.nama_salesman}} ({{d.tim}}) </option>
                  </selectize>
                </div>
              </div>

              <!--status-->
              <div class="row">
                <div class="col-6 form-group">
                  <label for="status" class="form-label">Pilih Status</label>
                  <selectize v-model="dataFilter.status" data-placeholder="Pilih Status" required id="status">
                    <option :value="d.v" v-for="(d, i) in [{l: 'Semua', v: 'semua'},{l: 'Belum Lunas', v: 'belum_lunas'},{l: 'Lunas', v: 'lunas'},{l: 'Over Due', v: 'over_due'}]" :key="i"> {{d.l}} </option>
                  </selectize>
                </div>

                <div class="col-6 form-group">
                  <label for="tipe-pembayaran" class="form-label">Tipe Pembayaran</label>
                  <selectize v-model="dataFilter.tipe_pembayaran" id="tipe-pembayaran" data-placeholder="Tipe Pembaayaran">
                    <option value="all"> semua </option>
                    <option :value="d" v-for="(d, i) in ['cash','credit']" :key="i"> {{d}} </option>
                  </selectize>
                </div>
              </div>

              <!-- Mitra -->
              <div class="form-group">
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

              <!--tanggal-->
              <div class="row">
                <div class="col-12 form-group">
                  <label for="tanggal" class="form-label">Tanggal</label>
                  <input type="date" class="form-control" required v-model="dataFilter.due_date" :max="dateTime('ymd')" id="tanggal">
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
import {mapActions, mapState} from "vuex";
import helper from "@/assets/js/helper.js";

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

      perusahaan: [], salesman: [], depos: [], mitra: [],

      dataFilter: {
        perusahaan: '',
        id_salesman: 'all',
        due_date: this.dateTime('ymd'),
        keyword: '',
        status: 'belum_lunas',
        depo: [],
        tipe_pembayaran: 'credit',
        id_mitra: 'exclude'
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
    ...mapActions('mitra', ['getListMitra']),
    close() {
      this.$emit("update:config", { view: false });
    },

    _getPerusahaan() {
      this.getListPerusahaanByAccess({}).then( res => {
        this.perusahaan = res
      })
    },

    _getDepo(id){
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
          if(this.perusahaan.length === 0) this._getPerusahaan()
          if(this.depos.length === 0) this._getDepo()
          if(this.salesman.length === 0) this._getSalesman()
          if(this.mitra.length === 0) this._getMitra()
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
