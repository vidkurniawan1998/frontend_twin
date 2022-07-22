<template>
  <div class="antialiased">
    <Sidebar/>

    <div class="page">
      <Header :disabledSearch="true"/>
      <div class="content">
        <div class="container">
          <div class="page-header">
            <!-- Page title -->
            <div class="page-header">
              <div class="row d-flex justify-content-between">
                <div class="col-auto">
                  <h2 class="page-title">
                    Export Data Kino & Kinofood
                  </h2>
                </div>

                <div class="col-auto">
                  <div class="row">
                    <div class="col-auto px-0">
                    </div>

                    <div class="col-auto">
                      <button class="btn btn-white" v-html="ic('filter') + ' Filter'" @click="_filter"></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FormFilter
        :config.sync="filter.config"
        :initData="filter.data"
        :dismiss.sync="filter.dismiss"
        :isSubmit.sync="filter.isSubmit"
        @submit="filter.action" />
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import FormFilter from "./modals/filter";
export default {
  name: "export-kino.vue",
  mixins: [helper],
  components: { FormFilter },
  data() {
    return {
      auth: {},

      filter: {
        config: { view: false, title: null },
        data: null,
        isSubmit: false,
        action: () => {},
      },

      loading: true,
      isFilter: false,
      data: [],
      file: '',

      dataFilter: {
        id_principal: '',
        id_depo: [],
        start_date: this.dateTime('ymd'),
        end_date: this.dateTime('ymd'),
      },

      isExcelRequest: false,
    };
  },
  methods: {
    _get() {
      this.loading = true;

      this.axios
          .get("export/kino", { params: this.dataFilter })
          .then((res) => {
            this.loading = false;
              for (const key in res.data) {
                let blob = new Blob([res.data[key]], {type: 'application/txt'})
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.setAttribute('download', key + ' - ' + this.dateTime('date') + '.txt')
                link.click()
              }
          })
          .catch((err) => {
            this.loading = false;
            this.onError(err);
          });
    },
    _filter() {
      this.filter.config = { view: true, title: "Filter" };
      this.filter.action = (formData) => {
        this.isFilter = true;

        for (const key in formData) {
          this.dataFilter[key] = formData[key];
        }

        this._get();
      };
    },
  }
}
</script>

<style scoped>

</style>