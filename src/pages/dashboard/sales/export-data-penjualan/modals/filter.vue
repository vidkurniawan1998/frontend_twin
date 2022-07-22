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
            <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
          </div>

            <div class="modal-body pt-3">

              <div class="form-group">
                <label for="" class="form-label">Nama Depo</label>
                <selectize v-model="dataFilter.id_depo" data-placeholder="Pilih Depo" required :disabled="request"> 
                  <option :value="d.id" v-for="(d, i) in depo" :key="i"> {{d.nama_depo}}</option>
                </selectize>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Nama Salesman</label>
                <selectize v-model="dataFilter.id_salesman" data-placeholder="Pilih Salesman" required :disabled="request"> 
                  <option :value="d.id" v-for="(d, i) in salesman" :key="i"> {{d.nama_salesman}} ({{d.tim}}) </option>
                </selectize>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Mulai Tanggal</label>
                <input type="date" class="form-control" required v-model="dataFilter.start_date" :max="dataFilter.end_date">
              </div>

              <div class="form-group">
                <label for="" class="form-label">Sampai Tanggal</label>
                <input type="date" class="form-control" required v-model="dataFilter.end_date" :max="dateTime('ymd')">
              </div>

              <div class="form-group">
                <label for="" class="form-label">Tipe Pembayaran</label>
                <label class="form-check form-check-inline" v-for="(d, i) in ['all','credit','cash']" :key="i">
                  <input class="form-check-input" type="radio" name="status" :value="d" v-model="dataFilter.tipe_pembayaran">
                  <span class="form-check-label" v-html="d"/>
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

      request: true,
      salesman: [], depo: [],

      dataFilter: {
        id_depo: 'all',
        id_salesman: 'all',
        start_date: this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
        tipe_pembayaran: 'all'
      },

    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    _getSalesmanNDepo(){
      this.request = true
      
      this.axios.get('salesman').then(res => {
        this.salesman = res.data.data;

        this.axios.get('depo').then(res => {
          this.depo = res.data.data;
          this.request = false
        }).catch(err => {
          this.onError(err);
          this.request = false
        });
      }).catch(err => {
        this.onError(err);
        this.request = false
      });
    },

    submit(){
      if(this.dataFilter.id_salesman != 'all'){
        this.findObject(this.salesman, 'id', this.dataFilter.id_salesman, (d, i) => {
          this.dataFilter.tim = d.tim
          this.dataFilter.salesman = d.nama_salesman
        })
      }

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
          if(this.salesman.length == 0) this._getSalesmanNDepo()
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
};
</script>

