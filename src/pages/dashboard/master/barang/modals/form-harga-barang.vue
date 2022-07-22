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
      <div class="modal-dialog modal-xl modal-dialog-centered" style="max-width : 700px" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{config.title == null ? '&nbsp;' : config.title}}</h5>
            <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
          </div>
          <form @submit.prevent="submit">
            <div class="modal-body">
              <div v-if="request">
                 <Skeleton
                  type="table"
                  :length="7"
                />
              </div>
              <div v-else>
                <div class="row">
                  <div class="col-sm-12">
                    <div class="form-group">
                      <label class="form-label"> Default PPN Value</label>
                      <input type="number" :readonly="!isCanPpn" v-model="default_ppn" placeholder="Inputkan default ppn value" class="form-control">
                    </div>
                  </div>
                  <div class="col-sm-5" @click="harga_field = false">
                    <div class="form-group">
                      <label @click="isCanExclude = isCanExclude ? false : true" class="form-label">Harga Exclude <span style="margin-left:5px; color:grey"><i class="fa fa-lock"></i></span></label>
                      <div class="input-group mb-2" v-for="(row, i) in data_harga" :key="i">
                        <span class="input-group-text" style="font-size: 12px; width: 70px" v-html="row.tipe_harga.toUpperCase()"/>
                        <currency-input
                          class="form-control"
                          :readonly="!isCanExclude"
                          :precision=2
                          :placeholder="'Inputkan harga tanpa ppn'+row.tipe_harga"
                          @input="harga_field ? '' : _setHarga(row)"
                          v-model="row.harga_non_ppn"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-2" @click="harga_field = false">
                    <div class="form-group">
                      <label @click="isCanPpn = isCanPpn ? false : true" class="form-label">PPN <span style="margin-left:5px; color:grey"><i class="fa fa-lock"></i></span></label>
                      <div class="input-group mb-2" v-for="(row, i) in data_harga" :key="i">
                        <input type="number" 
                          class="form-control" 
                          :readonly="!isCanPpn"
                          @input="_setHarga(row)" 
                          v-model="row.ppn" id="">
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-5" @click="harga_field = true">
                    <div class="form-group">
                      <label for="" class="form-label">Harga Include</label>
                      <div class="input-group mb-2" v-for="(row, i) in data_harga" :key="i">
                        <span class="input-group-text" style="font-size: 12px; width: 70px" v-html="row.tipe_harga.toUpperCase()"/>
                        <currency-input
                          class="form-control"
                          :precision=2
                          :placeholder="'Inputkan harga tanpa ppn'+row.tipe_harga"
                          @input="harga_field ? _setHargaExclude(row) : ''"
                          v-model="row.harga"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
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
        title: "Form Harga"
      }
    },
    initData: null,
    isCanExclude : false,
    isCanPpn : false,
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

      harga_field : false,
      request: true, tipeHarga: [], data: {},
      default_ppn : 0,
      data_harga : [],

      formData: {
        tipe_harga: ['dbp','rbp','hcobp','wbp','cbp'],
        harga: [0,0,0,0,0]
      },

    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    _setHarga(data){
      data.ppn_value = parseFloat(data.harga_non_ppn) * parseFloat(data.ppn) / 100
      data.harga = parseFloat(data.ppn_value) + parseFloat(data.harga_non_ppn)
    },

    _setHargaExclude(data){
      data.harga_non_ppn = parseFloat(data.harga) / ((parseFloat(data.ppn) + 100) / 100)
      data.ppn_value =  parseFloat(data.harga) - parseFloat(data.harga_non_ppn)
    },

    _getTipeHarga(){
      this.default_ppn = this.data.default_ppn
      this.request = true
      this.axios.get('tipe_harga', {
        params: {
          id_perusahaan: this.data.id_perusahaan
        }
      }).then(res => {
        this.data_harga = []
        let tipe_harga = res.data.data
        for (let i = (tipe_harga.length-1); i >= 0; i--) {
          let sub = tipe_harga[i]
          this.data_harga.push(
          {
            id_barang  : this.data.id,
            tipe_harga : sub.tipe_harga,
            harga      : this.data[sub.tipe_harga.toLowerCase()].harga,
            ppn        : this.data[sub.tipe_harga.toLowerCase()].ppn,
            ppn_value  : this.data[sub.tipe_harga.toLowerCase()].ppn_value,
            harga_non_ppn : this.data[sub.tipe_harga.toLowerCase()].harga_non_ppn,
          });
        }
        this.request = false
      }).catch( err => {
        this.onError(err)
        this.request = false
      });
    },

    submit() {
      this.$emit('update:isSubmit', true)
      this.$emit('submit', this.data_harga);
    },

  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
          this._getTipeHarga()
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    default_ppn: function () {
      for (let i = 0; i < this.data_harga.length; i++) {
        let data = this.data_harga[i]
        data.ppn       = this.default_ppn == '' ? 0 : parseFloat(this.default_ppn)
        data.ppn_value = data.harga_non_ppn * data.ppn/100
        data.harga     = parseFloat(data.harga_non_ppn) + parseFloat(data.ppn_value )
      }
    },    

    initData: function(data) {
      Object.assign(this.$data.formData, this.$options.data.call(this).formData);
      this.data = data

      if(data != null){
        let keys = ['dbp','rbp','hcobp','wbp','cbp']
        for (let i = 0; i < keys.length; i++) {
          this.formData.harga[i] = data[keys[i]] == null ? 0 : data[keys[i]].harga
        }
      }
    },

  }
};
</script>
