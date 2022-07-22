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
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{config.title == null ? '&nbsp;' : config.title}}</h5>
            <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
          </div>
          <div class="modal-body pt-3">
            <div class="form-group">
              <label for="" class="form-label">Tipe Salesman</label>
              <selectize
                  v-model="dataFilter.tipe_salesman"
                  data-placeholder="Pilih Salesman"
                  @input="_getSalesman()"
                  required>
                <option value="all"> Semua </option>
                <option v-for="(d, i) in tipe_salesman" :value="d.id" :key="i">{{ d.text }}</option>
              </selectize>
            </div>

            <div class="form-group">
              <label for="" class="form-label">Pilih Salesman</label>
              <selectize
                  v-model="dataFilter.id_salesman"
                  data-placeholder="Pilih Salesman"
                  required>
                <option value="all"> Semua Tim </option>
                <option :value="d.id" v-for="(d, i) in salesman" :key="i"> {{d.nama_salesman}} ({{d.tim}}) </option>
              </selectize>
            </div>

            <div class="row">
              <div class="col-6">
                <div class="form-group">
                  <label for="" class="form-label">Mulai Tanggal</label>
                  <input type="date" class="form-control" required v-model="dataFilter.start_date" :max="dataFilter.end_date">
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="" class="form-label">Sampai Tanggal</label>
                  <input type="date" class="form-control" required v-model="dataFilter.end_date" :min="dataFilter.start_date">
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
            <button type="button" class="btn btn-primary" @click="submit" v-html="'OK'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
export default {
name: "filter.vue",
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

      salesman: [],

      dataFilter: {
        tipe_salesman: 'all',
        id_salesman: 'all',
        start_date: this.dateTime('ymd'),
        end_date: this.dateTime('ymd')
      },

      tipe_salesman: [
        { id: 'to', text: 'TO'},
        { id: 'canvass', text: 'Canvass'}
      ]
    }
  },
  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },
    submit(){
      this.$emit("submit", this.dataFilter);
      this.close()
    },
    _getSalesman(){
      this.request = true

      this.axios.get('salesman', {
        params: {
          tipe_salesman: this.dataFilter.tipe_salesman
        }
      }).then(res => {
        this.salesman = res.data.data;
        this.request = false
      }).catch(err => {
        this.onError(err);
        this.request = false
      });
    },
  },
  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
          if(this.salesman.length == 0) this._getSalesman()
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
}
</script>

<style scoped>

</style>