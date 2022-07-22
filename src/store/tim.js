import $axios from "@/api";

const state = () => ({
    list_tim: {
        id: '',
        nama_tim: ''
    }
})

const mutations = {
    ASSIGN_LIST_TIM(state, payload) {
        state.list_tim = payload
    }
}

const actions = {
    getListTim( {state, commit }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`tim/list/simple`, {
                params: payload
            }).then((response) => {
                commit('ASSIGN_LIST_TIM', response.data.data)
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
