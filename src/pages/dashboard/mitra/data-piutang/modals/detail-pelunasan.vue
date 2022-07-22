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
                <h3 class="m-0"> {{config.title === null ? '&nbsp;' : config.title}} </h3>
                <div> <span v-html="data.id"></span> <span class="ml-2 badge" :class="data.paid_at == null ? 'bg-danger' : 'bg-success'" v-html="data.paid_at == null ? 'Belum Lunas' : 'Lunas ('+data.paid_at+')'"></span> </div>

                <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
              </div>

              <div class="card-tabs mb-0">
                <!-- Cards navigation -->

                <transition name="slide-fade-x">
                  <div class="btn-group float-right" v-if="tabActive === 1">
                    <button class="btn btn-outline-primary" :disabled="request" v-html="ic('refresh')" @click="_getItems()"/>
                    <button class="btn btn-outline-primary" v-if="data.status === 'approved' || data.status === 'delivered'" :disabled="isPrint" v-html="isPrint ? spin() : ic('printer')+' Cetak'" @click="_print"/>
                    <button class="btn btn-outline-primary" :disabled="request" @click="_add" v-html="ic('plus')"/>
                  </div>
                </transition>

                <ul class="nav nav-tabs">
                  <li class="nav-item" v-for="(tab, i) in ['Informasi Pelunasan','Daftar Pelunasan']" :key="i" @click="tabActive = i">
                    <span class="nav-link" :class="tabActive === i ? 'active' : ''" data-toggle="tab" v-html="tab"></span>
                  </li>
                </ul>
                <div class="tab-content">

                  <div class="card tab-pane" :class="tabActive === 0 ? ' active show' : ''">
                    <div class="card-body p-0">

                      <Skeleton type="list" :length="5" class="mt-3 bg-white m-2" v-if="request"/>

                      <transition name="slide-up">
                        <ul class="list-group list-stripped list-borderless" style="max-height: calc(100vh - 320px); overflow: auto" v-if="!request">
                          <li class="list-group-item" v-for="(row, i) in info" :key="i">
                            <div><b>{{row.label}}</b></div> <span v-html="row.value"></span>
                          </li>
                        </ul>
                      </transition>

                    </div>
                  </div>

                  <div class="card tab-pane" :class="tabActive === 1 ? ' active show' : ''">
                    <div class="card-body p-0 table-responsive " style="min-height: 350px">

                      <Skeleton type="table" :length="5" class="mt-3 bg-white m-2" v-if="request"/>
                      <Nodata v-if="!request && items.length === 0"/>

                      <transition name="slide-up">

                        <div class="table-dpb" v-if="!request && items.length > 0">
                          <table class="table table-v center table-hover card-table table-striped table-no-break">

                            <thead>
                              <tr class="text-muted">
                                <th>No</th>
                                <th>Waktu Pelunasan</th>
                                <th>Tipe Pembayaran</th>
                                <th>Nominal</th>
                                <th>Status</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(row, i) in items" :key="i">
                                <td>{{i + 1}}</td>
                                <td>{{dateFormat(row.tanggal)}}</td>
                                <td>{{row.tipe}}</td>
                                <td>{{'Rp '+ribuan(row.nominal)}}</td>
                                <td>
                                  <span class="badge w-100" :class="row.status === 'waiting' ? 'bg-orange' : row.status === 'approved' ? 'bg-success' : 'bg-danger'">
                                    {{row.status}}</span>
                                </td>
                                <td style="padding: 2px">
                                  <div class="btn-group" v-if="row.status === 'approved' || row.status === 'rejected'">
                                    <button class="btn btn-white btn-pill" :disabled="isConfirm" @click="_cancelConfirm(row)"> <i class="fe fe-rotate-ccw mr-2"></i> Batalkan </button>
                                  </div>

                                  <div class="btn-group" v-if="row.status === 'waiting'">
                                    <button class="btn btn-white btn-pill" :disabled="isConfirm" @click="_edit(row)" v-html="ic('edit')"> </button>
                                    <button class="btn btn-white btn-pill" :disabled="isConfirm" @click="_delete(row.id)" v-html="ic('trash')"> </button>

                                    <button class="btn btn-white btn-pill text-success" :disabled="isConfirm" @click="_confirm(row, 1)" v-html="ic('check')"> </button>
                                    <button class="btn btn-white btn-pill text-danger" :disabled="isConfirm" @click="_confirm(row, 0)" v-html="ic('close')"> </button>
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

            <div class="px-4 pt-3" v-if="tabActive === 1">
              <span class="badge-md strong mr-2" v-for="(row, i) in itemsFoot" :key="i"> {{ucwords(row.label)}} <span v-html="row.value"></span> </span>
            </div>

            <div class="px-4 py-4 text-right">
              <span v-html="spin()+' Konfirmasi...'" v-if="isConfirm" class="float-left"></span>
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
            </div>

            <!-- form add & edit item -->

            <transition name="slide-fade-x">

              <div class="form-item" v-show="form.view">

                <div class="card-header">
                  <h3 class="card-title" v-html="form.title"/>
                  <button type="button" class="close" @click="form.view = false" v-html="form.request ? spin() : ic('close')"/>
                </div>

                <form @submit.prevent="form.action">

                  <div class="card-body" style="overflow: auto; height: 465px">

                    <div class="form-group">
                      <label for="tanggal-pelunasan" class="form-label">Tanggal Pelunasan</label>
                      <input type="date" class="form-control" v-model="formData.tanggal" id="tanggal-pelunasan">
                    </div>

                    <div class="form-group">
                      <label class="form-label">Tipe Pembayaran</label>
                      <label class="form-check form-check-inline" v-for="(d, i) in ['tunai','transfer','bilyet_giro','saldo_retur','lainnya']" :key="i">
                        <input class="form-check-input" type="radio" name="tp" :value="d" v-model="formData.tipe">
                        <span class="form-check-label" v-html="ucwords(d.split('_').join(' '))"/>
                      </label>
                    </div>

                    <div class="alert alert-info" v-if="formData.tipe === 'saldo_retur'">
                      <span v-if="isLoadSaldoRetur" v-html="spin()+' Loading saldu retur'"></span> <span v-else>Saldo Retur : <b class="float-right">Rp {{ribuan(saldo_retur)}}</b></span>
                    </div>

                    <div class="form-group">
                      <label for="nominal" class="form-label">Nominal</label>
                      <input
                          id="nominal"
                          type="tel"
                          class="form-control"
                          placeholder="Nominal"
                          onfocus="this.select()"
                          @keypress="numberOnly($event)"
                          maxlength="11"
                          v-model="formData.nominal"
                          :required="formData.tipe === 'tunai'">
                    </div>

                    <div class="form-group" v-if="formData.tipe !== 'tunai' && formData.tipe !== 'saldo_retur' && formData.tipe !== 'lainnya'">
                      <label for="bank" class="form-label">Bank</label>
                      <input id="bank" type="tel" class="form-control" placeholder="Bank" number-only v-model="formData.bank">
                    </div>

                    <div class="form-group" v-if="formData.tipe !== 'tunai' && formData.tipe !== 'saldo_retur' && formData.tipe !== 'lainnya'">
                      <label for="no-rekening" class="form-label">No. Rekening</label>
                      <input id="no-rekening" type="tel" class="form-control" placeholder="No. Rekening" @keypress="numberOnly($event)" maxlength="11" v-model="formData.no_rekening">
                    </div>

                    <div class="form-group" v-if="formData.tipe === 'bilyet_giro'">
                      <label for="no-bg" class="form-label">No. Bilyet Giro</label>
                      <input id="no-bg" type="tel" class="form-control" placeholder="No. bilyet giro" @keypress="numberOnly($event)" maxlength="11" v-model="formData.no_bg">
                    </div>

                    <div class="form-group" v-if="formData.tipe === 'bilyet_giro'">
                      <label for="jatuh-tempo" class="form-label">Jatuh Tempo</label>
                      <input id="jatuh-tempo" type="date" class="form-control" v-model="formData.jatuh_tempo_bg">
                    </div>

                    <div class="form-group" v-if="formData.tipe === 'lainnya'">
                      <label for="keterangan" class="form-label">Keterangan</label>
                      <textarea id="keterangan" class="form-control" v-model="formData.keterangan" placeholder="Keterangan"></textarea>
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

      request: true, data: {}, tabActive: 0,
      info: [], items: [], itemsHasLoaded: false, itemsFoot: [],

      // data detail stock
      filter: [],
      keyword: '', saldo_retur: 0, belumBayar: 0,

      id_stock: null, hasChange: false,

      formData: {
        tanggal: this.dateTime('ymd'),
        id_penjualan: null,
        tipe: 'tunai',
        nominal: 0,
        bank: null,
        no_rekening: null,
        no_bg: null,
        jatuh_tempo_bg: null,
        keterangan: null
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

      isLoadSaldoRetur: false,
      isConfirm: false, isPrint: false
    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    _getItems(){
      this.request = true
      this.axios.get('detail_pelunasan_penjualan?per_page=10&page=1&keyword='+this.data.id).then( res => {
        this.request = false;
        this.items = res.data.data;
      }).catch( err => {
        this.onError(err);
        this.request = false
      });
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

      let api = this.initData == null ? "detail_penjualan/list/barang?id_penjualan=" : "detail_penjualan/list/barang_edit?id_penjualan=";
      this.axios.get( api+this.data.id ).then(res => {
        this.formItems = res.data.data;
        this._loadPromo()
      }).catch(err => {
        this.onError(err);
        this.form.request = false
      });

      this.axios.get('stock/'+this.data.id_gudang).then(res => {
        this.formItems = res.data.data;
        this.form.request = false
      }).catch(err => {
        this.onError(err);
        this.form.request = false
      });
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

    _add(){
      if(this.formItems.length === 0){
        this._loadBarang()
      }

      // clear form
      Object.assign(this.$data.formData, this.$options.data.call(this).formData);
      this.formData.id_penjualan = this.data.id
      this.form.view = true
      this.form.title = 'Tambah Pelunasan'
      this.form.action = () => {
        this.form.isSubmit = true

        this.axios.post('detail_pelunasan_penjualan', this.formData).then(res => {
          this.toast('Berhasil ditambahkan');
          this.items.splice(0, 0, res.data.data ); // insert to first index
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

      this.formData.id_penjualan = this.data.id

      this.form.view = true
      this.form.title = 'Edit Pelunasan'
      this.form.action = () => {
        this.form.isSubmit = true

        this.axios.put('detail_pelunasan_penjualan/'+data.id, this.formData).then(res => {
          this.toast('Berhasil diperbarui');

          this.findObject(this.items, 'id', data.id, (d, i) => {
            this.items[i] = res.data.data
          })

          this.form.view = this.form.isSubmit = false
        }).catch( err => {
          this.onError(err);
          this.form.isSubmit = false;
        });
      }
    },

    _delete(id){
      this.confirm.id = id
      this.confirm.title = 'Yakin ingin menghapus pembayaran ini dari pelunasan?'
      this.confirm.action = () => {

        this.axios.delete('detail_pelunasan_penjualan/'+id).then(() => {
          this.toast('Berhasil dihapus');

          this.findObject(this.items, 'id', id, (d, i) => {
            this.items.splice(i, 1)
          })

          this.confirm.id = null
        }).catch( err => {
          this.onError(err);
          this.confirm.isSubmit = false
        });
      }
    },

    _confirm(data, action){
      this.isConfirm = true
      let url = action === 1 ? 'detail_pelunasan_penjualan/approve/'+data.id : 'detail_pelunasan_penjualan/reject/'+data.id;
      this.axios.post(url).then(() => {
        this.findObject(this.items, 'id', data.id, (d, i) => {
          this.items[i].status = action === 1 ? 'approved' : 'rejected'
        })

        this.isConfirm = false
      }).catch( err => {
        this.onError(err);
        this.isConfirm = false
      });
    },

    _cancelConfirm(data){
      this.isConfirm = true
      this.axios.post('detail_pelunasan_penjualan/cancel_approval/'+data.id).then(() => {
        this.findObject(this.items, 'id', data.id, (d, i) => {
          this.items[i].status = 'waiting'
        })

        this.isConfirm = false
      }).catch( err => {
        this.onError(err);
        this.isConfirm = false
      });
    }
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
          this.itemsHasLoaded = false
          this.tabActive = 0
        }, 100);
      }
    },

    tabActive(t){
      if(t === 1 && !this.itemsHasLoaded){
        this._getItems()
      }
    },

    initData: function(data) {
      this.data = data
      this.info = []

      this.belumBayar = data.jumlah_belum_bayar;
      this.request = true

      this.axios.get('detail_pelunasan_penjualan/jumlah_belum_dibayar/'+data.id).then( res => {
        let value = res.data;

        let labels = ['No. PO','No. Invoice','Nama Toko','No. Acc','Cust No','Tanggal Penjualan','Jatuh Tempo','Jumlah Pembayaran','Jumlah Lunas','Jumlah Belum Bayar','Status'],
            values = [
              data.id,
              data.no_invoice,
              data.nama_toko,
              data.no_acc,
              data.cust_no,
              data.tanggal_penjualan,
              data.paid_at == null ? data.due_date+' ('+data.over_due+' hari)' : data.due_date+' (LUNAS)',
              'Rp '+this.ribuan(data.jumlah_pembayaran),
              'Rp '+this.ribuan(value.jumlah_lunas),
              'Rp '+this.ribuan(value.jumlah_belum_dibayar),
              data.paid_at == null ? 'Belum Lunas' : 'Lunas ('+data.paid_at+')'
            ]

        for (let i = 0; i < labels.length; i++) {
          this.info.push({'label': labels[i], 'value': values[i]})
        }

        this.request = false
      }).catch( err => {
        this.onError(err)
        this.request = false
      });
    },

    'formData.tipe': function(data){
      if(data == 'saldo_retur'){
        this.isLoadSaldoRetur = true
        this.axios('toko/get_saldo_retur/'+this.data.id_toko).then(res => {
          var sr = res.data.saldo_retur;
          this.saldo_retur = sr;

          this.formData.nominal = sr < this.belumBayar ? sr : this.belumBayar;
          this.isLoadSaldoRetur = false
        }).catch(err => {
          this.onError(err)
          this.isLoadSaldoRetur = false
        })
      }
    }

    // items(items){
    //   this.itemsFoot = []

    //   let labels = ['subtotal','diskon','net','ppn','total dus','total pcs','grand total'],
    //   keys = ['total','disc_total','net_total','ppn','total_qty','total_pcs','grand_total']

    //   for (let i = 0; i < labels.length; i++) {
    //     let rp = ['total_qty','total_pcs']
    //     this.itemsFoot.push({label: labels[i], value: rp.indexOf(keys[i]) < 0 ? 'Rp '+this.ribuan(this.data[keys[i]]+'|,2') : this.ribuan(this.data[keys[i]])})
    //   }
    // }

  }
};
</script>

<style lang="scss" src="../pelunasan.scss" scoped/>
