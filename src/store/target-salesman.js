import $axios from "@/api";
import helper from "@/assets/js/helper";

const state = () => ({
    target_salesman: [],
    request: false,
    target: {
        id_perusahaan: '',
        mulai_tanggal: helper.methods.dateTime('ymd'),
        sampai_tanggal: helper.methods.dateTime('ymd'),
        hari_kerja: 0,
        salesman: []
    },
    update: {
        id: '',
        nama_salesman: '',
        tim: '',
        target: 0
    },
    filter: {
        id_perusahaan: '',
        id_depo: [],
        id_salesman: [],
        mulai_tanggal: helper.methods.dateTime('ymd'),
        sampai_tanggal: helper.methods.dateTime('ymd'),
    },
    form_update: false,
    form_filter: false,
    per_page: 10,
    page: 1
})

const mutations = {
    ASSIGN_DATA(state, payload) {
        state.target_salesman = payload
    },
    ASSIGN_UPDATE(state, payload) {
        state.update = {
            id: payload.id,
            nama_salesman: payload.nama_salesman,
            tim: payload.tim,
            target: payload.target
        }
    },
    SET_FORM_UPDATE(state, payload) {
        state.form_update = payload
    },
    SET_FORM_FILTER(state, payload) {
        state.form_filter = payload
    },
    SET_PAGE(state, payload) {
        state.page = payload
    },
    SET_PER_PAGE(state, payload) {
        state.per_page = payload
    },
    CLEAR_FORM(state, payload) {
        state.target = {
            id_perusahaan: '',
            mulai_tanggal: helper.methods.dateTime('ymd'),
            sampai_tanggal: helper.methods.dateTime('ymd'),
            hari_kerja: 0,
            salesman: []
        }
    }
}

const actions = {
    getTargetSalesman({ commit, state }, payload = {}) {
        payload = {...payload, ...state.filter}
        state.request       = true
        payload.per_page    = state.per_page
        payload.page        = state.page
        return new Promise( (resolve, reject) => {
            $axios.get(`/target_salesman`, {
                params: payload
            }).then((response) => {
                commit('ASSIGN_DATA', response.data)
                resolve(response.data)
                state.request = false
            })
        })
    },
    submitTargetSalesman({commit, state}) {
        return new Promise( (resolve, reject) => {
            $axios.post(`/target_salesman`, state.target)
                .then((response) => {
                    resolve(response.data)
                })
        })
    },
    editTargetSalesman({commit, state}, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/target_salesman/${payload}`)
                .then((response) => {
                    commit('ASSIGN_UPDATE', response.data.data)
                    commit('SET_FORM_UPDATE', true)
                })
        })
    },
    updateTargetSalesman({commit, state, dispatch}, payload) {
        return new Promise( (resolve, reject) => {
            $axios.put(`/target_salesman/${payload}`, state.update)
                .then((response) => {
                    dispatch('getTargetSalesman').then( () => resolve() )
                    commit('SET_FORM_UPDATE', false)
                })
        })
    },
    removeTargetSalesman({ commit, state, dispatch }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.delete(`/target_salesman/${payload}`)
                .then( (response) => {
                    dispatch('getTargetSalesman').then( () => resolve() )
                })
        })
    },
    downloadExcel({ commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/target_salesman/get/report_excel`, {
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
