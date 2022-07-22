<template>
  <div class="antialiased">
    <Sidebar/>
    <div class="page">
      <Header hint="Ketik no. invoice" @change="_search"/>
      <div class="content">
        <div class="container">
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <!-- title -->
              <div class="col-auto">
                <h2 class="page-title">
                  Faktur Pembelian
                </h2>
              </div>
              <!-- action button -->
              <div class="col-auto">
                <div class="row">
                  <div class="col-auto">
                    <!--Perpage-->
                    <div class="input-icon float-left">
                      <span class="input-icon-addon"><i class="fe fe-align-left"></i></span>
                      <select class="form-control" v-model="per_page" @change="getFakturs()" :disabled="loading">
                        <option :value="num" v-for="(num, i) in [10,50,100,999]" :key="i" v-html="num === 999 ? 'Semua' : num"/>
                      </select>
                    </div>

                   <div class="col-auto btn-group">
                      <button class="btn btn-outline-primary ml-3" @click="_createExcel"  :disabled="loading || isExcelRequest" 
                      v-html="isExcelRequest || loading ? spin() : ic('download')+' Export Excel'"> </button>
                      <button class="btn btn-white ml-3" v-html="ic('filter')" @click="SET_FILTER(true)" :disabled="loading || isExcelRequest"></button>
                      <button class="btn btn-primary ml-3" @click="CLEAR_FORM(); $router.push({name: 'Tambah Data Pembelian'})" :disabled="loading || isExcelRequest"> Tambah 
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
          <Skeleton
              type="table"
              :length="10"
              class="mt-3 bg-white"
              v-if="loading"
          >
          </Skeleton>
          <Nodata v-if="!loading &&  fakturs.data.length == 0"/>
          <div class="box" v-if="!loading && fakturs.data.length > 0">
            <div class="card">
              <div class="table-responsive">
                <table class="table table-vcenter table-hover card-table table-striped table-control">
                  <thead>
                    <tr class="text-muted">
                      <th class="v-center">No</th>
                      <th class="v-center">Comp</th>
                      <th class="v-center">Principal</th>
                      <th class="v-center">Invoice</th>
                      <th class="v-center">No PB</th>
                      <th class="v-center">Faktur Pajak</th>
                      <th class="v-center">Tgl Invoice</th>
                      <th class="v-center">Tgl Jt</th>
                      <th class="v-center">Total</th>
                      <th class="v-center">Status</th>
                      <th class="v-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in fakturs.data"
                        :class="row.over_due > 0 && row.tanggal_bayar == null ? 'text-danger' : 'text-dark'">
                      <td>{{ getTableNumber(i) }}</td>
                      <td>
                        <span class="badge bg-blue-lt mr-2">{{ row.kode_perusahaan }}</span>
                      </td>
                      <td>{{ row.nama_principal }}</td>
                      <td>{{ row.no_invoice }}</td>
                      <td>
                        <span v-for="(sub, j) in row.penerimaan_barang">{{sub.no_pb}}<br></span>
                      </td>
                      <td>{{ row.faktur_pajak }}</td>
                      <td>{{ row.tanggal_invoice }}</td>
                      <td>
                        {{ row.tanggal_jatuh_tempo }}
                        <br>
                        <span v-if="row.over_due !== ''">({{ row.over_due }} Hari)</span>
                      </td>
                      <td>
                        <div style="float: right;padding-right: 5px">
                          {{ row.grand_total | currency }}
                        </div>
                      </td>
                      <td>
                        <span
                            v-html="row.status"
                            class="badge w-100"
                            :class="row.status == 'input' ? 'bg-orange' : row.status == 'approved' ? 'bg-green' : 'bg-info'"></span>
                      </td>
                      <td class="p-0">
                        <b-dropdown variant="link" size="lg" dropleft no-caret>
                          <template slot="button-content"> <i class="fe fe-more-vertical"></i> </template>
                          <b-dropdown-item
                              @click="$router.push({name: 'Edit Data Pembelian', params: { id: row.id}})"
                          >
                            {{ row.status === 'input' ? 'Edit':'Lihat Detail' }}
                          </b-dropdown-item>
                          <b-dropdown-item v-if="row.status === 'approved'">
                            Tandai Terbayar
                          </b-dropdown-item>
                          <b-dropdown-item @click="_delete(row.id)" v-if="row.status === 'input'">
                            Hapus
                          </b-dropdown-item>
                        </b-dropdown>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <Confirm
              :id.sync="confirm.id"
              :title.sync="confirm.title"
              :subTitle.sync="confirm.subTitle"
              :isSubmit.sync="confirm.isSubmit"
              @submit="confirm.action"
              :btnConfirm.sync="confirm.btnConfirm"
              :textConfirm.sync="confirm.textConfirm"
          />
          <b-pagination
              v-if="typeof fakturs.meta != 'undefined' && !loading && fakturs.data.length"
              align="center"
              class="mt-5"
              :total-rows="fakturs.meta.total"
              v-model="page"
              :per-page="per_page" />
        </div>
      </div>
    </div>
    <FormFilter v-bind:keyword="keyword"/>
  </div>
</template>

<script>
import helper from "@/assets/js/helper";
import {mapActions, mapMutations, mapState} from "vuex";
import FormFilter from "./modals/Filter"
export default {
  name: "FakturPembelian",
  components: { FormFilter },
  mixins: [helper],
  data() {
    return {
      isExcelRequest : false,
      keyword: '',
      confirm: {
        id: null,
        title: null,
        isSubmit: false,
        action: () => {},
        subTitle: 'Penghapusan ini bersifat permanen',
        btnConfirm: 'btn-danger', textConfirm: 'Hapus Sekarang'
      },
    }
  },
  computed: {
    ...mapState(['loading']),
    ...mapState('faktur_pembelian', {
      fakturs: state => state.fakturs,
      per_page: state => state.per_page,
      dataFilter : state => state.dataFilter
    }),
    page: {
      get() {
        return this.$store.state.faktur_pembelian.page
      },
      set(val) {
        this.$store.commit('faktur_pembelian/SET_PAGE', val)
      }
    },
    per_page: {
      get() {
        return this.$store.state.faktur_pembelian.per_page
      },
      set(val) {
        this.$store.commit('faktur_pembelian/SET_PER_PAGE', val)
      }
    }
  },
  methods: {
    ...mapActions('faktur_pembelian', ['getFakturs']),
    ...mapMutations('faktur_pembelian', ['SET_FILTER','CLEAR_FORM']),
    getTableNumber(i) {
      if (this.per_page === 'all') {
        return i+1
      }

      return (this.fakturs.meta.current_page - 1) * this.per_page + i + 1
    },
    _delete(id){
      this.confirm.id = id
      this.confirm.title = 'Yakin ingin menghapus data penjualan ini?',
      this.confirm.subTitle = 'Penghapusan ini bersifat permanen'
      this.confirm.action = () => {
        let url = 'faktur_pembelian/'+id;
        this.axios.delete(url).then(res => {
          this.toast('Berhasil dihapus');
          this.getFakturs();
          this.confirm.id = null
        }).catch( err => {
          this.onError(err);
          this.confirm.isSubmit = false
        });

      }
    },
    _search(keyword) {
      this.keyword = keyword
      this.getFakturs(keyword)
    },

    _createExcel(){
      this.isExcelRequest=true;
      try {
       var dataExcel = []
       for (let i = 0; i < this.fakturs.data.length; i++) {
          let data = this.fakturs.data[i]
          let res = {
            'Perusahaan'            : data.kode_perusahaan,
            'Principal'             : data.nama_principal,
            'No Invoice'            : data.no_invoice,
            'Faktur Pajak'          : data.faktur_pajak,
            'Tanggal Invoice'       : data.tanggal_invoice,
            'Tanggal Jatuh Tempo'   : data.tanggal_jatuh_tempo,
            'Tanggal Bayar'         : data.tanggal_bayar,
            'Over Due'              : data.over_due,
            'Sub Total'             : data.subtotal,
            'Diskon'                : data.discount,
            'DPP'                   : data.dpp,
            'PPN'                   : data.ppn_value,
            'Grand Total'           : data.grand_total
          }
          dataExcel.push(res)
        } 
        this.isExcelRequest = false;
        this.createExcel({data: dataExcel, filename: 'Faktur Pembelian - '+this.dataFilter.due_date})   
      }
      catch(err) {
        this.isExcelRequest = false;
        this.onError(err)
      }
    }
  },
  created() {
    this.getFakturs();
  },
  watch: {
    page() {
      this.getFakturs(this.keyword)
    },
    per_page() {
      this.getFakturs(this.keyword)
    }
  }
}
</script>

<style scoped>

</style>
