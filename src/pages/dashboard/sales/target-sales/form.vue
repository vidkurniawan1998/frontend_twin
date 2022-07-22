<template>
  <div class="antialiased">
    <Sidebar/>
    <div class="page">
      <Header/>
      <div class="content">
        <div class="container">
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">Tambah Target Salesman</h2>
              </div>
            </div>
          </div>
          <div class="box">
            <div class="card">
              <div class="card-body">
                <div class="row">

                  <div class="form-group col-3">
                    <label class="form-label" for="perusahaan">Perusahaan</label>
                    <selectize id="perusahaan" v-model="target.id_perusahaan" data-placeholder="Pilih Perusahaan" :disabled="loading" required>
                      <option :value="d.id" v-for="(d, i) in perusahaan" :key="i"> {{d.kode_perusahaan}} - {{d.nama_perusahaan}} </option>
                    </selectize>
                  </div>

                  <div class="form-group col-3">
                    <label class="form-label" for="mulai-tanggal">Mulai Tanggal</label>
                    <input type="date" id="mulai-tanggal" class="form-control" v-model="target.mulai_tanggal">
                  </div>

                  <div class="form-group col-3">
                    <label class="form-label" for="sampai-tanggal">Sampai Tanggal</label>
                    <input type="date" id="sampai-tanggal" class="form-control" v-model="target.sampai_tanggal">
                  </div>

                  <div class="form-group col-2">
                    <label class="form-label" for="hari-kerja">Hari Kerja</label>
                    <input type="number" id="hari-kerja" class="form-control" v-model="target.hari_kerja">
                  </div>

                  <div class="form-group col-1">
                    <label class="form-label" style="color: white">Proses</label>
                    <button
                        class="btn btn-primary"
                        v-html="loading ? spin():'Proses'"
                        @click="_getSalesmanActive"
                        :disabled="loading">
                    </button>
                  </div>
                </div>

                <!-- LIST SALESMAN -->
                <div class="row">
                  <div class="col-12">
                    <div class="table-responsive">
                      <table class="table table-responsive">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Depo</th>
                            <th>Nama Salesman</th>
                            <th>Target</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(slsman, i) in target.salesman">
                            <td>{{ i+1 }}</td>
                            <td>{{ slsman.nama_depo }}</td>
                            <td>{{ slsman.nama_tim }} - {{slsman.nama }}</td>
                            <td>
                              <currency-input
                                  class="form-control"
                                  v-model="target.salesman[i].target"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <button
                        class="btn btn-primary"
                        @click="submit"
                        :disabled="loading"
                        v-if="target.salesman.length > 0">Simpan</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import helper from "@/assets/js/helper";
import {mapActions, mapMutations, mapState} from "vuex";
export default {
  name: "form.vue",
  mixins: [helper],
  data() {
    return {
      perusahaan: [],
    }
  },
  computed: {
    ...mapState(['loading']),
    ...mapState('target_salesman', {
      target: state => state.target
    })
  },
  methods: {
    ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
    ...mapActions('salesman', ['getListSalesmanActive']),
    ...mapActions('target_salesman', ['submitTargetSalesman']),
    ...mapMutations('target_salesman', ['CLEAR_FORM']),
    _getSalesmanActive() {
      this.getListSalesmanActive({id_perusahaan: this.target.id_perusahaan})
      .then( (res) => {
        this.target.salesman = res
      })
    },
    submit() {
      this.submitTargetSalesman().then((res) => {
        this.$router.push({name: 'Target Salesman'})
      })
    }
  },
  created() {
    this.CLEAR_FORM()
    this.getListPerusahaanByAccess({}).then((res) => {
      this.perusahaan = res
    })
  }
}
</script>

<style scoped>

</style>
