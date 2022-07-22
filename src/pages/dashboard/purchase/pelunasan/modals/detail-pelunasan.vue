<template>
  <div v-if="data_detail.form">
    <div
      class="modal fade"
      :class="data_detail.form ? 'show' : ''"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-hidden="true" 
    >

      <div class="modal-dialog modal-lg modal-dialog-centered " role="document">
        <div class="modal-content hidden-overflow">

            <div class="modal-body pt-3 pb-0">

              <div style="line-height: 17px" class="mb-4">
                <h3 class="m-0"> Detail Pelunasan </h3>
               <!--  {{data_detail}} -->
                <div> 
                  <span>
                    {{data_detail.data[0]}}
                    <span class="bg-success badge" v-if="data_detail.data[data_detail.data.length-1]=='lunas'">Lunas</span>
                    <span class="bg-danger badge" v-else>Belum Lunas</span>
                  </span>
                </div>

                <button type="button" class="close" @click="close" v-html="ic('close')"/>
              </div>

              <div class="card-tabs mb-0">
                <!-- Cards navigation -->

                <transition name="slide-fade-x">
                  <div class="btn-group float-right" v-if="tabActive === 1">
                    <button class="btn btn-outline-primary"  v-html="ic('refresh')" @click="getItem()"/>
                    <button class="btn btn-outline-primary"  @click="addItem" v-html="ic('plus')"/> 
                  </div>
                </transition>

                <ul class="nav nav-tabs">
                  <li class="nav-item" v-for="(tab, i) in ['Informasi Pelunasan','Daftar Pelunasan']" :key="i" @click="tabActive = i">
                    <span class="nav-link" :class="tabActive === i ? 'active' : ''" data-toggle="tab" v-html="tab"></span>
                  </li>
                </ul>
                <div class="tab-content">

                  <div class="card tab-pane" :class="tabActive === 0 ? ' active show' : ''">
                    <div class="card-body p-0">
                      <!-- <Skeleton type="list" :length="5" class="mt-3 bg-white m-2" v-if="request"/> -->
                      <transition name="slide-up">
                        <ul class="list-group list-stripped list-borderless" style="max-height: calc(100vh - 320px); overflow: auto">
                          <li class="list-group-item" v-for="(row, i) in detail_label" :key="i">
                            <div><b>{{row}}</b></div> <span v-html="data_detail.data[i]"></span>
                          </li>
                        </ul>
                      </transition>

                    </div>
                  </div>

                  <div class="card tab-pane" :class="tabActive === 1 ? ' active show' : ''">
                    <div class="card-body p-0 table-responsive " style="min-height: 350px">

                     <!--  <Skeleton type="table" :length="5" class="mt-3 bg-white m-2" v-if="loading"/> -->
                      <Nodata v-if="!form.request && detail_item.data.length === 0"/> 
                      <transition name="slide-up">

                       <div class="table-dpb" v-if="detail_item.data.length > 0">
                          <table class="table table-v center table-hover card-table table-striped table-no-break">

                            <thead>
                              <tr class="text-muted">
                                <th>No</th>
                                <th>Tanggal Pelunasan</th>
                                <th>Tipe Pembayaran</th>
                                <th>Nominal</th>
                                <th>Status</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(row, i) in detail_item.data" :key="i">
                                <td>{{i + 1}}</td>
                                <td>{{dateFormat(row.tanggal)}}</td>
                                <td>{{row.tipe}}</td>
                                <td>{{'Rp '+ribuan(row.nominal)}}</td>
                                <td>
                                  <span class="badge w-100" :class="row.status === 'waiting' ? 'bg-orange' : row.status === 'approved' ? 'bg-success' : 'bg-danger'">
                                    {{row.status}}</span>
                                </td>
                                <td style="padding: 2px">
                                  <div class="btn-group" v-if="row.status === 'approved' || row.status === 'rejected'">
                                    <button class="btn btn-white btn-pill" @click="cancelItem(row)"> <i class="fe fe-rotate-ccw mr-2"></i> Batalkan </button>
                                  </div>

                                  <div class="btn-group" v-if="row.status === 'waiting'">
                                    <button class="btn btn-white btn-pill" @click="itemEdit(row)" v-html="ic('edit')"> </button>
                                    <button class="btn btn-white btn-pill" @click="itemDelete(row.id)" v-html="ic('trash')"> </button>
                                    
                                    <button class="btn btn-white btn-pill text-success" @click="confirmItem(row, 1)" v-html="ic('check')"> </button>
                                    <button class="btn btn-white btn-pill text-danger" @click="confirmItem(row, 0)" v-html="ic('close')"> </button>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </transition>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="px-4 pt-3" v-if="tabActive === 1">
              <!-- <span class="badge-md strong mr-2" v-for="(row, i) in itemsFoot" :key="i"> {{ucwords(row.label)}} <span v-html="row.value"></span> </span> -->
            </div>

            <div class="px-4 py-4 text-right">
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
            </div>

            <!-- form add & edit item -->
            
            <!-- form add & edit item -->

            <transition name="slide-fade-x">
              <div class="form-item" v-show="form.view">
                <div class="card-header">
                  <h3 class="card-title" v-html="form.title"/>
                  <button type="button" class="close" @click="form.view = false" v-html="form.request ? spin() : ic('close')"/>
                </div>

                <form @submit.prevent="form.action">

                  <div class="card-body" style="overflow: auto; height: 465px">

                    <div class="form-group">
                      <label for="tanggal-pelunasan" class="form-label">Tanggal Pelunasan</label>
                      <input type="date" class="form-control" v-model="formData.tanggal" id="tanggal-pelunasan">
                    </div>

                    <div class="form-group">
                      <label class="form-label">Tipe Pembayaran</label>
                      <label class="form-check form-check-inline" v-for="(d, i) in ['tunai','transfer','bilyet_giro','lainnya']" :key="i">
                        <input class="form-check-input" type="radio" name="tp" :value="d" v-model="formData.tipe">
                        <span class="form-check-label" v-html="ucwords(d.split('_').join(' '))"/>
                      </label>
                    </div>

                    <div class="form-group">
                      <label for="nominal" class="form-label">Nominal</label>
                      <currency-input
                          id="nominal"
                          type="tel"
                          class="form-control"
                          placeholder="Nominal"
                          onfocus="this.select()"
                          @keypress="numberOnly($event)"
                          maxlength="11"
                          v-model="formData.nominal"
                          :required="formData.tipe === 'tunai'"/>
                    </div>

                    <div class="form-group" v-if="formData.tipe !== 'tunai' && formData.tipe !== 'lainnya'">
                      <label for="bank" class="form-label">Bank</label>
                      <input id="bank" type="tel" class="form-control" placeholder="Bank" number-only v-model="formData.bank">
                    </div>

                    <div class="form-group" v-if="formData.tipe !== 'tunai' && formData.tipe !== 'lainnya'">
                      <label for="no-rekening" class="form-label">No. Rekening</label>
                      <input id="no-rekening" type="tel" class="form-control" placeholder="No. Rekening" @keypress="numberOnly($event)" maxlength="11" v-model="formData.no_rekening">
                    </div>

                    <div class="form-group" v-if="formData.tipe === 'bilyet_giro'">
                      <label for="no-bg" class="form-label">No. Bilyet Giro</label>
                      <input id="no-bg" type="tel" class="form-control" placeholder="No. bilyet giro" @keypress="numberOnly($event)" maxlength="11" v-model="formData.no_bg">
                    </div>

                    <div class="form-group" v-if="formData.tipe === 'bilyet_giro'">
                      <label for="jatuh-tempo" class="form-label">Jatuh Tempo</label>
                      <input id="jatuh-tempo" type="date" class="form-control" v-model="formData.jatuh_tempo_bg">
                    </div>

                    <div class="form-group" v-if="formData.tipe === 'lainnya'">
                      <label for="keterangan" class="form-label">Keterangan</label>
                      <textarea id="keterangan" class="form-control" v-model="formData.keterangan" placeholder="Keterangan"></textarea>
                    </div>

                  </div>

                  <div class="card-footer text-right">
                    <button type="button" class="btn btn-white" @click="form.view = false" v-html="'Tutup'"></button>
                    <button type="submit" class="btn btn-primary ml-3" :disabled="form.isSubmit" v-html="form.isSubmit ? spin() : 'Simpan'"></button>
                  </div>

                </form>

              </div>
            </transition>

        </div>
      </div>
    </div>

    <div class="modal-backdrop fade" :class="data_detail.form ? 'show' : ''" />

    <Confirm :id.sync="confirm.id" :title.sync="confirm.title" :isSubmit.sync="confirm.isSubmit" @submit="confirm.action"/>

  </div>
</template>

<script> 
import { mapState, mapActions, mapMutations } from 'vuex';
import helper from "@/assets/js/helper.js";

export default {
  name: "Modal",
  mixins: [helper],
  computed:{
    ...mapState(['loading']),
    ...mapState('pelunasan_pembelian', {
      data_detail : state => state.data_detail,
      detail_item : state => state.detail_item,
      data_filter : state => state.data_filter,
      data_laporan: state => state.data_laporan,
    }),
  },
  data() {
    return {
      backdrop: false,
      request: true, 
      data: {}, 
      tabActive: 0,
      detail_label : ['No. Invoice','Nama Principel','Perusahaan','Depo','Tanggal Pembelian','Jatuh Tempo','Total Pembelian','Total Pembayaran','Piutang','Status'],
      form: {
        view: false, request: false,
        title: null, isSubmit: false,
        action: () => {}
      },      
      formData: {
        tanggal: this.dateTime('ymd'),
        id_faktur_pembelian: null,
        tipe: 'tunai',
        nominal: 0,
        bank: null,
        no_rekening: null,
        no_bg: null,
        jatuh_tempo_bg: null,
        keterangan: null,
        status : null,
      },
      confirm: {
        id: null, title: null, isSubmit: false, action: () => {}
      },
    };
  },

  methods: {
    ...mapActions('pelunasan_pembelian', ['get_laporan']),
    close() {
      this.data_detail.form = false;
      this.tabActive = 0;
    },
    getItem(){ 
      let id = this.data_detail.id_faktur_pembelian;
      const url = '/pelunasan_pembelian/'+id;

      this.axios.get(url).then((response) => {
          this.detail_item.data = response.data;
      })
    },
    confirmItem(data, action){
      let url = action === 1 ? 'detail_pelunasan_pembelian/approve/'+data.id : 'detail_pelunasan_pembelian/reject/'+data.id;
      let msg = action === 1 ? 'Data Pelunasan Pembelian yang telah disetujui.' : 'Data Pelunasan Pembelian yang telah ditolak.';
      this.axios.post(url).then(res => {
          this.toast(res.data.message);
          this.getItem();
          this.get_laporan();
        }).catch( err => {
          this.onError(err);
        });
    },
    cancelItem(data){
      let url = 'detail_pelunasan_pembelian/cancel_approval/'+data.id;
      let msg = 'Pelunasan Penjualan telah berhasil dibatalkan.';
      this.axios.post(url).then(res => {
          this.toast(res.data.message);
          this.getItem();
          this.get_laporan();
      }).catch( err => {
        this.onError(err);
      });
    },
    addItem(){
      // clear form
      Object.assign(this.$data.formData, this.$options.data.call(this).formData);
      this.formData.id_faktur_pembelian = this.data_detail.id_faktur_pembelian;
      this.form.view = true
      this.form.title = 'Tambah Pelunasan'
      this.form.action = () => {
        this.form.isSubmit = true

        this.axios.post('detail_pelunasan_pembelian', this.formData).then(res => {
          this.toast('Berhasil ditambahkan');
          this.form.view = this.form.isSubmit = false;
          this.getItem();
          this.get_laporan();
        }).catch( err => {
          this.onError(err);
          this.form.isSubmit = false;
        });
      }
    },
    itemEdit(data){
      Object.assign(this.$data.formData, this.$options.data.call(this).formData);
      this.formData.id_faktur_pembelian = this.data_detail.id_faktur_pembelian;
      this.form.view = true;
      this.form.title = 'Edit Pelunasan';
      this.formData = data;
      this.getItem();
      this.form.action = () => {
        this.form.isSubmit = true;

        this.axios.put('detail_pelunasan_pembelian/'+data.id, this.formData).then(res => {
          console.log(res.data);
          this.toast('Berhasil diperbarui');
          this.form.view = this.form.isSubmit = false;
          this.getItem();
          this.get_laporan();
        }).catch( err => {
          this.onError(err);
          this.form.isSubmit = false;
        });
      }
    },
    itemDelete(id){
      this.confirm.id = id
      this.confirm.title = 'Yakin ingin menghapus pembayaran ini dari pelunasan?'
      this.confirm.action = () => {

        this.axios.delete('detail_pelunasan_pembelian/'+id).then(() => {
          this.toast('Berhasil dihapus');
          this.confirm.id = null
          this.getItem();
          this.get_laporan();
        }).catch( err => {
          this.onError(err);
          this.confirm.isSubmit = false
        });
      }
    }

  },

  watch: {
   
  },
};
</script>

<style lang="scss" src="../pelunasan.scss" scoped/>
