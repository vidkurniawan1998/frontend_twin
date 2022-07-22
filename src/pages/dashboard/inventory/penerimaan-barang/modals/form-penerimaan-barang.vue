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
            <h5 class="modal-title">{{ config.title == null ? "&nbsp;" : config.title }}</h5>
            <button type="button" class="close" @click="request ? spin() : close()">
              <i class="fe fe-x"></i>
            </button>
          </div>

          <form @submit.prevent="submit">
            <div class="modal-body">
              <div class="row">
                <div class="form-group col-6">
                  <label for="gudang">Bongkar di Gudang</label>
                  <selectize id="gudang" v-model="data.id_gudang" data-placeholder="Pilih gudang" required :disabled="loading">
                    <option :value="dt.id" v-for="(dt, i) in gudang" :key="i"> {{ dt.nama_gudang }} </option>
                  </selectize>
                </div>
                <div class="form-group col-6">
                  <label for="no-delivery">No Delivery Order</label>
                  <input type="text" id="no-delivery" class="form-control" placeholder="No delivery order" v-model="data.no_do" required />
                </div>
              </div>

              <div class="row">
                <div class="form-group col-6">
                  <label for="no-spb">No SPB</label>
                  <input type="text" id="no-spb" class="form-control" placeholder="No spb" v-model="data.no_spb" />
                </div>
                <div class="form-group col-6">
                  <label for="terima-dari">Terima Dari</label>
                  <selectize id="terima-dari" v-model="data.id_principal" data-placeholder="Pilih principal" :disabled="loading">
                    <option :value="dt.id" v-for="(dt, i) in principal" :key="i"> {{ dt.nama_principal }} </option>
                  </selectize>
                </div>
              </div>
              <div class="row">
                <div class="form-group col-6">
                  <label for="tgl-kirim">Tanggal Kirim</label>
                  <input type="date" id="tgl-kirim" class="form-control" v-model="data.tgl_kirim" required />
                </div>
                <div class="form-group col-6">
                  <label for="tgl-datang">Tanggal Datang</label>
                  <input type="date"  id="tgl-datang" class="form-control" v-model="data.tgl_datang" required />
                </div>
              </div>

              <div class="row">
                <div class="form-group col-6">
                  <label for="bongkar">Tanggal Bongkar</label>
                  <input type="date" id="bongkar" class="form-control" v-model="data.tgl_bongkar" required />
                </div>

                <div class="form-group col-6">
                  <label for="driver">Driver</label>
                  <input type="text" id="driver" class="form-control" placeholder="Driver" v-model="data.driver" />
                </div>
              </div>
              <div class="row">
                <div class="form-group col-6">
                  <label for="transpoter">Transporter</label>
                  <input type="text" id="transapoter" class="form-control" placeholder="Transporter" v-model="data.transporter" />
                </div>

                <div class="form-group col-6">
                  <label for="plat">Plat Nomor Kendaraan</label>
                  <input type="text" id="plat" class="form-control" placeholder="Plat nomor kendaraan" v-model="data.no_pol_kendaraan" />
                </div>
              </div>

              <div class="row">
                <div class="form-group col-12">
                  <label for="keterangan">Keterangan</label>
                  <textarea placeholder="Keterangan" id="keterangan" class="form-control" v-model="data.keterangan"></textarea>
                </div>
              </div>
            </div>

            <div class="modal-footer pt-2">
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />

              <button type="submit" class="btn btn-primary" :disabled="loading" v-html="loading ? spin() : 'Simpan'" />
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
        title: "Modal Title",
      },
    },
    initData: null,
    isSubmit: { default: false },
    dismiss: { default: true },
  },

  mixins: [helper],

  data() {
    return {
      backdrop: false,
      modal: {
        open: false,
        formNav: 0,
      },

      request: true,
      gudang: [],
      principal: [],

      data: {
        no_do: null,
        no_spb: null,
        id_principal: 0,
        id_gudang: null,
        tgl_kirim: null,
        tgl_datang: null,
        tgl_bongkar: this.dateTime("ymd"),
        driver: null,
        transporter: null,
        no_pol_kendaraan: null,
        keterangan: null,
      },
    };
  },

  computed: {
    ...mapState(['loading'])
  },

  methods: {
    ...mapActions('principal', ['getListPrincipal']),
    ...mapActions('gudang', ['getListGudang']),
    close() {
      this.$emit("update:config", { view: false });
    },

    getGudangNPrincipal() {
      this.getListPrincipal().then( res => {
        this.principal = res
      })

      this.getListGudang().then( res => {
        this.gudang = res
      })
    },

    submit() {
      this.$emit("update:isSubmit", true);
      this.$emit("submit", this.data);
    },
  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
          this.getGudangNPrincipal();
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    initData: function(data) {
      if (data == null) {
        Object.assign(this.$data.data, this.$options.data.call(this).data);
      } else {
        for (const key in this.data) {
          this.data[key] = data[key];
        }
      }
    },
  },
};
</script>
