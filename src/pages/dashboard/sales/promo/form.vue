<template>
  <div>
    <div class="row">
      <div class="col-6 form-group">
        <label for="perusahaan" class="form-label">Perusahaan</label>
        <selectize id="perusahaan" v-model="promo.id_perusahaan" data-placeholder="Pilih Perusahaan" @input="_getDepoBarang($event)" :disabled="loading" required>
          <option :value="d.id" v-for="(d, i) in perusahaan" :key="i"> {{d.kode_perusahaan}} - {{d.nama_perusahaan}} </option>
        </selectize>
      </div>
      <div class="col-6 form-group">
        <label class="form-label">Depo</label>
        <selectize
            @input="_getToko($event)"
            v-model="promo.depo"
            data-placeholder="Pilih Depo"
            :settings="selectConfig"
            :disabled="loading"
            required
            :key="re_render"
        >
          <option :value="row.id" v-for="(row, i) in list_depo" :key="i">
            {{row.nama_depo}}
          </option>
        </selectize>
      </div>
    </div>

    <div class="row">
      <div class="col-6 form-group">
        <label class="form-label">No Proposal</label>
        <input type="text" class="form-control" v-model="promo.no_promo">
      </div>
      <div class="col-6 form-group">
        <label class="form-label">Nama Proposal</label>
        <input type="text" class="form-control" v-model="promo.nama_promo">
      </div>
    </div>

    <div class="row">
      <div class="col-3 form-group">
        <label class="form-label">Disk Rupiah (Distributor)</label>
        <input type="number" class="form-control" v-model="promo.disc_rupiah_distributor">
      </div>
      <div class="col-3 form-group">
        <label class="form-label">Disk Rupiah (Principal)</label>
        <input type="number" class="form-control" v-model="promo.disc_rupiah_principal">
      </div>
      <div class="col-6 form-group">
        <label class="form-label">Barang Extra</label>
        <selectize data-placeholder="Pilih barang" v-model="promo.id_barang">
          <option :value="''">Tanpa Barang Extra</option>
          <option
              :value="d.id"
              v-for="(d, i) in list_barang_extra"
              :key="i"> {{d.kode_barang}} - {{d.nama_barang}}
          </option>
        </selectize>
      </div>
    </div>

    <div class="row">
      <div class="col-3 form-group">
        <label class="form-label">Minimal Order (Grand Total Value)</label>
        <input type="number" class="form-control" v-model="promo.minimal_order" min="0">
      </div>
      <div class="col-3 form-group">
        <label class="form-label">Volume Minimal Pcs</label>
        <input type="number" class="form-control" v-model="promo.volume_extra">
      </div>
      <div class="col-6 form-group">
        <label class="form-label">Bonus Pcs Extra</label>
        <input type="number" class="form-control" v-model="promo.pcs_extra">
      </div>
    </div>

    <div class="row">
      <div class="col-6 form-group">
        <label class="form-label">Diskon Persen 1 (Distributor)</label>
        <input type="text"
               class="form-control"
               placeholder="Diskon persen"
               v-model="promo.disc_persen[0]"
               autocomplete="off">
      </div>
      <div class="col-6 form-group">
        <label class="form-label">Diskon Persen 2 (Distributor)</label>
        <input type="text"
               class="form-control"
               placeholder="Diskon persen"
               v-model="promo.disc_persen[1]"
               autocomplete="off">
      </div>
    </div>

    <div class="row">
      <div class="col-6 form-group">
        <label class="form-label">Diskon Persen 3 (Distributor)</label>
        <input type="text"
               class="form-control"
               placeholder="Diskon persen"
               v-model="promo.disc_persen[2]"
               autocomplete="off">
      </div>
      <div class="col-6 form-group">
        <label class="form-label">Diskon Persen 4 (Distributor)</label>
        <input type="text"
               class="form-control"
               placeholder="Diskon persen"
               v-model="promo.disc_persen[3]"
               autocomplete="off">
      </div>
    </div>

    <div class="row">
      <div class="col-6 form-group">
        <label class="form-label">Diskon Persen 1 (Principal)</label>
        <input type="text"
               class="form-control"
               placeholder="Diskon persen"
               v-model="promo.disc_persen[4]"
               autocomplete="off">
      </div>
      <div class="col-6 form-group">
        <label class="form-label">Diskon Persen 2 (Principal)</label>
        <input type="text"
               class="form-control"
               placeholder="Diskon persen"
               v-model="promo.disc_persen[5]"
               autocomplete="off">
      </div>
    </div>

    <div class="row">
      <div class="col-6 form-group">
        <label class="form-label">Tanggal Berlaku</label>
        <input type="date" class="form-control" v-model="promo.tanggal_awal">
      </div>
      <div class="col-6 form-group">
        <label class="form-label">Tanggal Berakhir</label>
        <input type="date" class="form-control" v-model="promo.tanggal_akhir">
      </div>
    </div>
    <div class="row">
      <div class="col-3 form-group">
        <label class="form-label">Status Klaim</label>
        <label class="form-check form-check-inline" v-for="(d, i) in ['Belum','Sudah']" :key="i">
          <input
              class="form-check-input"
              type="radio" name="status_klaim"
              :value="i" v-model="promo.status_klaim">
          <span class="form-check-label" v-html="ucwords(d.split('_').join(' '))"/>
        </label>
      </div>
      <div class="col-3 form-group">
        <label class="form-label">Status Promo</label>
        <label class="form-check form-check-inline" v-for="(d, i) in ['active','non_active']" :key="i">
          <input
              class="form-check-input"
              type="radio" name="status"
              :value="d" v-model="promo.status">
          <span class="form-check-label" v-html="ucwords(d.split('_').join(' '))"/>
        </label>
      </div>
      <div class="col-6 form-group">
        <label class="form-label">Berlaku untuk salesman</label>
        <selectize
            v-model="promo.salesman"
            data-placeholder="Pilih jenis salesman" @input="addToko($event)">
          <option
              :value="d"
              v-for="(d, i) in option_salesman"
              :key="i">
            {{ d }}
          </option>
        </selectize>
      </div>
    </div>

    <div class="row" style="margin-bottom: 20px">
      <div class="col-6">
        <label class="form-label">Toko</label>
        <selectize
            data-placeholder="Pilih Toko" @input="addToko($event)">
          <option :value="''">Pilih Toko</option>
          <option
              :value="d.id"
              v-for="(d, i) in list_toko"
              :key="i">
            {{d.no_acc}} - {{d.nama_toko}} - {{d.nama_tim}}
          </option>
        </selectize>
      </div>
      <div class="col-6">
        <label class="form-label">Kunci Principal</label>
        <selectize data-placeholder="Pilih Principal" v-model="promo.id_principal">
          <option :value="''">Pilih Principal</option>
          <option
              :value="d.id"
              v-for="(d, i) in principal"
              :key="i">
            {{d.nama_principal}}
          </option>
        </selectize>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <table class="table table-responsive">
          <thead>
          <tr>
            <th style="max-width: 5%">#</th>
            <th style="max-width: 20%">No Akun</th>
            <th style="max-width: 20%">Nama toko</th>
            <th style="max-width: 20%">Tim</th>
            <th style="min-width: 10%">Aksi</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="promo.toko.length == 0">
            <td colspan="5" class="text-center">
              Tidak ada toko terdaftar di promo
            </td>
          </tr>
          <tr v-for="(toko, i) in promo.toko" :key="i">
            <td>{{ i+1 }}</td>
            <td>{{ toko.no_acc }}</td>
            <td>{{ toko.nama_toko }}</td>
            <td>{{ toko.nama_tim }}</td>
            <td>
              <button
                  class="btn btn-danger btn-sm btn-icon"
                  @click="delPromoToko(i)"
                  v-html="ic('minus')">
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="row">
      <div class="col-4 form-group">
        <label class="form-label">Barang</label>
        <selectize
            data-placeholder="Pilih Barang"
            v-model="barang.id_barang"
        >
          <option :value="''">Pilih Barang</option>
          <option :value="d.id" v-for="(d, i) in list_barang" :key="i"> {{d.kode_barang}} - {{d.nama_barang}} </option>
        </selectize>
      </div>
      <div class="col-3 form-group">
        <label class="form-label">Volume</label>
        <input type="number" v-model="barang.volume" class="form-control">
      </div>
      <div class="col-3 form-group">
        <label class="form-label">Bonus Pcs</label>
        <input type="number" v-model="barang.bonus_pcs" class="form-control">
      </div>
      <div class="col-2 form-group">
        <label class="form-label" style="color: white">.</label>
        <button class="btn btn-primary" @click="addBarang()">Tambah</button>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <table class="table table-responsive">
          <thead>
          <tr>
            <th>#</th>
            <th>Kode Barang</th>
            <th>Nama Barang</th>
            <th>Volume</th>
            <th>Bonus</th>
            <th>Aksi</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="promo.barang.length == 0">
            <td colspan="6" class="text-center">
              Tidak ada barang terdaftar di promo
            </td>
          </tr>
          <tr v-for="(barang, i) in promo.barang" :key="i">
            <td>{{ i+1 }}</td>
            <td>{{ barang.kode_barang }}</td>
            <td>{{ barang.nama_barang }}</td>
            <td>{{ barang.volume }}</td>
            <td>{{ barang.bonus_pcs }}</td>
            <td>
              <button
                  class="btn btn-danger btn-sm btn-icon"
                  @click="delBarang(i)"
                  v-html="ic('minus')">
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <label class="form-label">Keterangan</label>
        <textarea class="form-control" v-model="promo.keterangan" cols="30" rows="5"></textarea>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapActions, mapState, mapMutations} from 'vuex'
  import helper from "@/assets/js/helper.js";
  export default {
    name: "AddPromo",
    mixins: [helper],
    data() {
      return {
        list_barang_extra: [],
        list_barang: [],
        perusahaan: [],
        principal: [],
        option_salesman: ['all', 'to', 'canvass'],
        barang: {
          id_barang: '',
          volume: 0,
          bonus_pcs: 0
        }
      }
    },
    computed: {
      ...mapState(['loading']),
      ...mapState('promo', {
        promo: state => state.promo,
        re_render: state => state.re_render
      }),
      ...mapState('depo', {
        list_depo: state => state.list_depo
      }),
      ...mapState('toko', {
        list_toko: state => state.list_toko
      })
    },
    methods: {
      ...mapActions('perusahaan', ['getListPerusahaan']),
      ...mapActions('barang', ['getListBarang']),
      ...mapActions('depo', ['getListDepo']),
      ...mapActions('toko', ['getListToko']),
      ...mapActions('promo', ['submitPromo', 'editPromo']),
      ...mapActions('principal', ['getListPrincipal']),
      ...mapMutations('promo', ['CLEAR_FORM']),
      addToko(val) {
        let { id, no_acc, nama_toko, nama_tim } = this.list_toko.find(x => x.id == val)
        let newItem = {
          id: id,
          no_acc: no_acc,
          nama_toko: nama_toko,
          nama_tim: nama_tim
        }
        this.promo.toko.push(newItem)
      },
      delPromoToko(i) {
        this.promo.toko.splice(i, 1)
      },
      addBarang() {
        let { id_barang, volume, bonus_pcs } = this.barang
        let { id, kode_barang, nama_barang } = this.list_barang.find(x => x.id == id_barang)
        let newItem = {
          id: id,
          kode_barang: kode_barang,
          nama_barang: nama_barang,
          volume: volume,
          bonus_pcs: bonus_pcs
        }
        this.promo.barang.push(newItem)
      },
      delBarang(i) {
        this.promo.barang.splice(i, 1)
      },
      _getDepoBarang(id) {
        this.getListDepo({id_perusahaan: id}).then( () => {
          this.$store.state.promo.re_render = !this.$store.state.promo.re_render
        })

        this.getListBarang({extra: 0, id_perusahaan: id}).then((data) => {
          this.list_barang = data
        })

        this.getListBarang({extra: 1, id_perusahaan: id}).then((data) => {
          this.list_barang_extra = data
        })

        this.getListPrincipal({id_perusahaan: id}).then((data) => {
          this.principal = data
        })
      },
      _getToko(id) {
        this.getListToko({id_depo: id})
      }
    },
    created() {
      this.CLEAR_FORM()
      this.getListPerusahaan({}).then( res => {
        this.perusahaan = res.data
      })
    },
    watch: {
      "promo.id": {
        handler: function (val, oldVal) {
          if(val) {
            this._getDepoBarang(this.promo.id_perusahaan)
            this._getToko(this.promo.depo)
          }
        },
        deep: true
      }
    }
  }
</script>
<style>
  .row{
    margin-top: 10px;
  }
</style>
