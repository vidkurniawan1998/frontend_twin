import $axios from "@/api";
import helper from "@/assets/js/helper.js";

const state = () => ({
    data_filter : {
        form : false,
        modal : false,
        request : false,

        id_perusahaan : [],
        id_principal : [],
        tipe_promo : [],
        start_date : helper.methods.dateTime('ymd'),
        end_date : helper.methods.dateTime('ymd'),

    },
    data_laporan : {
        data : [],
        meta : [],
    },
})

const mutations = {

}

const actions = {
    triggerFilter({state, commit, payload}){
        let is_modal = state.data_filter.modal ? false : true;
        if(is_modal){
            state.data_filter.form = is_modal;
            setTimeout(() => {
              state.data_filter.modal = is_modal;
            }, 100);
        }
        else{ 
            state.data_filter.modal = is_modal;
            setTimeout(() => {
                state.data_filter.form = is_modal;
            }, 100);
        }
    },
    getLaporan( {state, commit }, payload) {
        state.data_filter.request = true 
        return new Promise( (resolve, reject) => {
            $axios.get(`pembagian_promo`, {
                params: state.data_filter
            }).then((response) => {
                state.data_laporan.data = response.data.data
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
