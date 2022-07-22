
import $axios from "@/api";
import helper from "@/assets/js/helper.js";

const state = () => ({
    data_filter : {
        form : false,
        modal : false,
        request : false,
        keyword  : '',
        buffer : '',
        rule : '',
        tipe : '',
        due_date : helper.methods.dateTime('ymd'),
        parameter_prediksi : 5,
        minggu : 0
    },
    data_laporan : [],
})

const mutations = {
    ASSIGN_DATA(state, data) {
        let id_barang   = 0
        let data_fixed  = []
        let total_stt   = 0
        let total_savl  = 0
        let n           = -1
        for (var i = 0; i < data.length; i++) {
            let res = data[i]
            if(res.id_barang != id_barang){
              data_fixed.push({
                id_barang      : res.id_barang,
                nama_barang    : res.nama_barang,
                nama_brand     : res.nama_brand,
                nama_principal : res.nama_principal,
                harga          : parseFloat(res.harga),
                stt            : parseFloat(res.stt),
                savl           : parseFloat(res.savl)
              })
              id_barang = res.id_barang
              n++
            }
            else{
                data_fixed[n].stt  += parseFloat(res.stt)
                data_fixed[n].savl += parseFloat(res.savl)
            }
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
            $axios.get(`suggest_order`, {
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
