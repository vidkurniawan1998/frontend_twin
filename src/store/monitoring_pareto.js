import $axios from "@/api";
import helper from "@/assets/js/helper.js";

const state = () => ({
    data_filter : {
        form : false,
        modal : false,
        request : false,

        start_date : helper.methods.dateTime('ymd'),
        end_date : helper.methods.dateTime('ymd'),

        id_perusahaan : [],
        id_depo : [],
        id_brand : [],
        id_barang: [],
        id_salesman : [],
        id_principal : [],
    },
    data_laporan : {
        data  : [],
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
            $axios.get(`monitoring/pareto`, {
                params: state.data_filter
            }).then((response) => {
                var id_salesman = 0;
                var total  = 0;
                var showed = [];
                var total_before  = [0,0,0,0,0];
                var total_after   = [0,0,0,0,0];
                let barang = response.data.barang
                for (var i = 0; i < response.data.data.length; i++) {
                    let data = response.data.data[i]
                    for (var l = 0; l < barang.length; l++) {
                        let sub_barang    = barang[l]
                        let total_before  = parseFloat(data['total_before_'+sub_barang.id])
                        let total_after   = parseFloat(data['total_after_'+sub_barang.id])  
                        data['growth_'+sub_barang.id]   = total_before == 0 ? 0 : (total_after - total_before) / total_before 
                    }
                    if(data.id_salesman != id_salesman) {
                        if(id_salesman>0){
                            let total_pareto = {}
                            let total_other  = {}
                            let total_all    = {}
                            for (var k = 0; k < barang.length; k++) {
                                let sub_barang = barang[k]
                                total_pareto['total_before_'+sub_barang.id] = total_before[k]
                                total_other['total_before_'+sub_barang.id]  = response.data.total[id_salesman]['total_before_'+sub_barang.id] - total_before[k]
                                total_all['total_before_'+sub_barang.id]    = response.data.total[id_salesman]['total_before_'+sub_barang.id]

                                total_pareto['total_after_'+sub_barang.id]  = total_after[k]
                                total_other['total_after_'+sub_barang.id]   = response.data.total[id_salesman]['total_after_'+sub_barang.id] - total_after[k]
                                total_all['total_after_'+sub_barang.id]     = response.data.total[id_salesman]['total_after_'+sub_barang.id]

                                total_pareto['growth_'+sub_barang.id]       = total_pareto['total_before_'+sub_barang.id] == 0 ? 0 :(total_pareto['total_after_'+sub_barang.id] - total_pareto['total_before_'+sub_barang.id]) / total_pareto['total_before_'+sub_barang.id]
                                total_other['growth_'+sub_barang.id]        = total_other['total_before_'+sub_barang.id] == 0 ? 0 : (total_other['total_after_'+sub_barang.id] - total_other['total_before_'+sub_barang.id]) / total_other['total_before_'+sub_barang.id]
                                total_all['growth_'+sub_barang.id]          = total_all['total_before_'+sub_barang.id] == 0 ? 0 : (total_all['total_after_'+sub_barang.id] - total_all['total_before_'+sub_barang.id]) / total_all['total_before_'+sub_barang.id]
                            }
                            let describ = {'id_salesman' : id_salesman, 'nama_tim' : response.data.data[i-1].nama_tim, 'nama_salesman' : response.data.data[i-1].nama_salesman, 'tipe' : 'total_pareto'}
                            showed.push({...describ, ...{'nama_toko' : 'TOTAL PARETO', 'tipe' : 'total_pareto'}, ...total_pareto})
                            showed.push({...describ, ...{'nama_toko' : 'TOTAL OTHER', 'tipe' : 'total_other'}, ...total_other})
                            showed.push({...describ, ...{'nama_toko' : 'TOTAL ALL', 'tipe' : 'total_all'}, ...total_all})
                        }
                        id_salesman   = data.id_salesman
                        total_before  = [0,0,0,0,0];
                        total_after   = [0,0,0,0,0];
                    }
                    if(total_before[0]<(response.data.total[id_salesman]['total_before_'+barang[0].id] * 0.6)){
                        showed.push(data)
                        for (var j = 0; j < barang.length; j++) {
                            let sub_barang =  barang[j]
                            total_before[j] += parseFloat(data['total_before_'+sub_barang.id])
                            total_after[j]  += parseFloat(data['total_after_'+sub_barang.id])
                        }
                    }
                }
                state.data_laporan.data   = showed
                state.data_laporan.barang = response.data.barang
                state.data_filter.request = false
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
