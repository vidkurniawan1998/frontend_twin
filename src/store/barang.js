import $axios from "@/api";

const state = () => ({
    list_barang: {
        id: '',
        kode_barang: '',
        nama_barang: ''
    }
})

const mutations = {
    ASSIGN_LIST_BARANG(state, payload) {
        state.list_barang = payload
    }
}

const actions = {
    getListBarang( {state, commit }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`barang/list/simple`, {
                params: payload
            })
            .then((response) => {
                resolve(response.data.data)
            })
        })
    },
    getListBarangMitra( {state, commit }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`barang/list/simple/mitra`, {
                params: payload
            })
            .then((response) => {
                resolve(response.data.data)
            })
        })
    },
    getListBarangByBrand( {state, commit }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`barang/list/brand`, {
                params: payload
            })
            .then((response) => {
                resolve(response.data)
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
