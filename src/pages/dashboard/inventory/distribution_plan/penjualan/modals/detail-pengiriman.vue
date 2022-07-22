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
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document" ref="document" :style="modal.style">
        <div class="modal-content hidden-overflow">

          <div class="modal-body pt-3 pb-0" style="min-height: 350px">

            <div style="line-height: 17px" class="mb-4">
              <h3 class="m-0"> {{config.title == null ? '&nbsp;' : config.title}} </h3>
              <!-- <div> <span v-html="data.id"></span> <span class="badge ml-2" :class="data.status == 'waiting' ? 'bg-orange' : data.status == 'approved' ? 'bg-green' : 'bg-info'" v-html="data.status"></span> </div> -->

              <div class="info-header mt-3">
                <div class="mb-1" v-for="(row, i) in info.filter((item, index) => index < 14 || index > 16 )" :key="i" :class="i == 0 ? 'click-able text-primary' : ''" @click="i == 0 ? [copyToClipboard('nopo'), toast(row.value+' disalin')] : false">
                  {{row.label}} <span v-html="i == 0 ? row.value+' <i class=\'ml-1 la la-copy\'></i>' : row.value" :class="i == 0 ? 'text-primary' : ''" :id="'nopo'"></span>
                </div>
              </div>

              <!-- <button type="button" class="btn-link btn px-0 text-dark" v-html="!modal.expanded ? ic('maximize') : ic('minimize')" @click="_expand"/>
              <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/> -->

              <div class="modal-control">
                <button class="btn-modal-control" v-html="ic('refresh')" @click="_get(data.id)" :disabled="request"/>
                <button class="btn-modal-control" v-html="!modal.expanded ? ic('maximize') : ic('minimize')" @click="_expand"/>
                <button class="btn-modal-control" v-html="request ? spin() : ic('close')" @click="close()"/>
              </div>
            </div>

            <div class="card-tabs mb-0 modal-card">
              <div class="tab-content">

                <div class="card tab-pane" :class="tabActive == 0 ? ' active show' : ''">
                  <div class="card-body p-0 table-responsive" style="min-height: 350px">

                    <Skeleton type="table" :length="5" class="mt-3 bg-white m-2" v-if="request"/>
                    <Nodata v-if="!request && items.length == 0"/>

                    <transition name="slide-up">

                      <div class="table-dpb" v-if="!request && items.length > 0">
                        <table class="table table-v center table-hover card-table table-striped table-no-break">

                          <thead>
                          <tr class="text-muted">
                            <th>No</th>
                            <th>Kode Barang</th>
                            <th>Nama Barang</th>
                            <th class="text-center">Qty/Pcs Order</th>
                            <th class="text-center">Qty/Pcs Ship</th>
                            <th>Harga</th>
                            <th>Sub Total</th>
                            <th>Diskon</th>
                            <th>Net</th>
                            <th v-if="data.status == 'waiting'"></th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="(row, i) in items" :key="i">
                            <td>{{i+1}}</td>
                            <td>{{row.kode_barang}}</td>
                            <td>{{row.nama_barang}}</td>
                            <td class="text-center">{{ribuan(row.order_qty)}} / {{row.order_pcs}}</td>
                            <td class="text-center">{{ribuan(row.qty)}} / {{row.qty_pcs}}</td>
                            <td>{{ ribuan(row.harga_barang+'|Rp |,2') }}<br/>
                              <small class="text small">{{row.tipe_harga}}</small>
                            </td>
                            <td>{{ ribuan(row.subtotal+'|Rp |,2') }}</td>
                            <td> {{ ribuan(row.discount+'|Rp |,2') }} <br/>
                              <small class="text small">{{row.nama_promo}}</small>
                            </td>
                            <td >{{ ribuan(row.net+'|Rp |,2') }}</td>

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

          <div class="px-4 pt-3" v-if="tabActive == 0">
            <span class="badge-md strong mr-2" v-for="(row, i) in itemsFoot" :key="i"> {{ucwords(row.label)}} <span v-html="row.value"></span> </span>
          </div>

          <div class="px-4 py-4 text-right">
            <button type="button" class="btn btn-white float-left" @click="_location"> <i class="fe fe-map-pin mr-2"></i> Lihat Lokasi </button>

            <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />

          </div>

          <!-- form add & edit item -->

          <transition name="slide-fade-x">

            <div class="form-item" v-show="form.view">
              <div class="fi-body">

                <div class="card-header">
                  <h3 class="card-title" v-html="form.title"/>
                  <button type="button" class="close" @click="form.view = false" v-html="form.request ? spin() : ic('close')"/>
                </div>

                <form @submit.prevent="form.action">

                  <div class="card-body">

                    <div class="form-group">
                      <label for="nama-barang" class="form-label">Nama Barang</label>
                      <selectize v-model="formData.id_stock" data-placeholder="Pilih barang" required :disabled="form.request" id="nama-barang">
                        <option :value="b.id" v-for="(b, i) in formItems" :key="i"> {{b.kode_barang}} - {{b.nama_barang}}</option>
                      </selectize>
                    </div>

                    <div class="row">
                      <div class="col-6">

                        <div class="form-group">
                          <label for="qty-dus" class="form-label">Qty Dus</label>
                          <input v-model="formData.qty" type="tel" onfocus="this.select()" id="qty-dus" required @keypress="numberOnly($event)" maxlength="11" class="form-control" placeholder="Qty dus">
                        </div>

                      </div>
                      <div class="col-6">

                        <div class="form-group">
                          <label for="qty-pcs" class="form-label">Qty Pcs</label>
                          <input v-model="formData.qty_pcs" type="tel" onfocus="this.select()" id="qty-pcs" required @keypress="numberOnly($event)" maxlength="11" class="form-control" placeholder="Qty pcs">
                        </div>

                      </div>
                    </div>

                    <!-- <div class="alert alert-info">
                      <span > ({{'Stock = '+ribuan(dataStock.qty)+', Waiting = '+ribuan(dataStock.qty_waiting)+', Available = '+ribuan(dataStock.qty_available)}}) </span>
                    </div> -->

                    <div class="form-group">
                      <label class="form-label">Promo</label>
                      <selectize v-model="formData.id_promo" data-placeholder="Pilih promo">
                        <option :value="0">Tanpa Promo</option>
                        <option :value="d.id" v-for="(d, i) in formPromo" :key="i">{{d.nama_promo}}</option>
                      </selectize>
                    </div>

                  </div>

                  <div class="card-footer text-right">
                    <button type="button" class="btn btn-white" @click="form.view = false" v-html="'Tutup'"></button>
                    <button type="submit" class="btn btn-primary ml-3" :disabled="form.isSubmit || form.request" v-html="form.isSubmit ? spin() : 'Simpan'"></button>
                  </div>

                </form>

              </div>
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
        expanded: false,
        width: null,

        style: {}
      },

      request: false, data: {}, tabActive: 0, idCache: null,
      info: [], items: [], itemsHasLoaded: false, itemsFoot: [], dataStock: {},

      // data detail stock
      filter: [],
      keyword: '',

      id_stock: null, hasChange: false,

      formData: {
        id_penjualan: null,
        id_stock: null,
        qty: 0,
        qty_pcs: 0,
        id_harga: null,
        id_promo: 0
      },

      form: {
        view: false, request: false,
        title: null, isSubmit: false,
        action: () => {}
      },

      formItems: [], formPromo: [],
      confirm: {
        id: null, title: null, isSubmit: false, action: () => {}
      },

      isApproved: false, isPrint: false

    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    _expand(){
      this.modal.style = {
        'transition': '.3s', 'max-width': '90%'
      }

      if(this.modal.expanded){
        this.modal.style['max-width'] = this.modal.width+'px'
      }

      this.modal.expanded = !this.modal.expanded
    },

    _getItems(){
      console.log(this.data)
      this.request = true
      this.axios.get("detail_penjualan/" + this.data.id + "/detail").then(res => {
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

      this.axios.get('penjualan/distribusi/penjualan', {
        params: {
          id_penjualan: id
        }
      }).then(res => {
        this.data = res.data.data
        this.filter = res.data.data

        this._getItems()
      }).catch(err => {
        this.onError(err)
        this.request = false
      })
    },

    _loadPromo() {
      this.form.request = true
      this.axios.get("promo/list/aktif").then(res => {
        this.formPromo = res.data.data;
        this.form.request = false
      }).catch(err => {
        this.onError(err);
        this.form.request = false
      });
    },

    _loadStock(id_stock){
      this.form.request = true
      this.axios.get('stock/detail/'+id_stock).then(res => {
        this.dataStock = res.data.data;
        this.form.request = false
      }).catch(err => {
        this.onError(err);
        this.form.request = false
      });
    },

    _location(){
      let lat = this.data.toko[0].latitude, lon = this.data.toko[0].longitude
      if(lat == null || lon == null){
        this.toast('Lokasi tidak ditemukan');
      }else{
        window.open('https://www.google.com/maps/search/?api=1&query='+lat+','+lon+'', '_blank');
      }
    },

    _initHeader(data){
      this.info = []

      let labels = ['No. PO', 'No. Invoice', 'Nama Toko','No ACC','Cust No','Alamat','Salesman','Tim','Gudang','Tanggal','Tipe Toko','Tipe Pembayaran','Tipe Harga','Status','Diinput Pada','Disetujui Pada','Terkirim Pada','Keterangan'],
          values = [
            data.po_manual == null || data.po_manual == '' ? data.id : data.po_manual,
            data.no_invoice == null ? '-' : data.no_invoice,
            data.toko.nama_toko,
            data.toko.no_acc,
            data.toko.cust_no,
            data.toko.alamat,
            data.salesman.nama_salesman,
            data.salesman.tim.nama_tim,
            data.gudang == null ? data.salesman.gudang : data.gudang.nama_gudang,
            data.tanggal,
            data.toko.tipe,
            data.tipe_pembayaran,
            data.tipe_harga,
            data.status,
            data.created_at,
            data.approved_at === '' ? '-' : data.approved_at,
            data.delivered_at === '' ? '-' : data.delivered_at,
            data.keterangan
          ]

      for (let i = 0; i < labels.length; i++) {
        this.info.push({'label': labels[i], 'value': values[i]})
      }
    },
  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        this.form.view = false
        this.tabActive = 0

        setTimeout(() => {
          if(this.modal.width == null){
            let mod = this.$refs.document.getBoundingClientRect()
            this.modal.width = mod.width

            setTimeout(() => {
              this._expand()
            }, 100);
          }

          this._getItems()
          this.modal.open = view;
        }, 200);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
          this.itemsHasLoaded = false
          this.tabActive = 0
        }, 100);
      }
    },

    tabActive(t){
      if(t == 0 && !this.itemsHasLoaded){
        this._getItems()
      }
    },

    initData: function(data) {
      this.data = data
      this._initHeader(this.data)
    },

    'data.status': function(){
      console.log(this.data)
      this._initHeader(this.data)
    },

    'formData.id_stock': function(id){
      // this._loadStock(id)
    },

    items(items){
      this.itemsFoot = []

      let labels = ['subtotal','diskon','net','ppn','total dus','total pcs','grand total'],
          keys = ['total','disc_total','net_total','ppn','total_qty','total_pcs','grand_total']
      for (let i = 0; i < labels.length; i++) {
        let rp = ['total_qty','total_pcs']
        this.itemsFoot.push({label: labels[i], value: rp.indexOf(keys[i]) < 0 ? 'Rp '+this.ribuan(this.data[keys[i]]+'|,2') : this.ribuan(this.data[keys[i]])})
      }
    }

  }
};
</script>

<style lang="scss" src="../../../../sales/penjualan/penjualan.scss" scoped/>
