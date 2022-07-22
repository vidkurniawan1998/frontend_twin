<template>
  <div v-if="backdrop">
    <div
      class="modal fade"
      :class="modal.open ? 'show' : ''"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
      @click="dismiss ? $event.target.classList.contains('modal') ? close() : true : true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">{{config.title == null ? '&nbsp;' : config.title}}</h5>
            <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
          </div>

            <div class="modal-body pt-3">
              
              <form action="" @submit.prevent="_search">
                <div class="row">
                  <div class="col-6" style="width: calc(100% - 281px)">
                    <div class="form-group">
                        <label class="form-label">Tim</label>
                        <selectize v-model="data.id_salesman" data-placeholder="Pilih tim" required>
                            <option :value="d.id" v-for="(d, i) in salesman" :key="i">{{d.tim}} - {{d.nama_salesman}}</option>
                        </selectize>
                    </div>
                  </div>
                  <div class="col-4" style="width: 200px">
                    <div class="form-group">
                      <label class="form-label">Tanggal</label>
                      <input type="date" v-model="data.date" class="form-control">
                    </div>
                  </div>
                  <div class="col-auto text-right">
                    <div class="form-group">
                      <label class="form-label">&nbsp;</label>
                      <button class="btn btn-primary" :disabled="request || loading" v-html="ic('search')"></button>
                    </div>
                  </div>
                </div>
              </form>

              <div style="min-height: 200px">
                <Skeleton type="table" :length="5" class="mt-3 bg-white" v-if="loading" style="overflow: hidden"/>

                <div class="card bg-white" v-if="!loading && invoices.length > 0">
                  <table class="table table-vcenter table-hover card-table table-striped">
                    <thead>
                        <tr>
                            <th>No. PO</th>
                            <th>No. Invoice</th>
                            <th>Toko</th>
                            <th class="text-right pos-relative"> 
                              <label class="form-check" style="position: absolute; top: 4px; right: 10px">
                                <input class="form-check-input" type="checkbox" :checked="invoices.length == checkeds.length" @click="checkAll">
                                <span class="form-check-label"></span>
                              </label>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(d,i) in invoices" :key="i">
                            <td> {{d.id}} </td>
                            <td>{{d.no_invoice}}</td>
                            <td>[{{d.toko.no_acc}}] {{d.toko.nama_toko}}</td>
                            <td class="text-right pos-relative"> 
                              <label class="form-check" style="position: absolute; top: 8px; right: 10px">
                                <input class="form-check-input" type="checkbox" @click="checkInvoice(d.id)" :checked="checkeds.indexOf(d.id) > -1">
                                <span class="form-check-label"></span>
                              </label>
                            </td>
                        </tr>

                    </tbody>
                  </table>
                </div>

              </div>

            </div>

            <div class="px-4 py-3 text-right" style="border-top: 1px #ddd solid">
              <strong class="float-left mt-1" v-html="'TOTAL INVOICE : '+invoices.length" v-if="invoices.length > 0"></strong>

              <strong class="float-left mt-1 ml-3 text-success" v-if="success.length > 0" v-html="success.length+''+ic('check')"></strong>
              <strong class="float-left mt-1 ml-2 text-danger" v-if="failed.length > 0" v-html="failed.length+''+ic('close')"></strong>

              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
              <button type="button" class="btn btn-primary ml-3"  @click="download" :disabled="isDownload || checkeds.length == 0" v-html="isDownload ? spin()+' Download '+checkeds.length+' Invoice' : ic('download')+' Download Invoice'" />
            </div>

        </div>
      </div>
    </div>

    <div class="modal-backdrop fade" :class="modal.open ? 'show' : ''" />
  </div>
</template>

<script>
import helper from "@/assets/js/helper.js";

export default {
  name: "Modal",
  props: {
    config: {
      default: {
        view: false,
        title: "Modal Title"
      }
    },
    initData: null,
    isSubmit: {default: false},
    dismiss: {default: true}
  },

  mixins: [helper],

  data() {
    return {
      backdrop: false,
      modal: {
        open: false,
        formNav: 0
      },

      request: true, loading: false, isDownload: false,
      salesman: [], invoices: [], filename: null,

      data: {
        id_salesman: null,
        date: '2019-11-01'//this.dateTime('ymd')
      },

      checkeds: [], inPreview: [], success: [], failed: []
    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    _getSalesman(){
      this.request = true

      this.axios.get('salesman').then(res => {
        this.salesman = res.data.data;
        this.request = false
      }).catch(err => {
        this.onError(err);
        this.request = false
      });
    },

    _search(){
      this.loading = true
      this.axios('penjualan/list/invoice_pdf?id_salesman='+this.data.id_salesman+'&date='+this.data.date).then(res => {
        this.invoices = res.data.data;

        // set filename for download pdf
        this.filename = res.data.nama_tim+'_inv_penjualan_'
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.onError(err)
      })
    },

    checkInvoice(npo){
      // check exist npo in checkeds
      this.checkeds.indexOf(npo) > -1 ? this.checkeds.splice(this.checkeds.indexOf(npo), 1) :this.checkeds.push(npo)
    },

    checkAll(){
      let npos = [];
      this.invoices.forEach(f => { npos.push(f.id); })
      this.checkeds = this.checkeds.length == this.invoices.length ? [] : npos
    },

    async download(){
      this.isDownload = true; this.success = []; this.failed = [];
      let checkeds = this.checkeds;

      let blobs = []

      for(let i = 0; i < checkeds.length; i++){

        let url = 'penjualan_pdf/'+checkeds[i];
        await this.axios({method: 'get', url: url, responseType: 'arraybuffer'}).then( async (res) => {

            let filename = this.filename+''+checkeds[i]+'_'+this.dateTime('ymd')+'_'+this.dateTime();
            
            let blob = new Blob([res.data], { type: 'application/pdf' })
            let link = document.createElement('a')

            // console.log(typeof res.data)
            // console.log(res.data)

            link.href = window.URL.createObjectURL(blob)
            link.download = filename+'.pdf'
            link.click()

            blobs.push(res.data)

            this.success.push(checkeds[i])
            
        }).catch(err => {
            this.failed.push(checkeds[i])
            this.catch(this, err.response)
        })

        if(i == this.checkeds.length - 1){
          this.isDownload = false
        }

      }
    },
    

  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
          if(this.salesman.length == 0) this._getSalesman()
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    initData: function(data) { },

  }
};
</script>

<style lang="scss" src="../pelunasan.scss" scoped/>
