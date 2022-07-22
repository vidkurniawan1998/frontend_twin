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
                <div v-html="data.nama_toko+' - '+data.alamat+' ('+data.pemilik+')'"></div>
            
                <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
              </div>

              <div class="card-tabs mb-0">
                <!-- Cards navigation -->

                <transition name="slide-fade-x">
                  <div class="btn-group float-right" v-if="tabActive == 1">
                    <button class="btn btn-outline-primary" v-html="ic('edit')+' Edit Lokasi'" @click="_edit"/>
                  </div>
                </transition>

                <ul class="nav nav-tabs">
                  <li class="nav-item" v-for="(tab, i) in ['Informasi Toko','Lokasi Toko','Penjualan']" :key="i" @click="tabActive = i">
                    <a href="#1" class="nav-link" :class="tabActive == i ? 'active' : ''" data-toggle="tab" v-html="tab"></a>
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
                    <div class="card-body p-1 table-responsive text-center" style="min-height: 350px">
                      <div v-if="data.latitude == null || data.longitude == null" >
                        <img :src="asset('no-loc.png')" alt="" style="height: 300px; opacity: .7">
                        <div>Lokasi toko tidak ditemukan.</div>
                      </div>

                      <iframe v-if="data.latitude != null || data.latitude != null"
                        style="width: 100%; min-height: 400px; display: block" frameborder="0"
                        scrolling="no" marginheight="0" marginwidth="0" samesite="none" secure
                        :src="'https://maps.google.com/maps?q='+data.latitude+','+data.longitude+'&hl=es;z=14&amp;output=embed'"/> 
                    </div>
                  </div>
                  
                  <div class="card tab-pane" :class="tabActive == 2 ? ' active show' : ''">
                    <div class="card-body p-0 table-responsive " style="min-height: 350px">

                      <Skeleton type="table" :length="5" class="mt-3 bg-white m-2" v-if="request"/>
                      <Nodata v-if="!request && items.length == 0"/>

                      <transition name="slide-up">

                        <div class="table-dpb" v-if="!request && items.length > 0">
                          <table class="table table-v center table-hover card-table table-striped table-no-break">

                            <thead>
                              <tr class="text-muted">
                                <th>No Faktur</th>
                                <th>Dibuat Tanggal</th>
                                <th>GPS</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(row, i) in items" :key="i" :id="'tr'+row.id">
                                <td v-html="row.id"></td>
                                <td v-html="dateFormat(row.created_at)"></td>
                                <td> <router-link to="#viewmap" :id="'gps'+i" @click.native="_viewMap(row.latitude, row.longitude)" v-html="row.latitude+','+row.longitude"></router-link> </td>
                                <td class="text-right"> <button class="btn btn-sm btn-white" v-html="ic('copy')" @click="copyToClipboard('gps'+i); toast('GPS disalin')"></button> </td>
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
                  
                    <div class="row">
                      <div class="col-6">
                        <div class="form-group">
                          <label for="" class="form-label">Latitude</label>
                          <input v-model="formData.latitude" type="tel" required maxlength="11" class="form-control" placeholder="Latitude">
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="form-group">
                          <label for="" class="form-label">Longitude</label>
                          <input v-model="formData.longitude" type="tel" required maxlength="11" class="form-control" placeholder="Longitude">
                        </div>
                      </div>
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
      info: [], items: [], itemsHasLoaded: false,

      // data detail stock
      data: [], filter: [],
      keyword: '',

      formData: {
        latitude: null,
        longitude: null,
      },

      form: {
        view: false, request: false,
        title: null, isSubmit: false,
        action: () => {}
      },

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

    _getPenjualan(){
      this.request = true
      this.axios('toko/lokasi_penjualan/'+this.data.id).then( res => {
        this.items = res.data.list_penjualan
        this.request = false
        this.itemsHasLoaded = true
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

    _edit(){
      for (const key in this.formData) {
        this.formData[key] = this.data[key]
      }

      this.form.view = true
      this.form.title = 'Edit Lokasi'
      this.form.action = () => {

        if(isNaN(this.formData.latitude) || isNaN(this.formData.longitude)){
          this.toast('Format data tidak valid'); return
        }

        this.form.isSubmit = true

        this.axios.put('toko/edit_location/'+this.data.id, this.formData).then(() => {
          this.toast('Berhasil diperbarui');
          this.data.latitude = this.formData.latitude
          this.data.longitude = this.formData.longitude

          this.form.view = this.form.isSubmit = false
        }).catch( err => {
          this.onError(err);
          this.form.isSubmit = false;
        });
      }
    },

    _viewMap(lat, lon){
      if(lat == null || lon == null){
        this.toast('Lokasi tidak ditemukan');
      }else{
        window.open('https://www.google.com/maps/search/?api=1&query='+lat+','+lon+'', '_blank');
      }
    },

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
      if(t == 2 && !this.itemsHasLoaded){
        this._getPenjualan()
      }
    },

    initData: function(data) {
      this.data = data
      this.info = []
      
      let keys = ['nama_toko','no_acc','cust_no','kode_mars','tipe','pemilik','telepon','alamat',
                    'kabupaten','kecamatan','kelurahan','kode_pos','nama_tim','nama_depo',
                    'top','limit','saldo_retur','npwp','hari','minggu']

      for (let i = 0; i < keys.length; i++) {
        this.info.push({'label': this.ucwords(keys[i].replace('_',' ')), 'value': data[keys[i]]})
      }
    },

    items(items){
    //   this.itemsFoot = []

    //   let labels = ['total qty','total pcs','subtotal'], arr = [0,0,0]
    //   for (let i = 0; i < items.length; i++) {
    //     arr[0] += +items[i].qty_adj
    //     arr[1] += +items[i].pcs_adj
    //     arr[2] += +items[i].subtotal
    //   }

    //   for (let i = 0; i < labels.length; i++) {
    //     let rp = [2]
    //     this.itemsFoot.push({label: labels[i], value: rp.indexOf(i) > -1 ? 'Rp '+this.ribuan(arr[i]+'|,2') : this.ribuan(arr[i])})        
    //   }
    }

  }
};
</script>

<style lang="scss" src="../toko.scss" scoped/>
