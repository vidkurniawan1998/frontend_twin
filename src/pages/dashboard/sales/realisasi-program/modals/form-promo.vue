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
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{config.title == null ? '&nbsp;' : config.title}}</h5>
            <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
          </div>

          <form @submit.prevent="submit">
            <div class="modal-body" ref="modal">

              <div class="form-group">
                <label for="" class="form-label">Nama Promo</label>
                <input type="text" class="form-control" placeholder="Nama promo" v-model="data.nama_promo" required ref="focus">
              </div>

              <div class="form-group">
                <label for="" class="form-label">Diskon Rupiah</label>
                <input type="number" @keypress="numberOnly($event)" onfocus="this.select()" min="0" class="form-control" v-model="data.disc_rupiah" placeholder="Diskon rupiah" required>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Diskon Persen (Distributor)</label>
                <div class="row row-sm animated" :class="discDist.length > 1 && i != 0 ? 'mt-1 headShake' : ''" v-for="(row, i) in discDist" :key="i">
                  <div class="col">
                    <input type="text" class="form-control" autofocus v-model="discDist[i]" :id="'discd'+i" onfocus="this.select()" placeholder="Diskon persen" autocomplete="off">
                  </div>
                  <div class="col-auto">
                    <div class="btn-group">
                      <button type="button" v-if="discDist.length > 1 && i != 0" class="btn btn-white btn-icon text-danger" v-html="ic('close')" @click="_discDis('-', i)"/>
                      <button type="button" class="btn btn-white btn-icon" v-html="ic('plus')" @click="_discDis('+', i)" :disabled="discDist.length == 4"/>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Diskon Persen (Principal)</label>
                <div class="row row-sm animated" :class="discPrin.length > 1 && i != 0 ? 'mt-1 headShake' : ''" v-for="(row, i) in discPrin" :key="i">
                  <div class="col">
                    <input type="text" class="form-control" autofocus v-model="discPrin[i]" :id="'discp'+i" onfocus="this.select()" placeholder="Diskon persen" autocomplete="off">
                  </div>
                  <div class="col-auto">
                    <div class="btn-group">
                      <button type="button" v-if="discPrin.length > 1 && i != 0" class="btn btn-white btn-icon text-danger" v-html="ic('close')" @click="_discPrin('-', i)"/>
                      <button type="button" class="btn btn-white btn-icon" v-html="ic('plus')" @click="_discPrin('+', i)" :disabled="discPrin.length == 2"/>
                    </div>
                  </div>
                </div>
              </div>

              <!-- <div class="alert alert-info">
                Untuk diskon bertingkat ditulis dengan format penulisan DISKON_1 + DISKON_2 + DISKON_3 + DISKON_4 (dipisahkan dengan tanda "+"). Contoh: 2.5 + 1 (berarti diskon bertingkat 2.5% lalu 1%).
              </div> -->

              <div class="form-group">
                <label for="" class="form-label">Barang Ekstra</label>
                <selectize v-model="data.id_barang" data-placeholder="Pilih barang"> 
                  <option :value="''">Tanpa Barang Extra</option>
                  <option :value="d.id" v-for="(d, i) in barang" :key="i"> {{d.kode_barang}} - {{d.nama_barang}} </option>
                </selectize>
              </div>

              <div class="form-group">
                <label for="">Pcs Ekstra</label>
                <input type="text" @keypress="numberOnly($event)" class="form-control" placeholder="Pcs ekstra" v-model="data.pcs_extra">
              </div>

              <div class="form-group">
                <label for="" class="form-label">Status</label>
                <label class="form-check form-check-inline" v-for="(d, i) in ['active','non_active']" :key="i">
                  <input class="form-check-input" type="radio" name="status" :value="d" v-model="data.status">
                  <span class="form-check-label" v-html="ucwords(d.split('_').join(' '))"/>
                </label>
              </div>

              <div class="row">
                <div class="col-6">
                  <div class="form-group">
                    <label for="" class="form-label">Tanggal Berlaku</label>
                    <input type="date" class="form-control" v-model="data.tanggal_awal">
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-group">
                    <label for="" class="form-label">Tanggal Expired</label>
                    <input type="date" class="form-control" v-model="data.tanggal_akhir" :min="data.tanggal_awal">
                  </div>
                </div>
              </div>

              <div class="form-group" @click="_scrollTo('modal')">
                <label class="form-label">Depo</label>
                <selectize v-model="data.depo" data-placeholder="Pilih Depo" :settings="selectConfig" :disabled="request"> 
                  <!-- <option :value="''">Semua Depo</option> -->
                  <option :value="row.id" v-for="(row, i) in depo" :key="i">
                    {{row.nama_depo}}
                  </option> 
                </selectize>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Keterangan</label>
                <textarea placeholder="Keterangan" class="form-control" v-model="data.keterangan"></textarea>
              </div>

            </div>

            <div class="modal-footer pt-2">
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />

              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmit || request"
                v-html="isSubmit ? spin() : 'Simpan'"
              />
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal-backdrop fade" :class="modal.open ? 'show' : ''" />
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";

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
        formNav: 0
      },

      request: true, barang: [], discDist: [0], discPrin: [0], depo: [],

      data: {
        nama_promo: null,
        id_barang: '',
        disc_rupiah: 0,
        disc_persen: [0,0,0,0,0,0],
        pcs_extra: 0,
        status: 'active',
        tanggal_awal: this.dateTime('ymd'),
        tanggal_akhir: this.dateTime('ymd'),
        depo: [],
        keterangan: null
      },

    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    getBarang() {
      this.request = true
      this.axios.get('barang').then( res => {
        this.barang = res.data.data;

        this._getDepo()
      }).catch( err => {
        this.onError(err)
        this.request = false
      });
    },

    _getDepo(){
      this.request = true

      this.axios.get('depo').then(res => {
        this.depo = res.data.data;
        this.request = false
      }).catch(err => {
        this.onError(err);
        this.request = false
      });
    },

    submit() {
      let formData = new FormData()

      for (const key in this.data) {
        if(key == 'disc_persen'){
          for (let i = 0; i < this.data[key].length; i++) {
            formData.append('disc_persen[]', this.data[key][i])
          }
        }else{
          if(key != 'depo') formData.append(key, this.data[key])
        }
      }

      let depo = this.data.depo
      if(this.initData != null){
        // formData.append('_method', 'PUT')
      }

      for (let i = 0; i < depo.length; i++) {
        formData.append('depo[]', depo[i])        
      }

      // for (var pair of formData.entries()) {
      //   console.log(pair[0]+ ', ' + pair[1]); 
      // }
      
      this.$emit('update:isSubmit', true)
      this.$emit('submit', formData);
    },

    _onChange(value, i){
      // console.log(this.$refs.disc.value)
    },

    _discDis(action, i){
      let dd = this.discDist;

      if(action == '+'){
        if(dd.length >= 4){
          this.toast('Maksimal 4')
        }else{
          dd.push(0)

          setTimeout(() => {
            document.querySelector('#discd'+(dd.length - 1)).focus()
          }, 50);

        }
      }else{
        dd.splice(i, 1)
      }
    },

    _discPrin(action, i){
      let dd = this.discPrin;

      if(action == '+'){
        if(dd.length >= 2){
          this.toast('Maksimal 2')
        }else{
          dd.push(0)

          setTimeout(() => {
            document.querySelector('#discp'+(dd.length - 1)).focus()
          }, 50);

        }
      }else{
        dd.splice(i, 1)
      }
    }

  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view; this.$refs.focus.focus()
          this.getBarang()
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    initData: function(data) { //console.log(data)
      if(data == null){
        Object.assign(this.$data.data, this.$options.data.call(this).data);
      }else{
        for (const key in this.data) {
          if(key != 'disc_persen') this.data[key] = data[key]
        }

        this.discDist = [0]; this.discPrin = [0]

        // fill disc_persen
        for (let i = 0; i < this.data.disc_persen.length; i++) {
          let fill = data['disc_'+(i + 1)]
          this.data.disc_persen[i] = fill

          if(i < 4){
            if(fill != 0.0) this.discDist.push(fill);
          }else{
            if(fill != 0.0) this.discPrin.push(fill);
          }
        }

        // karena push, maka index 0 harus di hapus dengan splice jika kondisinya data lebih dari 1
        if(this.discDist.length > 1){
          this.discDist.splice(0, 1)
        }

        if(this.discPrin.length > 1){
          this.discPrin.splice(0, 1)
        }

        // set depo
        this.data.depo = []
        for (let i = 0; i < data.depo.length; i++) {
          this.data.depo.push(data.depo[i].id)
        }
      }
    },

    discDist: function(value){ 
      for (let i = 0; i < 4; i++) {
        if(i < value.length){
          this.data.disc_persen[i] = value[i]
        }else{
          this.data.disc_persen[i] = 0
        }
      }
    },

    discPrin: function(value){ 
      this.data.disc_persen[4] = value[0]
      this.data.disc_persen[5] = value.length > 1 ? value[1] : 0
    },

  }
};
</script>
