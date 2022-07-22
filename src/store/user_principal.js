import $axios from "@/api";

const state = () => ({
    user_principals: {
        data: []
    },
    page: 1,
    per_page: 10,
    user_principal: {
        user_id: '',
        principal_id: []
    },
    form: false,
    form_title: 'Tambah Data'
})

const mutations = {
    ASSIGN_DATA(state, payload) {
        state.user_principals = payload
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
        state.user_principal = {
            user_id: '',
            principal_id: []
        }
    }
}

const actions = {
    getUserPrincipals({ commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/user_principal`, {
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
    submitUserPrincipal({ dispatch, commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.post(`/user_principal`, state.user_principal)
            .then((response) => {
                commit('SET_FORM', false)
                dispatch('getUserPrincipals').then(() => {
                    resolve(response.data)
                })
            })
        })
    },
    editUserPrincipal({ commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/user_principal/${payload}`)
            .then((response) => {
                let dt = response.data.data
                dt.principal_id = Array.from(dt.principal, principal => principal.id)
                delete dt.principal
                state.user_principal = dt
            })
        })
    },
    updateUserPrincipal({ dispatch, state, commit}, payload) {
        return new Promise( (resolve, reject) => {
            $axios.put(`/user_principal`, state.user_principal)
            .then( (response) => {
                commit('SET_FORM', false)
                commit('CLEAR_FORM')
                dispatch('getUserPrincipals').then(() => {
                    resolve(response.data)
                })
            })
        })
    },
    removeUserPrincipal({ dispatch }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.delete(`/user_principal/${payload}`)
            .then( (response) => {
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
