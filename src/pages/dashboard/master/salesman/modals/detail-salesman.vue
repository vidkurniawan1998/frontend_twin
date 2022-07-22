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
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">{{config.title == null ? '&nbsp;' : config.title}}</h5>
            <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
          </div>

            <div class="modal-body text-center">

              <img :src="asset('profile.png')" class="avatar avatar-xl mb-4" alt="">

              <Skeleton type="list-1" :length="4" v-if="request" class="text-left"/>

              <transition name="slide-up">
                <ul class="list-group text-left bg-white" v-if="!request">
                  <li class="list-group-item">
                    <b>NIK</b> <br> <span v-html="user.nik"></span>
                  </li>
                  <li class="list-group-item">
                    <b>Email</b> <br> <span v-html="user.email"></span>
                  </li>
                  <li class="list-group-item">
                    <b>No. Telepon</b> <br> <span v-html="user.phone"></span>
                  </li>
                  <li class="list-group-item">
                    <b>Status</b> <br> <span v-html="user.status"></span>
                  </li>
                </ul>
              </transition>

            </div>

            <div class="modal-footer">
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

      request: true,
      user: {}
    };
  },

  methods: {
    close() {
      this.$emit("update:config", { view: false });
    },

    _getUser(id){
      this.request = true

      this.axios.get('user/'+id).then(res => {
        this.user = res.data
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
        }, 100);
      } else {
        this.modal.open = view;

        setTimeout(() => {
          this.backdrop = view;
        }, 100);
      }
    },

    initData: function(data) {
      this._getUser(data.id)
    },

  }
};
</script>
