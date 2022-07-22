
import $axios from "@/api";
import helper from "@/assets/js/helper.js";

const state = () => ({
    data_filter : {
        form        : false,
        modal       : false,
        request     : false,
        id_mitra    : [],
        id_barang   : [],
        start_date  : helper.methods.dateTime('ymd'),
        end_date    : helper.methods.dateTime('ymd'),
    },
    data_laporan : {
        data    : [],
        total   : []
    },
})

const mutations = {
    ASSIGN_DATA(state, data) {
        state.data_laporan = data;
    },
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
            $axios.get(`posisi_stock_mitra`, {
                params: state.data_filter
            }).then((response) => {
                commit('ASSIGN_DATA', response.data)
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
