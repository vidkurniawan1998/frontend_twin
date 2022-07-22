import $axios from "@/api";
import helper from "@/assets/js/helper.js";

const state = () => ({
    data_laporan : {
        data  : [],
    },
    data_filter:{
        id_perusahaan: [],
        id_principal: [],
        id_salesman: [],
        id_brand : [],
        depo:[],
        keyword : '',
        //start_date: helper.methods.dateTime('ymd'),
        //end_date: helper.methods.dateTime('ymd'),
        form: false,
        modal : false,
    },
})

const mutations = {
 
}
 
const actions = {
    getLaporan({state}){
      const url = 'ranking_piutang';
      $axios.get(url, {
        params: state.data_filter
      }).then((response) => {
        state.data_laporan.data = response.data;
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