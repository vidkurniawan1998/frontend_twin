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
      <div class="modal-dialog modal-md modal-dialog-centered " role="document">
        <div class="modal-content hidden-overflow">

            <div class="modal-header">
              <h4 class="modal-title" v-html="config.title == null ? '&nbsp;' : config.title"></h4>
              <button type="button" class="close" @click="close()" v-html="ic('close')"/>
            </div>

            <div class="modal-body">
              
              <transition name="slide-up">
                <ul class="list-group list-stripped">
                  <li class="list-group-item" v-for="(row, i) in info" :key="i">
                    <div><b>{{row.label}}</b></div> <span v-html="row.value"></span>
                  </li>
                </ul>
              </transition>

            </div>

            <div class="modal-footer pt-2">
              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
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

      info: [],
    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },
  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    initData: function(data) {
      let labels = ['No. PO','No. Invocie','Nama Toko','Cust No','Tipe Pembayaran','Nominal','Status','Bank','No. Rekening','No. BG','Jatuh Tempo BG','Created At','Approved At'],
          values = []

      values.push(data.id_penjualan);
      values.push(data.no_invoice);
      values.push(data.nama_toko+' ['+data.no_acc+']');
      values.push(data.cust_no == null ? '-' : data.cust_no);
      values.push(data.tipe);
      values.push('Rp '+this.ribuan(data.nominal));
      values.push(data.status);
      values.push(data.bank);
      values.push(data.no_rekening);
      values.push(data.no_bg);
      values.push(data.jatuh_tempo_bg == null ? '-' : data.jatuh_tempo_bg);
      values.push(data.created_at);
      values.push(data.approved_at == '' ? '-' : data.approved_at);

      switch (data.tipe) {
        case 'bilyet_giro':
          labels.splice(7, 2)
          values.splice(7, 2)
          break;

        case 'transfer':
          labels.splice(9, 2)
          values.splice(9, 2)
          break;

        case 'tunai':
          labels.splice(7, 4)
          values.splice(7, 4)
          break;
      }

      this.info = []
      
      for (let i = 0; i < labels.length; i++) {
        this.info.push({label: labels[i], value: values[i]})
      }
    },

  }
};
</script>

<style lang="scss" src="../pelunasan.scss" scoped/>
