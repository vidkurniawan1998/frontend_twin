import $axios from "@/api";
import helper from "@/assets/js/helper.js";

const state = () => ({
    promos: [],
    promo: {
        id: '',
        no_promo: '',
        nama_promo: '',
        disc_rupiah: 0,
        disc_persen: [0, 0, 0, 0, 0, 0],
        id_barang: '',
        volume_extra: 0,
        pcs_extra: 0,
        tanggal_awal: helper.methods.dateTime('ymd'),
        tanggal_akhir: helper.methods.dateTime('ymd'),
        status_klaim: 0,
        status: 'active',
        depo: [],
        toko: [],
        barang: [],
        keterangan: '',
        id_perusahaan: '',
        salesman: 'all',
        id_principal: '',
        minimal_order: 0
    },
    re_render: false
})

const mutations = {
    ASSIGN_DATA(state, payload) {
        state.promos = payload
    },
    CLEAR_FORM(state) {
        state.promo = {
            id: '',
            no_promo: '',
            nama_promo: '',
            disc_rupiah: 0,
            disc_rupiah_distributor: 0,
            disc_rupiah_principal: 0,
            disc_persen: [0, 0, 0, 0, 0, 0],
            id_barang: '',
            volume_extra: 0,
            pcs_extra: 0,
            tanggal_awal: helper.methods.dateTime('ymd'),
            tanggal_akhir: helper.methods.dateTime('ymd'),
            status_klaim: 0,
            status: 'active',
            depo: [],
            toko: [],
            barang: [],
            keterangan: '',
            id_perusahaan: '',
            salesman: 'all',
            id_principal: '',
            minimal_order: 0
        }
    }
}

const actions = {
    getPromoOption({ commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/promo`)
                 .then((response) => {
                    commit('ASSIGN_DATA', response.data)
                    resolve(response.data)
                })
        })
    },
    submitPromo({commit, state}) {
        return new Promise( (resolve, reject) => {
            $axios.post(`/promo`, state.promo)
                .then((response) => {
                    resolve(response.data)
                })
        })
    },
    editPromo({ commit, state }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/promo/${payload}`)
                .then((response) => {
                    let rspn = response.data.data
                    let disc = ['disc_1', 'disc_2', 'disc_3', 'disc_4', 'disc_5', 'disc_6']
                    let disc_persen = []
                    for (const key in rspn) {
                        if (key == 'depo') {
                            for (let i = 0; i < rspn.depo.length; i++) {
                                state.promo[key].push(rspn.depo[i].id)
                            }
                            continue
                        }
                        if (disc.includes(key)) {
                            disc_persen.push(rspn[key])
                            continue
                        }

                        state.promo[key] = rspn[key]
                    }
                    state.promo['disc_persen'] = disc_persen
                    state.re_render = true
                })
        })
    },
    updatePromo({ state, commit }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.put(`/promo/${payload}`, state.promo)
                .then((response) => {
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
