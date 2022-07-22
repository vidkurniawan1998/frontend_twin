import $axios from "@/api";

const state = () => ({
    list_toko: {
        id: '',
        no_acc: '',
        cust_no: '',
        nama_toko: '',
        nama_tim: ''
    },
    data_filter : {
        form : false,
        modal : false,
        request : false,

        id_perusahaan : [],
        id_depo : [],
        id_tim : [],
        tipe : '',

        tipe_keyword : [],
        keyword : [],

        page: 1,
        per_page: 10,
    },
    data_laporan : {
        data : [],
        meta : [],
    },
})

const mutations = {
    ASSIGN_LIST_TOKO(state, payload) {
        state.list_toko = payload
    }
}

const actions = {
    getListToko( {state, commit }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`toko/list/simple`, {
                params: payload
            }).then((response) => {
                commit('ASSIGN_LIST_TOKO', response.data.data)
                resolve(response.data.data)
            })
        })
    },
    getTokoById( {state, commit }, payload) {
        return new Promise( (resolve, reject) => {
             $axios.get("toko/"+payload)
             .then((response) => {
                resolve(response.data.data)
            })
        })
    },
    tokoTanpaGrupLogistik( {state, commit }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`toko/toko_tanpa_grup_logistik`, {
                params: payload
            }).then((response) => {
                resolve(response.data.data)
            })
        })
    },
    omsetToko({state, commit }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`toko/toko_by_omset`, {
                params: payload
            }).then((response) => {
                resolve(response.data.data[0] || null)
            })
        })
    },
    triggerFilter({state, commit, payload}){
        console.log('cek')
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
            $axios.get(`toko`, {
                params: state.data_filter
            }).then((response) => {
                state.data_laporan.data = response.data.data
                state.data_laporan.meta = response.data.meta
                resolve(response.data.data)
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
