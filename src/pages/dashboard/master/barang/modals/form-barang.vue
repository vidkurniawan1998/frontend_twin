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
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document" ref="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{config.title == null ? '&nbsp;' : config.title}}</h5>
            <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
          </div>

          <form @submit.prevent="submit">
            <div class="modal-body" ref="modal">
              <div class="row">
                <div class="col-6 form-group">
                  <label for="kode-barang" class="form-label">Kode Barang</label>
                  <input type="text" id="kode-barang" class="form-control" placeholder="Kode barang" v-model="data.kode_barang" required>
                </div>

                <div class="col-6 form-group">
                  <label for="nama-barang" class="form-label">Nama Barang</label>
                  <input type="text" id="nama-barang" class="form-control" placeholder="Nama barang" v-model="data.nama_barang" required>
                </div>
              </div>

              <div class="row">
                <div class="col-6 form-group">
                  <label for="kode-stok" class="form-label">Kode Stok</label>
                  <input type="text" id="kode-stok" class="form-control" placeholder="Kode barang" v-model="data.item_code" required>
                </div>
                <div class="col-6 form-group">
                  <label for="kode-pcs" class="form-label">Kode PCS</label>
                  <input type="text" id="kode-pcs" class="form-control" placeholder="Kode barang" v-model="data.pcs_code" required>
                </div>
              </div>

              <div class="row">
                <div class="col-6 form-group">
                  <label for="berat" class="form-label">Berat (gram)</label>
                  <input type="number" id="berat" step="0.1" class="form-control" placeholder="Berat" v-model="data.berat" required>
                </div>

                <div class="col-6 form-group">
                  <label for="isi" class="form-label">Isi</label>
                  <input type="text" id="isi" number-only class="form-control" placeholder="Isi" v-model="data.isi" required>
                </div>
              </div>

              <div class="row">
                <div class="col-6 form-group">
                  <label for="satuan" class="form-label">Satuan</label>
                  <input type="text" id="satuan" class="form-control" placeholder="Satuan" v-model="data.satuan" required>
                </div>
                <div class="col-3 form-group">
                  <label for="status-barang" class="form-label">Tipe Barang</label>
                  <select class="form-control" id="status-barang" v-model="data.tipe">
                    <option value="exist">Exist</option>
                    <option value="non_exist">Non Exist</option>
                    <option value="bebas_retur">Bebas Retur</option>
                  </select>
                </div>
                <div class="col-3 form-group">
                  <label for="status-barang" class="form-label">Status Barang</label>
                  <select class="form-control" id="status-barang" v-model="data.status">
                    <option value="1">Aktif</option>
                    <option value="0">Tidak Aktif</option>
                  </select>
                </div>
              </div>

              <div class="row">
                <div class="form-group">
                  <label for="perusahaan" class="form-label">Perusahaan</label>
                  <selectize id="perusahaan" v-model="data.id_perusahaan" data-placeholder="Pilih Perusahaan" @input="_getDepoSegmen($event)" required>
                    <option :value="d.id" v-for="(d, i) in perusahaan" :key="i"> {{d.kode_perusahaan}} - {{d.nama_perusahaan}} </option>
                  </selectize>
                </div>
              </div>

              <div class="row">
                <div class="col-6 form-group" @click="_scrollTo('modal')">
                  <label class="form-label" for="depo">Depo</label>
                  <selectize v-model="data.depo" id="depo" :key="request" data-placeholder="Pilih Depo" :settings="selectizeConfig" required :disabled="loading">
                    <option :value="row.id" v-for="(row, i) in depos" :key="i">
                      {{row.nama_depo}}
                    </option>
                  </selectize>
                </div>
                <div class="col-6 form-group" @click="_scrollTo('modal')">
                  <label for="nama-segmen" class="form-label">Nama Segmen</label>
                  <selectize id="nama-segmen" v-model="data.id_segmen" data-placeholder="Pilih segmen" :disable="request">
                    <option :value="dt.id" v-for="(dt, i) in segmens" :key="i"> {{ dt.nama_segmen }} </option>
                  </selectize>
                </div>
              </div>

              <div class="row">
                <div class="col-6 form-group">
                  <label class="form-label" for="depo">Mitra</label>
                  <selectize v-model="data.id_mitra" id="mitra" :key="request" data-placeholder="Pilih Mitra" :disabled="loading">
                    <option :value="row.id" v-for="(row, i) in mitra" :key="row.id">
                      {{row.kode_mitra}} - {{row.perusahaan}}
                    </option>
                  </selectize>
                </div>

                <div class="col-6 form-group">
                  <label for="kelipatan-order" class="form-label">Kelipatan Order</label>
                  <input type="text" id="kelipatan-order" class="form-control" placeholder="Kelipatan Order" v-model="data.kelipatan_order" required>
                </div>
              </div>

              <label class="form-check form-switch">
                <input class="form-check-input" type="checkbox" v-model="isExtra">
                <span class="form-check-label">Barang Ekstra</span>
              </label>
            </div>

            <div class="modal-footer pt-2">
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />

              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmit || request || !modal.submit"
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
import {mapActions, mapState} from "vuex";

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
        submit: true,

        event: {
          mousedown: false
        },

        style: null,
        offset: []
      },

      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },

      request: false, segmens: [], isExtra: false, depos:[], mitra: [],

      data: {
        kode_barang: null,
        nama_barang: null,
        item_code: null,
        pcs_code: null,
        berat: null,
        isi: null,
        satuan: null,
        id_segmen: null,
        extra: 0,
        status: 1,
        tipe : 'exist',
        depo: [],
        id_perusahaan: null,
        id_mintra: '',
        kelipatan_order: 1,
      },

      perusahaan: [],
    };
  },
  computed: {
    ...mapState(['loading'])
  },
  methods: {
    ...mapActions('perusahaan', ['getListPerusahaan']),
    ...mapActions('mitra', ['getListMitra']),
    close() {
      this.$emit("update:config", { view: false });
    },

    _getSegmen(id){
      this.request = true

      this.axios.get('segmen', {
        params: {
          id_perusahaan: id
        }
      }).then(res => {
        this.segmens = res.data.data;
        this.request = false
        this.modal.submit = true
      }).catch( err => {
        this.onError(err)
        this.request = false
        this.modal.submit = false
      });
    },
    _getDepo(id){
      this.request = true

      this.axios.get('depo', {
        params: {
          id_perusahaan: id
        }
      }).then(res => {
        this.depos = res.data.data;
        this.request = false
      }).catch(err => {
        this.onError(err);
        this.request = false
      });
    },

    _getDepoSegmen(id) {
      this._getDepo(id)
      this._getSegmen(id)
    },

    submit() {
      if(this.modal.submit){
        this.$emit('update:isSubmit', true)
        this.$emit('submit', this.data);
      }
    },

    _getPerusahaan() {
      this.getListPerusahaan(null).then( res => {
        this.perusahaan = res.data
      })
    },

    _getMitra() {
      this.getListMitra(null).then( res => {
        this.mitra = res
      })
    }
  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
          if (this.perusahaan.length === 0) this._getPerusahaan()
          if (this.mitra.length === 0) this._getMitra()
          this._getDepo(this.data.id_perusahaan)
          this._getSegmen(this.data.id_perusahaan)

        }, 200);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
          Object.assign(this.$data.modal, this.$options.data.call(this).modal);
        }, 100);
      }
    },

    initData: function(data) {
      if(data == null){
        Object.assign(this.$data.data, this.$options.data.call(this).data);
      }else{
        this.isExtra = false

        for (const key in this.data) {
          if(key === 'depo') {
            continue
          }
          this.data[key] = data[key]
        }

        if(data.extra != null && data.extra === 1){
          this.isExtra = true
        }

        for (let i = 0; i < data.depo.length; i++) {
          this.data.depo.push(data.depo[i].id)
        }
      }
    },

    isExtra(bool){
      this.data.extra = bool ? 1 : 0
    }

  }
};
</script>
