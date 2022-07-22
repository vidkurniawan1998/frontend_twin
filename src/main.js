import 'expose-loader?jQuery!jquery' // eslint-disable-line
import 'expose-loader?$!jquery' // eslint-disable-line
import Vue from 'vue';
import axios from 'axios'
import VueAxios from 'vue-axios'

import BootstrapVue from 'bootstrap-vue';
import VueTouch from 'vue-touch';
import Trend from 'vuetrend';
import ToggleSwitch from 'vuejs-toggle-switch';

import store from './store';
import router from './Routes';
import App from './App';
import VueCryptojs from 'vue-cryptojs';
import VueAnalytics from 'vue-analytics';
import * as VueGoogleMaps from 'vue2-google-maps';
import VueSweetalert2 from "vue-sweetalert2"
import VueCurrencyFilter from 'vue-currency-filter'
import 'sweetalert2/dist/sweetalert2.min.css'
import VueCurrencyInput from 'vue-currency-input'
// COMPONENTS
import Header from '@/components/partials/header';
import Sidebar from '@/components/partials/sidebar';
import Skeleton from '@/components/skeleton/skeleton';
import Nodata from '@/components/nodata/nodata';
import Confirm from '@/components/confirmation/confirm';

// library
import Selectize from 'vue2-selectize';
import {fn} from '@/assets/js/fn.js';
import helper from '@/assets/js/helper.js';

import jsPDF from "jspdf";
import "jspdf-autotable";
import XLSX from 'xlsx';

axios.defaults.baseURL = process.env.VUE_APP_API_URL
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'

if (localStorage.token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token
}

Vue.use(VueCurrencyFilter,
    {
      symbol : '',
      thousandsSeparator: '.',
      fractionCount: 0,
      fractionSeparator: ',',
      symbolPosition: 'front',
      symbolSpacing: true,
      avoidEmptyDecimals: undefined,
    }
)

Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);
Vue.use(VueTouch);
Vue.use(Trend);
Vue.use(ToggleSwitch);
Vue.use(VueCryptojs);
Vue.use(VueSweetalert2);
Vue.use(VueAnalytics, {
  id: 'UA-149567923-1',
  router
})

const vueInputCurrencyOptions = {
  globalOptions: {
    currency: { prefix: 'Rp '},
    precision: 0,
    locale: 'id'
  }
}

Vue.use(VueCurrencyInput, vueInputCurrencyOptions)

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDULBwyHjobEGU48V-YHmwXYGbCFLIWWso', // jangkar.developer@gmail.com
    // v: 'OPTIONAL VERSION NUMBER',
    // libraries: 'places', //// If you need to use place input
  }
});

Vue.prototype.$fn = fn;

Vue.mixin({
  components: {
    Selectize, Sidebar, Header, Skeleton, Nodata, Confirm
  },

  data(){
    return {
      secretKey: '',

      selectConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },

      version: '2.1.11'
    }
  },

  mixin: [helper],

  methods: {
    // logout(){
    //   localStorage.clear()
    //   this.$router.push('/')
    // },

    encrypt(string, key){
      return this.CryptoJS.AES.encrypt(string, key).toString();
    },

    decrypt(string, key, utf8 = true){
      let dec = this.CryptoJS.AES.decrypt(string, key);
      return utf8 ? dec.toString(this.CryptoJS.enc.Utf8) : dec.toString()
    },

    getAuth(get){
      let token = localStorage.token;

      try {
        let decrypt = this.decrypt(token, this.secretKey), // get token (string)
            split = JSON.parse(decrypt).split('|') // split by |

        return get == 'date' ? split[0] : JSON.parse(split[1]);
      } catch (err) {  }
    },


    // jspdf styling
    pdfHeader(title = ''){
      return {
        theme: 'plain',
        styles: { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0 },
        margin: { top: 10, left: 10, right: 10 },
        columnStyles: { 1: { halign: 'center', fontSize: 18 } },

        head: [['PT. Kembar Putra Makmur','']],

        body: [
          ['Jl. Kargo Permai No. 77 Ubung Kaja, Denpasar Bali', { content: title, rowSpan: 2, styles: { halign: 'right' } }],
          ['Phone (0361) 430858-430854, Fax (0361) 430855-430857', ],
          ['Indonesia'],
        ],
      }
    },

    pdfDownload(arr = []){
      let blobPDF = new Blob(arr, { type : 'application/pdf'});
      let blobUrl = URL.createObjectURL(blobPDF);
      window.open(blobUrl);
    },

    createPdf(params){
      let doc = new jsPDF('p'), styles = { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0 }
      doc.autoTable(this.pdfHeader(params == null ? '' : params.title))

      let header = params.header

      if(header != null){ // header
        doc.autoTable({
          theme: header.theme == null ? 'plain' : header.theme,
          styles: styles,
          margin: { top: 10, left: 10, right: 10 },
          body: header.body == null ? [] : header.body,
        })
      }

      let body = params.body

      if(body != null){ // body
        doc.autoTable({
          theme: body.theme == null ? 'grid' : body.theme,
          styles: { fillColor: [255, 255, 255], cellPadding: 2, lineColor: 0 },
          margin: { top: 10, left: 10, right: 10 },
          body: body.data == null ? [] : body.data,
        })
      }

      let blobPDF = new Blob([ doc.output() ], { type : 'application/pdf'});
      let blobUrl = URL.createObjectURL(blobPDF);
      window.open(blobUrl);
    },

    createExcel(params, raw = true){
      var data = XLSX.utils.json_to_sheet(params.data, { raw: raw, cellDates: true, skipHeader: false})
      var wb = XLSX.utils.book_new() // make Workbook of Excel
      XLSX.utils.book_append_sheet(wb, data, 'sheet') // sheet is name of Worksheet
      XLSX.writeFile(wb, params.filename+'.xlsx')
    }

  },

  created(){

  },


})

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
