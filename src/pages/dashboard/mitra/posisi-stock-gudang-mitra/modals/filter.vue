<template>
  <div v-if="data_filter.form">
    <div
      class="modal fade"
      :class="data_filter.modal ? 'show' : ''"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content ">
          <div class="modal-header">
            <h5 class="modal-title">Filter</h5>
            <button type="button" class="close" v-on:click="triggerFilter" v-html="loading ? spin() : ic('close')"/>
          </div>

          <div class="modal-body pt-3">

            <!--Mitra-->
            <div class="row">
              <div class="col-12 form-group">
                <label class="form-label">Mitra</label>
                <selectize v-model="data_filter.id_mitra" @input="_getBarang()" data-placeholder="Pilih Mitra" required :disabled="loading">
                  <option :value="row.id" v-for="(row, i) in mitra" :key="i">
                    {{row.perusahaan}}
                  </option>
                </selectize>
              </div>
            </div>

            <!--tanggal-->
            <div class="row">
              <div class="form-group col-6">
                <label for="tanggal-mulai" class="form-label">Mulai Tanggal</label>
                <input type="date" id="tanggal-mulai" class="form-control" required v-model="data_filter.start_date" />
              </div>

              <div class="form-group col-6">
                <label for="tanggal-akhir" class="form-label">Sampai Tanggal</label>
                <input type="date" id="tanggal-akhir" class="form-control" required v-model="data_filter.end_date" />
              </div>
            </div>

            <!--tipe-->
              <div class="form-group">
                <label for="brand" class="form-label">Pilih Barang
                  <span class="form-label-description p-cursor text-primary" @click="data_filter.id_barang = []">Hapus Semua</span>
                </label>
                <selectize v-model="data_filter.id_barang" data-placeholder="Pilih Barang" :disabled="loading" :settings="selectConfig">
                  <option :value="d.id" v-for="(d, i) in barang" :key="i">
                    {{ d.kode_barang + " - " + d.nama_barang }}
                  </option>
                </selectize>
              </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-white"  v-on:click="triggerFilter" v-html="'Tutup'" />
            <button type="button" class="btn btn-primary"  v-on:click="getLaporan(); triggerFilter()"  v-html="'OK'" />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import helper from "@/assets/js/helper.js";

export default {
  name: "Modal",
  mixins: [helper],
  computed:{
    ...mapState(['loading']),
    ...mapState('posisi_stock_mitra', {
      data_filter : state => state.data_filter,
    }),
  },
  data() {
    return {
      barang : [],
      mitra  : []
    };
  },

  methods: {
    ...mapActions('principal', ['getListPrincipal']),
    ...mapActions('posisi_stock_mitra', ['triggerFilter','getLaporan']),
    ...mapActions('mitra', ['getListMitra']),
    ...mapActions('barang', ['getListBarangMitra']),

    _getMitra(){
      this.getListMitra().then( res => {
        this.mitra = res
      })
    },
    _getBarang() {
      console.log('cek')
      this.getListBarangMitra({id_mitra : this.data_filter.id_mitra}).then( res => {
        this.barang = res
      })
    },
  },
  mounted(){
    this._getMitra()
  },
};
</script>
