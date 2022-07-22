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
            </div>

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

<style lang="scss" src="../retur_report.scss" scoped/>
