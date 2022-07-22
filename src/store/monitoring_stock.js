import $axios from "@/api";
import helper from "@/assets/js/helper.js";

const state = () => ({
    data_filter : {
        form : false,
        modal : false,
        request : false,
        keyword  : '',
        due_date : helper.methods.dateTime('ymd'),
    },
    data_laporan : [],
})

const mutations = {
    ASSIGN_DATA(state, data) {
        let id_depo    = 0
        let data_fixed = []
        let header     = {
        nama_barang : 'header'
        }
        let data_sub   = []
        data_sub.push(header)
        for (var i = 0; i < data.length; i++) {
        let res = data[i]
        if(res.id_depo != id_depo){
          if(i>0){
            data_fixed.push(data_sub)
            data_sub = []
            data_sub.push(header)
          }
          id_depo = res.id_depo
        }
        if(i==data.length-1){
          data_fixed.push(data_sub)
        }
        data_sub.push(res)
        }
        state.data_laporan = data_fixed;
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
            $axios.get(`monitoring_stock`, {
                params: state.data_filter
            }).then((response) => {
                commit('ASSIGN_DATA', response.data)
            })
        })
    },
    getHariEfektif( {state, commit }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`monitoring_stock/get/hari_efektif`, {
                params: payload
            }).then((response) => {
                resolve(response.data)
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
