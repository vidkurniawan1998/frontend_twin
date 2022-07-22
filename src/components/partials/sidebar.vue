<template>
  <aside class="navbar navbar-vertical navbar-expand-lg navbar-dark" style="overflow-x: hidden">
    <div class="container">
      <button class="navbar-toggler" :class="navbar.collapsed ? 'collapsed' : ''" type="button" :aria-expanded="navbar.collapsed" @click="_navbar()">
        <span class="navbar-toggler-icon"></span>
      </button>

      <router-link to="/dashboard" class="navbar-brand navbar-brand-autodark">
        <img :src="asset('nav-white-logo.png')" alt="" class="navbar-brand-image" />
      </router-link>

      <!-- SEARH MENU -->
      <div class="find-menu" @click="_search">
        <i class="fe fe-search"></i>
      </div>

      <transition name="fade">
        <div class="form-find-menu" v-show="isSearch" @click="$event.target.classList.contains('form-find-menu') ? (isSearch = false) : true">
          <div
            class="text-white"
            style="
              position: absolute;
              left: 50%;
              transform: translate(-50%, 20px);
            "
            v-if="keyword.length > 1 && filter.length > 0"
          >
            Tekan tab untuk fokus ke hasil pencarian
          </div>

          <div class="input-center" :class="keyword.length > 1 ? 'filled' : ''">
            <div class="input-icon">
              <span class="input-icon-addon">
                <i class="fe fe-search"></i>
              </span>
              <input
                type="text"
                class="form-control form-control-rounded"
                :class="keyword.length > 0 ? 'filled' : ''"
                ref="search"
                placeholder="Ketik nama menu"
                v-model="keyword"
                autofocus
              />
            </div>

            <div class="result" v-if="keyword.length > 1">
              <li class="list-link" v-for="(li, i) in filter" :key="i">
                <router-link :to="li.link">
                  <i class="fe fe-external-link mr-1 text-primary"></i>
                  {{ li.text }}
                </router-link>
              </li>
            </div>
          </div>
        </div>
      </transition>

      <!-- /SEARH MENU -->

      <div class="collapse navbar-collapse" :class="navbar.collapsed ? 'show' : ''" style="transition: 0.5s">
        <ul class="navbar-nav pt-lg-3">
          <li
            v-for="(item, i) in menus"
            :key="i"
            class="nav-item"
            :class="item.submenu != null ? 'dropdown' : $route.path.split('/').pop() == item.group ? 'active' : ''"
          >
            <div class="text-muted mt-2" v-if="item.sparate">
              <span class="small" style="padding: 0 13px"> LAINNYA </span>
              <div style="border-top: 1px rgba(0, 0, 0, 0.3) solid" />
            </div>

            <router-link
              class="nav-link"
              :to="item.link != null ? item.link : ''"
              :class="item.submenu != null ? 'drop down-toggle' : ''"
              @click.native="item.link == null ? _collapsed(item) : null"
            >
              <span class="nav-link-title" style="width: 100%">
                <i class="fe fe-chevron-right float-right mt-1 d-toggle" :class="item.text == collapsed ? 'collapsed' : ''" v-if="item.submenu != null"></i>
                <i class="la la-lg mr-2" :class="item.icon"></i> {{ item.text }}
              </span>
            </router-link>

            <ul
              class="dropdown-menu"
              :class="item.text == collapsed || (item.text == collapsed && $route.path.split('/').indexOf(item.group) > -1) ? navbar.show : ''"
              v-if="item.submenu != null"
            >
              <li v-for="(child, l) in item.submenu" :key="l" :class="$route.path.split('/').pop() == child.active ? 'active' : ''">
                <router-link class="dropdown-item" :to="child.link" v-html="child.text" />
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script>
import helper from "@/assets/js/helper.js";

export default {
  name: "Sidebar",
  components: {},
  mixins: [helper],
  data() {
    return {
      navbar: {
        collapsed: false,
        show: "show-7",
      },

      collapsed: null,
      keyword: "",
      isSearch: false,
      filter: [],

      menus: [
        {
          icon: "la-stream",
          text: "Dashboard",
          link: "/dashboard",
          group: "dashboard",
          permission: "*",
        },

        // {
        //   icon: 'la-users',
        //   text: 'HRM',
        //   group: 'users',
        //   submenu: [
        //     {
        //       text: 'Data Employee',
        //       link: '/',
        //       active: 'team'
        //     },
        //     {
        //       text: 'List Memo',
        //       link: '/',
        //       active: 'client'
        //     },
        //     {
        //       text: 'Birthday List',
        //       link: '/',
        //       active: 'client'
        //     },
        //   ]
        // },

        // {
        //   icon: 'la-file-alt',
        //   text: 'General Affair',
        //   group: 'users',
        //   submenu: [
        //     {
        //       text: 'Aset',
        //       link: '/',
        //       active: 'team'
        //     },
        //     {
        //       text: 'Jatuh Tempo Kendaraan',
        //       link: '/',
        //       active: 'client'
        //     },
        //     {
        //       text: 'Maintenance Aset',
        //       link: '/',
        //       active: 'client'
        //     },
        //   ]

        // },
        {
          icon: "fa-database",
          text: "Master",
          group: "master",
          permission: "group menu master",
          submenu: [
            {
              text: "Perusahaan",
              link: "/dashboard/master/perusahaan",
              active: "perusahaan",
              permission: "menu perusahaan",
            },
            {
              text: "Barang",
              link: "/dashboard/master/barang",
              active: "barang",
              permission: "menu barang",
            },
            {
              text: "Principal",
              link: "/dashboard/master/principal",
              active: "principal",
              permission: "menu principal",
            },
            {
              text: "Brand",
              link: "/dashboard/master/brand",
              active: "brand",
              permission: "menu brand",
            },
            {
              text: "Segmen",
              link: "/dashboard/master/segmen",
              active: "segmen",
              permission: "menu segmen",
            },
            {
              text: "Canvas",
              link: "/dashboard/master/canvas",
              active: "canvas",
              permission: "menu canvass",
            },
            {
              text: "Depo",
              link: "/dashboard/master/depo",
              active: "depo",
              permission: "menu depo",
            },
            {
              text: "Salesman",
              link: "/dashboard/master/salesman",
              active: "salesman",
              permission: "menu salesman",
            },
            {
              text: "Tim",
              link: "/dashboard/master/tim",
              active: "tim",
              permission: "menu tim",
            },
            {
              text: "Tipe Harga",
              link: "/dashboard/master/tipe-harga",
              active: "tipe-harga",
              permission: "menu tipe harga",
            },
            {
              text: "Hari Efektif",
              link: "/dashboard/master/hari-efektif",
              active: "hari-efektif",
              permission: "import hari efektif",
            },
          ],
        },
        {
          icon: "fa-desktop",
          text: "Monitoring",
          group: "monitoring",
          permission: "menu group monitoring",
          submenu: [
            {
              text: "Monitoring Pareto",
              link: "/dashboard/monitoring/pareto",
              active: "monitoring-pareto",
              permission: "menu monitoring pareto",
            },
            {
              text: "Monitoring Ota",
              link: "/dashboard/monitoring/ota",
              active: "monitoring-ota",
              permission: "menu monitoring ota",
            },
            {
              text: "Monitoring Pro",
              link: "/dashboard/monitoring/pro",
              active: "monitoring-pro",
              permission: "menu monitoring pro",
            },
            {
              text: "Monitoring Stock Tmp",
              link: "/dashboard/monitoring/stock-tmp",
              active: "monitoring-tmp",
              permission: "menu monitoring stock tmp",
            },
            {
              text: "Quick Searching",
              link: "/dashboard/monitoring/quick-search",
              active: "quick-search",
              permission: "menu quick search",
            },
          ],
        },
        {
          icon: "la-tags",
          text: "Sales",
          group: "sales",
          permission: "menu group sales",
          submenu: [
            {
              text: "Toko",
              link: "/dashboard/sales/toko",
              active: "toko",
              permission: "menu toko",
            },
            {
              text: "Penjualan",
              link: "/dashboard/sales/penjualan",
              active: "penjualan",
              permission: "menu penjualan",
            },
            {
              text: "Delivery Penjualan",
              link: "/dashboard/sales/delivery-penjualan",
              active: "delivery-penjualan",
              permission: "tanggal terima penjualan",
            },
            {
              text: "Retur Penjualan",
              link: "/dashboard/sales/retur-penjualan",
              active: "retur-penjualan",
              permission: "menu retur penjualan",
            },
            {
              text: "Stock",
              link: "/dashboard/sales/stock",
              active: "stock",
              permission: "menu stock barang",
            },
            // { text: 'Item Maintenance', link: '/', active: '' },
            // { text: 'Price List', link: '/', active: '' },
            // { text: 'Customers', link: '/', active: '' },
            {
              text: "Promo",
              link: "/dashboard/sales/promo",
              active: "promo",
              permission: "menu promo",
            },
            {
              text: "Sharing Promo",
              link: "/dashboard/sales/sharing-promo",
              active: "sharing-promo",
              permission: "menu sharing promo",
            },
            {
              text: "Pembagian Promo",
              link: "/dashboard/sales/pembagian-promo",
              active: "pembagian-promo",
              permission: "menu laporan pembagian promo",
            },
            {
              text: "Posisi Penjualan",
              link: "/dashboard/sales/posisi-penjualan",
              active: "posisi-penjualan",
              permission: "posisi penjualan",
            },
            {
              text: "Realisasi Program",
              link: "/dashboard/sales/realisasi-program",
              active: "realisasi-program",
              permission: "*",
            },
            {
              text: "Rekapitulasi DO",
              link: "/dashboard/sales/rekapitulasi-do",
              active: "rekapitulasi-do",
              permission: "*",
            },
            {
              text: "Target Salesman",
              link: "/dashboard/sales/target-salesman",
              active: "target-salesman",
              permission: "menu target salesman",
            },
            {
              text: "Service Level Monitoring",
              link: "/dashboard/sales/service-level-monitoring",
              active: "service-level-monitoring",
              permission: "menu service level monitoring",
            },
            {
              text: "Laporan Aktual",
              link: "/dashboard/sales/laporan-aktual",
              active: "laporan-aktual",
              permission: "menu laporan aktual",
            },
            {
              text: "Laporan Sales To Trade",
              link: "/dashboard/sales/laporan-sales-to-trade",
              active: "laporan-sales-to-trade",
              permission: "menu laporan stt",
            },
            {
              text: "Laporan STT Pajak",
              link: "/dashboard/sales/laporan-stt-pajak",
              active: "laporan-stt-pajak",
              permission: "menu laporan stt",
            },
            {
              text: "Laporan Sales To Distributor",
              link: "/dashboard/sales/laporan-sales-to-distributor",
              active: "laporan-sales-to-distributor",
              permission: "menu laporan std",
            },
            {
              text: "Laporan Penjualan Harian",
              link: "/dashboard/sales/laporan-penjualan-harian",
              active: "laporan-penjualan-harian",
              permission: "menu laporan penjualan harian",
            },
            {
              text: "Laporan Jurnal Penjualan",
              link: "/dashboard/sales/laporan-jurnal-penjualan",
              active: "laporan-jurnal-penjualan",
              permission: "laporan jurnal penjualan",
            },
            {
              text: "Laporan Retur Penjualan",
              link: "/dashboard/sales/laporan-retur-penjualan",
              active: "laporan-retur-penjualan",
              permission: "menu laporan retur penjualan",
            },
            {
              text: "Laporan Retur Segmen",
              link: "/dashboard/sales/laporan-retur-segmen",
              active: "laporan-retur-segmen",
              permission: "menu laporan retur segmen",
            },
            {
              text: "Laporan Omset Toko",
              link: "/dashboard/sales/laporan-omset-toko",
              active: "laporan-omset-toko",
              permission: "menu laporan omset toko",
            },
            {
              text: "Laporan Ranking Barang",
              link: "/dashboard/sales/laporan-ranking-barang",
              active: "laporan-ranking-barang",
              permission: "menu laporan ranking barang",
            },
            {
              text: "Laporan KPI",
              link: "/dashboard/sales/laporan-kpi",
              active: "laporan-kpi",
              permission: "menu laporan kpi",
            },
            {
              text: "Export Data Penjualan",
              link: "/dashboard/sales/export-data-penjualan",
              active: "export-data-penjualan",
              permission: "menu laporan export penjualan",
            },
            {
              text: "Laporan Kunjungan Salesman",
              link: "/dashboard/sales/laporan-salesman/kunjungan",
              active: "kunjungan",
              permission: "menu kunjungan sales",
            },
          ],
        },
        {
          icon: "la-handshake",
          text: "Mitra",
          group: "mitra",
          permission: "group mitra",
          submenu: [
            {
              text: "Penjualan",
              link: "/dashboard/mitra/penjualan",
              active: "penjualan",
              permission: "*",
            },
            {
              text: "Retur Penjualan",
              link: "/dashboard/mitra/retur-penjualan",
              active: "retur-penjualan",
              permission: "*",
            },
            {
              text: "Pelunasan Piutang",
              link: "/dashboard/mitra/pelunasan",
              active: "pelunasan",
              permission: "*",
            },
            {
              text: "Laporan Piutang",
              link: "/dashboard/mitra/data-piutang",
              active: "data-piutang",
              permission: "*",
            },
            {
              text: "Rekapitulasi Penagihan",
              link: "/dashboard/mitra/rekapitulasi-penagihan",
              active: "rekapitulasi-penagihan",
              permission: "*",
            },
            {
              text: "Laporan Aktual",
              link: "/dashboard/mitra/laporan-aktual",
              active: "laporan-aktual",
              permission: "*",
            },
            {
              text: "Laporan Sales To Trade",
              link: "/dashboard/mitra/laporan-sales-to-trade",
              active: "laporan-sales-to-trade",
              permission: "*",
            },
            {
              text: "Laporan Retur Penjualan",
              link: "/dashboard/mitra/laporan-retur-penjualan",
              active: "laporan-retur-penjualan",
              permission: "*",
            },
            {
              text: "Laporan Penjualan Harian",
              link: "/dashboard/mitra/laporan-penjualan-harian",
              active: "laporan-penjualan-harian",
              permission: "*",
            },
            {
              text: "Posisi Stock Gudang",
              link: "/dashboard/mitra/posisi-stock-gudang-mitra",
              active: "posisi-stock-gudang-mitra",
              permission: "menu posisi stock gudang mitra",
            },
          ]
        },
        {
          icon: "la-money-bill",
          text: "Purchase",
          group: "purchase",
          permission: "menu group purchase",
          submenu: [
            {
              text: "Pembelian",
              link: "/dashboard/purchase/data-pembelian",
              active: "data-pembelian",
              permission: "*",
            },
            {
              text: "Pelunasan",
              link: "/dashboard/purchase/pelunasan-pembelian",
              active: "pelunasan-pembelian",
              permission: "menu pelunasan pembelian",
            },
          ]
        },
        {
          icon: "la-wallet",
          text: "Finance",
          group: "finance",
          permission: "menu group finance",
          submenu: [
            {
              text: "Data Piutang",
              link: "/dashboard/finance/data-piutang",
              active: "data-piutang",
              permission: "menu pelunasan penjualan",
            },
            {
              text: "Pelunasan Piutang",
              link: "/dashboard/finance/pelunasan",
              active: "pelunasan",
              permission: "*",
            },
            {
              text: "Rekapitulasi Penagihan",
              link: "/dashboard/finance/rekapitulasi-penagihan",
              active: "rekapitulasi-penagihan",
              permission: "*",
            },
            {
              text: "Laporan Klaim Retur",
              link: "/dashboard/finance/klaim-retur",
              active: "klaim-retur",
              permission: "laporan klaim retur",
            },
            {
              text: "Laporan Ranking Piutang",
              link: "/dashboard/finance/laporan-ranking-piutang",
              active: "ranking-piutang",
              permission: "menu laporan ranking piutang",
            },
            {
              text: "Invoice Note",
              link: "/dashboard/finance/invoice-note",
              active: "invoice-note",
              permission: "menu invoice note",
            },
            {
              text: "Gross Profit",
              link: "/dashboard/finance/laporan-gross-profit",
              active: "gross-profit",
              permission: "menu gross profit",
            },
            // { text: 'Sales Invocies List', link: '#', },
            // { text: 'AR Listing', link: '#', },
          ],
        },

        {
          icon: "la-archive",
          text: "Inventory",
          group: "inventory",
          permission: "*",
          submenu: [
            {
              text: "Stock Opname",
              link: "/dashboard/inventory/stock-opname",
              active: "stock-opname",
              permission: "menu stock opname",
            },
            {
              text: "Penerimaan Barang",
              link: "/dashboard/inventory/penerimaan-barang",
              active: "penerimaan-barang",
              permission: "menu penerimaan barang",
            },
            {
              text: "Gudang",
              link: "/dashboard/inventory/gudang",
              active: "gudang",
              permission: "menu gudang",
            },
            {
              text: "Distribution Plan",
              link: "/dashboard/inventory/distribution-plan",
              active: "distribution-plan",
              permission: "*",
            },
            {
              text: "Delivery Report",
              link: "/dashboard/inventory/distribution-plan/delivery-report",
              active: "delivery-report",
              permission: "*",
            },
            {
              text: "Rekapitulasi DO",
              link: "/dashboard/inventory/report-jadwal-pengiriman/",
              active: "report-jadwal-pengiriman",
              permission: "*",
            },
            {
              text: "Realisasi DO",
              link: "/dashboard/inventory/realisasi-do/",
              active: "realisasi-do",
              permission: "*",
            },
            // {
            //   text: "Delivery Order",
            //   link: "/dashboard/inventory/delivery-order",
            //   active: "delivery-order",
            //   permission: "*",
            // },
            {
              text: "Driver",
              link: "/dashboard/inventory/driver",
              active: "driver",
              permission: "menu driver",
            },
            {
              text: "Kendaraan",
              link: "/dashboard/inventory/kendaraan",
              active: "kendaraan",
              permission: "menu kendaraan",
            },
            {
              text: "Mutasi Barang",
              link: "/dashboard/inventory/mutasi-barang",
              active: "mutasi-barang",
              permission: "menu mutasi barang",
            },
            {
              text: "Riwayat Barang",
              link: "/dashboard/inventory/riwayat-barang",
              active: "riwayat-barang",
              permission: "menu riwayat barang",
            },
            {
              text: "Adjusment Barang",
              link: "/dashboard/inventory/adjustment-barang",
              active: "adjustment-barang",
              permission: "menu adjustment barang",
            },
            {
              text: "Posisi Stock Gudang",
              link: "/dashboard/inventory/posisi-stock-gudang",
              active: "posisi-stock-gudang",
              permission: "menu posisi stock gudang",
            },
            {
              text: "Laporan Posisi Stock",
              link: "/dashboard/inventory/laporan-posisi-stock",
              active: "laporan-posisi-stock",
              permission: "menu laporan posisi stock",
            },
            {
              text: "Laporan Monitoring Stock",
              link: "/dashboard/inventory/laporan-monitoring-stock",
              active: "laporan-monitoring-stock",
              permission: "menu laporan monitoring stock",
            },
            {
              text: "Laporan Suggest Order",
              link: "/dashboard/inventory/laporan-suggest-order",
              active: "laporan-suggest-order",
              permission: "menu laporan suggest order",
            },
            {
              text: "Laporan Mutasi Barang",
              link: "/dashboard/inventory/laporan-mutasi-barang",
              active: "laporan-mutasi-barang",
              permission: "menu laporan mutasi barang",
            },
            {
              text: "Laporan Adjusment Barang",
              link: "/dashboard/inventory/laporan-adjustment-barang",
              active: "laporan-adjustment-barang",
              permission: "menu laporan adjustment",
            },
          ],
        },

        {
          icon: "la-address-card",
          text: "Administrator",
          group: "administrator",
          permission: "menu group administrator",
          submenu: [
            {
              text: "User",
              link: "/dashboard/administrator/users",
              active: "users",
              permission: "menu user",
            },
            {
              text: "Role",
              link: "/dashboard/administrator/role",
              active: "role",
              permission: "menu role",
            },
            {
              text: "Permissions",
              link: "/dashboard/administrator/permissions",
              active: "permissions",
              permission: "menu permission",
            },
            {
              text: "Whitelist Outlet",
              link: "/dashboard/administrator/whitelist-outlet",
              active: "whitelist-outlet",
              permission: "menu toko tanpa limit",
            },
            {
              text: "Group Toko",
              link: "/dashboard/administrator/group-toko",
              active: "group-toko",
              permission: "*",
            },
            {
              text: "Reference",
              link: "/dashboard/administrator/reference",
              active: "reference",
              permission: "menu reference",
            },
            {
              text: "Select Option",
              link: "/dashboard/administrator/option",
              active: "reference",
              permission: "menu option",
            },
            {
              text: "Akses Principal",
              link: "/dashboard/administrator/akses-principal",
              active: "akses-principal",
              permission: "menu akses principal",
            },
          ],
        },

        {
          icon: "la-terminal",
          text: "External App",
          group: "external",
          permission: "*",
          submenu: [
            {
              text: "Briging",
              link: "/dashboard/external/bridging",
              active: "bridging",
              permission: "*",
            },
            {
              text: "Kino Briging",
              link: "/dashboard/external/kino-bridging",
              active: "kino-bridging",
              permission: "menu kino bridging",
            },
            {
              text: "Export Kino",
              link: "/dashboard/external/export-kino",
              active: "export-kino",
              permission: "*",
            },
            {
              text: "Survey Harga",
              link: "/dashboard/external/survey-harga",
              active: "survey-harga",
              permission: "menu survey harga",
            },
            {
              text: "ESPT",
              link: "/dashboard/external/espt",
              active: "espt",
              permission: "*",
            },
            {
              text: "Konversi Pajak",
              link: "/dashboard/external/konversi-pajak",
              active: "konversi-pajak",
              permission: "*",
            },
            {
              text: "Import Nomor Pajak",
              link: "/dashboard/external/import-nomor-pajak",
              active: "import-nomor-pajak",
              permission: "*",
            },
            {
              text: "Rekap Import Nomor Pajak",
              link: "/dashboard/external/rekap-import-pajak",
              active: "rekap-import-pajak",
              permission: "*",
            },
            {
              text: "Import Order Sosro",
              link: "/dashboard/external/import-order-sosro",
              active: "import-order-sosro",
              permission: "import order sosro",
            },
            {
              text: "Import Order Kino",
              link: "/dashboard/external/import-order-kino",
              active: "import-order-kino",
              permission: "*",
            },
          ],
        },

        {
          icon: "la-gear",
          text: "Pengaturan",
          link: "#",
          group: "setting",
          sparate: true,
        },
      ],

      keydown: [],
    };
  },

  methods: {
    _collapsed(item) {
      if (item.submenu != null) {
        this.collapsed = this.collapsed == item.text ? null : item.text;
      }

      this.navbar.show = item.submenu == null ? "" : "show-" + item.submenu.length;
    },

    _navbar() {
      this.navbar.collapsed = !this.navbar.collapsed;
    },

    _setSideBar(path) {
      let group = path.split("/")[2],
        menus = this.menus;
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].group == group) {
          this._collapsed(menus[i]);
        }
      }
    },

    _search() {
      this.isSearch = true;
      this.keyword = "";

      setTimeout(() => {
        this.$refs.search.focus();
      }, 200);
    },
  },

  mounted() {
    this._setSideBar(this.$route.path);

    let newMenus = [];

    // check permissions
    let permissions = JSON.parse(localStorage.permissions),
      menus = this.menus;
    let permissTLC = permissions.map((x) => x.toLowerCase());

    for (let i = 0; i < menus.length; i++) {
      if (menus[i].permission != "*") {
        if (permissTLC.indexOf(menus[i].permission) > -1) {
          newMenus.push(menus[i]);
        }
      } else {
        newMenus.push(menus[i]);
      }
    }

    for (let i = 0; i < newMenus.length; i++) {
      let submenus = newMenus[i].submenu,
        newSubmenus = [];

      if (submenus != null) {
        for (let l = 0; l < submenus.length; l++) {
          if (submenus[l].permission != null) {
            if (permissTLC.indexOf(submenus[l].permission) > -1 || submenus[l].permission == "*") {
              // console.log(submenus[l].permission)
              newSubmenus.push(submenus[l]);
            }
          }
        }

        // console.log(newMenus[i])
        newMenus[i].submenu = newSubmenus;
        newSubmenus = [];
      }
    }

    this.menus = newMenus;

    // hapus parent menu yang tidak memiliki submenu
    for (let i = 0; i < newMenus.length; i++) {
      let submenus = newMenus[i].submenu;

      if (submenus != null) {
        if (submenus.length == 0) {
          this.menus.splice(i, 1);
        }
      }
    }

    // ctrl + f
    document.addEventListener("keydown", (e) => {
      let keys = [91, 70];

      if (keys.indexOf(e.keyCode) > -1) {
        this.keydown.push(e.keyCode);
      }

      if (this.keydown.length == 2) {
        e.preventDefault();
        this._search();
      }
    });

    document.addEventListener("keyup", (e) => {
      this.keydown = [];
    });
  },

  created() {},

  computed: {},

  watch: {
    $route(to, from) {
      this.collapsed = null;
      this._setSideBar(to.path);
      this.isSearch = false;
    },

    keyword: function(key) {
      this.filter = [];

      let menus = [];

      for (let i = 0; i < this.menus.length; i++) {
        let submenu = this.menus[i].submenu;

        if (submenu != null) {
          for (let l = 0; l < submenu.length; l++) {
            menus.push(submenu[l]);
          }
        }
      }

      for (let i = 0; i < menus.length; i++) {
        if (
          menus[i].text
            .toString()
            .toLowerCase()
            .includes(key.toLowerCase())
        ) {
          this.filter.push(menus[i]);
        }
      }
    },
  },
};
</script>

<style src="./sidebar.scss" lang="scss" scoped />
