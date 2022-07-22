<template>
  <div v-if="form">
    <div class="modal fade"
         tabindex="-1"
         style="display: block"
         role="dialog" v-if="form"
         :class="form ? 'show' : ''"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="close" @click="form = false" v-html="ic('close')"/>
          </div>
          <form v-on:submit.prevent="saveData()">
          <!--body-->
          <div class="modal-body default">
            <div class="row">
              <div class="col-12 form-group">
                <label for="promo">Pilih Promo</label>
                <selectize id="promo" v-model="sharing_promo.id_promo" data-placeholder="Pilih Promo">
                  <option
                      v-for="(promo, i) in promos.data"
                      :key="i" :value="promo.id">
                      {{ promo.no_promo }} - {{ promo.nama_promo }}
                  </option>
                </selectize>
              </div>
            </div>
            <!--Diskon Persen-->
            <div class="row">
              <div class="col-6 form-group">
                <label for="disk-persen-dist">Disk. Persen Distributor</label>
                <input
                    v-model="sharing_promo.persen_dist"
                    id="disk-persen-dist"
                    type="text"
                    class="form-control">
              </div>
              <div class="col-6 form-group">
                <label for="disk-persen-prin">Disk. Persen Principal</label>
                <input
                    v-model="sharing_promo.persen_principal"
                    id="disk-persen-prin"
                    type="text"
                    class="form-control">
              </div>
            </div>
            <!--End Diskon Persen-->

            <!--Diskon Rupiah-->
            <div class="row">
              <div class="col-6 form-group">
                <label for="disk-rupiah-dist">Disk. Rupiah Distributor</label>
                <input
                    v-model="sharing_promo.nominal_dist"
                    id="disk-rupiah-dist"
                    type="text"
                    class="form-control">
              </div>
              <div class="col-6 form-group">
                <label for="disk-rupiah-prin">Disk. Rupiah Principal</label>
                <input
                    v-model="sharing_promo.nominal_principal"
                    id="disk-rupiah-prin"
                    type="text"
                    class="form-control">
              </div>
            </div>
            <!--End Diskon Rupiah-->

            <!--Diskon Barang Extra-->
            <div class="row">
              <div class="col-6 form-group">
                <label for="barang-extra-dist">Barang Extra Distributor</label>
                <input
                    v-model="sharing_promo.extra_dist"
                    id="barang-extra-dist"
                    type="text"
                    class="form-control">
              </div>
              <div class="col-6 form-group">
                <label for="barang-extra-prin">Barang Extra Principal</label>
                <input
                    v-model="sharing_promo.extra_principal"
                    id="barang-extra-prin"
                    type="text"
                    class="form-control">
              </div>
            </div>
            <!--End Diskon Barang Extra-->
          </div>

          <div class="modal-footer pt-2">
            <button
                @click="form = false"
                type="button"
                class="btn btn-white"
                v-html="'Tutup'" />
            <button
                :disabled="loading"
                type="submit"
                class="btn btn-primary"
                v-html="'Simpan'"
            />
          </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import helper from "@/assets/js/helper.js";
export default {
  name: "FormSharingPromo",
  mixins: [helper],
  computed: {
    ...mapState(['errors', 'loading']),
    ...mapState('sharing_promo', {
      title: state => state.form_title,
      sharing_promo: state => state.sharing_promo
    }),
    ...mapState('promo', {
      promos: state => state.promos
    }),
    form: {
      get() {
        return this.$store.state.sharing_promo.form
      },
      set(val) {
        return this.$store.commit('sharing_promo/SET_FORM', val)
      }
    },
  },
  methods: {
    ...mapActions('promo', ['getPromoOption']),
    ...mapActions('sharing_promo', ['submitSharingPromo', 'updateSharingPromo']),
    saveData() {
      if (this.sharing_promo.id == '') {
        this.submitSharingPromo()
      } else {
        this.updateSharingPromo(this.sharing_promo.id)
      }
    }
  },
  created() {
    this.getPromoOption()
  }
}
</script>

<style scoped>

</style>