<template>
  <div v-if="backdrop">
    <div
      class="modal fade"
      :class="modal.open ? 'show' : ''"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content" style="overflow: hidden">

          <div class="modal-body text-center">

            <div style="margin: 25px 0">
              <i class="la la-circle-notch la-spin la-lg" style="font-size: 45px"></i>
            </div>


            <div class="my-5">
              <h2>Logout</h2>
              <span class="text-muted"> Mohon menunggu, permintaan Anda sedang diproses... </span>
            </div>
            
          </div>

          <!-- <div class="modal-footer" style="padding-top: 15px">
            <button type="button" class="btn btn-white btn-block" @click="close()" v-html="'Tutup'" />
          </div> -->

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

      auth: {},
      isSave: false,

      data: {
        old_pass: '',
        password: '',
        conf_pass: ''
      }

    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    _logout(){
      this.axios.post('logout').then(() => {
        this.$router.push('/');
      }).catch( err => {
        this.onError(err)
        this.close()
      });
    }

  },

  mounted(){
    this.auth = this.getAuth('auth')
  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view;
          this._logout()
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    initData: function() { },

  }
};
</script>