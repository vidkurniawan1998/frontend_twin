<template>
  <div v-if="backdrop">
    <div
      class="modal fade"
      :class="modal.open ? 'show' : ''"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
      @click="$event.target.classList.contains('modal') ? close() : true"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{config.title == null ? '&nbsp;' : config.title}}</h5>
            <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
          </div>

          <form @submit.prevent="submit">
            <div class="modal-body">

              <div class="form-group">
                <label for="" class="form-label">Tanggal</label>
                <input type="date" class="form-control" v-model="data.tanggal" required>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Tipe Pembayaran</label>
                <label class="form-check form-check-inline" v-for="(d, i) in ['tunai','transfer','bilyet_giro','saldo_retur','lainnya']" :key="i">
                  <input class="form-check-input" type="radio" name="tp" :value="d" v-model="data.tipe">
                  <span class="form-check-label" v-html="ucwords(d.split('_').join(' '))"/>
                </label>
              </div>

              <div class="alert alert-info" v-if="data.tipe == 'saldo_retur'">
                <span v-if="isLoadSaldoRetur" v-html="spin()+' Loading saldu retur'"></span> <span v-else>Saldo Retur : <b class="float-right">Rp {{ribuan(saldo_retur)}}</b></span>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Nominal</label>
                <input type="tel" class="form-control" placeholder="Nominal" @keypress="numberOnly($event)" maxlength="11" v-model="data.nominal" :required="data.tipe == 'tunai'">
              </div>

              <div class="form-group" v-if="data.tipe != 'tunai' && data.tipe != 'saldo_retur' && data.tipe != 'lainnya'">
                <label for="" class="form-label">Bank</label>
                <input type="tel" class="form-control" placeholder="Bank" number-only v-model="data.bank">
              </div>

              <div class="form-group" v-if="data.tipe != 'tunai' && data.tipe != 'saldo_retur' && data.tipe != 'lainnya'">
                <label for="" class="form-label">No. Rekening</label>
                <input type="tel" class="form-control" placeholder="No. Rekening" @keypress="numberOnly($event)" maxlength="11" v-model="data.no_rekening">
              </div>

              <div class="form-group" v-if="data.tipe == 'bilyet_giro'">
                <label for="" class="form-label">No. Bilyet Giro</label>
                <input type="tel" class="form-control" placeholder="No. bilyet giro" @keypress="numberOnly($event)" maxlength="11" v-model="data.no_bg">
              </div>

              <div class="form-group" v-if="data.tipe == 'bilyet_giro'">
                <label for="" class="form-label">Jatuh Tempo</label>
                <input type="date" class="form-control" v-model="data.jatuh_tempo_bg">
              </div>

              <div class="form-group" v-if="data.tipe == 'lainnya'">
                <label for="" class="form-label">Keterangan</label>
                <textarea class="form-control" v-model="data.keterangan" placeholder="Keterangan"></textarea>
              </div>
              
            </div>

            <div class="modal-footer pt-2">
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />

              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmit || request"
                v-html="isSubmit ? spin() : 'Simpan'"
              />
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal-backdrop fade" :class="modal.open ? 'show' : ''" />
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";

export default {
  name: "Form",
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

      request: false,
      isLoadSaldoRetur: false,
      saldo_retur: 0, belumBayar: 0, 

      data: {
        id_penjualan: null,
        tipe: 'tunai',
        nominal: 0,
        bank: null,
        no_rekening: null,
        no_bg: null,
        jatuh_tempo_bg: null,
        keterangan: null,
        tanggal: null
      },

    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    submit() {
      this.$emit('update:isSubmit', true)
      this.$emit('submit', this.data);
    },

  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    initData: function(data) {
      if(data == null){
        Object.assign(this.$data.data, this.$options.data.call(this).data);
      }else{
        for (const key in this.data) {
          this.data[key] = data[key]
        }
      }
    },

    'data.tipe': function(data){
      if(data == 'saldo_retur'){
        this.isLoadSaldoRetur = true
        this.axios('toko/get_saldo_retur/'+this.data.id_toko).then(res => {
          var sr = res.data.saldo_retur;
          this.saldo_retur = sr;

          this.data.nominal = sr < this.belumBayar ? sr : this.belumBayar;
          this.isLoadSaldoRetur = false
        }).catch(err => {
          this.onError(err)
          this.isLoadSaldoRetur = false
        })
      }
    }

  }
};
</script>
