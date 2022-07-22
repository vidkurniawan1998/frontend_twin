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

                <div class="modal-control">
                  <button class="btn-modal-control" v-html="request ? spin() : ic('close')" @click="close()"/>
                </div>
              </div>

              <div class="card-tabs mb-0">
                <!-- Cards navigation -->

                <transition name="slide-fade-x">
                  <div class="btn-gr oup float-right">
                    <div class="input-icon">
                      <span class="input-icon-addon"> <i class="fe fe-search"></i> </span>
                      <input type="text" class="form-control" placeholder="Ketik nama toko" v-model="keyword" @keyup="_search">
                    </div>
                  </div>
                </transition>

                <ul class="nav nav-tabs">
                  <li class="nav-item" v-for="(tab, i) in ['Daftar Toko ('+stores.length+')']" :key="i" @click="tabActive = i">
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
                                <th style="width: 20px">
                                  <label class="form-check" style="display: block">
                                    <input class="form-check-input" type="checkbox" v-model="checkall">
                                  </label>
                                </th>
                                <th style="width: 50px" class="text-center">No</th>
                                <th style="width: 250px">Nama Toko</th>
                                <th style="widt h: 150px">Alamat</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(row, i) in filter" :key="i">
                                <td style="width: 20px">
                                  <label class="form-check" style="display: block">
                                    <input class="form-check-input" type="checkbox" :checked="checkeds.indexOf(row.id) > -1" @click="_check(row.id)">
                                  </label>
                                </td>
                                <td style="width: 50px" class="text-center">{{i+1}}</td>
                                <td style="width: 250px" v-html="row.store"/>
                                <td style="wi dth: 150px" v-html="row.location"/>
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
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
              <button type="button" class="btn btn-primary ml-3" :disabled="request || checkeds.length == 0" @click="_exportExcel" v-html="request ? spin() : 'Export Excel'" />
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
      stores: [], filter: [],
      keyword: '',

      checkall: false, checkeds: []
    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    _getstores(id){
      this.request = true
      fb.firestore.collection('stores').where('store_id','==',id).onSnapshot((snapshot) => {
        let temp = []

        snapshot.forEach((doc) => {
          let data = doc.data();
              data.id = doc.id

          temp.push(data)
        })

        this.stores = this.filter = temp
        this.request = false
      });
    },

    _check(id){
      let io = this.checkeds.indexOf(id)

      if(io > -1){
        this.checkeds.splice(io, 1)
      }else{
        this.checkeds.push(id)
      }
    },

    _search(){
      let k = this.keyword.toString().toLowerCase(), stores = this.stores

      this.filter = []

      for (let i = 0; i < stores.length; i++) {
        if(stores[i].store.toString().toLowerCase().includes(k)){
          this.filter.push(stores[i])
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

    async _exportExcel(){
      this.request = true

      if(this.checkeds.length == 0){
        this.toast('Anda belum memilih toko')
      }else{

        let dataExcel = [], loop = 0

        for (let i = 0; i < this.checkeds.length; i++) {
          await fb.firestore.collection('items').where('store_id','==',this.checkeds[i]).onSnapshot((snapshot) => {
            let no = 1

            snapshot.forEach((doc) => {
              let data = doc.data(); 

              let item = {
                'No': no,
                'Nama Barang': data.item,
                'Harga': data.price,
                'Berat': data.weight+' '+data.unit
              }

              dataExcel.push(item); no++
            })

            loop++

            if(loop == this.checkeds.length){
              this.request = false
              this.createExcel({data: dataExcel, filename: 'Surga - '+this.dTime('datetime')})
            }
          });
        }
      }
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
          this.storesHasLoaded = false
          this.tabActive = 0
        }, 100);
      }
    },

    initData: function(data) {
      if(data != null){
        this.stores = this.filter = data
      }
    },

    checkall: function(bool){
      this.checkeds = []

      if(bool){
        for (let i = 0; i < this.stores.length; i++) {
          this.checkeds.push(this.stores[i].id)
        }
      }
    }


  }
};
</script>

<style lang="scss" scoped src="../survey-harga.scss"/>