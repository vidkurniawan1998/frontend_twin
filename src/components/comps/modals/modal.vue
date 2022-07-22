<template>
  <div v-if="backdrop">
    <div
      class="modal fade"
      :class="modal.open ? 'show' : ''"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
      @click="$event.target.classList.contains('modal') ? close() : true"
    >
      <div class="modal-dialog modal-md modal-dialog-centered x" role="document" ref="document" :style="modal.style">
        <div class="modal-content" ref="content" :style="modal.style.content != null ? 'top: '+modal.style.content.top+'px' : ''">
          <div class="modal-header px-4" ref="header">
            <h5 class="modal-title">{{config.title == null ? '&nbsp;' : config.title}}</h5>

            <div class="modal-controls">
                <slot name="modal-control"> </slot>

                <button type="button" v-if="config.expandable" @click="_expand" v-html="modal.expanded ? ic('minimize') : ic('maximize')"/>
                <button type="button" v-html="ic('close')" @click="close()"/>
            </div>
          </div>

          <form @submit.prevent="submit">
            <div class="modal-body">
                <slot name="body"> </slot>
            </div>

            <div class="modal-footer">
              <div class="float-left">
                <slot name="footer"> </slot>
              </div>

              <button type="button" class="btn btn-white" @click="close()" v-html="'Tutup'" />
              <button type="submit" class="btn btn-primary" v-html="'Simpan'"/>
            </div>
          </form>
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
      default: () => ({
        view: false,
        title: "Modal Title",
        expandable: false,
        autoexpanded: false
      }),
    },
    initData: null,
    isSubmit: false
  },

  mixins: [helper],

  data() {
    return {
      backdrop: false,
      modal: {
        open: false, expanded: false, event: {}, offset: [],
        default: null, style: {}
      },

    };
  },

  methods: {
    close() {
      let def = this.config; def.view = false
      this.$emit("update:config", def);
    },

    _expand(){
      let mod = this.$refs.document.getBoundingClientRect()

      this.modal.style['transition'] = '.2s'
      this.modal.style['max-width'] = '90%'
      this.modal.style['width'] = '90%'

      // (size screen - (size screen * (width-percent / 100))) / 2 -> space left and right
      this.modal.style['left'] = (document.body.clientWidth - (document.body.clientWidth * (90/100))) / 2+'px'
      this.modal.style['top'] = '0px'

      if(this.modal.expanded){
        this.modal.style['max-width'] = this.modal.default['max-width']
        this.modal.style['left'] = this.modal.default.left
        this.modal.style['top'] = this.modal.default.top
      }

      this.modal.expanded = !this.modal.expanded

      setTimeout(() => {
        delete this.modal.style.transition;
      }, 300);
    },

    _initModal(){
      // simpan width default modal
      let mod = this.$refs.document.getBoundingClientRect(),
          modContent = this.$refs.content.getBoundingClientRect()
      
      if(this.modal.default == null){
        this.modal.style = {
          left: mod.left+'px', top: '0px', 'max-width': mod.width+'px', 'width': mod.width+'px', position: 'fixed', //content: { top: modContent.top }
        }

        this.modal.default = {
          left: mod.left+'px', top: '0px', 'max-width': mod.width+'px',
        }
      }

      // moveable modal
      let header = this.$refs.header

      header.addEventListener('mousedown', (e) => {
        this.modal.event.mousedown = true

        this.modal.offset = [
          this.modal.style.left.replace('px', '') - e.clientX,
          this.modal.style.top.replace('px', '') - e.clientY
        ]

        delete this.modal.style.transform;
      })

      document.addEventListener('mouseup', (e) => { 
        this.modal.event.mousedown = false 
      })

      document.addEventListener('mousemove', (e) => {
        let mousedown = this.modal.event.mousedown,
            modContent = this.$refs.content.getBoundingClientRect()

        if(mousedown){

          this.modal.style.left = (e.clientX + this.modal.offset[0])+'px'
          this.modal.style.top = (e.clientY + this.modal.offset[1])+'px'

          let posL = parseFloat(this.modal.style.left.replace('px', '')),
              posT = parseFloat(this.modal.style.top.replace('px', '')),
              max = 0


          if(modContent.top <= 0) {
            max = this.modal.style.top
            this.modal.style.top = max
            // this.modal.style.content.top = 0
            console.log(this.modal.style.top)

            if(e.clientY > -1){
              this.modal.offset = [
                this.modal.style.left.replace('px', '').replace('%','') - e.clientX,
                this.modal.style.top.replace('px', '').replace('%','') - e.clientY
              ]
            }
          }
        }
      })
    },

    submit() {
        // this.$emit('update:isSubmit', true)
        // this.$emit('submit', this.data);
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

        setTimeout(() => {
          this._initModal()
          setTimeout(() => { if(this.config.autoexpanded && !this.modal.expanded) this._expand() }, 100);
        }, 200);

      } else {
        this.modal.open = view;
        let mod = this.$refs.document.getBoundingClientRect()

        setTimeout(() => {
          this.backdrop = view;
          // Object.assign(this.$data.modal, this.$options.data.call(this).modal);

        }, 100);
      }
    },

    initData: function(data) {
      
    },


  }
};
</script>

<style lang="scss" scoped src="./modal.scss"/>
