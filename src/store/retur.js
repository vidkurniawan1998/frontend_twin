import $axios from "@/api";
import helper from "@/assets/js/helper.js";

const state = () => ({
    show_modal: false,
    show_modal_detail: false,
    confirm_modal: false,
    claim_date: '',
    claim_id: '',
    updated: false,
    confirm: {
        title: '',
        subTitle: '',
        btnConfirm: '',
        textConfirm: '',
        actions: '',
    },
    depos:[],
    retur: {},
    detail_retur: {},
    barang_retur: {
        id: '',
        id_barang: '',
        kategori_bs: 'kd',
        expired_date: '',
        qty_dus: 0,
        qty_pcs: 0,
        disc_persen: 0,
        disc_nominal: 0
    },
    form_print : {
        id : '',
        form : false,
        modal : false,
        faktur_pajak_pembelian : '',
        tanggal_faktur_pajak_pembelian : '',

    },
    faktur_pajak : '',
    is_faktur_pajak : false,
})

const mutations = {
    SET_CLAIM_MODAL(state, payload) {
        state.show_modal = payload
    },
    SET_DETAIL_MODAL(state, payload) {
        state.show_modal_detail = payload
    },
    SET_CONFIRM_MODAL(state, payload) {
      state.confirm_modal = payload
    },
    SET_CLAIM_ID(state, payload) {
        state.claim_id = payload
    },
    SET_UPDATED(state, payload) {
        state.updated = payload
    },
    SET_CONFIRM(state, payload) {
        state.confirm = payload
    },
    CLEAR_CONFIRM(state, payload) {
        state.confirm = {
            id: '',
            title: '',
            subTitle: '',
            btnConfirm: '',
            textConfirm: '',
            actions: ''
        }
    },
    ASSIGN_DATA(state,payload)
    {
        state.depos = payload
    },
    ASSIGN_DATA_RETUR(state, payload) {
        state.retur = payload
    },
    ASSIGN_DATA_DETAIL_RETUR(state, payload) {
        state.detail_retur = payload
    },
    ASSIGN_DATA_BARANG_RETUR(state, payload) {
        state.barang_retur = payload
    },
    CLEAR_BARANG_RETUR(state) {
        state.barang_retur = {
            id: '',
            id_barang: '',
            kategori_bs: 'kd',
            expired_date: '',
            qty_dus: 0,
            qty_pcs: 0,
            disc_persen: 0,
            disc_nominal: 0
        }
    },
    SET_FAKTUR_PAJAK(state, payload){
        state.faktur_pajak = payload
    },
    SET_IS_FAKTUR_PAJAK(state, payload){
        state.is_faktur_pajak = payload
    },
}

const actions = {
    setClaimRetur({ dispatch, commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.put(`/retur_penjualan/${state.claim_id}/set_claim`, {
                claim_date   : state.claim_date,
                faktur_pajak : state.faktur_pajak
            })
            .then((response) => {
                commit('SET_CLAIM_MODAL', false)
                commit('SET_UPDATED', true)
            })
        })
    },
    cancelClaim({ dispatch, commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.put(`/retur_penjualan/${state.claim_id}/cancel_claim`)
            .then((response) => {
                commit('SET_CONFIRM_MODAL', false)
                commit('SET_UPDATED', true)
            })
        })
    },
    getDepo({ dispatch, commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`depo/depo_by_user`)
            .then((response) => {
                commit('ASSIGN_DATA', response.data.data)
            })
        })
    },
    removeRetur({ dispatch, commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.delete(`retur_penjualan/${state.claim_id}`)
            .then((response) => {
                commit('SET_CONFIRM_MODAL', false)
                commit('SET_UPDATED', true)
            })
        })
    },
    getRetur({ dispatch, commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/retur_penjualan/${payload}` )
            .then((response) => {
                commit('ASSIGN_DATA_RETUR', response.data.data)
            })
        })
    },
    getDetailRetur({ dispatch, commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/detail_retur_penjualan/${payload}/detail` )
            .then((response) => {
                commit('ASSIGN_DATA_DETAIL_RETUR', response.data.data)
            })
        })
    },
    addDetailRetur({ dispatch, commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.post(`/detail_retur_penjualan`, state.barang_retur)
            .then((response) => {
                resolve(response.data.data)
            }).catch(err => {
                helper.methods.toast(err.response.data.error)
            })
        })
    },
    updateDetailRetur({ dispatch, commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.put(`/detail_retur_penjualan/${payload}`, state.barang_retur)
            .then((response) => {
                resolve(response.data.data)
            }).catch(err => {
                helper.methods.toast(err.response.data.error)
            })
        })
    },
    removeDetailRetur({ dispatch, commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.delete(`/detail_retur_penjualan/${payload}`)
                .then( (response) => {
                    resolve(response.data.data)
                })
        })
    },
    approveRetur({ dispatch, commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.post(`/retur_penjualan/${payload}/approve`)
                .then( (response) => {
                    resolve(response.data.data)
                }).catch(err => {
                    helper.methods.toast(err.response.data.error)
                })
        })
    },
    cancelApproveRetur({ dispatch, commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.put(`/retur_penjualan/${payload}/unapprove`)
                .then( (response) => {
                    resolve(response.data.data)
                })
        })
    },
    triggerFormPrint({state, commit, payload}){
        let is_modal = state.form_print.modal ? false : true;
        if(is_modal){
            state.form_print.form = is_modal;
            setTimeout(() => {
              state.form_print.modal = is_modal;
            }, 100);
        }
        else{ 
            state.form_print.modal = is_modal;
            setTimeout(() => {
                state.form_print.form = is_modal;
            }, 100);
        }
    },
    setFakturPembelian({ dispatch, commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.put(`/retur_penjualan/set_faktur_pembelian/`+state.form_print.id, {  
              id                             : state.form_print.id,
              faktur_pajak_pembelian         : state.form_print.faktur_pajak_pembelian,
              tanggal_faktur_pajak_pembelian : state.form_print.tanggal_faktur_pajak_pembelian
            })
            .then((response) => {
                resolve(response.data)
                commit('SET_UPDATED', true)
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
