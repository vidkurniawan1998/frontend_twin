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
              <label for="salesman" class="form-label">Pilih Salesman</label>
              <selectize id="salesman" v-model="dataFilter.id_salesman" data-placeholder="Pilih Salesman" required>
                <option value="all"> Semua Tim </option>
                <option :value="d.id" v-for="(d, i) in salesman" :key="i"> {{d.nama_salesman}} ({{d.tim}}) </option>
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

      request: true,

      salesman: [], depos:[],

      dataFilter: {
        status: 'approved',
        id_salesman: 'all',
        start_date: this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        tipe_pembayaran: 'all',
        depo:[],
      },

    };
  },
  computed: {
    ...mapState(['loading']),
  },
  methods: {
    ...mapActions('depo', ['getListDepoByUser']),
    ...mapActions('salesman', ['getListSalesman']),
    close() {
      this.$emit("update:config", { view: false });
    },

    _getSalesman(){
      this.getListSalesman({depo: this.dataFilter.depo}).then( res => {
        this.salesman = res
      })
    },
    _getDepo(){
      this.getListDepoByUser({}).then( res => {
        this.depos = res
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
          if(this.salesman.length == 0) this._getSalesman()
          if(this.depos.length == 0) this._getDepo()
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    initData: function(data) { },
    "dataFilter.depo": {
      handler: function(val, old) {
        this._getSalesman();
      },
      deep: true
    }
  }
};
</script>
