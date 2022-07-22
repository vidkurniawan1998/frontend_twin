import Vue from 'vue';
import Vuex from 'vuex';

import layout from './layout';
import retur from './retur';
import retur_segmen from './retur_segmen';
import adjustment_barang from './adjustment_barang';
import sharing_promo from './sharing-promo';
import promo from './promo';
import barang from './barang';
import depo from './depo';
import brand from './brand';
import toko from './toko';
import toko_no_limit from "@/store/toko_no_limit";
import perusahaan from "@/store/perusahaan";
import tim from "@/store/tim";
import principal from "@/store/principal";
import gudang from "@/store/gudang";
import reference from "@/store/reference";
import salesman from "@/store/salesman";
import driver from "@/store/driver";
import option from "@/store/option";
import target_salesman from "@/store/target-salesman";
import penerimaan_barang from "@/store/penerimaan_barang";
import faktur_pembelian from "@/store/faktur_pembelian";
import user_principal from "@/store/user_principal";
import jurnal_penjualan from "@/store/jurnal_penjualan"
import stock from "@/store/stock"
import pelunasan_pembelian from "@/store/pelunasan_pembelian";
import grup_toko_logistik from "@/store/grup_toko_logistik";
import invoice_note from "@/store/invoice_note";
import distribution_plan from "@/store/distribution_plan";
import mitra from "@/store/mitra";
import ranking_barang from "@/store/ranking_barang";
import ranking_piutang from "@/store/ranking_piutang";
import omset_toko from "@/store/omset_toko";
import pembagian_promo from "@/store/pembagian_promo";
import kpi from "@/store/kpi";
import monitoring_stock from "@/store/monitoring_stock";
import suggest_order from "@/store/suggest_order";
import gross_profit from "@/store/gross_profit";
import konversi_pajak from "@/store/konversi_pajak";
import posisi_stock_mitra from "@/store/posisi_stock_mitra";
import service_level from "@/store/service_level";
import monitoring_pareto from "@/store/monitoring_pareto";
import monitoring_ota from "@/store/monitoring_ota";
import monitoring_pro from "@/store/monitoring_pro";
import monitoring_stock_tmp from "@/store/monitoring_stock_tmp";

//laporan sales
import kunjungan from "@/store/kunjungan";

Vue.use(Vuex);

const state = {
  token: localStorage.getItem('token'),
  errors:[],
  loading: false
}

const getters = {
  isAuth: state => {
    return state.token != null && state.token != "null"
  }
}

const mutations = {
  SET_TOKEN (state, payload) {
    state.token = payload
  },
  SET_ERRORS (state, payload) {
    state.errors = payload
  },
  CLEAR_ERRORS (state) {
    state.errors = []
  },
  SET_LOADING (state, payload) {
    state.loading = payload
  }
}

export default new Vuex.Store({
  modules: {
    layout,
    retur,
    retur_segmen,
    adjustment_barang,
    sharing_promo,
    promo,
    barang,
    depo,
    toko,
    toko_no_limit,
    perusahaan,
    tim,
    principal,
    gudang,
    reference,
    salesman,
    brand,
    driver,
    kunjungan,
    option,
    target_salesman,
    penerimaan_barang,
    faktur_pembelian,
    user_principal,
    jurnal_penjualan,
    stock,
    pelunasan_pembelian,
    grup_toko_logistik,
    invoice_note,
    distribution_plan,
    mitra,
    ranking_barang,
    ranking_piutang,
    omset_toko,
    pembagian_promo,
    kpi,
    monitoring_stock,
    suggest_order,
    gross_profit,
    konversi_pajak,
    posisi_stock_mitra,
    service_level,
    monitoring_pareto,
    monitoring_stock_tmp,
    monitoring_ota,
    monitoring_pro,
  },
  state,
  getters,
  mutations
});
