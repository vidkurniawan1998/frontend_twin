import $axios from "@/api";
import helper from "@/assets/js/helper.js";

const state = () => ({
    data_filter : {
        form : false,
        modal : false,
        request : false,

        start_date : helper.methods.dateTime('ymd'),
        end_date : helper.methods.dateTime('ymd'),

        id_perusahaan : [],
        id_depo : [],
        id_salesman : [],
        id_principal : [],
    },
    data_laporan : {
        data  : [],
        total : [],
    },
})

const mutations = {
}

const actions = {
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
    getLaporan( {state, commit }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`service_level`, {
                params: state.data_filter
            }).then((response) => {
                state.data_laporan.data  = response.data.data
                state.data_laporan.total = response.data.total 
            })
        })
    },
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
