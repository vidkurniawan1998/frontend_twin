import $axios from "@/api";

const state = () => ({
    stock: {
        id_gudang: '',
        id_barang: '',
        qty: 0,
        qty_pcs: 0,
    },
    form: false,
    form_title: 'Tambah Data'
})

const mutations = {
    SET_FORM(state, payload) {
        state.form = payload
    },
    SET_FORM_TITLE(state, payload) {
        state.form_title = payload
    },
    CLEAR_FORM(state, payload) {
        state.stock = {
            id_gudang: '',
            id_barang: '',
            qty: 0,
            qty_pcs: 0,
        }
    }
}

const actions = {
    submitStock({ dispatch, commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.post(`/stock`, state.stock)
                .then((response) => {
                    commit('SET_FORM', false)
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