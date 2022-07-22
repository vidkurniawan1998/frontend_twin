import $axios from "@/api";

const state = () => ({

})

const mutations = {

}

const actions = {
    getListSalesman({state, commit}, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/salesman`, {
                params: payload
            }).then((response) => {
                resolve(response.data.data)
            })
        })
    },
    getListSalesmanActive({state, commit}, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/salesman/get/salesman_active`, {
                params: payload
            }).then((response) => {
                resolve(response.data.data)
            })
        })
    },
    getListSalesmanPrincipal({state, commit}, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`/salesman/get/salesman_principal`, {
                params: payload
            }).then((response) => {
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
