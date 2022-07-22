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
          <!--header-->
          <div class="modal-header">
            <h5 class="modal-title">{{config.title == null ? '&nbsp;' : config.title}}</h5>
            <button type="button" class="close" @click="close()" v-html="loading ? spin() : ic('close')"/>
          </div>

          <!--modal body-->
          <div class="modal-body pt-3">
            <!-- perusahaan -->
            <div class="row">
              <div class="col-12 form-group">
                <label class="form-label" for="perusahaan">Perusahaan</label>
                <selectize
                    data-placeholder="Pilih Perusahaan"
                    id="perusahaan"
                    v-model="dataFilter.id_perusahaan"
                    :disabled="loading"
                    required
                    @input="_getDepo($event)"
                >
                  <option :value="row.id" v-for="(row, i) in perusahaan" :key="i">
                    {{ row.nama_perusahaan }}
                  </option>
                </selectize>
              </div>
            </div>

            <!--depo -->
            <div class="row">
              <div class="col-12 form-group">
                <label class="form-label">Depo</label>
                <selectize
                    v-model="dataFilter.depo"
                    data-placeholder="Pilih Depo"
                    :settings="selectizeConfig"
                    required
                    :disabled="loading">
                  <option :value="row.id" v-for="(row, i) in depos" :key="i">
                    {{row.nama_depo}}
                  </option>
                </selectize>
              </div>
            </div>

            <!-- jenis salesman -->
            <div class="row">
              <div class="col-12 form-group">
                <label class="form-label" for="jenis-salesman">Jenis Salesman</label>
                <selectize
                    id="jenis-salesman"
                    v-model="dataFilter.jenis_salesman"
                    data-placeholder="Jenis Salesman"
                    required
                    :disabled="loading">
                  <option :value="row.l" v-for="(row, i) in jenis_salesman" :key="i">
                    {{row.v}}
                  </option>
                </selectize>
              </div>
            </div>

            <!-- status -->
            <div class="row">
              <div class="col-12 form-group">
                <label class="form-label">Status</label>
                <label class="form-check form-check-inline" v-for="(d, i) in ['all', 'active','non_active']" :key="i">
                  <input class="form-check-input" type="radio" name="status" :value="d" v-model="dataFilter.status">
                  <span class="form-check-label" v-html="d.replace('_', ' ')"/>
                </label>
              </div>
            </div>
          </div>

          <!--modal footer-->
          <div class="modal-footer">
            <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
            <button type="button" class="btn btn-primary" @click="submit" :disabled="loading" v-html="'OK'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import helper from "@/assets/js/helper";
import {mapActions, mapState} from "vuex";

export default {
  name: "FilterPromo",
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
      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },
      perusahaan: [], depos: [],
      jenis_salesman: [
        {l: 'semua promo', v: 'all'},
        {l: 'to', v: 'to'},
        {l: 'canvass', v: 'canvass'}
      ],
      dataFilter: {
        id_perusahaan: '',
        depo: [],
        jenis_salesman: [],
        status: 'all'
      }
    }
  },

  computed: {
    ...mapState(['loading'])
  },

  methods: {
    ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
    ...mapActions('depo', ['getListDepo']),
    close() {
      this.$emit("update:config", { view: false });
    },
    submit(){
      this.$emit("submit", this.dataFilter);
      this.close()
    },

    _getPerusahaan() {
      this.getListPerusahaanByAccess({}).then( res => {
        this.perusahaan = res
      })
    },

    _getDepo(id) {
      this.getListDepo({
        filter: false,
        id_perusahaan: id
      }).then( res => {
        this.depos = res
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
          if(this.perusahaan.length === 0) this._getPerusahaan()
          if(this.depos.length === 0) this._getDepo()
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    initData: function(data) { },

  },
  mounted: function () {
    this.$watch('dataFilter', function (value) {

    }, {deep:true})
  }
}
</script>

<style scoped>

</style>
