<template>
  <div>
    <div class="row">
      <div class="col-4 form-group">
        <label for="perusahaan" class="form-label">Perusahaan</label>
        <selectize
            id="perusahaan"
            data-placeholder="Pilih Perusahaan"
            @input="_getDepo($event)"
            v-model="faktur_pembelian.id_perusahaan"
            :disabled="loading" required>
          <option :value="d.id" v-for="(d, i) in perusahaan" :key="i"> {{d.kode_perusahaan}} - {{d.nama_perusahaan}} </option>
        </selectize>
      </div>
      <div class="col-4 form-group">
        <label for="depo" class="form-label">Depo</label>
        <selectize
            id="depo"
            data-placeholder="Pilih Depo"
            :disabled="loading"
            v-model="faktur_pembelian.id_depo"
            required>
          <option :value="d.id" v-for="(d, i) in depo" :key="i"> {{d.nama_depo}} </option>
        </selectize>
      </div>
      <div class="col-4 form-group">
        <label for="principal" class="form-label">Principal</label>
        <selectize
            id="principal"
            data-placeholder="Pilih Principal"
            :disabled="loading"
            @input="_getListPenerimaanBarang($event)"
            v-model="faktur_pembelian.id_principal"
            required>
          <option :value="d.id" v-for="(d, i) in principal" :key="i"> {{d.nama_principal}} </option>
        </selectize>
      </div>
    </div>

    <div class="row">
      <div class="col-4 form-group">
        <label for="no-invoice" class="form-label">No Invoice</label>
        <input type="text" id="no-invoice" placeholder="Inputkan No Invoice" class="form-control" v-model="faktur_pembelian.no_invoice" required>
      </div>

      <div class="col-4 form-group">
        <label for="tanggal-invoice" class="form-label">Tanggal Invoice</label>
        <input type="date" id="tanggal-invoice" class="form-control" v-model="faktur_pembelian.tanggal_invoice" required>
      </div>

      <div class="col-4 form-group">
        <label for="due-date" class="form-label">Due Date</label>
        <input type="date" id="due-date" class="form-control" v-model="faktur_pembelian.tanggal_jatuh_tempo" required>
      </div>
    </div>

    <div class="row">
      <div class="col-4 form-group">
        <label for="ppn" class="form-label">PPN</label>
        <input type="number" id="ppn" class="form-control" v-model="faktur_pembelian.ppn">
      </div>
      <div class="col-4 form-group">
        <label for="penerimaan" class="form-label">No Penerimaan Barang</label>
        <selectize
            id="penerimaan"
            data-placeholder="Pilih Penerimaan Barang"
            :disabled="loading"
            v-model="id_penerimaan_barang"
            required>
          <option :value="d.id" v-for="(d, i) in penerimaan_barang" :key="i"> {{d.no_pb}} - {{d.no_do}} </option>
        </selectize>
      </div>
       <div class="col-4 form-group">
        <label for="no-invoice" class="form-label">No Faktur Pajak</label>
        <input type="text" id="no_faktur_pajak" placeholder="Inputkan No Faktur Pajak" class="form-control" v-model="faktur_pembelian.faktur_pajak" required>
      </div>
    </div>

    <div class="row" style="text-align: right; top: -25px; position: relative;">
       <div class="col-8"></div>
       <div class="col-4">
        <label class="form-label" style="color: white">.</label>
        <button class="btn btn-primary" @click="add_do()">Tambah</button>
      </div>
    </div>

    <div class="row" style="margin-top: 10px">
      <div class="col-12">
        <table class="table table-responsive">
          <thead>
            <tr>
              <th>No</th>
              <th>No PB</th>
              <th>No DO/SJ</th>
              <th>Tgl Bongkar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="faktur_pembelian.penerimaan_barang.length === 0">
              <td class="text-center" colspan="5">
                Belum ada data
              </td>
            </tr>
            <tr v-for="(pb, i) in faktur_pembelian.penerimaan_barang" :key="i">
              <td>{{ i+1 }}</td>
              <td>{{ pb.no_pb }}</td>
              <td>{{ pb.no_do }}</td>
              <td>{{ pb.tgl_bongkar }}</td>
              <td>
                <button class="btn btn-sm btn-danger" v-html="ic('minus')" @click="del_do(i)"></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="row">
      <div class="col-4">
        <button class="btn btn-info" @click="_getListBarang()" :disabled="loading">Proses Invoice Pembelian</button>
      </div>
    </div>

    <!-- detail barang -->
    <div class="row" style="margin-top: 20px">
      <div class="col-12">
        <table class="table table-responsive">
          <thead>
            <tr>
              <th>No</th>
              <th>Kode Barang</th>
              <th>Nama Barang</th>
              <th>Qty</th>
              <th>Harga Barang</th>
              <th>Disc Persen</th>
              <th>Disc Rupiah</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="faktur_pembelian.detail_faktur_pembelian.length === 0">
                <td colspan="8" class="text-center">
                  Belum ada data
                </td>
            </tr>
            <tr v-for="(pembelian, i) in faktur_pembelian.detail_faktur_pembelian">
              <td>{{ i+1}}</td>
              <td>{{ pembelian.kode_barang}} </td>
              <td>{{ pembelian.nama_barang}} </td>
              <td>{{ pembelian.qty }} / {{ pembelian.pcs }}</td>
              <td class="text-right">{{ pembelian.harga_barang | currency }}</td>
              <td>
                <input type="number" class="form-control" v-model="pembelian.disc_persen">
              </td>
              <td>
                <currency-input
                    class="form-control"
                    v-model="pembelian.disc_value"
                />
              </td>
              <td class="text-right">
                {{ ((pembelian.subtotal - ( pembelian.subtotal * pembelian.disc_persen/100)) - pembelian.disc_value) | currency }}
              </td>
            </tr>
            <tr v-if="faktur_pembelian.detail_faktur_pembelian.length > 0">
              <td colspan="2"></td>
              <td></td>
              <td>{{ ribuan(_totalQty()[0]) }} / {{ ribuan(_totalQty()[1]) }}</td>
              <td></td>
              <td>
                <input type="number" class="form-control" v-model="faktur_pembelian.disc_persen">
              </td>
              <td>
                <currency-input
                    class="form-control"
                    v-model="faktur_pembelian.disc_value"
                />
              </td>
              <td class="text-right">{{ subtotal | currency }}</td>
            </tr>
            <tr v-if="faktur_pembelian.detail_faktur_pembelian.length > 0">
              <td colspan="6"></td>
              <td class="text-right">SUBTOTAL</td>
              <td class="text-right">{{ subtotal | currency }}</td>
            </tr>
            <tr v-if="faktur_pembelian.detail_faktur_pembelian.length > 0">
              <td colspan="6"></td>
              <td class="text-right">DISC</td>
              <td class="text-right">{{ disc | currency }}</td>
            </tr>
            <tr v-if="faktur_pembelian.detail_faktur_pembelian.length > 0">
              <td colspan="6"></td>
              <td class="text-right">DPP</td>
              <td class="text-right">{{ net | currency }}</td>
            </tr>
            <tr v-if="faktur_pembelian.detail_faktur_pembelian.length > 0">
              <td colspan="6"></td>
              <td class="text-right">PPn</td>
              <td class="text-right">{{ (net*0.1) | currency }}</td>
            </tr>
            <tr v-if="faktur_pembelian.detail_faktur_pembelian.length > 0">
              <td colspan="6"></td>
              <td class="text-right">GRAND TOTAL</td>
              <td class="text-right">{{ (net*1.1) | currency }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import helper from "@/assets/js/helper";
export default {
  name: "form.vue",
  mixins: [helper],
  data() {
    return {
      perusahaan: [], depo: [], principal: [], penerimaan_barang: [],
      id_penerimaan_barang: '',
      subtotal: 0, total: 0, net: 0, disc: 0
    }
  },
  computed: {
    ...mapState(['loading']),
    ...mapState('faktur_pembelian', {
      faktur_pembelian: state => state.faktur_pembelian
    })
  },
  methods: {
    ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
    ...mapActions('depo', ['getListDepo']),
    ...mapActions('principal', ['getListPrincipal']),
    ...mapActions('penerimaan_barang', ['getListPenerimaanBarang', 'getListBarang']),
    _getPerusahaan() {
      this.getListPerusahaanByAccess({}).then( res => {
        this.perusahaan = res
      })
    },
    _getDepo(id = '') {
      this.getListDepo({filter: false, id_perusahaan: id}).then(res => {
        this.depo = res
      });

      this._getPrincipal(id)
    },
    _getPrincipal(id = '') {
      this.getListPrincipal({id_perusahaan: id}).then( res => {
        this.principal = res
      })
    },
    _getListPenerimaanBarang(id = '') {
      this.getListPenerimaanBarang({id_principal: id}).then( res => {
        this.penerimaan_barang = res
      })
    },
    add_do() {
      let exists = this.faktur_pembelian.penerimaan_barang.find( x => x.id == this.id_penerimaan_barang)
      if (exists) {
        alert('Data duplikat')
        return
      }

      let pb = this.penerimaan_barang.find( x => x.id == this.id_penerimaan_barang )
      this.faktur_pembelian.penerimaan_barang.push(pb)
    },
    del_do(i) {
      this.faktur_pembelian.penerimaan_barang.splice(i, 1)
    },
    _getListBarang() {
      let id_pb = Array.from(this.faktur_pembelian.penerimaan_barang, item => item.id)
      this.faktur_pembelian.detail_faktur_pembelian = []
      this.getListBarang({id_penerimaan_barang: id_pb}).then( res => {
        this.faktur_pembelian.detail_faktur_pembelian.push(...res)
      })
    },
    _subtotal() {
      this.subtotal   = 0
      this.net        = 0
      let total       = 0
      let discItem    = 0
      let discGlobal  = 0
      let discTotal   = 0
      for (let pb of this.faktur_pembelian.detail_faktur_pembelian ) {
        discItem = (pb.subtotal * pb.disc_persen/100) + pb.disc_value
        this.subtotal+= pb.subtotal
        total+= pb.subtotal - discItem
        discTotal+= discItem
      }

      discGlobal = (total * this.faktur_pembelian.disc_persen / 100) + this.faktur_pembelian.disc_value
      discTotal += discGlobal
      this.disc = discTotal
      this.net  = this.subtotal - discTotal
    },
    _totalQty() {
      let pcs = 0
      let qty = 0
      for (let pb of this.faktur_pembelian.detail_faktur_pembelian ) {
        qty+= pb.qty
        pcs+= pb.pcs
      }

      return [qty, pcs]
    }
  },
  created() {
    this._getPerusahaan()
    this._getDepo()
    this._getPrincipal()
  },
  watch: {
    "faktur_pembelian.detail_faktur_pembelian": {
      handler(val){
        this._subtotal()
      },
      deep: true
    },
    "faktur_pembelian.disc_persen": {
      handler(val){
        this._subtotal()
      },
      deep: true
    },
    "faktur_pembelian.disc_value": {
      handler(val){
        this._subtotal()
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
