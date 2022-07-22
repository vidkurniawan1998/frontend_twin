import $axios from "@/api";
import helper from "@/assets/js/helper.js";

const state = () => ({
    data_laporan : {
        data:[],
    },
    data_grand_total : {
    },
    data_filter:{
        keyword:'',
        perusahaan:'',
        depo:'',
        tim:'',
        id_perusahaan:'',
        id_depo:'',
        id_tim:'',
        nama_perusahaan:'',
        nama_depo:'',
        nama_tim:'',
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
      const url = '/retur_segmen';
      $axios.get(url, {
        params: state.data_filter
      }).then((response) => {
        state.data_laporan.data = response.data.data;
        state.data_grand_total = response.data.grand_total;
      })
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
