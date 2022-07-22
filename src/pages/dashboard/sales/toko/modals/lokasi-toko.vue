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
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document" style="max-width: 90%">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">{{config.title == null ? '&nbsp;' : config.title}}</h5>
            <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
          </div>

            <div class="modal-body">

              <div class="row">
                <div class="col-md-8 mb-3">

                  <div v-if="!mapLoaded">Loading map...</div>

                  <!-- <div id="map" style="width: 100%" v-if="viewAllPoint"></div> -->
                  <gmap-map
                    :center="center"
                    :zoom="7" v-if="viewAllPoint"
                    style="width: 100%; height: 500px"
                  >
                    <gmap-marker
                      :key="index"
                      v-for="(m, index) in markers"
                      :position="m.position"
                      :clickable="true"
                      :label="m.label"
                      labelClass = 'labels'
                      @click="center=m.position"
                    ></gmap-marker>
                  </gmap-map>

                  <iframe style="width: 100%; display: block; border-radius: 4px"
                    height="500"
                    frameborder="0" 
                    scrolling="no" 
                    marginheight="0" 
                    marginwidth="0" @load="_loaded" v-show="mapLoaded && !viewAllPoint"
                    :src="'https://maps.google.com/maps?q='+data.latitude+','+data.longitude+'&hl=es;z=14&amp;output=embed'"/>
                </div>
                <div class="col-md-4">
                  <div class="input-icon">
                    <span class="input-icon-addon" v-html="request ? spin() : ic('search')"/>
                    <input type="text" class="form-control" placeholder="Inputkan nama toko" @change="_search" v-model="keyword" ref="focus">
                  </div>

                  <Skeleton type="list" :length="10" class="mt-3" v-if="request"/>
                  
                  <Nodata v-if="!request && toko.length == 0 && hasRequest"/>

                  <transition name="slide-up">
                    <div style="max-height: 450px; overflow: auto; border: 1px #ddd solid; border-radius: 4px" class="mt-3" v-if="toko.length > 0 && !request">
                      <ul class="list-group list-borderless list-toko">
                        <li class="list-group-item" v-for="(row, i) in toko" :key="i" @click="_viewLocation(row, i)" :class="i == selected ? 'list-active' : ''">
                          <i class="fe fe-map-pin float-right text-success" v-if="row.latitude != null"></i>
                          <span v-html="row.nama_toko"></span>
                        </li>
                      </ul>
                    </div>
                  </transition>
                </div>
              </div>
              
            </div>

            <div class="p-4 text-right">
              <button class="btn btn-white float-left" :disabled="toko.length == 0" @click="_viewAllPoint"> <i class="la la-lg la-map-marked-alt mr-1"></i> {{viewAllPoint ? 'Tampilkan Satu Titik' : 'Tampilkan Semua Titik'}}</button>

              <strong v-html="toko.length+' Toko'" v-if="toko.length > 0" class="mr-3 text-primary"/>
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
            </div>

        </div>
      </div>
    </div>

    <div class="modal-backdrop fade" :class="modal.open ? 'show' : ''" />
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

      request: false, hasRequest: false, keyword: null, toko: [], selected: -1,

      data: {
        latitude: null,
        longitude: null
      },

      mapLoaded: false,
      viewAllPoint: false,

      center: {},
      markers: []
    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    _loaded(e){
      this.mapLoaded = true
    },

    _search(){
      this.request = true
      this.axios.get('toko?keyword='+this.keyword).then(res => {
        this.request = false; this.selected = -1; this.hasRequest = true
        this.toko = res.data.data;

        if(this.viewAllPoint) this._viewAllPoint(true)
      }).catch( err => {
        this.onError(err)
        this.request = false
      });
    },

    _viewLocation(data, i){
      if(data.latitude != null){
        this.data.latitude = data.latitude
        this.data.longitude = data.longitude

        this.selected = i
      }
    },

    _viewAllPoint(keep = false){
      if(this.viewAllPoint && !keep){
        this.viewAllPoint = false
      }else{
        let toko = this.toko, locations = []

        for (let i = 0; i < toko.length; i++) {
          if(toko[i].latitude != null){
            locations.push({label: toko[i].nama_toko, position: {lat: parseFloat(toko[i].latitude), lng: parseFloat(toko[i].longitude)}})
          }
        }

        if(locations.length == 0){
          this.toast('Gps tidak tersedia')
        }else{
          this.viewAllPoint = true
          this.center = {lat: locations[0].position.lat, lng: locations[0].position.lng}
          this.markers = locations
        }
      }
    }


  },

  mounted(){
    
  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
          this.$refs.focus.focus()
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    initData: function(data) { },

  }
};
</script>

<style lang="scss" scoped src="../toko.scss"/>