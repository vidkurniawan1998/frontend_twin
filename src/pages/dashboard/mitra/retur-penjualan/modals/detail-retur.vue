<template>
  <div v-if="show_modal">
    <div
        class="modal fade"
        :class="show_modal ? 'show':''"
        style="display: block"
        tabindex="-1"
        role="dialog"
        aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document"
           style="max-width: 90%; transition: .3s">
        <div class="modal-content">
          <div class="modal-body pt-3 pb-0" style="min-height: 350px">
            <!-- header -->
            <div style="line-height: 17px" class="mb-4">
              <h3 class="m-0">Detail Retur Penjualan</h3>
              <div class="info-header mt-3">
                <div class="mb-1">
                  No Retur
                  <span class="click-able">{{ retur.id }}</span>
                </div>
                <div class="mb-1">
                  No Retur Toko
                  <span class="click-able">{{ retur.no_retur_manual }}</span>
                </div>
                <div class="mb-1">
                  No Acc
                  <span class="click-able">{{ retur.no_acc_toko }}</span>
                </div>
                <div class="mb-1">
                  No Cust
                  <span class="click-able">{{ retur.no_cust_toko }}</span>
                </div>
                <div class="mb-1">
                  Nama Toko
                  <span class="click-able">{{ retur.nama_toko }}</span>
                </div>
                <div class="mb-1">
                  Alamat
                  <span class="click-able">{{ retur.alamat_toko }}</span>
                </div>
                <div class="mb-1">
                  NPWP
                  <span class="click-able">{{ retur.npwp }}</span>
                </div>
                <div class="mb-1">
                  Gudang
                  <span class="click-able">{{ retur.nama_gudang }}</span>
                </div>
                <div class="mb-1">
                  Tipe Barang
                  <span class="click-able">{{ retur.tipe_barang }}</span>
                </div>
                <div class="mb-1">
                  Status
                  <span class="click-able">{{ retur.status }}</span>
                </div>
                <div class="mb-1">
                  TIM
                  <span class="click-able">{{ retur.nama_tim }}</span>
                </div>
                <div class="mb-1">
                  Salesman
                  <span class="click-able">{{ retur.nama_salesman }}</span>
                </div>
              </div>
              <div class="modal-control">
                <button class="btn-modal-control" v-html="ic('refresh')"  @click="refreshData" :disabled="loading"/>
                <button class="btn-modal-control" v-html="ic('plus')" v-if="retur.status === 'waiting'" :disabled="loading" @click="showFormModal(true)"/>
                <button class="btn-modal-control" v-html="ic('printer')" @click="print()" :disabled="loading"/>
                <button class="btn-modal-control" v-html="loading ? spin() : ic('close')" @click="show_modal = false"/>
              </div>
            </div>

            <div class="card">
              <div class="card-body p-0 table-responsive" style="min-height: 350px">
                <div class="table-dpb">
                  <table class="table table-v center table-hover card-table table-striped table-no-break">
                    <thead>
                      <tr class="text-muted">
                        <th>No</th>
                        <th>Kode Barang</th>
                        <th>Nama Barang</th>
                        <th>Kategori</th>
                        <th>Kuantiti</th>
                        <th>Harga</th>
                        <th>Subtotal</th>
                        <th>Diskon</th>
                        <th>DPP</th>
                        <th v-if="retur.status == 'waiting'"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="10" style="padding: 0px!important">
                          <Skeleton type="table" :length="5" class="mt-3 bg-white m-2"/>
                        </td>
                      </tr>
                      <tr v-if="detail_retur.length === 0">
                        <td colspan="10">
                          Tidak ada data...
                        </td>
                      </tr>
                      <tr v-for="(row, i) in detail_retur" v-if="!loading">
                        <td>{{ i+1 }}</td>
                        <td>{{ row.kode_barang }}</td>
                        <td>{{ row.nama_barang }}</td>
                        <td>{{ row.kategori_bs }}</td>
                        <td>{{ row.qty_dus }} / {{ row.qty_pcs }}</td>
                        <td>{{ row.harga | currency }}</td>
                        <td>{{ row.subtotal | currency }}</td>
                        <td>{{ row.discount | currency }}</td>
                        <td>{{ row.dpp | currency }}</td>
                        <td style="padding: 2px" v-if="retur.status == 'waiting'">
                          <div class="btn-group">
                            <button class="btn btn-white btn-pill" @click="editDetailRetur(row)" v-html="ic('edit')"> </button>
                            <button class="btn btn-white btn-pill" @click="deleteDetailRetur(row.id)" v-html="ic('trash')"> </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <!-- detail harga -->
          <div class="px-4 pt-3">
            <span class="badge-md strong mr-2"> Subtotal <span>{{ retur.subtotal | currency }}</span> </span>
            <span class="badge-md strong mr-2"> Diskon <span>{{ retur.discount | currency }}</span> </span>
            <span class="badge-md strong mr-2"> DPP <span>{{ retur.dpp | currency }}</span> </span>
            <span class="badge-md strong mr-2"> Total Dus <span>{{ retur.total_dus }}</span> </span>
            <span class="badge-md strong mr-2"> Total Pcs <span>{{ retur.total_pcs }}</span> </span>
            <span class="badge-md strong mr-2"> PPn <span>{{ retur.ppn | currency }}</span> </span>
            <span class="badge-md strong mr-2"> Grand Total <span>{{ retur.grand_total | currency }}</span> </span>
          </div>

          <!-- button -->
          <div class="px-4 py-4 text-right">
            <button
                @click="show_modal = false"
                type="button"
                class="btn btn-white"
                v-html="'Tutup'" />
            <button
                :disabled="loading"
                @click="updateStatus"
                type="button"
                class="btn btn-primary ml-3"
                v-html=" retur.status === 'waiting' ? `Setujui`: `Batal Setujui`" />
          </div>

          <!-- form add & edit item -->

          <transition name="slide-fade-x">

            <div class="form-item" v-show="form.modal">
              <div class="fi-body">
                <div class="card-header">
                  <h3 class="card-title">{{ form.title }}</h3>
                  <button type="button" class="close" @click="showFormModal(false)" v-html="ic('close')"/>
                </div>
                <form @submit.prevent="submitForm">
                  <div class="card-body">
                    <div class="form-group">
                      <label for="barang" class="form-label">Pilih Barang</label>
                      <selectize id="barang" data-placeholder="Pilih barang" v-model="barang_retur.id_barang" required>
                        <option v-for="(br, i) in barang" :value="br.id">{{ br.kode_barang }} - {{ br.nama_barang }}</option>
                      </selectize>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Tipe Retur Barang</label>
                      <label class="form-check form-check-inline" v-for="(d, i) in tipe_retur" :key="i">
                        <input
                            class="form-check-input"
                            type="radio" name="tipe-retur"
                            :value="d.value"
                            v-model="barang_retur.kategori_bs">
                        <span class="form-check-label" v-html="d.text"/>
                      </label>
                    </div>

                    <div class="form-group">
                      <label for="expired" class="form-label">Tanggal Expired</label>
                      <input
                          id="expired"
                          type="date"
                          class="form-control"
                          v-model="barang_retur.expired_date"
                          required>
                    </div>

                    <div class="row">
                      <div class="form-group col-6">
                        <label for="dus" class="form-label">Banyak Dus</label>
                        <input
                            type="number"
                            id="dus"
                            v-model="barang_retur.qty_dus"
                            class="form-control"
                            placeholder="Banyak dus">
                      </div>

                      <div class="form-group col-6">
                        <label for="pcs" class="form-label">Banyak Pcs</label>
                        <input
                            id="pcs"
                            type="number"
                            v-model="barang_retur.qty_pcs"
                            class="form-control"
                            placeholder="Banyak pcs">
                      </div>
                    </div>

                    <div class="row">
                      <div class="form-group col-6">
                        <label for="disc-persen" class="form-label">Disc Persen</label>
                        <input
                            type="number"
                            id="disc-persen"
                            v-model="barang_retur.disc_persen"
                            class="form-control"
                            placeholder="Diskon Persen">
                      </div>

                      <div class="form-group col-6">
                        <label for="disc-nominal" class="form-label">Disc Nominal</label>
                        <currency-input
                            id="disc-nominal"
                            class="form-control"
                            v-model="barang_retur.disc_nominal">
                        </currency-input>
                      </div>
                    </div>

                  </div>

                  <div class="card-footer text-right">
                    <button type="button" class="btn btn-white" @click="showFormModal(false)" v-html="'Tutup'"></button>
                    <button type="submit" class="btn btn-primary ml-3" :disabled="loading" v-html="'Simpan'"></button>
                  </div>

                </form>
              </div>

            </div>
          </transition>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
import helper from "@/assets/js/helper";
import {mapActions, mapMutations, mapState} from "vuex";

export default {
  name: "DetailRetur",
  mixins: [helper],
  data() {
    return {
      form: {
        modal: false,
        title: 'Tambah Barang Retur'
      },
      barang: [], tipe_retur: [],
    }
  },
  computed: {
    ...mapState(['loading']),
    ...mapState('retur', {
      retur: state => state.retur,
      detail_retur: state => state.detail_retur,
      barang_retur: state => state.barang_retur
    }),
    show_modal: {
      get() {
        return this.$store.state.retur.show_modal_detail
      },
      set(val) {
        return this.$store.commit('retur/SET_DETAIL_MODAL', val)
      }
    }
  },
  methods: {
    ...mapActions('retur', [
        'getRetur', 'getDetailRetur', 'addDetailRetur',
        'updateDetailRetur', 'removeDetailRetur', 'approveRetur',
        'cancelApproveRetur'
    ]),
    ...mapActions('barang', ['getListBarang']),
    ...mapActions('option', ['getOptionsByCode']),
    ...mapMutations('retur', ['ASSIGN_DATA_BARANG_RETUR', 'CLEAR_BARANG_RETUR']),
    showFormModal(status, edit=null) {
      this.form.modal = status
      if (this.barang.length === 0) this.getBarang({id_perusahaan: this.retur.id_perusahaan})
      if (this.tipe_retur.length === 0) this.getJenisReturBarang()
      if (edit !== true) {
        this.form.title = 'Tambah Barang Retur'
        this.CLEAR_BARANG_RETUR()
      }
    },
    editDetailRetur(row) {
      this.form.title = 'Edit Barang Retur'
      this.showFormModal(true, true)
      this.ASSIGN_DATA_BARANG_RETUR(row)
    },
    getBarang(payload) {
      this.getListBarang(payload).then(res => {
        this.barang = res
      })
    },
    getJenisReturBarang() {
      this.getOptionsByCode('jenis_retur_barang').then( res => {
        this.tipe_retur = res
      })
    },
    submitForm() {
      if(this.barang_retur.id === '') {
        this.barang_retur.id_retur_penjualan = this.retur.id
        this.addDetailRetur().then( res => {
          this.form.modal = false
          this.refreshData()
        })
      } else {
        this.updateDetailRetur(this.barang_retur.id).then( res => {
          this.form.modal = false
          this.refreshData()
        })
      }
    },
    deleteDetailRetur(id) {
      this.removeDetailRetur(id).then( res => {
        this.refreshData()
      })
    },
    updateStatus() {
      if (this.retur.status === 'approved') {
        this.cancelApproveRetur(this.retur.id).then( res => {
          this.refreshData()
          this.$emit('refresh')
        })
      } else {
        this.approveRetur(this.retur.id).then( res => {
          this.refreshData()
          this.$emit('refresh')
        })
      }
    },
    refreshData() {
      this.getRetur(this.retur.id)
      this.getDetailRetur(this.retur.id)
    },
    print() {
      let data = {
        header: this.retur,
        details: this.detail_retur
      }

      localStorage.retur = JSON.stringify(data)
      window.open(window.location.origin+'/dashboard/sales/retur-penjualan/print', '_blank')
    }
  }
}
</script>

<style lang="scss" src="../retur-penjualan.scss" scoped/>