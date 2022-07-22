import $axios from "@/api";
import helper from "@/assets/js/helper.js";

const state = () => ({
    data_laporan : {
        data  : [],
        qty   : [],
        total : [],
    },
    data_item : {
        data:[]
    },
    data_depo : {
        data: []
    },
    data_filter:{
        id_perusahaan: [],
        id_principal: [],
        id_salesman: 'all',
        id_brand : [],
        section : 'on',
        depo:[],
        start_date: helper.methods.dateTime('ymd'),
        end_date: helper.methods.dateTime('ymd'),
        form: false,
        is_filter : false,
    },
})

const mutations = {
 
}
 
const actions = {
    
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}