import $axios from "@/api";

const state = () => ({
})

const mutations = {
}

const actions = {
    getListMitra( {state, commit }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`mitra/list/simple`, {
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