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
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Filter</h5>
            <button type="button" class="close" v-on:click="triggerFilter" v-html="loading ? spin() : ic('close')"/>
          </div>

            <div class="modal-body pt-3">
             <div class="form-group">
                <label for="nama-gudang" class="form-label-description">Nama Gudang</label>
                <selectize id="nama-gudang" v-model="data_filter.id_gudang" data-placeholder="Pilih Gudang" required :settings="selectizeConfig":disabled="loading">
                  <option :value="d.id" v-for="(d, i) in gudang" :key="i"> {{ d.nama_gudang }}</option>
                </selectize>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-white"  v-on:click="triggerFilter" v-html="'Tutup'" />
              <button type="button" class="btn btn-primary"  v-on:click="triggerFilter(); getLaporan();"  v-html="'OK'" />
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
    ...mapState('monitoring_stock_tmp', {
      data_filter : state => state.data_filter,
    }),
  },
  data() {
    return{
      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },

      gudang: [],
    }
  },
  methods: {
    ...mapActions('monitoring_stock_tmp', ['triggerFilter','getLaporan']),
    ...mapActions('gudang', ['getListGudang']),
    _getGudang(){
      this.getListGudang().then(res => {
        this.gudang= res
      })
    },
  },
  mounted: function () {
    this._getGudang()
  },
};
</script>