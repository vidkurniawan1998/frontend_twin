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
            <button type="button" class="close" @click="close()" v-html="loading ? spin() : ic('close')"/>
          </div>

          <form @submit.prevent="submit">
            <div class="modal-body default">
              <div class="row">
                <div class="form-group col-6">
                  <label for="perusahaan" class="form-label">Perusahaan</label>
                  <selectize v-model="data.id_perusahaan" data-placeholder="Pilih Perusahaan" id="perusahaan" @input="_getDepo($event)">
                    <option :value="d.id" v-for="(d, i) in perusahaan" :key="i"> {{d.kode_perusahaan}} - {{d.nama_perusahaan}} </option>
                  </selectize>
                </div>

                <div class="form-group col-6">
                  <label for="depo" class="form-label">Nama Depo</label>
                  <selectize id="depo" v-model="data.id_depo" data-placeholder="Pilih depo">
                    <option :value="d.id" v-for="(d, i) in depo" :key="i"> {{d.nama_depo}} </option>
                  </selectize>
                </div>
              </div>

              <div class="form-group">
                <label for="nama-gudang" class="form-label">Nama Gudang</label>
                <input type="text" class="form-control" placeholder="Nama gudang" v-model="data.nama_gudang" id="nama-gudang" required>
              </div>

              <div class="form-group">
                <label for="kode-gudang" class="form-label">Kode Gudang</label>
                <input type="text" class="form-control" maxlength="5" placeholder="Kode gudang" v-model="data.kode_gudang" id="kode-gudang" required>
              </div>

              <div class="form-group">
                <label for="keterangan" class="form-label">Keterangan</label>
                <textarea class="form-control" rows="5" v-model="data.keterangan" placeholder="Keterangan" id="keterangan"></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Jenis</label>
                <label class="form-check form-check-inline" v-for="(d, i) in ['baik','bad_stock','canvass','motor']" :key="i">
                  <input class="form-check-input" type="radio" name="jg" :value="d" v-model="data.jenis">
                  <span class="form-check-label" v-html="ucwords(d.replace('_',' '))"/>
                </label>
              </div>

            </div>

            <div class="modal-footer pt-2">
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />

              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmit || loading"
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
        formNav: 0,
        depo: [],
      },

      request: false,
      perusahaan: [],
      depo: [],
      data: {
        id_perusahaan: null,
        id_depo: null,
        nama_gudang: null,
        kode_gudang: null,
        keterangan: null,
        jenis: 'baik'
      },

    };
  },

  computed: {
    ...mapState(['loading'])
  },

  methods: {
    ...mapActions('perusahaan', ['getListPerusahaan']),
    ...mapActions('depo', ['getListDepo']),

    close() {
      this.$emit("update:config", { view: false });
    },

    submit() {
      this.$emit('update:isSubmit', true)
      this.$emit('submit', this.data);
    },

    _getPerusahaan() {
      this.getListPerusahaan(null).then( res => {
        this.perusahaan = res.data
      })
    },

    _getDepo(id){
      this.getListDepo({id_perusahaan: id}).then( res => {
        this.depo = res
      })
    },
  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
          if(this.perusahaan.length === 0) this._getPerusahaan()
          this._getDepo(this.data.id_perusahaan)
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
      }else{
        for (const key in this.data) {
          this.data[key] = data[key]
        }
      }
    },

  }
};
</script>
