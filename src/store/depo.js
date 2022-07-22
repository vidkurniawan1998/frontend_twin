import $axios from "@/api";

const state = () => ({
    list_depo: {
        id: '',
        nama_depo: ''
    }
})

const mutations = {
    ASSIGN_LIST_DEPO(state, payload) {
        state.list_depo = payload
    }
}

const actions = {
    getListDepo( {state, commit }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`depo/list/simple`, {
                params: payload
            }).then((response) => {
                commit('ASSIGN_LIST_DEPO', response.data.data)
                resolve(response.data.data)
            })
        })
    },
    getListDepoByUser( {state, commit }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`depo/depo_by_user`, {
                params: payload
            }).then((response) => {
                resolve(response.data.data)
            })
        })
    },
    getListDepoById( {state, commit }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`depo/list/by_id`, {
                params: payload
            }).then((response) => {
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
