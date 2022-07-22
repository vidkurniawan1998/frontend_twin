import $axios from "@/api";

const state = () => ({
    references: {
        data: []
    },
    page: 1,
    per_page: 10,
    reference: {
        id: '',
        code: '',
        value: '',
        notes: ''
    },
    form: false,
    form_title: 'Tambah Data'
})

const mutations = {
    ASSIGN_DATA(state, payload) {
        state.references = payload
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
        state.reference = {
            id: '',
            code: '',
            value: '',
            notes: ''
        }
    }
}

const actions = {
    getReferences({ commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/references`, {
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
    submitReference({ dispatch, commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.post(`/references`, state.reference)
                .then((response) => {
                    commit('SET_FORM', false)
                    dispatch('getReferences').then(() => {
                        resolve(response.data)
                    })
                })
        })
    },
    editReference({ commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/references/${payload}`)
                .then((response) => {
                    state.reference = response.data.data
                })
        })
    },
    updateReference({ dispatch, state, commit}, payload) {
        return new Promise( (resolve, reject) => {
            $axios.put(`/references/${payload}`, state.reference)
                .then( (response) => {
                    commit('SET_FORM', false)
                    commit('CLEAR_FORM')
                    dispatch('getReferences').then(() => {
                        resolve(response.data)
                    })
                })
        })
    },
    removeReference({ dispatch }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.delete(`/references/${payload}`)
                .then( (response) => {
                    dispatch('getReferences').then( () => resolve() )
                })
        })
    },
    getReferenceByCode({state}, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/references/get/by_code`, {
                params: payload
            }).then( (response) => {
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
