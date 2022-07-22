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
            <button type="button" class="close" @click="close()" v-html="ic('close')"/>
          </div>

            <div class="modal-body pt-3">

              <div class="form-group">
                <label for="" class="form-label">Pilih Driver</label>
                <selectize v-model="data.driver_id" data-placeholder="Pilih Driver" required>
                  <option :value="d.id" v-for="(d, i) in driver" :key="i"> {{d.nama_driver}} [{{d.nama_perusahaan}}]</option>
                </selectize>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Pilih Checker</label>
                <selectize v-model="data.checker_id" data-placeholder="Pilih Checker" required>
                  <option :value="d.id" v-for="(d, i) in checker" :key="i"> {{d.nama_checker}} </option>
                </selectize>
              </div>

              <div class="form-group">
                <label for="" class="form-label">Pilih Tanggal Pengiriman</label>
                <input type="date" class="form-control" v-model="data.tanggal_jadwal" :min="this.dateTime('ymd')">
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
              <button type="button" class="btn btn-primary" @click="submit" v-html="'Simpan'" />
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
      },

      request: true, driver:[], checker:[],
      data: {
        tanggal_jadwal: this.dateTime('ymd'),
        driver_id:'',
        checker_id:'',
        id:[],
      }

    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    _getDriver(){
      this.request = true
      this.axios.put('driver/distribusi/'+this.data.id).then(res => {
        this.driver = res.data.data;
        this.request = false
      }).catch(err => {
        this.onError(err);
        this.request = false
      });
    },

    _getChecker(){
      this.request = true
      this.axios.put('checker/distribusi/'+this.data.id).then(res => {
        this.checker = res.data.data;
        this.request = false
      }).catch(err => {
        this.onError(err);
        this.request = false
      });
    },

    submit(){
      this.$emit("submit", this.data);
      this.close()
    }

  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          if(this.driver.length == 0) this._getDriver()
          if(this.checker.length == 0) this._getChecker()
          this.modal.open = view;
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    initData: function(data) {
      Object.assign(this.$data.data, this.$options.data.call(this).data);
      // for (const key in this.data) {
      //   this.data[key] = data[key]
      // }
      for (let i = 0; i < data.length; i++) {
        this.data.id.push(data[i])
      }
    },

  }
};
</script>
