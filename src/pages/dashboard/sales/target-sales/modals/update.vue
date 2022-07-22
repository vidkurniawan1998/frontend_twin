<template>
  <div v-if="form">
    <div
        class="modal fade"
        :class="form ? 'show' : ''"
        style="display: block"
        tabindex="-1"
        role="dialog"
        aria-hidden="true"
        @click="dismiss ? $event.target.classList.contains('modal') ? SET_FORM_UPDATE(false) : true : true"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">{{update_data.tim}} - {{ update_data.nama_salesman }}</h5>
            <button type="button" class="close" @click="SET_FORM_UPDATE(false)" v-html="loading ? spin() : ic('close')"/>
          </div>
          <div class="modal-body pt-3">
            <div class="row">
              <div class="form-group col-12">
                <label class="form-label">Target</label>
                <currency-input
                    class="form-control"
                    v-model="update_data.target"
                />
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
                type="button"
                class="btn btn-white"
                @click="SET_FORM_UPDATE(false)" v-html="'Tutup'" />
            <button
                type="button"
                :disabled="loading"
                @click="updateTargetSalesman(update_data.id)"
                class="btn btn-primary" v-html="'Simpan'" />
          </div>

        </div>
      </div>
    </div>

    <div class="modal-backdrop fade" :class="form ? 'show' : ''" />
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import {mapActions, mapMutations, mapState} from "vuex";

export default {
  name: "Modal",
  mixins: [helper],

  data() {
    return {
      dismiss: {default: true}
    };
  },
  computed: {
    ...mapState(['loading']),
    ...mapState('target_salesman', {
      form: state => state.form_update,
      update_data: state => state.update
    })
  },
  methods: {
    ...mapActions('target_salesman', ['updateTargetSalesman']),
    ...mapMutations('target_salesman', ['SET_FORM_UPDATE']),
  },
};
</script>

