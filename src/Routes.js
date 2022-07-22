import Vue from "vue";
import Router from "vue-router";

import Layout from "@/components/Layout/Layout";
// import Page from "@/components/Layout/Page";

// ERROR
import ErrorPage from "@/pages/Error/Error";
import P403 from "@/pages/Error/403/403";

// PUBLIC
import login from "@/pages/public/login/login";

// DASHBOARD
import dashboard from "@/pages/dashboard/dashboard";

//Master
import barang from "@/pages/dashboard/master/barang/barang";
import brand from "@/pages/dashboard/master/brand/brand";
import canvas from "@/pages/dashboard/master/canvas/canvas";
import depo from "@/pages/dashboard/master/depo/depo";
import principal from "@/pages/dashboard/master/principal/principal";
import salesman from "@/pages/dashboard/master/salesman/salesman";
import segmen from "@/pages/dashboard/master/segmen/segmen";
import tipeHarga from "@/pages/dashboard/master/tipe-harga/tipe-harga";
import hariEfektif from "@/pages/dashboard/master/hari-efektif/hari-efektif";
import perusahaan from "@/pages/dashboard/master/perusahaan/perusahaan";

//MONITORING
import pareto from "@/pages/dashboard/monitoring/pareto/monitoring-pareto";
import ota from "@/pages/dashboard/monitoring/ota/monitoring-ota";
import pro from "@/pages/dashboard/monitoring/pro/monitoring-pro";
import stockTmp from "@/pages/dashboard/monitoring/stock-tmp/monitoring-stock-tmp";
import quickSearch from "@/pages/dashboard/monitoring/quick-search/quick-search";

// SALES
import tim from "@/pages/dashboard/master/tim/tim";
import toko from "@/pages/dashboard/sales/toko/toko";

import penjualan from "@/pages/dashboard/sales/penjualan/penjualan";
import printInvoice from "@/pages/dashboard/sales/penjualan/print/invoice";
import printInvoice2 from "@/pages/dashboard/sales/penjualan/print/invoice2";

import stock from "@/pages/dashboard/sales/stock/stock";
import salesOrder from "@/pages/dashboard/sales/sales-order";
import promo from "@/pages/dashboard/sales/promo/promo";
import addPromo from "@/pages/dashboard/sales/promo/add";
import editPromo from "@/pages/dashboard/sales/promo/edit";
import sharingPromo from "@/pages/dashboard/sales/sharing-promo/sharing-promo";
import pembagianPromo from "@/pages/dashboard/sales/laporan-pembagian-promo/laporan-pembagian-promo";
import realisasiProgram from "@/pages/dashboard/sales/realisasi-program/realisasi-program";
import printRealisasiPenjualan from "@/pages/dashboard/sales/realisasi-program/print/realisasi-program";
import returPenjualan from "@/pages/dashboard/sales/retur-penjualan/retur-penjualan";
import printReturPenjualan from "@/pages/dashboard/sales/retur-penjualan/print/retur-penjualan";
import printReturPenjualanBaru from "@/pages/dashboard/sales/retur-penjualan/print/retur-penjualan-baru";
import targetsalesman from "@/pages/dashboard/sales/target-sales/target-sales";
import formTargetSales from "@/pages/dashboard/sales/target-sales/form";

import laporanAktual from "@/pages/dashboard/sales/laporan-aktual/laporan-aktual";
import laporanSTT from "@/pages/dashboard/sales/laporan-sales-to-trade/laporan-sales-to-trade";
import laporanSTTPajak from "@/pages/dashboard/sales/laporan-stt-pajak/laporan-stt-pajak";
import laporanSTD from "@/pages/dashboard/sales/laporan-sales-to-distributor/laporan-sales-to-distributor";
import laporanPenjualanHarian from "@/pages/dashboard/sales/laporan-penjualan-harian/laporan-penjualan-harian";
import laporanJurnalPenjualan from "@/pages/dashboard/sales/jurnal-penjualan/jurnal-penjualan";
import printJurnalPenjualan from "@/pages/dashboard/sales/jurnal-penjualan/print/jurnal-penjualan";

import laporanReturPenjualan from "@/pages/dashboard/sales/laporan-retur-penjualan/laporan-retur-penjualan";
import exportDataPenjualan from "@/pages/dashboard/sales/export-data-penjualan/export-data-penjualan";
import posisiPenjualan from "@/pages/dashboard/sales/posisi-penjualan/posisi-penjualan";

import laporanReturSegmen from "@/pages/dashboard/sales/laporan-retur-segmen/laporan-retur-segmen";
import printReturSegmen from "@/pages/dashboard/sales/laporan-retur-segmen/print/laporan-retur-segmen";

import omsetToko from "@/pages/dashboard/sales/laporan-omset-toko/laporan-omset-toko";
import detailOmsetToko from "@/pages/dashboard/sales/laporan-omset-toko/detail-omset-toko";

import laporanRankingBarang from "@/pages/dashboard/sales/laporan-ranking-barang/laporan-ranking-barang";
import detailRankingBarang from "@/pages/dashboard/sales/laporan-ranking-barang/detail-ranking-barang";

import laporanKpi from "@/pages/dashboard/sales/laporan-kpi/laporan-kpi";

import delivery from "@/pages/dashboard/sales/delivery-penjualan/delivery-penjualan";
import serviceLevelMonitoring from "@/pages/dashboard/sales/service-level-monitoring/service-level-monitoring";

// Laporan Salesman
import kunjungan from "@/pages/dashboard/sales/laporan-salesman/kunjungan";

//Rekapitulasi DO
import rekapitulasiDO from "@/pages/dashboard/sales/rekapitulasi-do/rekapitulasi-do";
import printRekapitulasiDO from "@/pages/dashboard/sales/rekapitulasi-do/print/rekapitulasi";

//Mitra
import mitraPelunasanPiutang from "@/pages/dashboard/mitra/pelunasan/pelunasan";
import mitraDataPiutang from "@/pages/dashboard/mitra/data-piutang/data-piutang";
import mitraReturPenjualan from "@/pages/dashboard/mitra/retur-penjualan/retur-penjualan";
import mitraSalesToTrade from "@/pages/dashboard/mitra/laporan-sales-to-trade/laporan-sales-to-trade";
import mitraLaporanReturPenjualan from "@/pages/dashboard/mitra/laporan-retur-penjualan/laporan-retur-penjualan";
import mitraLaporanAktual from "@/pages/dashboard/mitra/laporan-aktual/laporan-aktual";
import mitraLaporanPenjualanHarian from "@/pages/dashboard/mitra/laporan-penjualan-harian/laporan-penjualan-harian";
import mitraRekapitulasiPenagihan from "@/pages/dashboard/mitra/rekapitulasi-penagihan/rekapitulasi";
import mitraPenjualan from "@/pages/dashboard/mitra/penjualan/penjualan";
import mitraPrintInvoice from "@/pages/dashboard/mitra/penjualan/print/invoice";
import posisiStockGudangMitra from "@/pages/dashboard/mitra/posisi-stock-gudang-mitra/posisi-stock-gudang-mitra";

// INVENTORY
import StockOpname from "@/pages/dashboard/inventory/stock-opname/stock-opname";
import PrintStockOpname from "@/pages/dashboard/inventory/stock-opname/print/print-stock-opname";
import penerimaanBarang from "@/pages/dashboard/inventory/penerimaan-barang/penerimaan-barang";
import printPenerimaanBarang from "@/pages/dashboard/inventory/penerimaan-barang/print/penerimaan-barang";
import mutasiBarang from "@/pages/dashboard/inventory/mutasi-barang/mutasi-barang";
import printMutasi from "@/pages/dashboard/inventory/mutasi-barang/print/mutasi";

import adjustmentBarang from "@/pages/dashboard/inventory/adjustment-barang/adjustment-barang";
import printAdjustment from "@/pages/dashboard/inventory/adjustment-barang/print/adjustment";
import laporanAdjustmentBarang from "@/pages/dashboard/inventory/laporan-adjustment-barang/laporan-adjustment-barang";

import driver from "@/pages/dashboard/inventory/driver/driver";
import kendaraan from "@/pages/dashboard/inventory/kendaraan/kendaraan";
import gudang from "@/pages/dashboard/inventory/gudang/gudang";
import laporanPosisiStock from "@/pages/dashboard/inventory/laporan-posisi-stock/laporan-posisi-stock";
import laporanMonitoringStock from "@/pages/dashboard/inventory/laporan-monitoring-stock/laporan-monitoring-stock";
import laporanSuggestOrder from "@/pages/dashboard/inventory/laporan-suggest-order/laporan-suggest-order";
import riwayatBarang from "@/pages/dashboard/inventory/riwayat-barang/riwayat-barang";
import deliveryOrder from "@/pages/dashboard/inventory/delivery-order/do";
import posisiStockGudang from "@/pages/dashboard/inventory/posisi-stock-gudang/posisi-stock-gudang";
import PrintPosisiStockGudang from "@/pages/dashboard/inventory/posisi-stock-gudang/print/print-posisi-stock-gudang";
import laporanMutasiBarang from "@/pages/dashboard/inventory/laporan-mutasi-barang/laporan-mutasi-barang";

//Distribution Plan
import distributionPlanPenjualan from "@/pages/dashboard/inventory/distribution_plan/penjualan/penjualan";
import distributionPlanPenjualanTerjadwal from "@/pages/dashboard/inventory/distribution_plan/penjualan/pengiriman-penjualan-terjadwal";
import distributionPlan_DeliverReport from "@/pages/dashboard/inventory/distribution_plan/delivery-report/delivery-report";

import distributionPlan_ReportJadwalPengiriman from "@/pages/dashboard/inventory/report-jadwal-pengiriman/report-jadwal-pengiriman";
import printReportJadwalPengiriman from "@/pages/dashboard/inventory/report-jadwal-pengiriman/print/report";

//Realisasi DO
import distributionPlan_ReportRealisasiDO from "@/pages/dashboard/inventory/realisasi-do/realisasi-do";
import printReportRealisasiDO from "@/pages/dashboard/inventory/realisasi-do/print/report";

// FINANCE
import piutang from "@/pages/dashboard/finance/pelunasan/pelunasan";
import pelunasan from "@/pages/dashboard/finance/pelunasan/semua-invoice";
import printSemuaInvoice from "@/pages/dashboard/finance/pelunasan/print/semua-invoice";
import rekapitulasiPenagihan from "@/pages/dashboard/finance/rekapitulasi-penagihan/rekapitulasi";
import returKlaim from "@/pages/dashboard/finance/retur-report/retur-report";
import InvoiceNote from "@/pages/dashboard/finance/invoice-note/invoice-note";
import FormInvoiceNote from "@/pages/dashboard/finance/invoice-note/form";
import laporanRankingPiutang from "@/pages/dashboard/finance/laporan-ranking-piutang/laporan-ranking-piutang";
import detailRankingPiutang from "@/pages/dashboard/finance/laporan-ranking-piutang/detail-ranking-piutang";
import laporanGrossProfit from "@/pages/dashboard/finance/laporan-gross-profit/laporan-gross-profit";

// PURCHASE
import DataPembelian from "@/pages/dashboard/purchase/pembelian/pembelian";
import TambahDataPembelian from "@/pages/dashboard/purchase/pembelian/add";
import EditDataPembelian from "@/pages/dashboard/purchase/pembelian/edit";
import PelunasanPembelian from "@/pages/dashboard/purchase/pelunasan/pelunasan";

// EXTERNAL
import bridging from "@/pages/dashboard/external/bridging/bridging";
import kinoBridging from "@/pages/dashboard/external/kino-bridging/kino";
import surveyHarga from "@/pages/dashboard/external/survey-harga/survey-harga";
import espt from "@/pages/dashboard/external/espt/espt";
import konversiPajak from "@/pages/dashboard/external/konversi-pajak/konversi-pajak";
import importPajak from "@/pages/dashboard/external/import-pajak/import-pajak";
import importRekapPajak from "@/pages/dashboard/external/rekap-pajak/import-rekap-pajak";
import importOrderSosro from "@/pages/dashboard/external/order-sosro/import-order-sosro";
import importOrderKino from "@/pages/dashboard/external/order-kino/order-kino";
import exportKino from "@/pages/dashboard/external/export-kino/export-kino";

// ADMINISTRATOR
import permissions from "@/pages/dashboard/administrator/permissions/permissions";
import role from "@/pages/dashboard/administrator/role/role";
import users from "@/pages/dashboard/administrator/users/users";
import WhitelistOutlet from "@/pages/dashboard/administrator/toko-no-limit/toko-no-limit";
import reference from "@/pages/dashboard/administrator/reference/reference";
import SelectOption from "@/pages/dashboard/administrator/select-option/select-option"
import UserPrincipal from "@/pages/dashboard/administrator/principal/user-principal"
import grupToko from "@/pages/dashboard/administrator/grup-outlet/tambah-grup-outlet"
import dataGrupToko from "@/pages/dashboard/administrator/grup-outlet/data-grup-outlet"

// REPORT
import reportSKU from "@/pages/dashboard/reports/sku/sku"

Vue.use(Router);

let routes = new Router({
  mode: "history",
  routes: [
    // PUBLIC
    {
      path: "/",
      name: "Login",
      component: login,
    },

    { path: "*", name: "Error", component: ErrorPage },
    { path: "/403", name: "403", component: P403 },

    // PRIVATE
    {
      path: "/dashboard",
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        { path: "", name: "Dashboard", component: dashboard },

        //Master
        { path: "master/perusahaan", name: "Perusahaan", component: perusahaan },
        { path: "master/barang", name: "Barang", component: barang },
        { path: "master/brand", name: "Brand", component: brand },
        { path: "master/canvas", name: "Canvas", component: canvas },
        { path: "master/depo", name: "Depo", component: depo },
        { path: "master/principal", name: "Principal", component: principal },
        { path: "master/salesman", name: "Salesman", component: salesman },
        { path: "master/segmen", name: "Segmen", component: segmen },
        { path: "master/tipe-harga", name: "TipeHarga", component: tipeHarga },        
        { path: "master/hari-efektif", name: "HariEfektif", component: hariEfektif },

        { path: "master/tim", name: "Tim", component: tim },

        //MONITORING
        { path: "monitoring/pareto", name: "MonitoringPareto", component: pareto},
        { path: "monitoring/ota", name: "MonitoringOta", component: ota},
        { path: "monitoring/pro", name: "MonitoringPro", component: pro},
        { path: "monitoring/stock-tmp", name: "MonitoringStockTmp", component: stockTmp},
        { path: "monitoring/quick-search", name: "QuickSearch", component: quickSearch},


        //SALES
        { path: "sales/toko", name: "Toko", component: toko },
        { path: "sales/penjualan", name: "Penjualan", component: penjualan },
        { path: "sales/delivery-penjualan", name: "Penjualan", component: delivery },
        { path: "sales/print-invoice", name: "PrintInvoice", component: printInvoice },
        { path: "sales/print-invoice-2", name: "PrintInvoice", component: printInvoice2 },

        { path: "sales/stock", name: "Stock", component: stock },
        { path: "sales/sales-order", name: "SalesOrder", component: salesOrder },
        { path: "sales/promo", name: "Promo", component: promo },
        { path: "sales/promo/add", name: "Add Promo", component: addPromo },
        { path: "sales/promo/:id/edit", name: "Edit Promo", component: editPromo },
        { path: "sales/sharing-promo", name: "SharingPromo", component: sharingPromo },
        { path: "sales/pembagian-promo", name: "PembagianPromo", component: pembagianPromo },
        { path: "sales/realisasi-program", name: "RealisasiProgramm", component: realisasiProgram },
        { path: "sales/realisasi-program/print", name: "PrintRealisasiPenjualan", component: printRealisasiPenjualan },
        { path: "sales/retur-penjualan", name: "ReturPenjualan", component: returPenjualan },
        { path: "sales/retur-penjualan/print", name: "PrintReturPenjualan", component: printReturPenjualan },
        { path: "sales/retur-penjualan/print-baru", name: "printReturPenjualanBaru", component: printReturPenjualanBaru },
        { path: "sales/laporan-omset-toko", name: "LaporanOmsetToko", component: omsetToko },
        { path: "sales/detail-omset-toko", name: "DetailOmsetToko", component: detailOmsetToko },
        { path: "sales/target-salesman", name: "Target Salesman", component: targetsalesman},
        { path: "sales/service-level-monitoring", name: "Service Level Monitoring", component: serviceLevelMonitoring},
        { path: "sales/target-salesman/add", name: "Tambah Target Salesman", component: formTargetSales},

        { path: "sales/rekapitulasi-do", name: "rekapitulasiDO", component: rekapitulasiDO },
        { path: "sales/print-rekapitulasiDO", name: "printRekapitulasiDO", component: printRekapitulasiDO },
        { path: "sales/laporan-aktual", name: "LaporanAktual", component: laporanAktual },
        { path: "sales/laporan-sales-to-trade", name: "LaporanSTT", component: laporanSTT },
        { path: "sales/laporan-stt-pajak", name: "LaporanSTTPajak", component: laporanSTTPajak },
        { path: "sales/laporan-sales-to-distributor", name: "LaporanSTD", component: laporanSTD },
        { path: "sales/laporan-penjualan-harian", name: "LaporanPenjualanHarian", component: laporanPenjualanHarian },
        { path: "sales/laporan-jurnal-penjualan", name: "LaporanJurnalPenjualan", component: laporanJurnalPenjualan },
        { path: "sales/print-jurnal-penjualan", name: "PrintJurnalPenjualan", component: printJurnalPenjualan },
        { path: "sales/laporan-retur-segmen", name: "LaporanReturSegmen", component: laporanReturSegmen },
        { path: "sales/print-retur-segmen", name: "printReturSegmen", component: printReturSegmen },
        { path: "sales/laporan-retur-penjualan", name: "LaporanReturPenjualan", component: laporanReturPenjualan },
        { path: "sales/export-data-penjualan", name: "ExportDataPenjualan", component: exportDataPenjualan },
        { path: "sales/posisi-penjualan", name: "PosisiDataPenjualan", component: posisiPenjualan },
        { path: "sales/laporan-ranking-barang", name: "LaporanRankingBarang", component: laporanRankingBarang },
        { path: "sales/detail-ranking-barang", name: "DetailRankingBarang", component: detailRankingBarang },
        { path: "sales/laporan-kpi", name: "LaporanKpi", component: laporanKpi },
        {
          path: "sales/laporan-salesman",
          component: Layout,
          children: [
            {
              path: 'kunjungan',
              name: "KunjunganSaleman",
              component: kunjungan
            }
          ]
        },

        // MITRA
        { path: "mitra/penjualan", name: "MitraPenjualan", component: mitraPenjualan},
        { path: "mitra/pelunasan", name: "MitraPelunasanPiutang", component: mitraPelunasanPiutang},
        { path: "mitra/data-piutang", name: "MitraDataPiutang", component: mitraDataPiutang},
        { path: "mitra/retur-penjualan", name: "MitraReturPenjualan", component: mitraReturPenjualan },
        { path: "mitra/laporan-sales-to-trade", name: "MitraSalesToTrade", component: mitraSalesToTrade },
        { path: "mitra/laporan-retur-penjualan", name: "MitraLaporanReturPenjualan", component: mitraLaporanReturPenjualan },
        { path: "mitra/laporan-aktual", name: "MitraLaporanAktual", component: mitraLaporanAktual },
        { path: "mitra/laporan-penjualan-harian", name: "MitraLaporanPenjualanHarian", component: mitraLaporanPenjualanHarian },
        { path: "mitra/rekapitulasi-penagihan", name: "MitraRekapitulasiPenagihan", component: mitraRekapitulasiPenagihan },
        { path: "mitra/posisi-stock-gudang-mitra",name: "PosisiStockGudangMitra", component: posisiStockGudangMitra,},

        // INVENTORY
        {
          path: "inventory/stock-opname",
          name: "StockOpname",
          component: StockOpname,
        },
        {
          path: "inventory/stock-opname/print",
          name: "PrintStockOpname",
          component: PrintStockOpname,
        },
        {
          path: "inventory/penerimaan-barang",
          name: "PenerimaanBarang",
          component: penerimaanBarang,
        },
        {
          path: "inventory/penerimaan-barang/print",
          name: "PrintPenerimaanBarang",
          component: printPenerimaanBarang,
        },
        {
          path: "inventory/mutasi-barang",
          name: "MutasiBarang",
          component: mutasiBarang,
        },
        {
          path: "inventory/mutasi-barang/print",
          name: "PrintMutasi",
          component: printMutasi,
        },
        {
          path: "inventory/adjustment-barang",
          name: "AdjustmentBarang",
          component: adjustmentBarang,
        },
        {
          path: "inventory/adjustment-barang/print",
          name: "PrintAdjustment",
          component: printAdjustment,
        },
        {
          path: "inventory/laporan-adjustment-barang",
          name: "LaporanAdjustmentBarang",
          component: laporanAdjustmentBarang,
        },
        { path: "inventory/driver", name: "Driver", component: driver },
        {
          path: "inventory/kendaraan",
          name: "Kendaraan",
          component: kendaraan,
        },
        { path: "inventory/gudang", name: "Gudang", component: gudang },
        {
          path: "inventory/laporan-posisi-stock",
          name: "LaporanPosisiStock",
          component: laporanPosisiStock,
        },        
        {
          path: "inventory/laporan-monitoring-stock",
          name: "LaporanMonitoringStock",
          component: laporanMonitoringStock,
        },   
        {
          path: "inventory/laporan-suggest-order",
          name: "LaporanSuggestOrder",
          component: laporanSuggestOrder,
        },
        {
          path: "inventory/riwayat-barang",
          name: "RiwayatBarang",
          component: riwayatBarang,
        },
        {
          path: "inventory/delivery-order",
          name: "DeliveryOrder",
          component: deliveryOrder,
        },
        {
          path: "inventory/posisi-stock-gudang",
          name: "PosisiStockGudang",
          component: posisiStockGudang,
        },
        {
          path: "inventory/posisi-stock-gudang/print",
          name: "PrintPosisiStockGudang",
          component: PrintPosisiStockGudang,
        },
        {
          path: "inventory/laporan-mutasi-barang",
          name: "LaporanMutasiBarang",
          component: laporanMutasiBarang,
        },

        // Distribution Plan
        {
          path: "inventory/distribution-plan",
          component: Layout,
          props: true,
          children: [
            { path: "", name: "Distribusi Penjualan", component: distributionPlanPenjualan, props: true },
            {
              path: "jadwal",
              name: "PengirimanPenjualanTerjadwal",
              component: distributionPlanPenjualanTerjadwal,
              props: true,
            },
          ],
        },
        {
          path: "inventory/distribution-plan/delivery-report",
          name: "distributionPlanDeliverReport",
          component: distributionPlan_DeliverReport,
        },
        {
          path: "inventory/report-jadwal-pengiriman",
          name: "distributionPlanReportJadwalPengiriman",
          component: distributionPlan_ReportJadwalPengiriman,
        },
        {
          path: "inventory/report-jadwal-pengiriman/print",
          name: "printReportJadwalPengiriman",
          component: printReportJadwalPengiriman,
        },
        {
          path: "inventory/realisasi-do",
          name: "distributionPlanReportRealisasiDO",
          component: distributionPlan_ReportRealisasiDO,
        },
        {
          path: "inventory/realisasi-do/print",
          name: "printReportRealisasiDO",
          component: printReportRealisasiDO,
        },
        // End Distribution Plan

        // FINANCE
        // { path: 'finance/pelunasan', name: 'Pelunasan', component: pelunasan },
        { path: "finance/data-piutang", name:"Piutang", component: piutang },
        { path: "finance/pelunasan", name: "Pelunasan", component: pelunasan },
        { path: "finance/pelunasan/print", name: "printSemuaInvoice", component: printSemuaInvoice },
        {
          path: "finance/rekapitulasi-penagihan",
          name: "RekapitulasiPenagihan",
          component: rekapitulasiPenagihan,
        },
        {
          path: "finance/klaim-retur",
          name: "ReturKlaim",
          component: returKlaim,
        },
        {
          path: "finance/invoice-note",
          name: "Invoice Note",
          component: InvoiceNote,
        },
        {
          path: "finance/form-invoice-note",
          name: "Form Invoice Note",
          component: FormInvoiceNote,
        },
        {
          path: "finance/laporan-ranking-piutang",
          name: "Laporan Ranking Piutang",
          component: laporanRankingPiutang,
        }, 
        {
          path: "finance/detail-ranking-piutang",
          name: "Detail Ranking Piutang",
          component: detailRankingPiutang,
        },  
        {
          path: "finance/laporan-gross-profit",
          name: "Laporan Gross Profit",
          component: laporanGrossProfit,
        }, 

        // PURCHASE
        {
          path: "purchase/data-pembelian",
          name: "Data Pembelian",
          component: DataPembelian,
        },
        {
          path: "purchase/tambah-pembelian",
          name: "Tambah Data Pembelian",
          component: TambahDataPembelian,
        },
        {
          path: "purchase/:id/edit-pembelian",
          name: "Edit Data Pembelian",
          component: EditDataPembelian,
        },
        {
          path: "purchase/pelunasan-pembelian",
          name: "Pelunasan Pembelian",
          component: PelunasanPembelian,
        },

        // EXTERNAL
        { path: "external/bridging", name: "Bridging", component: bridging },
        {
          path: "external/kino-bridging",
          name: "KinoBridging",
          component: kinoBridging,
        },
        {
          path: "external/export-kino",
          name: "ExportKino",
          component: exportKino,
        },
        {
          path: "external/survey-harga",
          name: "SurveyHarga",
          component: surveyHarga,
        },
        { path: "external/espt", name: "Espt", component: espt },
        { path: "external/konversi-pajak", name: "KonversiPajak", component: konversiPajak },
        {
          path: "external/import-nomor-pajak",
          name: "ImportPajak",
          component: importPajak,
        },
        {
          path: "external/rekap-import-pajak",
          name: "ImportRekapPajak",
          component: importRekapPajak,
        },
        {
          path: "external/import-order-sosro",
          name: "ImportOrderSosro",
          component: importOrderSosro,
        },
        {
          path: "external/import-order-kino",
          name: "ImportOrderKino",
          component: importOrderKino,
        },

        // ADMINISTRATOR
        {
          path: "administrator/permissions",
          name: "Permissions",
          component: permissions,
        },
        { path: "administrator/role", name: "Role", component: role },
        { path: "administrator/group-toko", name: "Tambah Grup Toko", component: grupToko },
        { path: "administrator/data-group-toko", name: "Data Grup Toko", component: dataGrupToko },
        { path: "administrator/users", name: "Users", component: users },
        { path: "administrator/whitelist-outlet", name: "Whitelist Outlet", component: WhitelistOutlet },
        { path: "administrator/reference", name: "Reference", component: reference },
        { path: "administrator/option", name: "SelectOption", component: SelectOption },
        { path: "administrator/akses-principal", name: "UserPrincipal", component: UserPrincipal },

        // REPORT
        {
          path: "report/sku",
          component: reportSKU
        }
      ],
    },
  ],
});

export default routes;
