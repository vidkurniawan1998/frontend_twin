import $axios from "@/api";

const state = () => ({

})

const mutations = {

}

const actions = {
    getListPrincipal( {state, commit }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`principal/get/list`, {
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
