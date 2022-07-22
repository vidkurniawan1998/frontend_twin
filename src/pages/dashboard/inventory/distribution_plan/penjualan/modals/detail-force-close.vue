<template>
  <div v-if="data_close.form">
    <div
      class="modal fade"
      :class="data_close.form ? 'show' : ''"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Force Close</h5>
            <button type="button" class="close" @click="data_close.form=false" v-html="loading ? spin() : ic('close')"/>
          </div>
            <div class="modal-body pt-3">
              <div class="form-group">
                <textarea class="form-control" placeholder="Input Keterangan" v-model="data_close.remark" rows="5"></textarea>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-white" @click="data_close.form=false" v-html="'Tutup'" />
              <button type="button" class="btn btn-primary" @click="setForceClose" :disabled="loading" v-html="loading ? spin() : 'Simpan'"/>
            </div>

        </div>
      </div>
    </div>

    <div class="modal-backdrop fade" :class="data_close.form ? 'show' : ''" />
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import { mapState, mapActions, mapMutations } from 'vuex';

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

  computed: {
    ...mapState('distribution_plan', {
      data_close : state => state.data_close
    }),
  },

  data() {
    return {
      loading : false,
    }
  },

  methods:{
    setForceClose(){
      let payload = {};
      payload.checkeds = this.data_close.checkeds;
      payload.close_remark = this.data_close.remark;
      this.loading = true;
      this.axios.post(`penjualan/force_close`, payload).then(res => {
        this.toast('Penjualan berhasil dibatalkan');
        this.data_close.checkeds = [];
        this.data_close.remark = '';
        this.loading = false;
        this.data_close.form = false
        this.submit();
      }).catch( err => {
        this.loading = false
        this.onError(err)
      });
    },

    submit(){
      this.$emit("submit");
    }
  },

  watch: {
    initData: function(data) { },
  },
}
</script>
