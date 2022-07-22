<template>
  <div v-if="confirm_modal">
    <div
        class="modal modal-bl ur fade"
        :class="confirm_modal ? 'show' : ''"
        style="display: block; z-index: 99999999999; background: rgba(0,0,0,0.5)"
        tabindex="-1"
        role="dialog"
        aria-hidden="true"
        @click="$event.target.classList.contains('modal') ? close() : true"
    >
      <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <h5 class="modal-title mb-0" v-html="confirm.title"></h5>
            <small v-html="confirm.subTitle"></small>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-white" @click="confirm_modal = false">Batal</button>
            <button
                type="submit"
                ref="submit"
                v-on:click="callFunction(confirm.action)"
                class="btn "
                :class="confirm.btnConfirm"
                :disabled="loading"
                v-html="loading ? spin() : confirm.textConfirm"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" :class="confirm_modal ? 'show' : ''" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import helper from "@/assets/js/helper.js";
export default {
  name: "FormCancelClaim",
  mixins: [helper],
  computed: {
    ...mapState(['loading']),
    ...mapState('retur', {
      confirm: state => state.confirm
    }),
    confirm_modal: {
      get() {
        return this.$store.state.retur.confirm_modal
      },
      set(val) {
        return this.$store.commit('retur/SET_CONFIRM_MODAL', val)
      }
    }
  },
  methods: {
    ...mapActions('retur', ['cancelClaim', 'removeRetur']),
    callFunction(name) {
      this[name]()
    }
  }
}
</script>

<style scoped>

</style>
