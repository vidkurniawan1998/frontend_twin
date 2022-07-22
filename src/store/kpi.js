import $axios from "@/api";
import helper from "@/assets/js/helper.js";

const state = () => ({
    data_filter : {
        form : false,
        modal : false,
        request : false,

        id_perusahaan : [],
        id_depo : [],

        start_date: helper.methods.dateTime('ymd'),
        end_date: helper.methods.dateTime('ymd'),

        id_principal : [],
        id_brand : [],

        page: 1,
        per_page: 10,
    },
    data_laporan : {
        data : [],
        //meta : [],
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
        return new Promise( (resolve, reject) => {
            $axios.get(`kpi`, {
                params: state.data_filter
            }).then((response) => {
                state.data_laporan.data = response.data
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
