<template>
  <div class="antialiased">
    <Sidebar />

    <div class="page">
      <Header hint="Cari" :enabled="false" />

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Monitoring PRO<br />
                  <span style="font-size: 12px"
                    >REPEAT ORDER
                    <span v-if="data_laporan.data.length > 0">{{
                      data_laporan.data[0].nama_barang
                    }}</span></span
                  >
                </h2>
              </div>

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0"></div>

                  <div class="col-auto">
                    <button
                      class="btn btn-outline-primary ml-3"
                      @click="_createExcel"
                      :disabled="loading"
                      v-html="
                        loading ? spin() : ic('download') + ' Export Excel'
                      "
                    ></button>
                    <button
                      class="btn btn-white ml-3"
                      v-html="ic('filter') + ' Filter'"
                      @click="triggerFilter"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- {{data_laporan.data}} -->
          <Skeleton
            type="table"
            :length="10"
            class="mt-3 bg-white"
            v-if="loading"
          />
          <div
            class="alert alert-info"
            v-if="!loading && data_laporan.data.length == 0"
          >
            <i class="fe fe-info mr-2"></i> Pilih filter untuk memuat monitoring
            pro
          </div>
          <Nodata v-if="!loading && data_laporan.data.length == 0" />
          <div class="box" v-if="data_laporan.data.length > 0 && !loading">
            <div class="card">
              <div class="table-responsive">
                <table
                  class="
                    table table-vcenter table-hover
                    card-table
                    table-striped table-control table-no-break
                  "
                >
                  <thead class="text-muted">
                    <th>No</th>
                    <th>Supervised</th>
                    <th>Tim</th>
                    <th>Salesman</th>
                    <th>Total Outlet</th>
                    <th
                      v-for="(row, i) in data_laporan.jenis_hari"
                      :key="i"
                      class="centered"
                    >
                      {{ row }}
                    </th>
                    <th>Total</th>
                    <th>% Daya Beli</th>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in data_laporan.data" :key="i">
                      <td>{{ i + 1 }}</td>
                      <td>{{ row.nama_koordinator.toUpperCase() }}</td>
                      <td>{{ row.nama_tim }}</td>
                      <td>{{ row.nama_salesman.toUpperCase() }}</td>
                      <td class="centered">{{ row.total_toko }}</td>
                      <td
                        v-for="(sub, j) in data_laporan.jenis_hari"
                        :key="j"
                        class="centered click-able"
                        @click="_getDetail(row, row['penjualan_' + sub], sub)"
                      >
                        {{ row["penjualan_" + sub] | currency }}
                      </td>
                      <td class="centered">{{ row.total }}</td>
                      <td class="centered">
                        {{
                          Math.round((row.total * 10000) / row.total_toko) / 100
                        }}
                        %
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <FormFilter />
    <Detail />
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import { mapActions, mapState } from "vuex";
import FormFilter from "./modals/filter.vue";
import Detail from "./modals/detail.vue";

export default {
  name: "MonitoringOta",
  components: {
    FormFilter,
    Detail,
  },

  data() {
    return {};
  },

  mixins: [helper],

  computed: {
    ...mapState(["loading"]),
    ...mapState("monitoring_pro", {
      data_filter: (state) => state.data_filter,
      data_detail: (state) => state.data_detail,
      data_laporan: (state) => state.data_laporan,
      data_laporan_detail: (state) => state.data_laporan_detail,
    }),
  },
  methods: {
    ...mapActions("monitoring_pro", [
      "triggerFilter",
      "triggerDetail",
      "getLaporan",
    ]),
    _numColumn(num) {
      let s = "",
        t;
      while (num > 0) {
        t = (num - 1) % 26;
        s = String.fromCharCode(65 + t) + s;
        num = ((num - t) / 26) | 0;
      }
      return s || undefined;
    },
    _createExcel() {
      let data_excel = [];
      let cell = 4;
      for (let i = 0; i < this.data_laporan.data.length; i++) {
        let d = this.data_laporan.data[i];
        let pivot = i + 2;
        let res = {
          supervised: d.nama_koordinator,
          tim: d.nama_tim,
          salesman: d.nama_salesman,
          "total outlet": d.total_toko,
        };
        for (let j = 0; j < this.data_laporan.jenis_hari.length; j++) {
          let sub = this.data_laporan.jenis_hari[j];
          res[" " + sub + " "] = d["penjualan_" + sub] || 0;
        }
        res["total"] = d.total;
        res["daya beli"] = {
          f:
            "IFERROR(" +
            this._numColumn(cell + 1 + this.data_laporan.jenis_hari.length) +
            pivot +
            "/" +
            this._numColumn(cell) +
            pivot +
            ",0)",
          z: "0.00%",
        };
        data_excel.push(res);
        console.log(res);
      }
      this.createExcel({
        data: data_excel,
        filename:
          "monitoring-repeat-order-" +
          this.data_laporan.data[0].nama_barang.toLowerCase(),
      });
    },
    _getLaporanDetail(data) {
      this.data_laporan_detail.loading = true;
      this.triggerDetail();
      this.axios
        .get("monitoring/pro/detail", {
          params: data,
        })
        .then((res) => {
          this.data_laporan_detail.data = res.data;
          this.data_laporan_detail.loading = false;
        })
        .catch((err) => {
          this.onError(err);
        });
    },
    _getDetail(data, banyak, jenis) {
      if (typeof banyak != "undefined") {
        let params = {
          id_salesman: data.id_salesman,
          id_barang: data.id_barang,
          banyak_nota: banyak,
          jenis_hari: jenis,
          start_date: this.data_filter.start_date,
          end_date: this.data_filter.end_date,
        };
        let cop = {
          nama_salesman: data.nama_salesman,
          nama_tim: data.nama_tim,
          nama_barang: data.nama_barang,
        };
        this.data_laporan_detail.cop = cop;
        this._getLaporanDetail(params);
      }
    },
  },
  created() {},

  mounted() {},
};
</script>
<style lang="scss">
.centered {
  text-align: center;
}
</style>
