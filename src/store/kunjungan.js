import $axios from "@/api";

const state = () => ({
    kunjungan: {
        data: [],
    },
    page: 1,
    per_page: 10,
    request: false,
})

const mutations = {
    ASSIGN_DATA(state, payload) {
        state.kunjungan = payload
    },
    SET_PAGE(state, payload) {
        state.page = payload
    },
    SET_PER_PAGE(state, payload) {
        state.per_page = payload
    }
}

const actions = {
    getKunjungan({ commit, state }, payload = {}) {
        state.request = true
        payload.per_page    = state.per_page
        payload.page        = state.page
        return new Promise( (resolve, reject) => {
            $axios.get(`/kunjungan_sales`, {
                params: payload
            }).then((response) => {
                commit('ASSIGN_DATA', response.data)
                resolve(response.data)
                state.request = false
            })
        })
    },
    removeKunjunganSales({ commit, state, dispatch }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.delete(`/kunjungan_sales/${payload}`)
            .then( (response) => {
                dispatch('getKunjungan').then( () => resolve() )
            })
        })
    },
    downloadExcel({ commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/kunjungan_sales/get/report_excel`, {
                params: payload
            }).then((response) => {
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
