import $axios from "@/api";
import helper from "@/assets/js/helper";

const state = () => ({
    fakturs: {
        data: []
    },
    page: 1,
    per_page: 10,
    faktur_pembelian: {
        id: '',
        id_perusahaan: '',
        id_depo: '',
        id_principal: '',
        no_invoice: '',
        faktur_pajak: '',
        disc_value: 0,
        disc_persen: 0,
        status: 'input',
        ppn: 10,
        tanggal_invoice: helper.methods.dateTime('ymd'),
        tanggal_jatuh_tempo: helper.methods.dateTime('ymd'),
        penerimaan_barang: [],
        detail_faktur_pembelian: []
    },
    filter: false,
    filter_title: 'Filter',
    dataFilter: {
        id_perusahaan: [],
        id_principal: [],
        status: 'all',
        due_date: helper.methods.dateTime('ymd')
    }
})

const mutations = {
    ASSIGN_DATA(state, payload) {
        state.fakturs = payload
    },
    SET_PAGE(state, payload) {
        state.page = payload
    },
    SET_PER_PAGE(state, payload) {
        state.per_page = payload
    },
    CLEAR_FORM(state, payload) {
        state.faktur_pembelian = {
            id: '',
            id_perusahaan: '',
            id_depo: '',
            id_principal: '',
            no_invoice: '',
            disc_value: 0,
            disc_persen: 0,
            status: 'input',
            ppn: 10,
            tanggal_invoice: helper.methods.dateTime('ymd'),
            tanggal_jatuh_tempo: helper.methods.dateTime('ymd'),
            penerimaan_barang: [],
            detail_faktur_pembelian: []
        }
    },
    SET_FILTER(state, payload) {
        state.filter = payload
    }
}

const actions = {
    getFakturs({commit, state}, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/faktur_pembelian`, {
                params: {
                    per_page: state.per_page,
                    page: state.page,
                    keyword: payload,
                    id_perusahaan: state.dataFilter.id_perusahaan,
                    id_principal: state.dataFilter.id_principal,
                    status: state.dataFilter.status,
                    due_date: state.dataFilter.due_date
                }
            })
            .then((response) => {
                commit('ASSIGN_DATA', response.data) 
                commit('SET_FILTER', false)
                resolve(response.data)
            })
        })
    },
    submitFaktur({commit, state}) {
        return new Promise( (resolve, reject) => {
            $axios.post(`/faktur_pembelian`, state.faktur_pembelian)
            .then((response) => {
                commit('CLEAR_FORM')
                resolve(response.data)
            })
        })
    },
    editFaktur({commit, state}, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/faktur_pembelian/${payload}`)
            .then((response) => {
                state.faktur_pembelian = response.data.data
            })
        })
    },
    updateFaktur({commit, state, dispatch}, payload) {
        return new Promise( (resolve, reject) => {
            $axios.put(`/faktur_pembelian/${payload}`, state.faktur_pembelian)
            .then((response) => {
                dispatch('editFaktur', payload)
            })
        })
    },
    unapprove({commit, state, dispatch}, payload) {
        return new Promise( (resolve, reject) => {
            $axios.put(`/faktur_pembelian/${payload}/unapprove`, state.faktur_pembelian)
            .then((response) => {
                dispatch('editFaktur', payload)
            })
        })
    },
    approve({commit, state, dispatch}, payload) {
        return new Promise( (resolve, reject) => {
            $axios.put(`/faktur_pembelian/${payload}/approve`, state.faktur_pembelian)
            .then((response) => {
                dispatch('editFaktur', payload)
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
