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
      <div class="modal-dialog modal-lg modal-dialog-centered " role="document">
        <div class="modal-content hidden-overflow">

            <div class="modal-body pt-3 pb-0">

              <div style="line-height: 17px" class="mb-4">
                <h3 class="m-0"> {{config.title == null ? '&nbsp;' : config.title}} </h3>
                <div> <span v-html="data.no_pb"></span> <span class="badge ml-2" :class="data.is_approved == 0 ? 'bg-orange' : 'bg-green'" v-html="data.is_approved == 0 ? 'Menunggu' : 'Disetujui'"></span> </div>

                <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
              </div>

              <div class="card-tabs mb-0">
                <!-- Cards navigation -->

                <transition name="slide-fade-x">
                  <div class="btn-group float-right" v-if="tabActive == 1">
                    <button class="btn btn-outline-primary" :disabled="request" v-html="ic('refresh')" @click="_getItems()"/>
                    <button class="btn btn-outline-primary" :disabled="request" v-if="data.is_approved == 1" v-html="ic('printer')+' Cetak'" @click="_print"/>
                    <button class="btn btn-outline-primary" v-if="data.is_approved == 0" :disabled="request" @click="_add" v-html="ic('plus')"/>
                  </div>
                </transition>

                <ul class="nav nav-tabs">
                  <li class="nav-item" v-for="(tab, i) in ['Informasi Penerimaan','Daftar Barang']" :key="i" @click="tabActive = i">
                    <span class="nav-link" :class="tabActive == i ? 'active' : ''" data-toggle="tab" v-html="tab"></span>
                  </li>
                </ul>
                <div class="tab-content">

                  <div class="card tab-pane" :class="tabActive == 0 ? ' active show' : ''">
                    <div class="card-body p-0">

                      <ul class="list-group list-stripped list-borderless" style="max-height: calc(100vh - 320px); overflow: auto">
                        <li class="list-group-item" v-for="(row, i) in info" :key="i">
                          <div><b>{{row.label}}</b></div> <span v-html="row.value"></span>
                        </li>
                      </ul>

                    </div>
                  </div>

                  <div class="card tab-pane" :class="tabActive == 1 ? ' active show' : ''">
                    <div class="card-body p-0 table-responsive " style="min-height: 350px">

                      <Skeleton type="table" :length="5" class="mt-3 bg-white m-2" v-if="request"/>
                      <Nodata v-if="!request && items.length == 0"/>

                      <transition name="slide-up">
                        <div class="table-dpb" v-if="!request && items.length > 0">
                          <table class="table table-v center table-hover card-table table-striped table-no-break">
                            <thead>
                              <tr class="text-muted">
                                <th>No</th>
                                <th>Barang</th>
                                <th>Qty</th>
                                <th>Qty Pcs</th>
                                <th>Harga</th>
                                <th>Subtotal</th>
                                <th>Keterangan</th>
                                <th v-if="data.is_approved == 0"></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(row, i) in items" :key="i">
                                <td>{{i + 1}}</td>
                                <td>{{row.kode_barang}} - {{row.nama_barang}}</td>
                                <td>{{ribuan(row.qty,'')}} karton</td>
                                <td>{{ribuan(row.qty_pcs,'')}} {{row.satuan}}</td>
                                <td>Rp {{ribuan(row.harga)}}</td>
                                <td>Rp {{ribuan(row.subtotal)}}</td>
                                <td>{{row.keterangan}}</td>
                                <td style="padding: 2px">
                                  <div class="btn-group">
                                    <button class="btn btn-white btn-pill" @click="_edit(row)" v-html="ic('edit')"> </button>
                                    <button v-if="data.is_approved == 0" class="btn btn-white btn-pill" @click="_delete(row.id)" v-html="ic('trash')"> </button>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </transition>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="px-4 pt-3" v-if="tabActive == 1">
              <span class="badge-md strong mr-2" v-for="(row, i) in itemsFoot" :key="i"> {{ucwords(row.label)}} <span v-html="row.value"></span> </span>
            </div>

            <div class="px-4 py-4 text-right">
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
              <button type="button" class="btn btn-primary ml-3" :disabled="isApproved" @click="_confirm" v-html="isApproved ? spin() : data.is_approved == 0 ? 'Approve' : 'Batal Setujui'" />

            </div>

            <!-- form add & edit item -->

            <transition name="slide-fade-x">

              <div class="form-item" v-show="form.view">

                <div class="card-header">
                  <h3 class="card-title" v-html="form.title"/>
                  <button type="button" class="close" ref="close" @click="form.view = false" v-html="form.request ? spin() : ic('close')"/>
                </div>

                <form @submit.prevent="form.action">

                  <div class="card-body">
                    <div class="form-group" v-if="data.is_approved == 0">
                      <label for="nama-barang" class="form-label">Nama Barang</label>
                      <selectize id="nama-barang" v-model="formData.id_barang" data-placeholder="Pilih barang" required :disabled="form.request" @input="_loadHargaBarang($event)">
                        <option :value="b.id" v-for="(b, i) in formItems" :key="i"> {{b.kode_barang}} - {{b.nama_barang}}</option>
                      </selectize>
                    </div>

                    <div class="row" v-if="data.is_approved == 0">
                      <div class="col-6">

                        <div class="form-group">
                          <label for="qty-dus" class="form-label">Qty Dus</label>
                          <input
                              id="qty-dus"
                              v-model="formData.qty"
                              onfocus="this.select()"
                              type="tel"
                              required
                              @keypress="numberOnly($event)"
                              maxlength="11"
                              class="form-control"
                              placeholder="Qty dus">
                        </div>

                      </div>
                      <div class="col-6">

                        <div class="form-group">
                          <label for="qty-pcs" class="form-label">Qty Pcs</label>
                          <input
                              id="qty-pcs"
                              v-model="formData.qty_pcs"
                              onfocus="this.select()"
                              type="tel"
                              required
                              @keypress="numberOnly($event)"
                              maxlength="11"
                              class="form-control"
                              placeholder="Qty pcs">
                        </div>

                      </div>
                    </div>

                    <div class="form-group" v-if="data.is_approved == 1">
                      <label class="form-label">Harga</label>
                      <selectize v-model="formData.id_harga" :key="harga_key" data-placeholder="Pilih harga" :disabled="form.request">
                        <option :value="0">Pilih Harga</option>
                        <option :value="d.id" v-for="(d, i) in harga" :key="i">{{ ribuan(d.harga+'|,2') }} - {{d.tanggal}}</option>
                      </selectize>
                    </div>

                    <div class="form-group" v-if="data.is_approved == 0">
                      <label for="keterangan" class="form-label">Keterangan</label>
                      <textarea id="keterangan" v-model="formData.keterangan" class="form-control" placeholder="Keterangan"></textarea>
                    </div>

                  </div>

                  <div class="card-footer text-right">
                    <button type="button" class="btn btn-white" @click="form.view = false" v-html="'Tutup'"></button>
                    <button type="submit" class="btn btn-primary ml-3" :disabled="form.isSubmit" v-html="form.isSubmit ? spin() : 'Simpan'"></button>
                  </div>

                </form>

              </div>
            </transition>

        </div>
      </div>
    </div>

    <div class="modal-backdrop fade" :class="modal.open ? 'show' : ''" />

    <Confirm :id.sync="confirm.id" :title.sync="confirm.title" :isSubmit.sync="confirm.isSubmit" @submit="confirm.action"/>

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

      request: false, data: {}, tabActive: 0, idCache: null,
      info: [], items: [], itemsHasLoaded: false, itemsFoot: [], harga: [],

      // data detail stock
      filter: [], keyword: '',

      id_stock: null, hasChange: false,

      formData: {
        id_harga: 0,
        id_penerimaan_barang: null,
        id_barang: null,
        qty: 0,
        qty_pcs: 0,
        keterangan: null
      },

      harga_key: false,

      form: {
        view: false, request: false,
        title: null, isSubmit: false,
        action: () => {}
      },

      formItems: [],
      confirm: {
        id: null, title: null, isSubmit: false, action: () => {}
      },

      isApproved: false

    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    _getItems(){
      this.request = true
      this.axios.get('detail_penerimaan_barang/'+this.data.id+'/detail').then(res => {
        this.items = res.data.data
        this.request = false
        this.itemsHasLoaded = true
      }).catch( err => {
        this.onError(err);
        this.request = false
      });
    },

    _get(id){ // id gudang
      this.request = true

      this.axios.get('stock/'+id).then(res => {

        this.data = res.data.data
        this.filter = res.data.data

        this.request = false
      }).catch(err => {
        this.onError(err)
        this.request = false
      })
    },

    _search(keyword){
      let k = keyword.toString().toLowerCase(), data = this.data

      this.filter = []

      for (let i = 0; i < data.length; i++) {
        if(data[i].kode_barang.toString().toLowerCase().includes(k) || data[i].nama_barang.toString().toLowerCase().includes(k)){
          this.filter.push(data[i])
        }
      }
    },

    _loadBarang() {
      this.form.request = true
      let formData = {
        extra: 0,
        id_perusahaan: this.data.depo.id_perusahaan
      }

      this.axios.get('barang/list/simple', {
        params: formData
      }).then(res => {
        this.formItems = res.data.data;
        this.form.request = false

        setTimeout(() => {
          this.$refs.close.focus()
        }, 100);
      }).catch(err => {
        this.onError(err);
        this.form.request = false
      });
    },

    _loadHargaBarang(id_barang = null) {
      id_barang = id_barang || 0
      if(id_barang === 0){ return }
      this.harga_key = !this.harga_key
      this.harga = []
      this.form.request = true
      this.axios.get(`barang/${id_barang}/harga`, {
        params: {
          tipe_harga: 'dbp'
        }
      }).then( res => {
        this.harga_key = !this.harga_key
        this.form.request = false
        this.harga = res.data.data
      })
    },

    _add(){
      if(this.idCache != this.data.id || this.formItems.length == 0) {
        this._loadBarang()
        this.idCache = this.data.id
      }

      // clear form
      Object.assign(this.$data.formData, this.$options.data.call(this).formData);
      this.formData.id_penerimaan_barang = this.data.id

      setTimeout(() => {
        this.$refs.close.focus()
      }, 100);

      this.form.view = true
      this.form.title = 'Tambah Barang'
      this.form.action = () => {
        this.form.isSubmit = true

        this.axios.post('detail_penerimaan_barang', this.formData).then( res => {
          this.toast('Berhasil ditambahkan');
          this.items = res.data.data
          this.form.view = this.form.isSubmit = false
        }).catch( err => {
          this.onError(err);
          this.form.isSubmit = false;
        });
      }
    },

    _edit(data){
      if(this.idCache != this.data.id || this.formItems.length == 0){
        this._loadBarang()
        this.idCache = this.data.id
      }

      for (const key in this.formData) {
        this.formData[key] = data[key]
      }

      this._loadHargaBarang(this.formData.id_barang)

      this.formData.id_penerimaan_barang = this.data.id
      this.form.view = true
      this.form.title = 'Edit Barang'
      let url = this.data.is_approved == 0 ? `detail_penerimaan_barang/${data.id}` : `detail_penerimaan_barang/${data.id}/update_harga`
      this.form.action = () => {
        this.form.isSubmit = true
        this.axios.put(url, this.formData).then(res => {
          this.toast('Berhasil diperbarui');
          this.items = res.data.data
          this.form.view = this.form.isSubmit = false
        }).catch( err => {
          this.onError(err);
          this.form.isSubmit = false;
        });
      }
    },

    _delete(id){
      this.confirm.id = id
      this.confirm.title = 'Yakin ingin menghapus barang ini dari pengiriman?'
      this.confirm.action = () => {

        this.axios.delete('detail_penerimaan_barang/'+id).then(res => {
          this.items = res.data.data;
          this.toast('Berhasil dihapus');

          this.confirm.id = null
        }).catch( err => {
          this.onError(err);
          this.confirm.isSubmit = false
        });

      }
    },

    _confirm(){
      if(this.items.length == 0){
        this.toast('Barang tidak boleh kosong')
        this.tabActive = 1
      }else{
        this.isApproved = true

        this.axios.post('penerimaan_barang/'+this.data.id+(this.data.is_approved == 0 ? '/approve' : '/cancel_approval')).then(() => {
          this.toast(this.data.is_approved == 0 ? 'Berhasil disetujui' : 'Berhasil dibatalkan');
          this.data.is_approved = this.data.is_approved == 0 ? 1 : 0

          this.isApproved = false
        }).catch( err => {
          this.onError(err);
          this.isApproved = false
        });
      }
    },

    _print(){
      let doc = new jsPDF('p'), user = JSON.parse(localStorage.user);
      let styles = { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0 }

      let data = {
        terima_dari: this.data.nama_principal,
        nama_gudang: this.data.nama_gudang,
        tgl_datang: this.data.tgl_datang,
        tgl_bongkar: this.data.tgl_bongkar,
        perusahaan: this.data.perusahaan,
        depo: this.data.depo,
        no_pb: this.data.no_pb,
        no_do: this.data.no_do,
        no_pol: this.data.no_pol_kendaraan,
        no_spb: (this.data.no_spb == null ? '-' : this.data.no_spb),
        driver: this.data.driver,
        tgl_kirim: this.data.tgl_kirim,
        transporter: this.data.transporter,
        keterangan: this.data.keterangan,
        items: this.items,
        created_by: user.name,
        subtotal: this.data.subtotal,
        ppn: this.data.ppn
      }

      localStorage.penerimaan = JSON.stringify(data)
      window.open(window.location.origin+'/dashboard/inventory/penerimaan-barang/print', '_blank')
    },

    _initFooter(items){
      this.itemsFoot = []

      let labels = ['total qty','total pcs','subtotal','ppn','grand total'], arr = [0,0,0,0,0]
      for (let i = 0; i < items.length; i++) {
        arr[0] += items[i].qty
        arr[1] += items[i].qty_pcs
        arr[2] += items[i].subtotal
        arr[3] += items[i].ppn
        arr[4] += items[i].ppn + items[i].subtotal
      }

      for (let i = 0; i < labels.length; i++) {
        let rp = [2,3,4];
        this.itemsFoot.push({label: labels[i], value: rp.indexOf(i) > -1 ? 'Rp '+this.ribuan(arr[i]) : this.ribuan(arr[i])})
      }
    }

  },

  mounted(){
    document.addEventListener('keypress', (e) => {
      if(this.modal.open){
        let key = e.keyCode;

        if(!this.form.view && key == 110){ // 110 = n
          this._add()
        }

      }
    })
  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
          this.itemsHasLoaded = false
          this.itemsFoot = []
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
          this.tabActive = 0
        }, 100);
      }
    },

    tabActive(t){
      if(t == 1 && !this.itemsHasLoaded){
        this._getItems()
      }
    },

    initData: function(data) {
      this.data = data
      this.info = []

      let labels = ['No Penerimaan Barang','Dibongkar di Gudang','Terima Dari','No Delivery Order','No SPB','Tgl Kirim','Tanggal Datang','Tgl Terima / Bongkar','Transporter / Ekspedisi','No. Pol. Kendaraan','Driver','Keterangan'],
          keys = ['no_pb','nama_gudang','nama_principal','no_do','no_spb','tgl_kirim','tgl_datang','tgl_bongkar','transporter','no_pol_kendaraan','driver','keterangan'];

      for (let i = 0; i < labels.length; i++) {
        this.info.push({'label': labels[i], 'value': data[keys[i]]})
      }
    },

    items(items){
      this._initFooter(items)
    }

  }
};
</script>

<style lang="scss" src="../penerimaan.scss" scoped/>
