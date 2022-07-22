import $axios from "@/api";
import helper from "@/assets/js/helper.js";

const state = () => ({
    data_laporan : { 
        data : [],
        meta : [],
    },
    data_form : {
        data : [],
        id_depo : '',
        id_active : [],
        id_salesman : '',
        data_invoice : [],
    },
    data_filter : {
        keyword : '',
        data : [],
        form : false,
        request : false,
        status : 'belum_dikunjungi',
        id_perusahaan : [],
        id_depo : [],
        id_salesman : null,
        page: 1,
        per_page: 10,
        status : '',
        due_date : '',
    },
})

const mutations = {
  
}
 
const actions = {
    get_laporan({state}){
      const url = '/invoice_note';
      $axios.get(url, {
        params: state.data_filter
      }).then((response) => {
        state.data_laporan.data = response.data.data;
        state.data_laporan.meta = response.data.meta;
      })
    },
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
