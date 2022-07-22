import $axios from "@/api";

const state = () => ({
    grup_toko_logistiks: {
        data: []
    },
    grup_toko_logistik: {
        id: '',
        nama_grup: ''
    },
    page: 1,
    per_page: 10,
    form: false,
    form_title: 'Tambah Data'
})

const mutations = {
    ASSIGN_DATA(state, payload) {
        state.grup_toko_logistiks = payload
    },
    SET_PAGE(state, payload) {
        state.page = payload
    },
    SET_PER_PAGE(state, payload) {
        state.per_page = payload
    },
    SET_FORM(state, payload) {
        state.form = payload
    },
    SET_FORM_TITLE(state, payload) {
        state.form_title = payload
    },
    CLEAR_FORM(state) {
        state.grup_toko_logistik = {
            id: '',
            nama_grup: ''
        }
    },
    SET_FORM_VALUE(state, payload) {
        state.grup_toko_logistik = {
            id: payload.id,
            nama_grup: payload.nama_grup
        }
    }
}

const actions = {
    getTokoLogistiks({ commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/grup_toko_logistik`, {
                params: {
                    per_page: state.per_page,
                    page: state.page,
                    keyword: payload
                }
            })
            .then((response) => {
                commit('ASSIGN_DATA', response.data)
                resolve(response.data)
            })
        })
    },
    updateGrupLogistik({ dispatch, state, commit}, payload) {
        return new Promise( (resolve, reject) => {
            $axios.put(`/grup_toko_logistik/${payload}`, state.grup_toko_logistik)
                .then( (response) => {
                    commit('SET_FORM', false)
                    commit('CLEAR_FORM')
                    dispatch('getTokoLogistiks').then(() => {
                        resolve(response.data)
                    })
                })
        })
    },
    removeGrupLogistik({ dispatch }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.delete(`/grup_toko_logistik/${payload}`)
            .then( (response) => {
                dispatch('getTokoLogistiks').then( () => resolve() )
            })
        })
    },
    removeTokoFromGrup({dispatch, state, commit}, payload) {
        return new Promise( (resolve, reject) => {
            $axios.put(`/grup_toko_logistik/delete_toko/${payload}`)
            .then( (response) => {
                dispatch('getTokoLogistiks').then(() => {
                    resolve(response.data)
                })
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
