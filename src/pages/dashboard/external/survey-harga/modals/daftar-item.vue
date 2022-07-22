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
                <div class="mt-1 click-able" @click="_location" style="max-width: 60%; display: inline-block"> <i class="la la-lg la-map-marked-alt mr-2"></i> <span v-html="data.location"></span> </div>

                <div class="modal-control">
                  <button class="btn-modal-control" v-html="ic('refresh')" @click="_getItems(data.id)" :disabled="request"/>
                  <button class="btn-modal-control" v-html="request ? spin() : ic('close')" @click="close()"/>
                </div>
              </div>

              <div class="card-tabs mb-0">
                <!-- Cards navigation -->

                <transition name="slide-fade-x">
                  <div class="btn-gr oup float-right">
                    <div class="input-icon">
                      <span class="input-icon-addon"> <i class="fe fe-search"></i> </span>
                      <input type="text" class="form-control" placeholder="Ketik nama barang" v-model="keyword" @keyup="_search">
                    </div>
                  </div>
                </transition>

                <ul class="nav nav-tabs">
                  <li class="nav-item" v-for="(tab, i) in ['Daftar Barang ('+items.length+')']" :key="i" @click="tabActive = i">
                    <a href="#1" class="nav-link" :class="tabActive == i ? 'active' : ''" data-toggle="tab" v-html="tab"></a>
                  </li>
                </ul>
                <div class="tab-content">
                  
                  <div class="card tab-pane active show">
                    <div class="card-body p-0 table-responsive " style="min-height: 350px">

                      <Skeleton type="table" :length="5" class="mt-3 bg-white m-2" v-if="request"/>
                      <Nodata v-if="!request && filter.length == 0"/>

                      <transition name="slide-up">

                        <div class="table-dpb" v-if="!request && filter.length > 0">
                          <table class="fixed-table table table-v center table-hover card-table table-striped">

                            <thead>
                              <tr class="text-muted">
                                <th style="width: 50px">No</th>
                                <th style="width: 300px">Nama Barang</th>
                                <th style="width: 150px">Harga</th>
                                <th>Berat</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(row, i) in filter" :key="i">
                                <td style="width: 50px">{{i+1}}</td>
                                <td style="width: 300px" v-html="row.item"/>
                                <td style="width: 150px" v-html="'Rp '+ribuan(row.price)"/>
                                <td >{{ ribuan(row.weight)+' '+row.unit }}</td>
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

            <div class="px-4 py-4 text-right">
              <button type="button" class="btn btn-white float-left" @click="_location"> <i class="fe fe-map-pin mr-2"></i> Lihat Lokasi </button>

              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
              <button type="button" class="btn btn-primary ml-3" :disabled="request" @click="_exportExcel" v-html="'Export Excel'" />
            </div>

        </div>
      </div>
    </div>

    <div class="modal-backdrop fade" :class="modal.open ? 'show' : ''" />

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";

const fb = require('@/dbsurga.js');

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

      request: false, data: {}, tabActive: 0,
      items: [], filter: [],
      keyword: '',
    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    _getItems(id){
      this.request = true
      fb.firestore.collection('items').where('store_id','==',id).onSnapshot((snapshot) => {
        let temp = []

        snapshot.forEach((doc) => {
          let data = doc.data();
              data.id = doc.id

          temp.push(data)
        })

        this.items = this.filter = temp
        this.request = false
      });
    },

    _search(){
      let k = this.keyword.toString().toLowerCase(), items = this.items

      this.filter = []

      for (let i = 0; i < items.length; i++) {
        if(items[i].item.toString().toLowerCase().includes(k)){
          this.filter.push(items[i])
        }
      }
    },

    _location(){
      let lat = this.data.gps.lat, lon = this.data.gps.lon
      if(lat == null || lon == null){
        this.toast('Lokasi tidak ditemukan');
      }else{
        window.open('https://www.google.com/maps/search/?api=1&query='+lat+','+lon+'', '_blank');
      }
    },

    _exportExcel(){
      let dataExcel = []

      for (let i = 0; i < this.items.length; i++) {
        
        let data = {
          'No': i + 1,
          'Nama Barang': this.items[i].item,
          'Harga': this.items[i].price,
          'Berat': this.items[i].weight+' '+this.items[i].unit
        }

        dataExcel.push(data)
      }

      this.createExcel({data: dataExcel, filename: this.data.store+' - '+this.dTime('datetime')})
    }

  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        this.tabActive = 0

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
      if(data != null){
        this.data = data
        this._getItems(data.id)
      }

    },


  }
};
</script>

<style lang="scss" scoped src="../survey-harga.scss"/>