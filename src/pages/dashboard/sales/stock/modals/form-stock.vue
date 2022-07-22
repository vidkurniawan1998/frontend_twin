<template>
  <div v-if="form">
    <div class="modal fade"
         tabindex="-1"
         style="display: block"
         role="dialog" v-if="form"
         :class="form ? 'show' : ''"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="close" @click="form = false" v-html="ic('close')"/>
          </div>
          <form v-on:submit.prevent="saveData()">
            <div class="modal-body default">
              <div class="row">
                <div class="col-12 form-group">
                  <label for="gudang">Gudang</label>
                  <selectize
                      id="gudang"
                      v-model="stock.id_gudang"
                      data-placeholder="Pilih Gudang"
                      :disabled="loading">
                    <option :value="d.id" v-for="(d, i) in gudang" :key="i">
                      {{ d.nama_gudang }}
                    </option>
                  </selectize>
                </div>
              </div>
              <div class="row">
                <div class="col-12 form-group">
                  <label for="barang">Barang</label>
                  <selectize
                      id="barang"
                      v-model="stock.id_barang"
                      data-placeholder="Pilih Barang"
                      :disabled="loading">
                    <option :value="d.id" v-for="(d, i) in barang" :key="i">
                      {{ d.kode_barang }} - {{ d.nama_barang }}
                    </option>
                  </selectize>
                </div>
              </div>
              <div class="row">
                <div class="col-12 form-group">
                  <label for="qty">Qty</label>
                  <input
                      v-model="stock.qty"
                      id="qty"
                      type="number"
                      class="form-control">
                </div>
              </div>
              <div class="row">
                <div class="col-12 form-group">
                  <label for="qty-pcs">Qty PCS</label>
                  <input
                      v-model="stock.qty_pcs"
                      id="qty-pcs"
                      type="number"
                      class="form-control">
                </div>
              </div>
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
    <div class="modal-backdrop fade" :class="form ? 'show' : ''" />
  </div>
</template>

<script>
import helper from "@/assets/js/helper";
import {mapActions, mapState} from "vuex";
export default {
  name: "FormStock",
  mixins: [helper],
  data() {
    return {
      gudang: [],
      barang: []
    }
  },
  computed: {
    ...mapState(['errors', 'loading']),
    ...mapState('stock', {
      title: state => state.form_title,
      stock: state => state.stock
    }),
    form: {
      get() {
        return this.$store.state.stock.form
      },
      set(val) {
        return this.$store.commit('stock/SET_FORM', val)
      }
    }
  },
  methods: {
    ...mapActions('stock', ['submitStock']),
    ...mapActions('gudang', ['getListGudang']),
    ...mapActions('barang', ['getListBarang']),
    saveData() {
      this.submitStock()
    },
    _getListGudang() {
      this.getListGudang({}).then( res => {
        this.gudang = res
      })
    },
    _getListBarang() {
      this.getListBarang({}).then( res => {
        this.barang = res
      })
    }
  },
  watch: {
    form: function () {
      if (this.form === true) {
        if (this.gudang.length === 0) this._getListGudang()
        if (this.barang.length === 0) this._getListBarang()
      }
    }
  }
}
</script>

<style scoped>

</style>
