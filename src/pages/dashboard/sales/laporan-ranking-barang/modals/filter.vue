<template>
  <div v-if="data_filter.form">
    <div class="modal fade"
      tabindex="-1"
      style="display: block"
      role="dialog"
      v-if="data_filter.form"
      :class="data_filter.form ? 'show':''"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Filter</h5>
            <button type="button" class="close" @click="data_filter.form = false" v-html="ic('close')"/>
          </div>
          <form>
            <div class="modal-body default">

               <!--perusahaan-->
              <div class="row">
                <div class="col-12 form-group">
                  <label class="form-label" for="perusahaan">Perusahaan</label>
                  <selectize
                      data-placeholder="Pilih Perusahaan"
                      id="perusahaan"
                      v-model="data_filter.id_perusahaan"
                      :disabled="loading"
                      :settings="selectizeConfig"
                      required
                      @input="getDepo()"
                  >
                    <option :value="row.id" v-for="(row, i) in perusahaan" :key="i">
                      {{ row.nama_perusahaan }}
                    </option>
                  </selectize>
                </div>
              </div>

              <!--depo-->
              <div class="row">
                <div class="col-12 form-group">
                  <label class="form-label">Depo</label>
                  <selectize 
                  v-model="data_filter.depo" 
                  data-placeholder="Pilih Depo" 
                  :settings="selectizeConfig" 
                  required 
                  :disabled="loading"
                  @input="getSalesman()"
                  >
                    <option :value="row.id" v-for="(row, i) in depos" :key="i">
                      {{row.nama_depo}}
                    </option>
                  </selectize>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-12">
                  <label for="salesman" class="form-label">Nama Salesman</label>
                  <selectize
                      id="salesman"
                      v-model="data_filter.id_salesman"
                      data-placeholder="Pilih Salesman" required :disabled="loading">
                    <option :value="d.id" v-for="(d, i) in salesman" :key="i"> {{d.nama_salesman}} ({{d.tim}}) </option>
                  </selectize>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-12">
                  <label for="brand" class="form-label">Brand</label>
                  <selectize
                      id="brand"
                      v-model="data_filter.id_brand"
                      data-placeholder="Pilih Brand" 
                      required
                      :settings="selectizeConfig" 
                      :disabled="loading"
                      >
                    <option :value="d.id" v-for="(d, i) in brand" :key="i"> {{d.nama_brand}} </option>
                  </selectize>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-12">
                  <label class="form-label">Section</label>
                  <label class="form-check form-check-inline" v-for="(d, i) in ['on','off']" :key="i">
                    <input class="form-check-input" type="radio" :value="d" v-model="data_filter.section">
                    <span class="form-check-label" v-html="d"/>
                  </label>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-6">
                  <label class="form-label">Mulai Tanggal</label>
                  <input type="date" class="form-control" required v-model="data_filter.start_date" :max="data_filter.end_date">
                </div>

                <div class="form-group col-md-6">
                  <label class="form-label">Sampai Tanggal</label>
                  <input type="date" class="form-control" required v-model="data_filter.end_date" :max="dateTime('ymd')">
                </div>
              </div>

            </div>

            <div class="modal-footer pt-2">
              <button
                  @click="data_filter.form = false"
                  type="button"
                  class="btn btn-white"
                  v-html="'Tutup'" />
              <button
                  @click="getDataLaporan(); data_filter.form=false"
                  :disabled="loading"
                  type="button"
                  class="btn btn-primary"
                  v-html="'Oke'"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import helper from "@/assets/js/helper";
import {mapActions, mapState} from "vuex";
export default {
  name: "FormFilter",
  mixins: [helper],
  data(){
    return{
      perusahaan: [],
      brand : [],
      salesman :[],
      depos : [],
      data_id_barang : [],
      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },
    }
  },
  computed: {
     ...mapState(['loading']),
     ...mapState('ranking_barang', {
      data_filter : state => state.data_filter,
      data_item   : state => state.data_item,
      data_depo   : state => state.data_depo,
      data_laporan: state => state.data_laporan,
    }), 
  }, 
  methods: {
    ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
    ...mapActions('depo', ['getListDepo', 'getListDepoById']),
    ...mapActions('salesman', ['getListSalesman']),
    ...mapActions('brand', ['getListBrand']),
    ...mapActions('barang', ['getListBarangByBrand']),
    getListPerusahaan() {
      this.getListPerusahaanByAccess().then( res => {
        this.perusahaan = res
      })
    },
    getDepo(){
      this.getListDepo({
        id_perusahaan : this.data_filter.id_perusahaan
      }).then( res => {
        this.depos = res
      })
    },
    getSalesman(nama_depo){
      this.getListSalesman({depo: this.data_filter.depo}).then( res => {
        this.salesman = res
      })
    },
    getBrand(){
      this.getListBrand().then( res => {
        this.brand = res
      })
    },
    getLaporan() {
      const url = '/ranking_barang';
      this.axios.get(url, {
        params: this.data_filter
      }).then((response) => {
        this.data_item.data = [];
        this.data_id_barang = [];
        var order = [];
        let data_res   = response.data;
        var data_total = {};
        var data_temp  = {};
        var data_qty   = {};

        var brand_section   = '';
        for (var i = 0; i < data_res.length; i++) {
            var data = data_res[i];
            var id_sum = String(data.id_depo+'-'+data.id_barang);
            data_temp[id_sum] = data.total;

            var checker_qty   = parseFloat(data_qty[String(data.id_barang)]);
            var checker_total = parseFloat(data_total[String(data.id_barang)]);
            checker_qty       = checker_qty || 0
            checker_total     = checker_total || 0

            data_qty[String(data.id_barang)]   = checker_qty+parseFloat(data.total_qty);
            data_total[String(data.id_barang)] = checker_total+parseFloat(data.total);

            order.push(data.id_barang);
            if(brand_section!=data.nama_brand && this.data_filter.section=='on'){
              brand_section = data.nama_brand;
              this.data_item.data.push({
                brand_section : brand_section
              });
            }
            this.check({
              id          : data.id_barang,
              nama_barang : data.nama_barang,
              kode_barang : data.kode_barang,
              isi         : data.isi
            });
        }
        this.data_laporan.qty     = data_qty;
        this.data_laporan.data    = data_temp;
        this.data_laporan.total   = data_total;
        return this.data_filter.is_filter=false;
      })
    },
    check(data){
      let io = this.data_id_barang.indexOf(data.id);
      if(io > -1){
      }
      else{
        this.data_id_barang.push(data.id);
        this.data_item.data.push(data);
      }
    },
    getDataLaporan(){
      this.data_filter.is_filter = true;
      this.getListDepoById({
        id_depo: this.data_filter.depo
      }).then(res=>{
        this.data_depo.data = res
        this.getLaporan();
      });
    }
  },
  created(){
    this.getListPerusahaan();
    this.getBrand();
  },
}
</script>

<style scoped>
</style>