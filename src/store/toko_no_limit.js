import $axios from "@/api";

const state = () => ({
    toko_no_limits: {
        data: []
    },
    page: 1,
    per_page: 10,
    toko_no_limit: {
        id: '',
        id_toko: '',
        tipe: 'od'
    },
    form: false,
    form_title: 'Tambah Data'
})

const mutations = {
    ASSIGN_DATA(state, payload) {
        state.toko_no_limits = payload
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
    CLEAR_FORM(state, payload) {
        state.sharing_promo = {
            id: '',
            id_toko: '',
            tipe: 'od'
        }
    }
}

const actions = {
    getTokoNoLimits({ commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/toko_no_limit`, {
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
    submitTokoNoLimit({ dispatch, commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.post(`/toko_no_limit`, state.toko_no_limit)
                .then((response) => {
                    commit('SET_FORM', false)
                    dispatch('getTokoNoLimits').then(() => {
                        resolve(response.data)
                    })
                })
        })
    },
    editTokoNoLimit({ commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/toko_no_limit/${payload}`)
                .then((response) => {
                    state.sharing_promo = response.data.data
                })
        })
    },
    updateTokoNoLimit({ dispatch, state, commit}, payload) {
        return new Promise( (resolve, reject) => {
            $axios.put(`/toko_no_limit/${payload}`, state.sharing_promo)
                .then( (response) => {
                    commit('SET_FORM', false)
                    commit('CLEAR_FORM')
                    dispatch('getTokoNoLimits').then(() => {
                        resolve(response.data)
                    })
                })
        })
    },
    removeTokoNoLimit({ dispatch }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.delete(`/toko_no_limit/${payload}`)
                .then( (response) => {
                    dispatch('getTokoNoLimits').then( () => resolve() )
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
