import $axios from "@/api";

const state = () => ({

})

const mutations = {

}

const actions = {
    getListDriver( {state, commit }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`driver/list_by_depo/${payload}`).then((response) => {
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
