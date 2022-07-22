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
      <div class="modal-dialog modal-dialog-centered" role="document" ref="document" style="transition: .2s" :style="tabActive == 0 ? modal.width : 'max-width: 80%'">
        <div class="modal-content hidden-overflow">

            <div class="modal-body pt-3 pb-0">

              <div style="line-height: 17px" class="mb-4">
                <h3 class="m-0"> {{config.title == null ? '&nbsp;' : config.title}} </h3>
                <div> <span v-html="data.id"></span> <span class="badge ml-2" :class="data.status == 'waiting' ? 'bg-orange' : 'bg-green'" v-html="data.status == 'waiting' ? 'Menunggu' : 'Disetujui'"></span> </div>

                <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
              </div>

              <div class="card-tabs mb-0">
                <!-- Cards navigation -->

                <transition name="slide-fade-x">
                  <div class="btn-group float-right" v-if="tabActive == 1">
                    <button class="btn btn-outline-primary" :disabled="request" v-html="ic('refresh')" @click="_getItems()"/>
                    <button class="btn btn-outline-primary" :disabled="isPrint" v-html="isPrint ? spin() : ic('printer')+' Cetak'" @click="_print"/>
                    <button class="btn btn-outline-primary" v-if="data.status == 'waiting'" :disabled="request" @click="_add" v-html="ic('plus')"/>
                  </div>
                </transition>

                <ul class="nav nav-tabs">
                  <li class="nav-item" v-for="(tab, i) in ['Informasi Retur','Daftar Barang']" :key="i" @click="tabActive = i">
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
                                <th>Kode Barang</th>
                                <th>Nama Barang</th>
                                <th>Kategori Bs</th>
                                <th>Expired Date</th>
                                <th>Qty Dus</th>
                                <th>Qty Pcs</th>
                                <th>Harga</th>
                                <th>Subtotal</th>
                                <th v-if="data.status == 'waiting'"></th>
                              </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, i) in items" :key="i">
                                  <td> {{i + 1}} </td>
                                  <td> {{row.barang.kode_barang}} </td>
                                  <td>{{row.barang.nama_barang}}</td>
                                  <td>{{row.kategori_bs}}</td>
                                  <td>{{dateFormat(row.expired_date)}}</td>
                                  <td>{{row.qty_dus}}</td>
                                  <td>{{row.qty_pcs}}</td>
                                  <td>{{'Rp '+ribuan(row.harga)}}</td>
                                  <td>{{'Rp '+ribuan(row.subtotal_non_ppn)}}</td>
                                  <td style="padding: 2px" v-if="data.status == 'waiting'">
                                    <div class="btn-group">
                                      <button class="btn btn-white btn-pill" @click="_edit(row)" v-html="ic('edit')"> </button>
                                      <button class="btn btn-white btn-pill" @click="_delete(row.id)" v-html="ic('trash')"> </button>
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

            <div class="modal-footer pt-2">
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />

              <transition name="slide-fade-x">
                <button type="button" class="btn btn-primary" v-if="tabActive == 1 && data.status == 'waiting' || tabActive == 1 && _role('Unapprove Retur Penjualan')" :disabled="isApproved" @click="_confirm" v-html="isApproved ? spin() : data.status == 'waiting' ? 'Approve' : 'Batal Setujui'" />
              </transition>

            </div>

            <!-- form add & edit item -->

            <transition name="slide-fade-x">

              <div class="form-item" v-show="form.view">

                <div class="card-header">
                  <h3 class="card-title" v-html="form.title"/>
                  <button type="button" class="close" @click="form.view = false" v-html="form.request ? spin() : ic('close')"/>
                </div>

                <form @submit.prevent="form.action">

                  <div class="card-body">

                    <div class="form-group">
                      <label for="barang" class="form-label">Pilih Barang</label>
                      <selectize id="barang" v-model="formData.id_barang" data-placeholder="Pilih barang" required :disabled="request">
                        <option :value="d.id" v-for="(d, i) in formItems" :key="i"> {{d.kode_barang}} - {{d.nama_barang}} </option>
                      </selectize>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Tipe Retur Barang</label>
                      <label class="form-check form-check-inline" v-for="(d, i) in tipe_retur" :key="i">
                        <input class="form-check-input" type="radio" name="tipe_pembayaran" :value="d.value" v-model="formData.kategori_bs">
                        <span class="form-check-label" v-html="d.text"/>
                      </label>
                    </div>

                    <div class="form-group">
                      <label for="expired" class="form-label">Tanggal Expired</label>
                      <input id="expired" type="date" class="form-control" v-model="formData.expired_date" required>
                    </div>

                    <div class="form-group">
                      <label for="dus" class="form-label">Banyak Dus</label>
                      <input id="dus" type="tel" class="form-control" placeholder="Banyak dus" onfocus="this.select()" @keypress="numberOnly($event)" v-model="formData.qty_dus">
                    </div>

                    <div class="form-group">
                      <label for="pcs" class="form-label">Banyak Pcs</label>
                      <input id="pcs" type="tel" class="form-control" placeholder="Banyak pcs" onfocus="this.select()" @keypress="numberOnly($event)" v-model="formData.qty_pcs">
                    </div>

                  </div>

                  <div class="card-footer text-right">
                    <button type="button" class="btn btn-white" @click="form.view = false" v-html="'Tutup'"></button>
                    <button type="submit" class="btn btn-primary ml-3" :disabled="form.isSubmit || form.request" v-html="form.isSubmit ? spin() : 'Simpan'"></button>
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
import "jspdf-autotable";
import {mapActions} from 'vuex';

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
        width: 0
      },

      request: false, data: {}, tabActive: 0,
      info: [], items: [], itemsHasLoaded: false, itemsFoot: [],

      // data detail stock
      filter: [],
      keyword: '',

      id_stock: null, hasChange: false,

      formData: {
        id_retur_penjualan: null,
        id_barang: null,
        kategori_bs: 'kd',
        expired_date: null,
        qty_dus: 0,
        qty_pcs: 0,
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

      isApproved: false, isPrint: false,

      tipe_retur: [],
    };
  },

  methods: {
    ...mapActions('option', ['getOptionsByCode']),
    close() {
      this.$emit("update:config", { view: false });
    },

    _getItems(){
      this.request = true
      this.axios.get('detail_retur_penjualan/'+this.data.id+'/detail?per_page=all').then(res => {
        this.items = res.data.data
        this.request = false
        this.itemsHasLoaded = true
      }).catch( err => {
        this.onError(err);
        this.request = false
      });
    },

    _loadBarang(){
      this.form.request = true
      this.axios('barang?per_page=all').then(res => {
        this.formItems = res.data.data;
        this.form.request = false
      }).catch(err => {
        this.onError(err);
        this.form.request = false
      })
    },

    _add(){
      if(this.formItems.length == 0){
        this._loadBarang()
      }

      // clear form
      Object.assign(this.$data.formData, this.$options.data.call(this).formData);
      this.formData.id_retur_penjualan = this.data.id

      this.form.view = true
      this.form.title = 'Tambah Barang'
      this.form.action = () => {
        this.form.isSubmit = true

        this.axios.post("detail_retur_penjualan", this.formData).then(res => {
          this.toast(res.data.message);
          this.items.splice(0, 0, res.data.data);
          // UPDATE GRAND TOTAL
          this.data.ppn         = res.data.updated.ppn
          this.data.subtotal    = res.data.updated.subtotal
          this.data.grand_total = res.data.updated.grand_total
          // this.initFooter(this.items)
          this.form.view = this.form.isSubmit = false
        }).catch( err => {
          this.onError(err);
          this.form.isSubmit = false;
        });
      }
    },

    _edit(data){
      if(this.formItems.length === 0){
        this._loadBarang()
      }

      for (const key in this.formData) {
        this.formData[key] = data[key]
      }

      this.formData.id_retur_penjualan = this.data.id

      this.form.view = true
      this.form.title = 'Edit Barang'
      this.form.action = () => {
        this.form.isSubmit = true

        this.axios.put('detail_retur_penjualan/'+data.id, this.formData).then(res => {
          this.toast(res.data.message);
          // update
          this.findObject(this.items, 'id', data.id, (d, i) => {
            let _data = this.items[i]

            for (const key in _data) {
              _data[key] = res.data.data[key]
            }
          })

          // UPDATE GRAND TOTAL
          this.data.ppn         = res.data.updated.ppn
          this.data.subtotal    = res.data.updated.subtotal
          this.data.grand_total = res.data.updated.grand_total

          this.initFooter(this.items)

          this.form.view = this.form.isSubmit = false
        }).catch( err => {
          this.onError(err);
          this.form.isSubmit = false;
        });
      }
    },

    _delete(id){
      this.confirm.id = id
      this.confirm.title = 'Yakin ingin menghapus barang ini dari retur penjualan?'
      this.confirm.action = () => {

        this.axios.delete('detail_retur_penjualan/'+id).then((res) => {
          this.findObject(this.items, 'id', id, (d, i) => {
            this.items.splice(i, 1)
          })

          this.toast(res.data.message);
          this.confirm.id = null
          // UPDATE GRAND TOTAL
          this.data.ppn         = res.data.updated.ppn
          this.data.subtotal    = res.data.updated.subtotal
          this.data.grand_total = res.data.updated.grand_total
          this.initFooter(this.items)
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

        if(this.data.status == 'waiting'){
          this.axios.post('retur_penjualan/'+this.data.id+(this.data.status == 'waiting' ? '/approve' : '/cancel_approval')).then(() => {
            this.toast(this.data.status == 'waiting' ? 'Berhasil disetujui' : 'Berhasil dibatalkan');
            this.data.status = this.data.status == 'waiting' ? 'approved' : 'waiting'

            this.isApproved = false
          }).catch( err => {
            this.onError(err);
            this.isApproved = false
          });
        }else{
          this.axios.put('retur_penjualan/'+this.data.id+'/unapprove').then(() => {
            this.toast(this.data.status == 'waiting' ? 'Berhasil disetujui' : 'Berhasil dibatalkan');
            this.data.status = this.data.status == 'waiting' ? 'approved' : 'waiting'

            this.isApproved = false
          }).catch( err => {
            this.onError(err);
            this.isApproved = false
          });

        }
      }
    },

    _getJenisReturBarang() {
      this.getOptionsByCode('jenis_retur_barang').then( res => {
        this.tipe_retur = res
      })
    },

    _print(){
      let _data = this.data

      let data = {
        id: _data.id,
        id_depo : _data.id_depo,
        no_retur_manual: _data.no_retur_manual,
        customer: _data.toko.nama_toko,
        team: _data.salesman.tim.nama_tim,
        alamat: _data.toko.alamat,
        salesman: _data.salesman.user.name,
        npwp: _data.npwp,
        pic: _data.pic,
        account: _data.toko.no_acc,
        gudang: _data.gudang.nama_gudang,
        sales_retur_date: _data.sales_retur_date,
        kategori: _data.tipe_barang,
        items: this.items,
        total_dus: this.itemsFoot[1].value,
        total_pcs: this.itemsFoot[2].value,
        ppn: _data.ppn,
        subtotal: _data.subtotal,
        grand_total: _data.grand_total,
        retur_value: this.itemsFoot[0].value,
        status: _data.status,
        alamat_depo: _data.alamat_depo,
        nama_depo: _data.nama_depo,
        kabupaten_depo: _data.kabupaten_depo,
        telp_depo: _data.telp_depo,
        fax_depo: _data.fax_depo,
        nama_perusahaan: _data.nama_perusahaan
      }

      localStorage.retur = JSON.stringify(data)
      window.open(window.location.origin+'/dashboard/sales/retur-penjualan/print', '_blank')
    },

    initFooter(items){
      this.itemsFoot = []
      let labels = ['subtotal','total dus','total pcs','Ppn','Grand Total'],
      keys = ['subtotal','qty_dus','qty_pcs','ppn',''], arr = [0,0,0,0,0]

      arr[0] = this.data.subtotal
      arr[3] = this.data.ppn
      arr[4] = this.data.grand_total

      for (let i = 0; i < items.length; i++) {
        let rp = ['subtotal','ppn']
        arr[1] += +items[i].qty_dus
        arr[2] += +items[i].qty_pcs
      }

      for (let i = 0; i < labels.length; i++) {
        let rp = [0,3,4]
        this.itemsFoot.push({label: labels[i], value: rp.indexOf(i) > -1 ? 'Rp '+this.ribuan(arr[i]+'|,2') : this.ribuan(arr[i])})
      }
    }

  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
          let mod = this.$refs.document.getBoundingClientRect()
          this.modal.width = mod.width
          if (this.tipe_retur.length === 0) this._getJenisReturBarang()

        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop       = view;
          this.itemsHasLoaded = false
          this.tabActive      = 0
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

      let labels = ['no return penjualan','no retur toko','nama toko','no. acc','cust. no','alamat','NPWP','gudang','tipe barang','tanggal','status','keterangan','nama sales','nama tim'],
          values = [
            data['id'],
            data['no_retur_manual'],
            data['toko']['nama_toko'],
            data['toko']['no_acc'],
            data['toko']['cust_no'],
            data['toko']['alamat'],
            data['npwp'],
            data['gudang'] == null ? '-' : data.gudang.nama_gudang,
            data['tipe_barang'],
            this.dateFormat(data['sales_retur_date']),
            data['status'],
            data['keterangan'],
            data['salesman']['user']['name'],
            data['salesman']['tim']['nama_tim']
          ]

      for (let i = 0; i < labels.length; i++) {
        this.info.push({'label': this.ucwords(labels[i]), 'value': values[i]})
      }
    },

    items(items){
      this.initFooter(items)
    }

  }
};
</script>

<style lang="scss" src="../retur-penjualan.scss" scoped/>
