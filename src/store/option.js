import $axios from "@/api";

const state = () => ({
    options: [],
    page: 1,
    per_page: 10,
    option: {
        id: '',
        code: '',
        value: '',
        text: '',
    },
    form: false,
    form_title: 'Tambah Data'
})

const mutations = {
    ASSIGN_DATA(state, payload) {
        state.options = payload
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
        state.option = {
            id: '',
            code: '',
            value: '',
            text: '',
        }
    }
}

const actions = {
    getOptions({ commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/options`, {
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
    submitOption({ dispatch, commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.post(`/options`, state.option)
                .then((response) => {
                    commit('SET_FORM', false)
                    dispatch('getOptions').then(() => {
                        resolve(response.data)
                    })
                })
        })
    },
    editOption({ commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/options/${payload}`)
                .then((response) => {
                    state.option = response.data.data
                })
        })
    },
    updateOption({ dispatch, state, commit}, payload) {
        return new Promise( (resolve, reject) => {
            $axios.put(`/options/${payload}`, state.option)
                .then( (response) => {
                    commit('SET_FORM', false)
                    commit('CLEAR_FORM')
                    dispatch('getOptions').then(() => {
                        resolve(response.data)
                    })
                })
        })
    },
    removeOption({ dispatch }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.delete(`/options/${payload}`)
                .then( (response) => {
                    dispatch('getOptions').then( () => resolve() )
                })
        })
    },
    getOptionsByCode({ dispatch }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/options/get/list`, {
                params: {
                    code: payload
                }
            })
                .then( (response) => {
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
