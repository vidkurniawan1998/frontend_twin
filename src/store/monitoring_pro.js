import $axios from "@/api";
import helper from "@/assets/js/helper.js";

const state = () => ({
    data_filter : {
        form : false,
        modal : false,
        request : false,

        start_date : helper.methods.dateTime('ymd'),
        end_date : helper.methods.dateTime('ymd'),

        id_barang: [],
        id_principal : [],
    },   
    data_detail : {
        form : false,
        modal : false,
        request : false,
    },
    data_laporan : {
        data  : [],
        jenis_hari : [],
    },
    data_laporan_detail : {
        loading : false,
        data  : [],
        cop   : [],
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
    triggerDetail({state, commit, payload}){
        let is_modal = state.data_detail.modal ? false : true;
        if(is_modal){
            state.data_detail.form = is_modal;
            setTimeout(() => {
              state.data_detail.modal = is_modal;
            }, 100);
        }
        else{ 
            state.data_detail.modal = is_modal;
            setTimeout(() => {
                state.data_detail.form = is_modal;
            }, 100);
        }
    },
    getLaporan( {state, commit }, payload) {
        state.data_filter.request = true
        return new Promise( (resolve, reject) => {
            $axios.get(`monitoring/pro`, {
                params: state.data_filter
            }).then((response) => {
                state.data_laporan.data       = response.data.data
                state.data_laporan.jenis_hari = response.data.jenis_hari
            })
        })
    },
    getLaporanDetail( {state, commit}, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`monitoring/pro/detail`, {
                params: state.data_detail
            }).then((response) => {
                state.data_laporan_detail.data       = response.data.data
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
