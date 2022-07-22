import $axios from "@/api";

const state = () => ({
    sharing_promos: {
        data: []
    },
    page: 1,
    per_page: 10,
    sharing_promo: {
        id: '',
        id_promo: '',
        persen_principal: 0,
        persen_dist: 0,
        nominal_principal: 0,
        nominal_dist: 0,
        extra_principal: 0,
        extra_dist: 0,
    },
    form: false,
    form_title: 'Tambah Data'
})

const mutations = {
    ASSIGN_DATA(state, payload) {
        state.sharing_promos = payload
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
            id_promo: '',
            persen_principal: 0,
            persen_dist: 0,
            nominal_principal: 0,
            nominal_dist: 0,
            extra_principal: 0,
            extra_dist: 0,
        }
    }
}

const actions = {
    getSharingPromos({ commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/sharing_promo`, {
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
    submitSharingPromo({ dispatch, commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.post(`/sharing_promo`, state.sharing_promo)
                .then((response) => {
                    commit('SET_FORM', false)
                    dispatch('getSharingPromos').then(() => {
                        resolve(response.data)
                    })
                })
        })
    },
    editSharingPromo({ commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/sharing_promo/${payload}`)
                .then((response) => {
                    state.sharing_promo = response.data.data
                })
        })
    },
    updateSharingPromo({ dispatch, state, commit}, payload) {
        return new Promise( (resolve, reject) => {
            $axios.put(`/sharing_promo/${payload}`, state.sharing_promo)
                .then( (response) => {
                    commit('SET_FORM', false)
                    commit('CLEAR_FORM')
                    dispatch('getSharingPromos').then(() => {
                        resolve(response.data)
                    })
                })
        })
    },
    removeSharingPromo({ dispatch }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.delete(`/sharing_promo/${payload}`)
                .then( (response) => {
                    dispatch('getSharingPromos').then( () => resolve() )
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