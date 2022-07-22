<template>
  <div class="antialiased">
    <Sidebar/>

    <div class="page">
      <Header hint="Cari" :enabled="false"/>

      <div class="content">
        <div class="container">
          <!-- header -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Trend SKU
                </h2>
              </div>
            </div>
          </div>

          <!-- box -->
          <div class="box">
            <div class="row row-cards">
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Rank SKU By Brand</h3>
                  </div>
                  <div class="card-table table-responsive">
                      <table class="table card-table table-vcenter">
                        <thead>
                          <tr class="text-muted">
                            <th></th>
                            <th></th>
                            <th>NAMA BARANG</th>
                            <th>CTN</th>
                          </tr>
                        </thead>
                        <tbody>
                          <template v-for="(brand, i) in sku">

                          </template>
                        </tbody>
                      </table>
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
import $axios from "@/api";
export default {
  name: "sku.vue",
  data() {
    return {
      sku: []
    }
  },
  created() {
    $axios.get('/report_management/trend_sku', {
      params: {
        start_date: '2021-01-01',
        end_date: '2021-01-31',
      }
    }).then( res => {
      this.sku = res.data
    })
  }
}
</script>

<style scoped>

</style>
