import $axios from "@/api";
import helper from "@/assets/js/helper.js";

const state = () => ({
    data_filter : {
        form : false,
        modal : false,
        request : false,

        tipe_group : [],

        id_perusahaan : [],
        id_mitra      : '',
        id_depo       : [],
        id_principal  : [],
        id_brand      : [],
        id_barang     : [],
        start_date    : helper.methods.dateTime('ymd'),
        end_date      : helper.methods.dateTime('ymd'),
    },
    data_laporan : {
        data        : [],
        tipe_group  : [],
    },
})

const mutations = {
}

const actions = {
    getLaporan( {state, commit }, payload) {
        state.data_filter.request = true;
        return new Promise( (resolve, reject) => {
            $axios.get('gross_profit', {
                params: state.data_filter
            }).then((response) => {
                state.data_laporan.tipe_group = [...state.data_filter.tipe_group]
                state.data_laporan.data       = response.data
            })
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
