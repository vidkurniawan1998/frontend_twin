<template>
  <div class="antialiased">

    <Sidebar/>


    <div class="page">

      <Header hint="Cari" :enabled="false"/>

      <div class="content">
        <div class="container">
          <!-- Page title -->
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Quick Search
                </h2>
              </div>

              <div class="col-auto">
                <div class="row">
                  <div class="col-auto px-0">

                  </div>

                  <div class="col-auto">
                    <button class="btn btn-outline-primary ml-3" @click="_createExcel"  :disabled="loading" 
                    v-html="loading ? spin() : ic('download')+' Export Excel'"> </button>
                    <button class="btn btn-white  ml-3" v-html="ic('filter')+' Filter'"  @click="triggerFilter" > </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div class="box">
            <div class="card">
              <br>
              <div class="row" style="padding-left: 30px;">
                <div class="col-2">
                  <selectize  v-model="data_filter.tables" @input="_getColumn($event)" data-placeholder="Tables" required :disabled="loading">
                      <option :value="d" v-for="(d, i) in tables" :key="i"> {{ d }}</option>
                  </selectize>
                </div>
                <div class="col-2">
                  <selectize  v-model="data_filter.column" data-placeholder="Columns" required :disabled="loading">
                      <option :value="d" v-for="(d, i) in columns" :key="i"> {{ d }}</option>
                  </selectize>
                </div>
                <div class="col-2">
                  <selectize  v-model="data_filter.tipe" data-placeholder="Tipe" required :disabled="loading">
                      <option :value="d" v-for="(d, i) in tipe" :key="i"> {{ d }}</option>
                  </selectize>
                </div>
                <div class="col-4">
                  <input type="text" class="form-control" v-model="data_filter.value" placeholder="value">
                </div>
                <div class="col-2">
                  <div class="row">
                    <button class="col-6 btn btn-sm btn-outline-info" style="height: 35px; width: 70px; margin-right: 10px;" @click="_addValue('AND')" v-html="'AND'"></button>
                    <button class="col-6 btn btn-sm btn-outline-success" style="width: 70px;" @click="_addValue('OR')" v-html="'OR'"></button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-2" style="margin-top: 10px;">
                    <input type="text" v-model="data_filter.tables" v-if="data_filter.tables!=''" disabled class="form-control">
                  </div>
                  <div class="col-2">
                    <input style="margin-top: 10px; margin-left: 10px;" v-for="(row, i) in data_filter.columns" type="text" :value="row" disabled class="form-control">
                  </div>
                  <div class="col-2">
                    <input style="margin-top: 10px; margin-left: 10px;" v-for="(row, i) in data_filter.tipes" type="text" :value="row" disabled class="form-control">
                  </div>
                  <div class="col-4">
                    <input style="margin-top: 10px; margin-left: 10px;" v-for="(row, i) in data_filter.values" type="text" :value="row" disabled class="form-control">
                  </div>
                  <div class="col-1">
                    <input style="margin-top: 10px; margin-left: 10px;" v-for="(row, i) in data_filter.cogs" type="text" :value="row" disabled class="form-control">
                  </div>
                  <div class="col-1">
                    <button  style=" margin-top: 10px; margin-left: 0px; width: 70px; height: 35px;" v-for="(row, i) in data_filter.values"  class="btn btn-sm btn-outline-danger" @click="_delValue(i)" v-html="'Del'"></button>
                  </div>
                  <div class="col-12" style="text-align: right;">
                    <button class="btn btn-outline-primary"  style="margin-top: 10px; width: 100px;" @click="_getData()" v-html="ic('search')+' Cari'"></button>
                  </div>
                </div>
              </div>

              <div class="table-responsive" style="margin-left: 20px; margin-right: 20px; margin-top: 10px; margin-bottom: 20px;">
                <table class="table table-vcenter table-hover card-table table-striped table-control  table-no-break">
                  <thead>
                    <th  v-for="(value, name) in data_laporan.data[0]">{{name}}</th>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in data_laporan.data">
                       <td v-for="(sub, key) in row">{{sub}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>

  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";
import {mapActions, mapState} from "vuex";

export default {
  name: "QuickSearch",

  data() {
    return {
      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },
      data_laporan : {
        data : [],
      },
      data_filter : {
        tables  : [],
        columns : [],
        values  : [],
        tipes   : [],
        cogs    : [],
        column  : 'id',
        tipe    : '=',
        value   : '',
      },
      tables : [],
      columns : [],
      tipe : ['=','!=','between','not between']
    };
  },

  mixins: [helper],

  computed: {
    ...mapState(['loading']),
  },
  methods: {
      ...mapActions('monitoring_stock_tmp', ['triggerFilter','getLaporan']),
      _getTable(){
        this.axios.get("monitoring/quick_search/table").then(res => {
          this.tables = res.data
        }).catch( err => {
          this.onError(err)
        });
      },
      _getColumn(tables){
        this.axios.get("monitoring/quick_search/column",{params: {
          'tables' : this.data_filter.tables
        }}).then(res => {
          this.columns = res.data
        }).catch( err => {
          this.onError(err)
        });
      },
      _addValue(cog){
        this.data_filter.values.push(this.data_filter.value)
        this.data_filter.columns.push(this.data_filter.column)
        this.data_filter.tipes.push(this.data_filter.tipe)
        this.data_filter.cogs.push(cog)
        this._getData()
      },
      _delValue(i){
        this.data_filter.values.splice(i, 1)
        this.data_filter.columns.splice(i, 1)
        this.data_filter.tipes.splice(i, 1)
        this.data_filter.cogs.splice(i, 1)
      },
      _getData(){
        this.axios.get("monitoring/quick_search/row",{params: this.data_filter}).then(res => {
          this.data_laporan.data = res.data
        }).catch( err => {
          this.onError(err)
        });
      },
      _createExcel(){
        this.createExcel({data: this.data_laporan.data, filename: 'monitoring-stock-tmp'})
      },
      _copied(data) {
        navigator.clipboard.writeText(data);
        this.toast(data+' tersimpan di clipboard')
      },
  },
  created(){
  },

  mounted(){
    this.auth = JSON.parse(localStorage.user)
    this._getTable()
  },

};
</script>
