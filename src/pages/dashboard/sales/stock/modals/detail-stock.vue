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
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">

            <div class="modal-body pt-3">
              
              <div style="line-height: 17px" class="mb-4">
                <h3 class="m-0"> {{config.title == null ? '&nbsp;' : config.title}} </h3>
                <span v-html="data.kode_gudang+' - '+data.nama_gudang"></span>
            
                <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
              </div>

              <div class="input-icon mb-3">
                  <span class="input-icon-addon"> <i class="fe fe-search"></i> </span>
                  <input type="search" class="form-control" placeholder="Cari item" onfocus="this.select()" v-model="keyword" ref="focus" :disabled="request || data.length == 0">
              </div>


              <Skeleton type="list-1" :length="3" class="mt-3 bg-white" v-if="request"/>

              <Nodata v-if="!request && filter.length == 0"/>

              <transition name="slide-up">
                <div class="mt-3 list-overflow" v-if="!request && filter.length > 0" >
                  <ul class="list-group">
                    <li class="list-group-item" v-for="(row, i) in filter" :key="i">
                      <div class="row">
                        <div class="col-auto my-auto">
                          <div style="width: 70px; height: 70px">
                            <img :src="row.gambar == null ? asset('no-image.png') : image(row.gambar)" alt="" width="70" class="zoom-able">
                          </div>
                        </div>
                        <div class="col-auto my-auto">
                          <div><b>{{row.kode_barang}}</b></div>
                          <div>{{row.nama_barang}} <br/> <span v-html="ribuan(row.qty)+' dus, '+ribuan(row.qty_pcs)+' '+row.satuan"></span> </div>
                        </div>

                        <div class="col my-auto text-right">
                          <button class="btn btn-outline-primary btn-sm" @click="_edit(row, i)" style="display: inline-block"> <i class="fe fe-edit-2 mr-1"></i> Edit</button>
                        </div>
                      </div>

                      <transition name="slide-fade-x">
                        <div class="form-edit-stock" v-show="id_stock == row.id">
                          <div v-html="'<b>'+row.kode_barang+'</b> - '+row.nama_barang" class="mb-1"></div>

                          <div class="row">
                            <div class="col">
                              <input type="tel" @keypress="numberOnly($event); $event.keyCode == 13 ? $refs.submit[i].click() : false" onfocus="this.select()" :ref="'qty'+i" maxlength="11" v-model="formData.qty" class="form-control" placeholder="Jumlah dus">
                            </div>
                            <div class="col">
                              <input type="tel" @keypress="numberOnly($event); $event.keyCode == 13 ? $refs.submit[i].click() : false" onfocus="this.select()" maxlength="11" v-model="formData.qty_pcs" class="form-control" placeholder="Jumlah pcs">
                            </div>
                            <div class="col-auto">
                              <div class="btn-group">
                                <button class="btn btn-outline-secondary" v-html="ic('close')" @click="id_stock = null"> </button>
                                <button class="btn btn-outline-primary" :disabled="hasChange" v-html="hasChange ? spin() : ic('check')" @click="_saveChanges" ref="submit"> </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </transition>

                    </li>
                  </ul>
                </div>
              </transition>

            </div>

            <div class="px-4 pb-4 text-right">
              <div class="float-left" v-html="!request ? 'Total '+items.length+' Item ' : ''"></div>

              <button type="button" class="btn btn-white" :disabled="request || data.length == 0" @click="_export" v-html="ic('download')+' Export'" />
              <button type="button" class="btn btn-white ml-3" @click="close()" v-html="'Tutup'" />
              
            </div>

        </div>
      </div>
    </div>

    <div class="modal-backdrop fade" :class="modal.open ? 'show' : ''" />
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import XLSX from 'xlsx';

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

      request: true,

      // data detail stock
      data: {}, items: [], filter: [],
      keyword: '',

      id_stock: null, hasChange: false,

      formData: {
        id_gudang: null,
        id_barang: null,
        qty: 0,
        qty_pcs: 0
      }

    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    _get(id){ // id gudang
      this.request = true

      this.axios.get('stock/'+id).then(res => {

        this.items = res.data.data
        this.filter = res.data.data

        this.request = false
      }).catch(err => {
        this.onError(err)
        this.request = false
      })
    },

    _search(keyword){
      let k = keyword.toString().toLowerCase(), data = this.items

      this.filter = []

      for (let i = 0; i < data.length; i++) {
        if(data[i].kode_barang.toString().toLowerCase().includes(k) || data[i].nama_barang.toString().toLowerCase().includes(k)){
          this.filter.push(data[i])
        }
      }
    },

    _edit(data, i){
      this.id_stock = data.id
      this.formData = {'qty': data.qty, 'qty_pcs': data.qty_pcs}

      this.formData.id_gudang = data.id_gudang
      this.formData.id_barang = data.id_barang

      setTimeout(() => {
        this.$refs['qty'+i][0].focus()
      }, 100);
    },

    _saveChanges(){
      this.hasChange = true

      this.axios.put('stock/'+this.id_stock, this.formData).then(() => {
        this.hasChange = false

        this.findObject(this.items, 'id', this.id_stock, (d, i) => {
          this.items[i].qty = this.formData.qty
          this.items[i].qty_pcs = this.formData.qty_pcs

          this._search(this.keyword)
        })

        this.id_stock = null

      }).catch(err => {
        this.onError(err)
        this.hasChange = false
      })
    },

    _export(){
      let excel = [], keys = ['nama_gudang','jenis','kode_barang','nama_barang','barcode','satuan','isi','berat','qty','qty_pcs','dbp']

      for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i], ob = {}

        for (let l = 0; l < keys.length; l++) {
          ob[keys[l]] = item[keys[l]]
        }

        excel.push(ob)
      }

      var data = XLSX.utils.json_to_sheet(excel) 
      var wb = XLSX.utils.book_new() // make Workbook of Excel
      XLSX.utils.book_append_sheet(wb, data, 'sheet') // sheetAName is name of Worksheet
      XLSX.writeFile(wb, 'detail-stock.xlsx') 
    }
  },

  mounted(){
    document.addEventListener('keypress', (e) => {
      let key = e.keyCode; // 102 = f

      if(key == 102 && this.$refs.focus != null){
        setTimeout(() => {
          this.$refs.focus.focus()
        }, 50);
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
          this.$refs.focus.focus()
          this.keyword = ''
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    keyword(s){
      this._search(s)
    },

    initData: function(data) {
      this._get(data.id)
      this.data = data
    },

  }
};
</script>

<style lang="scss" src="../stock.scss" scoped/>
