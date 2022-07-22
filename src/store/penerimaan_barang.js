import $axios from "@/api";

const state = () => ({

})

const mutations = {

}

const actions = {
    getListPenerimaanBarang( {state, commit }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`penerimaan_barang/get/list`, {
                params: payload
            }).then((response) => {
                resolve(response.data.data)
            })
        })
    },
    getListBarang( {state, commit }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`detail_penerimaan_barang/get/list_barang`, {
                params: payload
            }).then((response) => {
                resolve(response.data.data)
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
