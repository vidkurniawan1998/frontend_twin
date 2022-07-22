<template>
  <div v-if="show_modal">
    <div
        class="modal fade"
        :class="show_modal ? 'show' : ''"
        style="display: block"
        tabindex="-1"
        role="dialog"
        aria-hidden="true"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Tandai Sudah Diklaim</h5>
            <button type="button" class="close" @click="show_modal = false" v-html="ic('close')"/>
          </div>
          <div class="modal-body pt-3">
            <div class="form-group">
              <label for="" class="form-label">Pilih Tanggal</label>
              <input type="date" class="form-control" v-model="$store.state.retur.claim_date">
            </div>

            <div class="form-group" v-if="is_faktur_pajak">
              <label for="faktur_pajak" class="form-label">Faktur Pajak Retur</label>
              <input type="text" id="faktur_pajak"  v-model="$store.state.retur.faktur_pajak" class="form-control" placeholder="Inputkan Faktur Pajak Retur">
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-white" @click="show_modal = false" v-html="'Tutup'" />
            <button type="button" class="btn btn-primary" @click="setClaimRetur()" :disabled="loading" v-html="loading ? spin() : `Tandai Sudah Klaim`" />
          </div>

        </div>
      </div>
    </div>

    <div class="modal-backdrop fade" :class="show_modal ? 'show' : ''" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import helper from "@/assets/js/helper.js";
export default {
  name: "FormClaim",
  mixins: [helper],
  computed: {
    ...mapState(['loading']),
    ...mapState('retur', {
      claim_id : state => state.claim_id,
      is_faktur_pajak : state => state.is_faktur_pajak,
    }),
    show_modal: {
      get() {
        return this.$store.state.retur.show_modal
      },
      set(val) {
        return this.$store.commit('retur/SET_CLAIM_MODAL', val)
      }
    }
  },
  methods: {
    ...mapActions('retur', ['setClaimRetur'])
  }
}
</script>

<style scoped>

</style>