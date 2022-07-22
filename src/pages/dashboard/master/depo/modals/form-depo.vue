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
            <button type="button" class="close" @click="close()" v-html="loading ? spin() : ic('close')"/>
          </div>

          <form @submit.prevent="submit">
            <div class="modal-body default">
              <div class="row">
                <div class="form-group col-6">
                  <label for="perusahaan" class="form-label">Perusahaan</label>
                  <selectize v-model="data.id_perusahaan" data-placeholder="Pilih Perusahaan" id="perusahaan" required>
                    <option :value="d.id" v-for="(d, i) in perusahaan" :key="i"> {{d.kode_perusahaan}} - {{d.nama_perusahaan}} </option>
                  </selectize>
                </div>

                <div class="form-group col-6">
                  <label for="depo" class="form-label">Nama Depo</label>
                  <input type="text" class="form-control" placeholder="Nama depo" v-model="data.nama_depo" id="depo" required>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-6">
                  <label for="gudang-baik" class="form-label">Gudang Baik</label>
                  <selectize v-model="data.id_gudang" data-placeholder="Pilih gudang" id="gudang-baik" required>
                    <option :value="d.id" v-for="(d, i) in gudang_baik" :key="i"> {{d.nama_gudang}} </option>
                  </selectize>
                </div>

                <div class="form-group col-6">
                  <label for="gudang-bs" class="form-label">Gudang BS</label>
                  <selectize v-model="data.id_gudang_bs" data-placeholder="Pilih gudang" id="gudang-bs" required>
                    <option :value="d.id" v-for="(d, i) in gudang_bs" :key="i"> {{d.nama_gudang}} </option>
                  </selectize>
                </div>
              </div>

              <div class="form-group">
                <label for="nomor-telepon" class="form-label">Nomor Telepon</label>
                <input type="text" class="form-control" placeholder="Nomor telepon" v-model="data.telp" id="nomor-telepon" required>
              </div>

              <div class="form-group">
                <label for="nomor-fax" class="form-label">Nomor FAX</label>
                <input type="text" class="form-control" placeholder="FAX" v-model="data.fax" id="nomor-fax" required>
              </div>

              <div class="form-group">
                <label for="wilayah" class="form-label">Wilayah / Kabupaten</label>
                <input type="text" class="form-control" placeholder="Nomor telepon" v-model="data.kabupaten" id="wilayah" required>
              </div>

              <div class="form-group">
                <label for="alamat-depo" class="form-label">Alamat Depo</label>
                <input type="text" class="form-control" placeholder="Alamat depo" v-model="data.alamat" id="alamat-depo" required>
              </div>

            </div>

            <div class="modal-footer pt-2">
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />

              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmit || loading"
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
        formNav: 0
      },

      request: true, gudang_baik: [], gudang_bs: [], kabupaten: [], perusahaan: [],

      data: {
        id_perusahaan: null,
        nama_depo: null,
        alamat: null,
        id_gudang: null,
        id_gudang_bs: null,
        kabupaten: null,
        telp:null,
        fax:null
      },

    };
  },

  computed: {
    ...mapState(['loading'])
  },

  methods: {
    ...mapActions('perusahaan', ['getListPerusahaan']),
    ...mapActions('gudang', ['getListGudang']),
    close() {
      this.$emit("update:config", { view: false });
    },

    _getGudangBaik(){
      this.getListGudang({jenis: 'baik'}).then(res => {
        this.gudang_baik = res
      })
    },
    _getGudangBS(){
      this.getListGudang({jenis: 'bad_stock'}).then(res => {
        this.gudang_bs = res
      })
    },
    _getPerusahaan() {
      this.getListPerusahaan(null).then( res => {
        this.perusahaan = res.data
      })
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
          if(this.perusahaan.length === 0) this._getPerusahaan()
          if(this.gudang_baik.length === 0) this._getGudangBaik()
          if(this.gudang_bs.length === 0) this._getGudangBS()
          // if(this.kabupaten.length == 0) this._getKabupaten()
        }, 200);
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
          if (key === 'id_perusahaan') {
            this.data[key] = data.perusahaan.id
          } else {
            this.data[key] = data[key]
          }
        }
        console.log(this.data)
      }
    },

  }
};
</script>
