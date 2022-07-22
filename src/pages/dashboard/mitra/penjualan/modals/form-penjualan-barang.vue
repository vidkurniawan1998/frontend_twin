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
      <div class="modal-dialog modal-dialog-centered" role="document" :class="initData == null ? 'modal-lg' : 'modal-md'">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{config.title == null ? '&nbsp;' : config.title}}</h5>
            <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
          </div>

          <form @submit.prevent="submit">
            <div class="modal-body">

              <div class="form-group">
                <label for="" class="form-label">Tanggal</label>
                <input type="date" class="form-control" v-model="data.tanggal" required>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Tipe Pembayaran</label>
                <label class="form-check form-check-inline" v-for="(d, i) in ['cash','credit']" :key="i">
                  <input class="form-check-input" type="radio" name="tp" :value="d" v-model="data.tipe_pembayaran">
                  <span class="form-check-label" v-html="d"/>
                </label>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Tipe Harga</label>
                <label class="form-check form-check-inline" v-for="(d, i) in tipe_harga" :key="i">
                  <input class="form-check-input" type="radio" name="th" :value="d.toLowerCase()" v-model="data.tipe_harga">
                  <span class="form-check-label" v-html="d.toUpperCase()"/>
                </label>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Keterangan</label>
                <textarea class="form-control" rows="5" v-model="data.keterangan" placeholder="Keterangan"></textarea>
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
    dismiss: {default: true},
  },

  mixins: [helper],

  data() {
    return {
      backdrop: false,
      modal: {
        open: false,
        formNav: 0
      },

      request: false, gudang: [],
      tipe_harga: [],
      data: {
        id_toko: null,
        tanggal: this.dateTime('ymd'),
        tipe_pembayaran: 'credit',
        tipe_harga: 'wbp',
        keterangan: null,
        id_salesman: null
      },
    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    submit() {
      this.$emit('update:isSubmit', true)
      this.$emit('submit', this.data);
    },

    _tipeHarga() {
      this.axios.get('tipe_harga/get/list').then(res => {
        this.tipe_harga = res.data
      }).catch(err => {
        this.onError(err)
      })
    }
  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
          if (this.tipe_harga.length === 0) this._tipeHarga()
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
