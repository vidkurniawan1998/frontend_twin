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
        id_brand : [],
        id_barang: [],
        id_salesman : [],
        id_principal : [],
    },
    data_laporan : {
        data  : [],
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
        state.data_filter.request = true
        return new Promise( (resolve, reject) => {
            $axios.get(`monitoring/ota`, {
                params: state.data_filter
            }).then((response) => {
                state.data_laporan.data = response.data
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
