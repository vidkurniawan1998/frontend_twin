<template>
  <div v-if="data_filter.form">
    <div
      class="modal fade"
      :class="data_filter.modal ? 'show' : ''"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Filter</h5>
            <button type="button" class="close" v-on:click="triggerFilter" v-html="loading ? spin() : ic('close')"/>
          </div>

            <div class="modal-body pt-3">
               <!--perusahaan-->
              <div class="row">
                <div class="col-12 form-group">
                  <label class="form-label" for="perusahaan">Perusahaan</label>
                  <selectize
                      data-placeholder="Pilih Perusahaan"
                      id="perusahaan"
                      v-model="data_filter.id_perusahaan"
                      :disabled="loading"
                      :settings="selectizeConfig"
                      required
                      @input="getDepo($event)"
                  >
                    <option :value="row.id" v-for="(row, i) in perusahaan" :key="i">
                      {{ row.nama_perusahaan }}
                    </option>
                  </selectize>
                </div>
              </div>

              <!--depo-->
              <div class="row">
                <div class="col-12 form-group">
                  <label class="form-label">Depo</label>
                  <selectize v-model="data_filter.id_depo" data-placeholder="Pilih Depo" :settings="selectizeConfig" required :disabled="loading">
                    <option :value="row.id" v-for="(row, i) in depos" :key="i">
                      {{row.nama_depo}}
                    </option>
                  </selectize>
                </div>
              </div>

               <!--tipe & tim-->
              <div class="row">
                <div class="col-6 form-group">
                  <label class="form-label" for="tipe">Tipe</label>
                  <selectize
                      data-placeholder="Pilih Tipe"
                      id="tipe"
                      v-model="data_filter.tipe"
                      :disabled="loading"
                      required
                  >
                    <option :value="row" v-for="(row, i) in tipe" :key="i">
                      {{ row }}
                    </option>
                  </selectize>
                </div>
                <div class="col-6 form-group">
                  <label class="form-label" for="tim">Tim</label>
                  <selectize
                      data-placeholder="Pilih Tim"
                      id="tim"
                      v-model="data_filter.id_tim"
                      :disabled="loading"
                      :settings="selectizeConfig"
                      required
                  >
                    <option :value="row.id" v-for="(row, i) in tim" :key="i">
                      {{ row.nama_tim }}
                    </option>
                  </selectize>
                </div>
              </div>

              <!--Keyword Search-->
              <div class="row">
                <div class="col-4 form-group">
                  <label class="form-label" for="tipe_keyword">Tipe Keyword</label>
                  <selectize
                      data-placeholder="Pilih Tipe"
                      id="tipe_keyword"
                      v-model="tipe_keyword_res"
                      :disabled="loading"
                      required
                  >
                    <option :value="row" v-for="(row, i) in tipe_keyword" :key="i">
                      {{ row }}
                    </option>
                  </selectize>
                </div>
                <div class="col-6 form-group">
                  <label class="form-label" for="tim">Keyword</label>
                  <input type="text"  v-model="keyword_res" class="form-control" placeholder="Inputkan keyword">
                </div>
                <div class="col">
                  <label class="form-label" for="tim">&nbsp</label>
                  <button v-html="ic('plus')" class="btn btn-outline-primary" @click="addKeyword()">
                  </button>
                </div>
              </div>

              <transition-group name="fade">
                <div v-for="(row, i) in data_filter.tipe_keyword" :key="`key-${i}`">
                  <div class="row" v-if="data_filter.tipe_keyword[i]!='Keyword'">
                    <div class="col-4 form-group">
                      <input type="text" v-model="data_filter.tipe_keyword[i]" disabled class="form-control" placeholder="Tipe Keyword Not Found">
                    </div>
                    <div class="col-6 form-group">
                      <input type="text" v-model="data_filter.keyword[i]" disabled class="form-control" placeholder="Keyword Not Found">
                    </div>
                    <div class="col">
                      <button v-html="ic('minus')" class="btn btn-outline-danger" @click="removeKeyword(i)">
                      </button>
                    </div>
                  </div>
                </div>
              </transition-group>
            </div>
             
            <div class="modal-footer">
              <button type="button" class="btn btn-white"  v-on:click="triggerFilter" v-html="'Tutup'" />
              <button type="button" class="btn btn-primary"  v-on:click="triggerFilter(); getLaporan();"  v-html="'OK'" />
            </div>
        </div>
      </div>

    </div>
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
    ...mapState('toko', {
      data_filter : state => state.data_filter,
    }),
  },
  data() {
    return{
      tipe_keyword_res : '',
      keyword_res : '',

      perusahaan: [],
      tim : [],
      depos: [],
      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },
      tipe:[
        'R1',
        'R2',
        'SM',
        'W',
        'HCO',
        'HCOC',
        'HRC',
        'KOP',
        'MM',
        'PND'
      ],
      tipe_keyword:[
        'Nama Toko',
        'Alamat',
        'Npwp',
        'Tipe Harga',
        'Nama Pkp'
      ],
    }
  },

  methods: {
    ...mapActions('perusahaan', ['getListPerusahaanByAccess']),
    ...mapActions('depo', ['getListDepo']),
    ...mapActions('salesman', ['getListSalesman']),
    ...mapActions('tim', ['getListTim']),
    ...mapActions('toko', ['triggerFilter','getLaporan']),

    addKeyword(){
      if(this.keyword_res!='' && this.tipe_keyword_res!=''){
        this.data_filter.keyword.push(this.keyword_res);
        this.data_filter.tipe_keyword.push(this.tipe_keyword_res);

        this.keyword_res = '';
        this.tipe_keyword_res = '';
      }
    },

    removeKeyword(id){
      this.data_filter.keyword.splice(id, 1)
      this.data_filter.tipe_keyword.splice(id, 1)
    },

    getListPerusahaan() {
      this.getListPerusahaanByAccess().then( res => {
        this.perusahaan = res
      })
    },


    getDepo(id){
      this.getListDepo({filter: false, id_perusahaan: id}).then( res => {
        this.depos = res
      })
    },

    getTim(){
      this.getListTim().then(res => {
        this.tim = res
      })
    },

    getDepo(id){
      this.getListDepo({filter: false, id_perusahaan: id}).then( res => {
        this.depos = res
      })
    },
  },
  mounted: function () {
  },
  created(){
    this.getListPerusahaan();
    this.getTim();
  }
};
</script>

