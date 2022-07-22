import $axios from "@/api";

const state = () => ({
    list_brand: {
        id: '',
        nama_brand: ''
    }
})

const mutations = {
    ASSIGN_LIST_BRAND(state, payload) {
        state.list_brand = payload
    }
}

const actions = {
    getListBrand( {state, commit }, payload) {
        console.log('testing')
        return new Promise( (resolve, reject) => {
            $axios.get(`brand`, {
                params: payload
            }).then((response) => {
                commit('ASSIGN_LIST_BRAND', response.data.data)
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
