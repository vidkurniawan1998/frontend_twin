import $axios from "@/api";
import helper from "@/assets/js/helper.js";

const state = () => ({
    data_laporan : {
        data:[],
        meta:[],
    },
    data_filter:{
        id_perusahaan: [],
        id_principal: [],
        id_salesman: 'all',
        id_active: 0,
        start_date: helper.methods.dateTime('ymd'),
        end_date: helper.methods.dateTime('ymd'),
        depo:[],
        page: 1,
        per_page: 10,
        form: false,
    },
    data_detail:{
        data : [],
        items : [],
        form: false,
        is_filter : false,
    },
})

const mutations = {
 
}
 
const actions = {
    getLaporan({ state },payload) {
      const url = '/omset_toko';
      $axios.get(url, {
        params: state.data_filter
      }).then((response) => {
        state.data_laporan.data = response.data;
      })
    },
    getDetail({ state }) {
      const url = '/omset_toko/detail';
      $axios.get(url, {
        params: state.data_filter
      }).then((response) => {
        state.data_detail.items = response.data;
      })
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}