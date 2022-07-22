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
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{config.title == null ? '&nbsp;' : config.title}}</h5>
            <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
          </div>

          <form @submit.prevent="submit">
            <div class="modal-body pb-0" ref="modal" style="max-height: calc(100vh - 210px) !important">
              <div class="row">
                <div class="col-12">
                  <div class="hr-text">
                    <span>Toko & Pemilik</span>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6 form-group">
                  <label for="no-acc" class="form-label">No Akun Toko</label>
                  <input type="text" id="no-acc" class="form-control" placeholder="No akun toko" v-model="data.no_acc">
                </div>
                <div class="col-6 form-group">
                  <label for="cust-no" class="form-label">Cust No</label>
                  <input id="cust-no" type="text" class="form-control" placeholder="Cust No" v-model="data.cust_no">
                </div>
              </div>
              <div class="row">
                <div class="col-6 form-group">
                  <label for="nama-toko" class="form-label">Nama Toko</label>
                  <input id="nama-toko" type="text" class="form-control" placeholder="Nama toko" v-model="data.nama_toko" required>
                </div>
                <div class="col-6 form-group">
                  <label for="nama-pemilik" class="form-label">Nama Pemilik</label>
                  <input id="nama-pemilik" type="text" class="form-control" placeholder="Nama pemilik" v-model="data.pemilik">
                </div>
              </div>
              <div class="row">
                <div class="col-6 form-group">
                  <label for="no-ktp" class="form-label">No KTP</label>
                  <input type="text" id="no-ktp" class="form-control" placeholder="No KTP" v-model="data.no_ktp">
                </div>
                <div class="col-6 form-group">
                  <label for="nama-ktp" class="form-label">Nama KTP</label>
                  <input type="text" id="nama-ktp" class="form-control" placeholder="Nama sesuai ktp" v-model="data.nama_ktp">
                </div>
              </div>
              <div class="row">
                <div class="col-6 form-group">
                  <label for="alamat-ktp" class="form-label">Alamat KTP</label>
                  <input type="text" id="alamat-ktp" class="form-control" placeholder="Alamat sesuai ktp" v-model="data.alamat_ktp">
                </div>
                <div class="col-6 form-group">
                  <label for="mars" class="form-label">Kode Mars</label>
                  <input type="text" id="mars" class="form-control" placeholder="Kode mars" v-model="data.kode_mars">
                </div>
              </div>

              <div class="row">
                <div class="col-12">
                  <div class="hr-text">
                    <span>Kontak & Alamat</span>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-6 form-group">
                  <label for="kabupaten" class="form-label">Kabupaten</label>
                  <selectize id="kabupaten" v-model="select.id_kabupaten" data-placeholder="Pilih kabupaten" :disabled="request">
                    <option :value="d.id" v-for="(d, i) in kabupaten" :key="i"> {{d.nama_kabupaten}} </option>
                  </selectize>
                </div>

                <div class="col-6 form-group">
                  <label for="" class="form-label">Kecamatan</label>
                  <selectize
                      v-model="select.id_kecamatan"
                      data-placeholder="Pilih kecamatan"
                      :disabled="request || select.id_kabupaten == null">
                    <option :value="d.id" v-for="(d, i) in kecamatan" :key="i"> {{d.nama_kecamatan}} </option>
                  </selectize>
                </div>
              </div>

              <div class="row">
                <div class="col-6 form-group">
                  <label for="kelurahan" class="form-label">Kelurahan</label>
                  <selectize id="kelurahan"
                             v-model="data.id_kelurahan"
                             data-placeholder="Pilih kelurahan"
                             :disabled="request || select.id_kecamatan == null">
                    <option
                        :value="d.id"
                        v-for="(d, i) in kelurahan"
                        :key="i">
                      {{d.nama_kelurahan}}
                    </option>
                  </selectize>
                </div>
                <div class="col-6 form-group">
                  <label for="kode-pos" class="form-label">Kode Pos</label>
                  <input id="kode-pos" type="tel" @keypress="numberOnly($event)" maxlength="5" class="form-control" placeholder="Kode pos" v-model="data.kode_pos">
                </div>
              </div>

              <div class="row">
                <div class="col-6 form-group">
                  <label for="nomor-telepon" class="form-label">Nomor Telepon</label>
                  <input id="nomor-telepon" type="text" @keypress="numberOnly($event)" maxlength="13" class="form-control" placeholder="Nomor telepon" v-model="data.telepon">
                </div>
                <div class="col-6 form-group">
                  <label for="alamat" class="form-label">Alamat</label>
                  <input type="text" id="alamat" class="form-control" placeholder="Alamat" v-model="data.alamat" required>
                </div>
              </div>

              <div class="row">
                <div class="col-12">
                  <div class="hr-text">
                    <span>Pajak</span>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-6 form-group">
                  <label for="npwp" class="form-label">Npwp</label>
                  <input type="text" id="npwp" class="form-control" placeholder="Inputkan npwp" v-model="data.npwp" @focus="_scrollTo('modal')">
                </div>
                <div class="col-6 form-group">
                  <label for="nama-pkp" class="form-label">Nama PKP</label>
                  <input type="text" id="nama-pkp" class="form-control" placeholder="Inputkan nama pkp" v-model="data.nama_pkp" :required="data.npwp != '' && data.npwp != null">
                </div>
              </div>

              <div class="row">
                <div class="col-12 form-group">
                  <label for="alamat-pkp" class="form-label">Alamat PKP</label>
                  <input type="text" id="alamat-pkp" class="form-control" placeholder="Inputkan alamat pkp" v-model="data.alamat_pkp">
                </div>
              </div>

              <div class="row">
                <div class="col-12">
                  <div class="hr-text">
                    <span>Perusahaan & Depo</span>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-6 form-group">
                  <label for="perusahaan" class="form-label">Perusahaan</label>
                  <selectize id="perusahaan" v-model="data.id_perusahaan" data-placeholder="Pilih Perusahaan" @input="_getDepo($event)" required>
                    <option :value="d.id" v-for="(d, i) in perusahaan" :key="i"> {{d.kode_perusahaan}} - {{d.nama_perusahaan}} </option>
                  </selectize>
                </div>

                <div class="col-6 form-group">
                  <label for="depo" class="form-label">Nama Depo</label>
                  <selectize id="depo" v-model="data.id_depo" data-placeholder="Pilih depo" @input="_getTim($event)" required>
                    <option :value="d.id" v-for="(d, i) in depo" :key="i"> {{d.nama_depo}} </option>
                  </selectize>
                </div>

                <div class="col-6 form-group">
                  <label for="principal" class="form-label">Principal</label>
                  <selectize id="principal" v-model="data.id_principal" data-placeholder="Pilih Principal">
                    <option :value="d.id" v-for="(d, i) in principal" :key="i"> {{d.nama_principal}} </option>
                  </selectize>
                </div>

                <div class="col-6 form-group">
                  <label for="eksklusif" class="form-label">Kode Eksklusif</label>
                  <input
                      type="text"
                      id="eksklusif"
                      class="form-control"
                      placeholder="Kode Eksklusif"
                      v-model="data.kode_eksklusif">
                </div>
              </div>

              <div class="row">
                <div class="col-12">
                  <div class="hr-text">
                    <span>Ketentuan Toko</span>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-6 form-group" @click="_scrollTo('modal')">
                  <label for="" class="form-label">Tipe Toko</label>
                  <selectize v-model="data.tipe" data-placeholder="Pilih tipe toko">
                    <option :value="d" v-for="(d, i) in ['R1','R2','W','MM','SM','KOP','HRC','HCO','HCOC','PND']" :key="i"> {{d}} </option>
                  </selectize>
                </div>
                <div class="col-6 form-group" ref="tipe" @click="_scrollTo('modal')">
                  <label for="" class="form-label">Tipe Harga</label>
                  <selectize v-model="data.tipe_harga" data-placeholder="Pilih tipe harga" :disabled="harga.request">
                    <option :value="row.tipe_harga.toLowerCase()" v-for="(row, i) in harga.data" :key="i"> {{row.tipe_harga}} </option>
                  </selectize>
                </div>
              </div>

              <div class="row">
                <div class="col-6 form-group">
                  <label for="" class="form-label">Tipe Pembayaran</label>
                  <label class="form-check form-check-inline" style="padding-bottom: 10px;" v-for="(d, i) in ['kredit','tunai']" :key="i">
                    <input class="form-check-input" type="radio" name="tp" :value="d" v-model="data.k_t">
                    <span class="form-check-label" v-html="ucwords(d)"/>
                  </label>
                </div>
                <div class="col-3 form-group">
                  <label for="limit" class="form-label">Limit</label>
                  <input type="number" id="limit" @keyup="numberOnly($event)" maxlength="11" class="form-control" placeholder="Limit" v-model="data.limit" required>
                </div>
                <div class="col-3 form-group">
                  <label for="top" class="form-label">TOP (Hari)</label>
                  <input type="number" id="top" @keyup="numberOnly($event)" maxlength="11" class="form-control" placeholder="Top" v-model="data.top" required>
                </div>
              </div>

              <div class="row">
                <div class="col-6 form-group">
                  <label class="form-label">Minggu</label>
                  <label class="form-check form-check-inline" style="padding-bottom: 10px;" v-for="(d, i) in ['1&3','2&4','1-4']" :key="i">
                    <input class="form-check-input" type="radio" name="m" :value="d" v-model="data.minggu">
                    <span class="form-check-label" v-html="d"/>
                  </label>
                </div>

                <div class="col-3 form-group">
                  <label for="hari" class="form-label">Hari</label>
                  <selectize id="hari" v-model="data.hari" data-placeholder="Pilih hari" required>
                    <option :value="d" v-for="(d, i) in ['senin','selasa','rabu','kamis','jumat','sabtu','minggu']" :key="i"> {{ucwords(d)}} </option>
                  </selectize>
                </div>

                <div class="col-3 form-group">
                  <label for="tim" class="form-label">Tim</label>
                  <selectize id="tim" v-model="data.id_tim" data-placeholder="Pilih tim" required>
                    <option :value="d.id" v-for="(d, i) in tim" :key="i"> {{d.nama_tim}} </option>
                  </selectize>
                </div>
              </div>
              <div class="row">
                <div class="col-6 form-group">
                  <label for="top" class="form-label">Tipe 2</label>
                  <input class="form-control" placeholder="Tipe Toko" v-model="data.tipe_2">
                </div>
                <div class="col-6 form-group">
                  <label for="mitra" class="form-label">Mitra</label>
                  <selectize id="mitra" v-model="data.id_mitra" data-placeholder="Pilih Mitra">
                    <option value="">Tanpa Mitra</option>
                    <option :value="d.id" v-for="(d, i) in mitra" :key="i"> {{d.kode_mitra}} - {{d.perusahaan}} </option>
                  </selectize>
                </div>
              </div>

              <div class="row">
                <div class="col-6 form-group">
                  <label for="lock-order" class="form-label">Tipe 3</label>
                  <selectize id="lock-order" v-model="data.tipe_3" data-placeholder="Tipe NOO / RO">
                    <option value="NOO">NOO</option>
                    <option value="RO">RO</option>
                  </selectize>
                </div>
                <div class="col-6 form-group">
                  <label for="lock-order" class="form-label">Kunci Order</label>
                  <selectize id="lock-order" v-model="data.lock_order" data-placeholder="Kunci Order">
                    <option value="1">Ya</option>
                    <option value="0">Tidak</option>
                  </selectize>
                </div>
              </div>
            </div>
            <div class="p-4 text-right">
              <label class="form-check form-switch float-left">
                <input class="form-check-input" type="checkbox" v-model="status_toko">
                <span class="form-check-label">Status Toko <b v-html="status_toko ? 'AKTIF' : 'TIDAK AKTIF'"></b></span>
              </label>

              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />

              <button
                type="submit"
                class="btn btn-primary ml-3"
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
import {mapActions} from "vuex";

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

      request: true, kabupaten: [], kecamatan: [], kelurahan: [], tim: [], depo:[], perusahaan:[], principal: [], mitra: [],

      select: {
        id_kabupaten: null,
        id_kecamatan: null
      },

      status_toko: true,
      data: {
        nama_toko: null,
        no_acc: null,
        cust_no: null,
        kode_mars: null,
        alamat: null,
        telepon: null,
        pemilik: null,
        no_ktp: '',
        nama_ktp: '',
        alamat_ktp: '',
        kode_pos: null,
        tipe: '',
        id_kelurahan: null,
        k_t: 'kredit',
        limit: 500000,
        top: 14,
        minggu: '1&3',
        hari: null,
        id_tim: null,
        npwp: '',
        status_verifikasi: 'Y',
        nama_pkp: null,
        alamat_pkp: null,
        tipe_harga: null,
        id_depo: null,
        id_perusahaan: null,
        id_principal: null,
        kode_eksklusif: '',
        tipe_2: '',
        tipe_3: '',
        id_mitra: '',
        lock_order: '0'
      },

      harga: {
        request: false, data: []
      },

    };
  },

  methods: {
    ...mapActions('depo', ['getListDepo']),
    ...mapActions('perusahaan', ['getListPerusahaan']),
    ...mapActions('tim', ['getListTim']),
    ...mapActions('principal', ['getListPrincipal']),
    ...mapActions('mitra', ['getListMitra']),
    close() {
      this.$emit("update:config", { view: false });
    },

    _getKabupaten(){
      this.request = true;
      this.axios.get('daerah?type=kabupaten').then(res => {
        this.kabupaten = res.data.data;
        this.request = false;
      }).catch( err => {
        this.onError(err)
        this.request = false;
      });
    },

    _getKecamatan(id){
      this.request = true;
      this.axios.get('daerah?type=kecamatan&parent_id='+id).then(res => {
        this.kecamatan = res.data.data;
        this.request = false;
      }).catch( err => {
        this.onError(err)
        this.request = false;
      });
    },

    _getKelurahan(id){
      this.request = true;
      this.axios.get('daerah?type=kelurahan&parent_id='+id).then(res => {
        this.kelurahan = res.data.data;
        this.request = false;
      }).catch( err => {
        this.onError(err)
        this.request = false;
      });
    },

    _getPrincipal(id) {
      this.getListPrincipal({id_perusahaan: id}).then( res => {
        this.principal = res
      })
    },

    _getTim(id){
      this.getListTim({id_depo: id}).then(res => {
        this.tim = res
      })
    },

    getTipeHarga(){
      this.harga.request = true
      this.axios.get('tipe_harga').then(res => {
        this.harga.request = false
        this.harga.data = res.data.data
      }).catch(err => {
        this.onError(err)
        this.harga.request = false
      })
    },

    _getDepo(id){
      this.getListDepo({id_perusahaan: id}).then( res => {
        this.depo = res
      })

      this._getPrincipal(id)
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
          this.getTipeHarga()
          if(this.kabupaten.length == 0) this._getKabupaten()
          if(this.perusahaan.length == 0) this._getPerusahaan()
          if(this.mitra.length == 0) this._getMitra()
          this._getDepo(this.data.id_perusahaan)
          this._getTim(this.data.id_depo)
        }, 150);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 150);
      }
    },

    initData: function(data) {
      if(data == null){
        Object.assign(this.$data.data, this.$options.data.call(this).data);
      }else{
        for (const key in this.data) {
          this.data[key] = data[key]
        }

        for (const key in this.select) {
          this.select[key] = data[key]
        }
      }
    },

    'select.id_kabupaten': function(id){
      this._getKecamatan(id)
    },

    'select.id_kecamatan': function(id){
      this._getKelurahan(id)
    },

    'data.status_verifikasi': function(b){
      this.status_toko = b == 'Y' ? true : false
    },

    status_toko(b){
      this.data.status_verifikasi = b ? 'Y' : 'N'
    }

  }
};
</script>

<style scoped>
  .hr-text {
    margin: 15px;
  }
</style>
