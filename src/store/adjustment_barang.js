import $axios from "@/api";
import helper from "@/assets/js/helper.js";

const state = () => ({
    data_laporan : {
        data:[],
        file:'',
    },
    data_filter:{
        keyword:'',
        id_perusahaan:'',
        id_depo:'',
        id_gudang:'',
        status:'all',
        start_date : helper.methods.dateTime('ymd'),
        end_date : helper.methods.dateTime('ymd'),
        page: 1,
        per_page: 10,
        form: false,
    }
})

const mutations = {
 
}
 
const actions = {
    getLaporan({ state },payload) {
      const url = '/adjustment/laporan_adjustment';
      $axios.get(url, {
        params: state.data_filter
      }).then((response) => {
        state.data_laporan.data = response.data.data;
        state.data_laporan.file = response.data.file;
      })
    }
   
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
