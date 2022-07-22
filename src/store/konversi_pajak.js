import $axios from "@/api";

const state = () => ({
    data_form : {
        form : false,
        modal : false,
        request : false,
    },
    data_laporan : {
        data : [],
        meta : [],
    },
    data_filter : {
        keyword : '',
        page: 2,
        per_page: 10,
    },
    npwp_external : {
        data : [],
        meta : [],
    },
})

const mutations = {
}

const actions = {
    triggerFilter({state, commit, payload}){
        let is_modal = state.data_form.modal ? false : true;
        if(is_modal){
            state.data_form.form = is_modal;
            setTimeout(() => {
              state.data_form.modal = is_modal;
            }, 100);
        }
        else{ 
            state.data_form.modal = is_modal;
            setTimeout(() => {
                state.data_form.form = is_modal;
            }, 100);
        }
    },
    getLaporan( {state, commit }, payload) {
        return new Promise( (resolve, reject) => {
            $axios.get(`toko`, {
                params: state.data_form
            }).then((response) => {
                state.data_laporan.data = response.data.data
                state.data_laporan.meta = response.data.meta
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
