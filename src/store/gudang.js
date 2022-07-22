import $axios from "@/api";

const state = () => ({

})

const mutations = {

}

const actions = {
    getListGudang( {state, commit }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`gudang/get/gudang_by_user`, {
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
