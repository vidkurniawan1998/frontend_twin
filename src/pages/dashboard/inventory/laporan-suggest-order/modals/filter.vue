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
        <div class="modal-content ">
          <div class="modal-header">
            <h5 class="modal-title">Filter</h5>
            <button type="button" class="close" v-on:click="triggerFilter" v-html="loading ? spin() : ic('close')"/>
          </div>

          <div class="modal-body pt-3">
            <!--tanggal-->
            <div class="row">
              <div class="col-12 form-group">
                <label class="form-label" for="end-date">Tanggal</label>
                <input id="tanggal" type="date" class="form-control" required v-model="data_filter.due_date" :max="dateTime('ymd')" />
              </div>
            </div>

            <!--rule-->
            <div class="row">
              <div class="col-6 form-group">
                <label class="form-label" for="end-date">Stock Buffer (Hari)</label>
                <input id="buffer" type="text" class="form-control" required v-model="data_filter.buffer" placeholder="Inputkan Stock Buffer (Hari)" />
              </div>
              <div class="col-6 form-group">
                <label class="form-label" for="end-date">Satuan Hari Kerja</label>
                <input id="rule" type="text" class="form-control" required v-model="data_filter.rule" placeholder="Inputkan Satuan Hari Kerja" />
              </div>
            </div>

            <!--tipe-->
            <div class="row">
              <div class="col-12 form-group">
                <label class="form-label" for="end-date">Tipe</label>
                 <selectize
                      id="tipe"
                      v-model="data_filter.tipe"
                      data-placeholder="Pilih Tipe"
                      required 
                      :disabled="loading">
                    <option :value='d' v-for="(d, i) in tipe_so" :key="i"> {{d}}</option>
                  </selectize>
              </div>
            </div>

            <!--long-->
            <div class="row">
              <div class="col-12 form-group">
                <label class="form-label" for="end-date">Prediction</label>
                <input id="prediction" type="number" class="form-control" required v-model="data_filter.parameter_prediksi" placeholder="Inputkan Jarak Prediksi" />
              </div>
            </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-white"  v-on:click="triggerFilter" v-html="'Tutup'" />
            <button type="button" class="btn btn-primary"  v-on:click="_getMinggu();"  v-html="'OK'" />
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
    ...mapState('suggest_order', {
      data_filter : state => state.data_filter,
    }),
  },
  data() {
    return {
      tipe_so : ['Day','Week'],
    };
  },

  methods: {
    ...mapActions('principal', ['getListPrincipal']),
    ...mapActions('suggest_order', ['triggerFilter','getLaporan','getHariEfektif']),

    _getMinggu(){
      this.getHariEfektif({tanggal : this.data_filter.due_date}).then( res => {
        this.data_filter.tanggal_4  = res.tanggal_4
        this.data_filter.tanggal_8  = res.tanggal_8
        this.data_filter.tanggal_13 = res.tanggal_13
        this.data_filter.minggu     = res.minggu_1
        this.getLaporan()
        this.triggerFilter()
        console.log(this.data_filter)
      })
    },
  },
  mounted(){
  },
};
</script>
