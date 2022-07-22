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
      <div class="modal-dialog modal-dialog-centered" role="document" ref="document" :style="modal.style">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" v-html="modal.tab == 1 ? 'Penjualan Baru' : 'Penjualan Baru - Input Barang'"></h5>
            <button type="button" class="close" @click="close()" v-html="request || gudang.request || barang.request || promo.request ? spin() : ic('close')"/>
          </div>

          <!-- <form @submit.prevent="submit"> -->
          <div class="modal-body modal-body-pb" :class="modal.tab == 2 ? 'p-0' : ''" ref="modal">
            <div class="row">
              <div class="form-group col-md-12">
                <label for="mitra" class="form-label">Pilih Mitra</label>
                <selectize id="mitra" v-model="data.id_mitra" data-placeholder="Pilih Mitra" :disabled="loading">
                  <option value="0">Tanpa Mitra</option>
                  <option :value="row.id" v-for="(row, i) in mitra" :key="i"> {{row.perusahaan}} </option>
                </selectize>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <label for="tanggal" class="form-label">Tanggal</label>
                <input type="date" id="tanggal" class="form-control" v-model="data.tanggal" required>
              </div>

              <div class="form-group col-md-6">
                <label for="po-manual" class="form-label">No. PO Toko</label>
                <input type="text" id="po-manual" class="form-control" v-model="data.po_manual" placeholder="No. po toko" ref="po" @keypress="$event.keyCode == 13 ? $refs.salesman.getElementsByTagName('input')[0].focus() : false">
              </div>

              <div class="form-group col-md-12" ref="salesman">
                <label for="salesman" class="form-label">Pilih Salesman</label>
                <selectize id="salesman" v-model="data.id_salesman" data-placeholder="Pilih salesman" :disabled="loading || sales.data.length == 0" @input="$refs.toko.focus()">
                  <option :value="row.id" v-for="(row, i) in sales.data" :key="i"> {{row.nama_salesman}} </option>
                </selectize>
              </div>

              <div class="form-group col-md-12">
                <label for="toko" class="form-label">Pilih Toko <span class="form-label-description" v-html="toko.data.length == 0 ? 'Tidak ada toko' :toko.data.length+' toko'"/> </label>
                <div id="toko" class="input-group" v-if="toko.search">
                  <input type="text" class="form-control" placeholder="Cari toko" v-model="toko.keyword" :readonly="toko.request" @keypress="$event.keyCode == 13 ? $refs.search.click() : false" ref="toko">
                  <button class="btn btn-white" type="button" v-html="toko.request ? spin() : ic('search')" @click="getToko" :disabled="toko.request" ref="search"/>
                </div>
                <div class="form-group" v-else>
                  <div style="width: calc(100% - 65px); display: inline-block" ref="toko">
                    <selectize v-model="data.id_toko" data-placeholder="Piih toko" @input="$refs.gudang.getElementsByTagName('input')[0].focus()">
                      <option :value="row.id" v-for="(row, i) in toko.data" :key="i"> {{row.no_acc+' - '+row.nama_toko}} </option>
                    </selectize>
                  </div>
                  <div style="width: 50px; display: inline-block" class="ml-2">
                    <button class="btn btn-white" v-html="ic('keyboard')" @click="_searchToko"/>
                  </div>
                </div>
              </div>

              <div class="form-group" ref="gudang">
                <label for="gudang" class="form-label">Pilih Gudang <span class="form-label-description" v-html="barang.data.length === 0 ? 'Tidak ada data barang' : barang.data.length+' barang'"/> </label>
                <selectize id="gudang" v-model="data.id_gudang" data-placeholder="Pilih gudang" :disabled="loading || barang.request" @input="$refs.tipe.getElementsByTagName('input')[0].focus()">
                  <option :value="row.id" v-for="(row, i) in gudang.data" :key="i"> {{row.nama_gudang}} </option>
                </selectize>
              </div>

              <div class="form-group">
                <label class="form-label">Tipe Pembayaran</label>
                <div class="selectgroup w-50">
                  <label class="selectgroup-item" v-for="(d, i) in ['cash','credit']" :key="i">
                    <input type="radio" name="tp" :value="d" class="selectgroup-input" v-model="data.tipe_pembayaran">
                    <span class="selectgroup-button" v-html="d.toUpperCase()"></span>
                  </label>
                </div>
              </div>

              <div class="form-group" ref="tipe">
                <label for="tipe-harga" class="form-label">Tipe Harga</label>
                <selectize id="tipe-harga" v-model="data.tipe_harga" data-placeholder="Pilih tipe harga" :disabled="request" @input="$refs.keterangan.focus()">
                  <option :value="row.tipe_harga.toLowerCase()" v-for="(row, i) in harga.data" :key="i"> {{row.tipe_harga}} </option>
                </selectize>
              </div>

              <div class="form-group">
                <label class="form-label">Keterangan</label>
                <textarea class="form-control" placeholder="Inputkan keterangan" v-model="data.keterangan" ref="keterangan"></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-white" @click="modal.tab === 1 ? close() : modal.tab = 1;" v-html="modal.tab === 1 ? 'Tutup' : 'Kembali'" />
            <button
                class="btn btn-primary ml-3" :disabled="isSubmit || data.id_toko == null || data.id_gudang == null || data.id_salesman == null || barang.request || barang.data.length == 0"
                v-html="modal.tab == 1 ? 'Input Barang' : isSubmit ? spin() : 'Simpan'" ref="submit"
                @click="submit"
            />
          </div>
          <!-- </form> -->
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
        tab: 1, default: {}, style: {}, tab2Style: {}
      },

      request: false, requestIndex: -1,

      toko: {
        keyword: '', request: false, search: true,
        data: [],
      },

      gudang: {
        request: false, data: []
      },

      sales: {
        request: false, data: []
      },

      barang: {
        request: false, data: [], isi: 0
      },

      promo: {
        request: false, data: []
      },

      harga: {
        request: false, data: []
      },

      header: [], mitra: [],

      data: {
        id_toko: null,
        id_gudang: null,
        po_manual: '',
        tanggal: this.dateTime('ymd'),
        tipe_pembayaran: 'cash',
        tipe_harga: 'rbp',
        id_salesman: null,
        keterangan: '',
        id_mitra: 0,
      }
    };
  },
  computed: {
    ...mapState(['loading'])
  },
  methods: {
    ...mapActions('mitra', ['getListMitra']),
    ...mapActions('salesman', ['getListSalesman']),
    ...mapActions('gudang', ['getListGudang']),
    close() {
      this.$emit("update:config", { view: false });
    },

    submit() {
      this.$emit('update:isSubmit', true)
      this.$emit('submit', this.data);
    },

    getToko(){
      if(this.toko.keyword.length < 2){
        this.$refs.toko.focus()
      }else{
        let sales = this.sales.data.find(item => item.id == this.data.id_salesman)

        this.toko.request = true
        this.axios.get('toko?keyword='+this.toko.keyword+'&id_tim='+sales.id_tim).then(res => {
          this.$refs.toko.focus()

          if(res.data.data.length !== 0){
            this.toko.search = false
          }

          this.toko.keyword = ''
          this.toko.request = false
          this.toko.data = res.data.data

          setTimeout(() => {
            if(res.data.data.length !== 0){
              this.$refs.toko.getElementsByTagName('input')[0].focus()
            }
          }, 50);
        }).catch(err => {
          this.onError(err)
          this.toko.request = false
        })
      }
    },

    _searchToko(){
      this.toko.search = true

      setTimeout(() => {
        this.$refs.toko.focus()
      }, 50);
    },

    getGudang(){
      this.getListGudang({}).then( res => {
        this.gudang.data = res
      })
    },

    getSalesman(){
      this.getListSalesman({}).then( res => {
        this.sales.data = res
      })
    },

    getMitra() {
      this.getListMitra().then( res => {
        this.mitra = res
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

    getBarang(id){
      this.barang.request = true
      this.axios.get('detail_penjualan/list/barang_by_gudang/'+id).then(res => {
        this.barang.request = false
        this.barang.data = res.data.data
        this.barang.isi = 0

        this.data.items = [{ id_stock: null, harga: 0, order_qty: 0, order_pcs: 0, id_promo: 0, subtotal: 0, net: 0 }]

      }).catch(err => {
        this.onError(err)
        this.barang.request = false
      })
    },
  },

  mounted(){
    document.addEventListener('keypress', (e) => {
      if(this.modal.tab == 1 && e.keyCode == 13){
        this.$refs.submit.click()
      }
    })
  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          if(this.modal.default.width == null){
            let mod = this.$refs.document.getBoundingClientRect()
            this.modal.default.width = mod.width
          }

          this.modal.open = view;
          this.$refs.po.focus()
          if(this.gudang.data.length === 0) this.getGudang()
          if(this.sales.data.length === 0) this.getSalesman()
          if(this.harga.data.length === 0) this.getTipeHarga()
          if(this.mitra.length === 0) this.getMitra()
        }, 200);
      } else {
        this.modal.open = view;

        if(this.isSubmit){
          this.modal.tab = 1
          this.toko.search = true
          Object.assign(this.$data.data, this.$options.data.call(this).data)
        }

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
          this.data[key] = data[key]
        }
      }
    },

    'data.id_gudang': function(id){
      this.getBarang(id)
    },
  }
};
</script>

<style lang="scss" scoped src="../penjualan.scss"/>
<style>

.modal-body {
  overflow-y: scroll !important;
}

.modal-body::-webkit-scrollbar {
  display: block !important;
}

.modal-body::-webkit-scrollbar {
  width: 10px !important;
  height: 6px !important;
}
</style>
