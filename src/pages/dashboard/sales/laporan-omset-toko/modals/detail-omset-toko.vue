<template>
  <div v-if="data_detail.form">
    <div class="modal fade"
      tabindex="-1"
      style="display: block"
      role="dialog"
      v-if="data_detail.form"
      :class="data_detail.form ? 'show':''"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered " role="document">
        <div class="modal-content hidden-overflow">

            <div class="modal-body pt-3 pb-0">

              <div style="line-height: 17px" class="mb-4">
                <h3 class="m-0"> Detail Omset </h3>
                <button type="button" class="close" @click="close_detail()" v-html="ic('close')"/>
              </div>

              <div class="card-tabs mb-0">
              <!-- Cards navigation -->
                  <Skeleton type="list" :length="8" class="mt-3 bg-white m-2" v-if="loading"/>
                  <div class="card tab-pane">
                    <div class="card-body p-0">
                      <transition name="slide-up" >
                        <ul class="list-group list-stripped list-borderless" v-if="!loading" style="max-height: calc(100vh - 320px); overflow: auto">
                          <li class="list-group-item">
                            <div><b>Nama Toko</b></div> <span>{{data_detail.data.nama_toko}}</span>
                          </li>
                          <li class="list-group-item">
                            <div><b>Pemilik  </b></div> <span>{{data_detail.data.pemilik}}</span>
                          </li>
                          <li class="list-group-item">
                            <div><b>Omset  </b></div> <span>{{data_detail.data.total | currency}}</span>
                          </li>
                          <li class="list-group-item">
                            <div class="row">
                              <div class="col-6">
                                <b>Detail Penjualan</b>
                              </div>
                              <div class="col-6" style="text-align: right;">
                                <button class="btn" @click="add_item()" v-html="ic('c-down')"/> 
                              </div>
                            </div>
                          </li>
                          <li>
                            <div style="max-height: 280px; overflow: auto">
                              <table class="table">
                              <thead>
                                <th style="font-size: 12px">Brand</th>
                                <th style="font-size: 12px">Barang</th>
                                <th style="font-size: 12px; text-align: center;">Qty</th>
                                <th style="font-size: 12px; text-align: right;">Omset</th>
                              </thead>
                              <tbody>
                                <template v-for="(row, i) in data_detail.items">
                                  <tr v-if="i < limit_item">
                                    <td>{{row.nama_brand}}</td>
                                    <td>{{row.nama_barang}}</td>
                                    <td style="text-align: center;">
                                      {{Math.floor(row.total_qty)}} / 
                                      {{row.isi*(row.total_qty-Math.floor(row.total_qty))}}
                                    </td>
                                    <td style="text-align: right;">{{row.total | currency}}</td>
                                  </tr>
                                </template>
                              </tbody>
                            </table>
                            </div>
                          </li>
                        </ul>
                      </transition>
                    </div>
                  </div>
              </div>
            </div>

            <div class="px-4 py-4 text-right">
              <button type="button" class="btn btn-primary" @click="createPdf()" v-html="'Export'" />
              <button type="button" class="btn btn-white" style="margin-left: 5px;" @click="close_detail()" v-html="'Tutup'" />
            </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import helper from "@/assets/js/helper";
import {mapActions, mapState} from "vuex";
import jsPDF from "jspdf";
import "jspdf-autotable";
export default {
  name: "FormFilter",
  mixins: [helper],
  data(){
    return{
      perusahaan: [],
      depos: [],
      salesman :[],
      limit_item : 5,
      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },
    }
  },
  computed: {
     ...mapState(['loading']),
     ...mapState('omset_toko', {
      data_detail : state => state.data_detail,
      data_filter : state => state.data_filter,
    }), 
  }, 
  methods: {
    ...mapActions('omset_toko', ['getDetail']),
    add_item(){
      this.limit_item++;
    },
    close_detail(){
      this.data_detail.form=false;
      this.limit_item = 5;
    },
    createPdf(){
        let doc = new jsPDF('p'), user = JSON.parse(localStorage.user);
        let styles = { fillColor: [255, 255, 255], cellPadding: 0, lineColor: 0 }
        // title
        doc.autoTable(this.pdfHeader(''))
        doc.autoTable(
          {theme: 'plain',
            styles, margin: { top: 10, left: 10, right: 10 },
            columnStyles: {
              0: {cellWidth: 40},
            },
            body: [
              ['Nama Toko', ': '+this.data_detail.data.nama_toko],
              ['Pemilik', ': '+this.data_detail.data.pemilik],
              ['Total Omset', ': '+this.ribuan(this.data_detail.data.total)],
            ],
          }
        )
        let header = [['Brand', 'Nama Barang', 'qty','qty pcs', 'Total']], temp = [];
        for(let i = 0; i < this.data_detail.items.length; i++){
          let data = this.data_detail.items[i];
          temp.push(data.nama_brand);
          temp.push(data.nama_barang);
          temp.push(this.ribuan(data.total_qty+'|,0'));
          temp.push(this.ribuan(data.total_qty_pcs+'|,0'));
          temp.push(this.ribuan(data.total+'|,0'));
          header.push(temp);
          temp = [];
        }
        styles['cellPadding'] = 2;
        doc.autoTable({ // body
          theme: 'grid', styles: styles, margin: { top: 10, left: 10, right: 10 },
          columnStyles: {
            0: {cellWidth: 40},
          },
          body: header,
        })
        this.pdfDownload([ doc.output() ])
      },
  },
  created(){
  },
}
</script>

<style scoped>
</style>