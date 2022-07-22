import $axios from "@/api";
import helper from "@/assets/js/helper.js";

const state = () => ({
    data_laporan : {
        data : [],
        meta : [],
    },
    data_detail : {
        data : [],
        form : false,
        request : false,
        id_faktur_pembelian : null,
    },
    data_filter : {
        keyword : '',
        data : [],
        form : false,
        modal : false,
        request : false,
        id_perusahaan : [],
        id_principal : [],
        page: 1,
        per_page: 10,
        status : '',
        due_date : helper.methods.dateTime('ymd'),
    },
    detail_item : {
        data : [],
    },
})

const mutations = {
  
}
 
const actions = {
    get_laporan({state}){
      const url = '/pelunasan_pembelian';
      $axios.get(url, {
        params: state.data_filter
      }).then((response) => {
        state.data_laporan.data = response.data.data;
        state.data_laporan.meta = response.data.meta;
      })
    },
    get_detail_pelunasan({state},id){
      const url = '/pelunasan_pembelian/'+id;
      $axios.get(url).then((response) => {
          state.detail_item.data = response.data;
      })
    },
    triggerFilter({state, commit, payload}){
        let is_modal = state.data_filter.modal ? false : true;
        if(is_modal){
            state.data_filter.form = is_modal;
            setTimeout(() => {
              state.data_filter.modal = is_modal;
            }, 100);
        }
        else{ 
              state.data_filter.modal = is_modal;
            setTimeout(() => {
                state.data_filter.form = is_modal;
            }, 100);
        }
    },
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
