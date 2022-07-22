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
            <button type="button" class="close" @click="close()" v-html="ic('close')"/>
          </div>

            <div class="modal-body">

              <div class="form-group">
                <label for="" class="form-label">Pilih Salesman</label>
                <selectize
                    v-model="data.id_salesman"
                    data-placeholder="Pilih Salesman"
                    required @input="$refs.toko.focus()">
                  <option
                      :value="d.id"
                      v-for="(d, i) in salesman"
                      :key="i"> {{d.nama_salesman}} ({{d.tim}}) </option>
                </selectize>
              </div>

              <div class="form-group" v-if="initData == null">
                <label for="" class="form-label">Pilih Toko <span class="form-label-description" v-html="toko.data.length == 0 ? 'Tidak ada toko' :toko.data.length+' toko'"/> </label>
                <div class="input-group" v-if="toko.search">
                  <input
                      type="text"
                      class="form-control"
                      placeholder="Cari toko"
                      v-model="toko.keyword"
                      :readonly="toko.request"
                      @keypress="$event.keyCode == 13 ? $refs.search.click() : false" ref="toko">
                  <button class="btn btn-white" type="button" v-html="toko.request ? spin() : ic('search')" @click="getToko" :disabled="toko.request" ref="search"/>
                </div>

                <div class="form-group" v-else>
                  <div style="width: calc(100% - 65px); display: inline-block" ref="toko">
                    <selectize
                        v-model="data.id_toko"
                        data-placeholder="Piih toko"
                        @input="$refs.keterangan.focus()">
                      <option
                          :value="row.id"
                          v-for="(row, i) in toko.data"
                          :key="i"> {{row.no_acc+' - '+row.nama_toko}} </option>
                    </selectize>
                  </div>
                  <div style="width: 50px; display: inline-block" class="ml-2">
                    <button class="btn btn-white" v-html="ic('keyboard')" @click="_searchToko"/>
                  </div>
                </div>
              </div>

              <div class="form-group" v-else>
                <label for="" class="form-label">Nama Toko</label>
                <input type="text" readonly v-model="nama_toko" class="form-control" placeholder="Inputkan nama toko">
              </div>

              <div class="form-group">
                <label for="" class="form-label">Tanggal</label>
                <input type="date" class="form-control" v-model="data.sales_retur_date" required>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Tiper Retur Barang</label>
                <label class="form-check form-check-inline" v-for="(d, i) in ['baik','bs']" :key="i">
                  <input class="form-check-input" type="radio" name="tr" :value="d" v-model="data.tipe_barang">
                  <span class="form-check-label" v-html="ucwords(d)"/>
                </label>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Keterangan</label>
                <textarea
                    class="form-control"
                    v-model="data.keterangan"
                    placeholder="Keterangan"
                    ref="keterangan"></textarea>
              </div>
            </div>

            <div class="modal-footer pt-2">
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />

              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmit" @click="submit"
                v-html="isSubmit ? spin() : 'Simpan'"
              />
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

      toko: {
        keyword: '', request: false, search: true,
        data: [],
      },

      nama_toko: null, salesman: [],

      data: {
        id_salesman: null,
        id_toko: null,
        tipe_barang: 'bs',
        keterangan: null
      },

    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    _getSalesman(){
      this.request = true

      this.axios.get('salesman').then(res => {
        this.salesman = res.data.data;
        this.request = false
      }).catch(err => {
        this.onError(err);
        this.request = false
      });
    },

    getToko(){
      if(this.toko.keyword.length < 2){
        this.$refs.toko.focus()
      }else{
        let sales = this.salesman.find(item => item.id == this.data.id_salesman)

        this.toko.request = true
        this.axios.get('toko?keyword='+this.toko.keyword+'&id_tim='+sales.id_tim).then(res => {
          this.$refs.toko.focus()

          if(res.data.data.length != 0){
            this.toko.search = false
          }

          this.toko.keyword = ''
          this.toko.request = false
          this.toko.data = res.data.data

          setTimeout(() => {
            if(res.data.data.length != 0){
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

    submit() {
      this.$emit('update:isSubmit', true)
      this.$emit('submit', this.data);
    },

  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;

        setTimeout(() => {
          this.modal.open = view;

          if(this.salesman.length == 0){
            this._getSalesman()
          }
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    initData: function(data) {
      if(data == null){
        Object.assign(this.$data.data, this.$options.data.call(this).data);
        this.nama_toko = null
      }else{
        this.nama_toko = data.nama_toko
        this.data.sales_retur_date = data.sales_retur_date;

        for (const key in this.data) {
          this.data[key] = data[key]
        }
      }
    },

  }
};
</script>
