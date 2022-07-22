<template>
  <div v-if="data_detail.form">
    <div
      class="modal fade"
      :class="data_detail.modal ? 'show' : ''"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div
        class="modal-dialog modal-xl modal-dialog-centered width-40"
        role="document"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detail Toko</h5>
            <button
              type="button"
              class="close"
              v-on:click="triggerDetail"
              v-html="loading ? spin() : ic('close')"
            />
          </div>

          <div class="modal-body pt-3">
            <div class="row">
              <div class="col-12 padding-buttom-20">
                <table
                  class="table table-vcenter table-hover card-table table-striped"
                >
                  <tbody>
                    <tr>
                      <td>
                        <span class="padding-20">
                          <button class="btn btn-info">
                            Nama Barang :
                            {{ data_laporan_detail.cop.nama_barang }}
                          </button>
                        </span>
                        <span class="padding-20">
                          <button class="btn btn-primary">
                            Salesman (Tim) :
                            {{
                              data_laporan_detail.cop.nama_salesman +
                                " (" +
                                data_laporan_detail.cop.nama_tim +
                                ")"
                            }}
                          </button>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Skeleton
                type="table"
                :length="10"
                class="mt-3 bg-white width-40"
                v-if="data_laporan_detail.loading"
              />
              <Nodata
                v-if="
                  !data_laporan_detail.loading &&
                    data_laporan_detail.data.length == 0
                "
              />
              <div class="col-12">
                <table
                  v-if="
                    !data_laporan_detail.loading &&
                      data_laporan_detail.data.length > 0
                  "
                  class="table table-vcenter table-hover card-table table-striped"
                >
                  <thead class="text-muted">
                    <th>No</th>
                    <th>No Acc</th>
                    <th>Cust No</th>
                    <th>Nama Toko</th>
                    <th>Tipe</th>
                    <th>Alamat</th>
                    <th class="text-center">Qty (Pcs)</th>
                    <th>Total Transksi</th>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in data_laporan_detail.data" :key="i">
                      <td>{{ i + 1 }}</td>
                      <td>{{ row.no_acc }}</td>
                      <td>{{ row.cust_no }}</td>
                      <td>{{ row.nama_toko }}</td>
                      <td>{{ row.tipe }}</td>
                      <td>{{ row.alamat }}</td>
                      <td class="text-center">{{ row.total_qty }}</td>
                      <td>{{ row.total_stt | currency }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-white"
              v-on:click="triggerDetail"
              v-html="'Tutup'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import helper from "@/assets/js/helper.js";

export default {
  name: "Modal",
  mixins: [helper],
  computed: {
    ...mapState(["loading"]),
    ...mapState("monitoring_pro", {
      data_detail: (state) => state.data_detail,
      data_laporan_detail: (state) => state.data_laporan_detail,
    }),
  },
  data() {
    return {
      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"],
      },

      principal: [],
      brand: [],
      barang: [],
    };
  },

  methods: {
    ...mapActions("monitoring_pro", ["triggerDetail"]),
  },
  created() {},
  mounted: function() {},
};
</script>
<style lang="scss">
.width-40 {
  max-width: 800px;
  max-height: 900px;
}
.padding-20 {
  padding-right: 10px;
}
.padding-buttom-20 {
  padding-bottom: 10px;
}
</style>
