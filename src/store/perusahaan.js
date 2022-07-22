import $axios from "@/api";

const state = () => ({
    perusahaans: {
        data: []
    },
    page: 1,
    per_page: 10,
    perusahaan: {
        id: '',
        kode_perusahaan: '',
        nama_perusahaan: '',
        npwp : '',
        nama_pkp : '',
        alamat_pkp : '',
    },
    form: false,
    form_title: 'Tambah Data'
})

const mutations = {
    ASSIGN_DATA(state, payload) {
        state.perusahaans = payload
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
        state.perusahaan = {
            id: '',
            kode_perusahaan: '',
            nama_perusahaan: '',
        }
    }
}

const actions = {
    getPerusahaans({ commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/perusahaan`, {
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
    submitPerusahaan({ dispatch, commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.post(`/perusahaan`, state.perusahaan)
                .then((response) => {
                    commit('SET_FORM', false)
                    dispatch('getPerusahaans').then(() => {
                        resolve(response.data)
                    })
                })
        })
    },
    editPerusahaan({ commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/perusahaan/${payload}`)
                .then((response) => {
                    state.perusahaan = response.data.data
                })
        })
    },
    updatePerusahaan({ dispatch, state, commit}, payload) {
        return new Promise( (resolve, reject) => {
            $axios.put(`/perusahaan/${payload}`, state.perusahaan)
                .then( (response) => {
                    commit('SET_FORM', false)
                    commit('CLEAR_FORM')
                    dispatch('getPerusahaans').then(() => {
                        resolve(response.data)
                    })
                })
        })
    },
    removePerusahaan({ dispatch }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.delete(`/perusahaan/${payload}`)
                .then( (response) => {
                    dispatch('getPerusahaans').then( () => resolve() )
                })
        })
    },
    getListPerusahaan({ state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/perusahaan/get/list`)
                .then( (response) => {
                    resolve(response.data)
                })
        })
    },
    getListPerusahaanByAccess({ state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/perusahaan/get/list_by_access`)
                .then( (response) => {
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
