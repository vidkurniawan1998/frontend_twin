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
                <div> <span v-html="data.id"></span> <span class="badge ml-2" :class="data.status == 'waiting' ? 'bg-orange' : 'bg-green'" v-html="data.status == 'waiting' ? 'Menunggu' : 'Disetujui'"></span> </div>

                <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
              </div>

              <div class="card-tabs mb-0">
                <!-- Cards navigation -->

                <transition name="slide-fade-x">
                  <div class="btn-group float-right" v-if="tabActive == 1">
                    <button class="btn btn-outline-primary" :disabled="request" v-html="ic('refresh')" @click="_getItems()"/>
                    <button class="btn btn-outline-primary" v-if="data.status == 'approved'" v-html="ic('printer')+' Cetak'" @click="_print"/>
                    <button class="btn btn-outline-primary" v-if="data.status == 'waiting'" :disabled="request" @click="_add" v-html="ic('plus')"/>
                  </div>
                </transition>

                <ul class="nav nav-tabs">
                  <li class="nav-item" v-for="(tab, i) in ['Informasi Adjustment','Daftar Barang']" :key="i" @click="tabActive = i">
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
                                <th v-if="data.status == 'waiting'"></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(row, i) in items" :key="i" :id="'tr'+row.id">
                                <td>{{i + 1}}</td>
                                <td>{{row.kode_barang}} - {{row.nama_barang}}</td>
                                <td>{{ribuan(row.qty_adj)}} karton</td>
                                <td>{{ribuan(row.pcs_adj)}} {{row.satuan}}</td>
                                <td>{{'Rp '+ribuan(row.price_before_tax+'|,2')}}</td>
                                <td>{{'Rp '+ribuan(row.subtotal+'|,2')}}</td>
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

            <div class="px-4 py-4 text-right">
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
              <button type="button" v-if="data.status == 'waiting'" class="btn btn-primary ml-3" :disabled="isApproved" @click="_confirm" v-html="isApproved ? spin() : data.status == 'waiting' ? 'Approve' : 'Batal Setujui'" />

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
                      <label for="" class="form-label">Nama Barang</label>
                      <selectize v-model="formData.id_stock" data-placeholder="Pilih barang" required :disabled="form.request">
                        <option :value="b.id" v-for="(b, i) in formItems" :key="i"> {{b.kode_barang}} - {{b.nama_barang}}</option>
                      </selectize>
                    </div>

                    <div class="row">
                      <div class="col-6">

                        <div class="form-group">
                          <label for="" class="form-label">Qty Dus</label>
                          <input v-model="formData.qty_adj" type="tel" required onfocus="this.select()" @keypress="numberOnly($event)" maxlength="11" class="form-control" placeholder="Qty dus">
                        </div>

                      </div>
                      <div class="col-6">

                        <div class="form-group">
                          <label for="" class="form-label">Qty Pcs</label>
                          <input v-model="formData.pcs_adj" type="tel" required onfocus="this.select()" @keypress="numberOnly($event)" maxlength="11" class="form-control" placeholder="Qty pcs">
                        </div>

                      </div>
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
      info: [], items: [], itemsHasLoaded: false, itemsFoot: [],

      // data detail stock
      filter: [], keyword: '',

      id_stock: null, hasChange: false,

      formData: {
        id_adjustment: null,
        id_stock: null,
        qty_adj: 0,
        pcs_adj: 0,
      },

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
      this.axios.get('detail_adjustment/'+this.data.id+'/detail').then(res => {
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

      this.axios.get('stock/'+this.data.id_gudang).then(res => {
        this.formItems = res.data.data;
        this.form.request = false
      }).catch(err => {
        this.onError(err);
        this.form.request = false
      });
    },

    _add(){
      if(this.idCache != this.data.id || this.formItems.length == 0){
        this._loadBarang()
        this.idCache = this.data.id
      }

      // clear form
      Object.assign(this.$data.formData, this.$options.data.call(this).formData);
      this.formData.id_adjustment = this.data.id

      this.form.view = true
      this.form.title = 'Tambah Barang'
      this.form.action = () => {
        this.form.isSubmit = true

        this.axios.post('detail_adjustment', this.formData).then( res => {
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

      this.formData.id_adjustment = this.data.id

      this.form.view = true
      this.form.title = 'Edit Barang'
      this.form.action = () => {
        this.form.isSubmit = true

        this.axios.put('detail_adjustment/'+data.id, this.formData).then( res => {
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
      this.confirm.title = 'Yakin ingin menghapus barang ini dari adjustment?'
      this.confirm.action = () => {

        this.axios.delete('detail_adjustment/'+id).then(res => {
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

        this.axios.post('adjustment/'+this.data.id+(this.data.status == 'waiting' ? '/approve' : '/cancel_approval')).then(() => {
          this.toast(this.data.status == 'waiting' ? 'Berhasil disetujui' : 'Berhasil dibatalkan');
          this.data.status = this.data.status == 'waiting' ? 'approved' : 'waiting'

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
        id: this.data.id,
        no_adjustment: this.data.no_adjustment,
        nama_gudang: this.data.nama_gudang,
        depo: this.data.depo,
        perusahaan: this.data.perusahaan,
        tanggal: this.dateFormat(this.data.tanggal),
        pic: this.data.pic,
        keterangan: (this.data.keterangan == null ? '' : this.data.keterangan),
        items: this.items,
        total_qty: this.itemsFoot[0].value,
        total_pcs: this.itemsFoot[1].value,
        subtotal: this.itemsFoot[2].value
      }

      localStorage.adjustment = JSON.stringify(data)
      window.open(window.location.origin+'/dashboard/inventory/adjustment-barang/print', '_blank')


      // title
      // doc.autoTable(this.pdfHeader('ADJUSTMENT BARANG'))

      // doc.autoTable({ // header
      //   theme: 'plain', styles: styles, margin: { top: 10, left: 10, right: 10 },
      //   body: [
      //     ['PO : '+this.data.id, 'No. Adjustment : '+this.data.no_adjustment],
      //     ['Nama Gudang : '+this.data.nama_gudang, 'Tanggal : '+this.dateFormat(this.data.tanggal)],
      //     ['PIC : '+this.data.pic, 'Keterangan : '+(this.data.keterangan == null ? '' : this.data.keterangan)],
      //   ],
      // })

      // let dataAdjustment = [['No','Barang','Qty','Qty Pcs','Harga','Subtotal']], temp = [];

      // for(let i = 0; i < this.items.length; i++){
      //     let data = this.items[i];

      //     temp.push(i+1);
      //     temp.push(data.kode_barang+' - '+data.nama_barang);
      //     temp.push(data.qty_adj+' karton');
      //     temp.push(data.pcs_adj+' '+data.satuan);
      //     temp.push('Rp '+this.ribuan(data.price_before_tax+'|,2'));
      //     temp.push('Rp '+this.ribuan(data.subtotal+'|,2'));

      //     dataAdjustment.push(temp);
      //     temp = [];
      // }

      // styles['cellPadding'] = 2;

      // doc.autoTable({ // body
      //   theme: 'grid', styles: styles, margin: { top: 10, left: 10, right: 10 },
      //   body: dataAdjustment,
      // })

      // let footer = [
      //   ['Total Qty '+this.itemsFoot[0].value,'Total Pcs '+this.itemsFoot[1].value,'Subtotal '+this.itemsFoot[2].value],
      // ];

      // doc.autoTable({ // footer
      //   theme: 'grid', styles: styles, margin: { top: 10, left: 10, right: 10 }, tableWidth: 170,
      //   body: footer,
      // })

      // this.pdfDownload([ doc.output() ])
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
      if(t == 1 && !this.itemsHasLoaded){
        this._getItems()
      }
    },

    initData: function(data) { //console.log(data)
      this.data = data
      this.info = []

      let labels = ['PO','No Adjustment','Nama Gudang','Tanngal','Status','Pic','Keterangan'],
          keys = ['id','no_adjustment','nama_gudang','tanggal','status','pic','keterangan']

      for (let i = 0; i < labels.length; i++) {
        this.info.push({'label': labels[i], 'value': data[keys[i]]})
      }
    },

    items(items){
      this.itemsFoot = []

      let labels = ['total qty','total pcs','subtotal'], arr = [0,0,0]
      for (let i = 0; i < items.length; i++) {
        arr[0] += +items[i].qty_adj
        arr[1] += +items[i].pcs_adj
        arr[2] += +items[i].subtotal
      }

      for (let i = 0; i < labels.length; i++) {
        let rp = [2]
        this.itemsFoot.push({label: labels[i], value: rp.indexOf(i) > -1 ? 'Rp '+this.ribuan(arr[i]+'|,2') : this.ribuan(arr[i])})
      }
    }

  }
};
</script>

<style lang="scss" src="../adjustment.scss" scoped/>
