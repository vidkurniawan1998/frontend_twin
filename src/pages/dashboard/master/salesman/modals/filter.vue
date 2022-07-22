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
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content" style="height:350px">

          <div class="modal-header">
            <h5 class="modal-title">{{config.title == null ? '&nbsp;' : config.title}}</h5>
            <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
          </div>

            <div class="modal-body pt-3">

              <div class="form-group">
                <label class="form-label">Depo</label>
                <selectize v-model="dataFilter.depo" data-placeholder="Pilih Depo" :settings="selectizeConfig" :disabled="request"> 
                  <option :value="row.id" v-for="(row, i) in depos" :key="i">
                    {{row.nama_depo}}
                  </option> 
                </selectize>
              </div>

            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
              <button type="button" class="btn btn-primary" @click="submit" v-html="'OK'" />
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

      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },

      request: true,

      depos: [],

      dataFilter: {
        keyword: '',
        depo: []
      },

    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },
    _getDepo(){
      this.request = true
      this.axios.get('depo/depo_by_user').then(res => {
        this.depos = res.data.data;
        this.request = false
      }).catch(err => {
        this.onError(err);
        this.request = false
      });
    },

    submit(){
        this.$emit("submit", this.dataFilter);
        this.close()
    }
  
  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
          if(this.depos.length == 0) this._getDepo()
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

<style lang="scss" src="../salesman.scss" scoped/>
