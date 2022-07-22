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
        <div class="modal-content" style="height: 500px;">

          <div class="modal-header">
            <h5 class="modal-title">{{config.title == null ? '&nbsp;' : config.title}}</h5>
            <button type="button" class="close" @click="close()" v-html="request ? spin() : ic('close')"/>
          </div>

            <div class="modal-body pt-3 pb-5">

              <div class="row form-group" v-for="(input,k) in inputs" :key="k">
                <div class="col-md-4">
                  <selectize :person="person" data-placeholder="Pilih Filter" v-model="input.name" required>
                    <template v-for="(fieldName, pos) in formFields"> 
                      <option :value="fieldName" :key="pos">{{capitalizeFirstLetter(fieldName)}}</option>
                    </template>
                  </selectize>
                </div>
                <div class="col-md-4 "  v-show="status.tim.index != k && status.tipe.index != k && status.depo.index != k && message.status == false">
                  <input type="text" class="form-control" v-model="input.value">
                </div>
                <div class="col-md-4" v-show="status.tim.status == true && status.tim.index == k && status.tim.count < 2 && message.status == false">
                  <selectize v-model="input.value" data-placeholder="Pilih tim" required :disabled="request"> 
                    <option :value="d.id" v-for="(d, i) in tim" :key="i"> {{d.nama_tim}} - {{d.nama_depo}} </option>
                  </selectize>
                </div>
                <div class="col-md-4" v-show="status.tipe.status == true && status.tipe.index == k && status.tipe.count < 2 && message.status == false">
                  <selectize v-model="input.value" data-placeholder="Pilih tipe" required :disabled="request"> 
                    <option :value="d" v-for="(d, i) in tipe" :key="i"> {{d}} </option>
                  </selectize>
                </div>

                <div class="col-md-4 form-group" v-show="status.depo.status == true && status.depo.index == k && status.depo.count < 2 && message.status == false" >
                  <selectize v-model="input.value" data-placeholder="Pilih Depo" :settings="selectizeConfig" required :disabled="request"> 
                    <option :value="row.id" v-for="(row, i) in depos" :key="i">
                      {{row.nama_depo}}
                    </option> 
                  </selectize>
                </div>

                <div class="col-md-4" v-if="message.status == true && message.index == k ">
                   Filter Telah Digunakan
                </div>
                <!-- <div class="col-md-5">
                   {{message.index}}
                </div> -->
                <div class="col-md-4">
                  <span>
                      <i type="button" class="btn btn-white btn-icon text-danger mr-2" v-html="ic('close')"  @click="remove(k)" v-show="k || ( !k && inputs.length > 1)"></i>
                      <i type="button" class="btn btn-white btn-icon" v-html="ic('plus')" @click="add(k)" v-show="k == inputs.length-1 && k < formFields.length-1 && message.index == 0"></i>
                  </span>
                </div>
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
    person: '',
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
      
      // Filer dinamis
      selectizeConfig: {
        maxItems: 99,
        plugins: ["remove_button"]
      },

      inputs: [
        {
          name: '',
          value: ''
        }
      ],
      message : {
        index:0,
        status:false
      },
      
      formFields: [
        "nama_toko",
        "alamat",
        "tipe",
        "npwp",
        "tipe_harga",
        "nama_pkp",
        "tim",
        "depo"
      ],

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

      temp_select:[], request: false, tim:[], depos: [],
      
      status:{
        tim:{
          status:false,
          index:null,
          count:0
        },
        tipe:{
          status:false,
          index:null,
          count:0
        },
        nama_toko:{
          status:false,
          index:null,
          count:0
        },
        alamat:{
          status:false,
          index:null,
          count:0
        },
        npwp:{
          status:false,
          index:null,
          count:0
        },
        tipe_harga:{
          status:false,
          index:null,
          count:0
        },
        nama_pkp:{
          status:false,
          index:null,
          count:0
        },
        depo:{
          status:false,
          index:null,
          count:0
        }
      },
      //End Filter dinamis
  
      dataFilter: {
        keyword: '',
        search: []
      }
    };
  },
  

  methods: {
    
    add(index) {
        this.inputs.push({ 
          name: '', 
          value: '' 
        });

        for (const key in this.inputs) {
          if(key != 'pull' && this.inputs[key].name != '' )
          {
            if(!this.temp_select.includes(this.inputs[key].name)){
              this.temp_select.push( this.inputs[key].name );
            }
          }
        }
        console.log(this.temp_select)
    },
    remove(index) {
        this.inputs.splice(index, 1);
    },

    close() {
      this.$emit("update:config", { view: false });
    },
    _getTim(){
      this.request = true; this.tim = []

      this.axios.get('tim').then(res => {
        this.tim = res.data.data;
        this.request = false;
      }).catch( err => {
        this.onError(err)
        this.request = false
      });
    },

    capitalizeFirstLetter(data) {
      let string = data.split('_');
      string[0] = string[0].charAt(0).toUpperCase() + string[0].slice(1);
      return string.join(' ')
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

        this.dataFilter.search = [];
        for (const key in this.inputs) {
          if(key != 'pull' && this.inputs[key].name != '' )
          {
            var temp = this.inputs[key].name+':'+this.inputs[key].value
            if(!this.dataFilter.search.includes(temp)){
              this.dataFilter.search.push(temp)
            }
          }
        }
        
        this.$emit("submit", this.dataFilter);
        this.close()
        
      // const data = {
      //   inputs: this.inputs
      // }
      // alert(JSON.stringify(data, null, 2))
    }
    
  },

  watch: {
    "config.view": function(view) {
      if (view) {
        this.$emit("update:isSubmit", false);

        this.backdrop = true;
        setTimeout(() => {
          this.modal.open = view; 
          if(this.tim.length == 0) this._getTim()
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

  },
  mounted: function () {
    this.$watch('inputs', function (value) {
      let temp_index = {
        nama_toko:0,
        alamat:0,
        tipe:0,
        npwp:0,
        tipe_harga:0,
        nama_pkp:0,
        tim:0,
        depo:0
      };

      for (const key in value) { //Pengecekan Untuk Value Of Filter dari Select
        if(key != 'pull' && value[key].name != '' )
        {
          for(const val in this.formFields)
          {
            if(val != 'pull')
            {
              if(value[key].name == this.formFields[val]) //Kondisi Filter ada pada list
              {
                temp_index[this.formFields[val]]++ //Count jumlah pengunaan filter
                this.status[this.formFields[val]].status = true; // Status True =  Filter Sedang digunakan
                this.status[this.formFields[val]].index = key; // Index Filter digunakan
                this.status[this.formFields[val]].count = temp_index[this.formFields[val]]; //Mencatat jumlah filter ini di gunakan
              }
              if(value[key].name != this.formFields[val] && key == this.status[this.formFields[val]].index) // kondisi saat filter di hapus / diganti (dilihat dari index yang berbeda)
              {
                this.status[this.formFields[val]].status = false; // Status False =  Filter tidak digunakan
                this.status[this.formFields[val]].index = null;
              }
            }
          }
          for (const aa in temp_index) { // Menambah Messages Jika Terdapat Fitur yang digunakan lebih dari sekali
            if(temp_index[aa] > 1){
              this.message.index = key; // Index fitur yang digunakan
              this.message.status = true; // Status True saat terdapat Fitur yang digunakan lebih dari sekali
              break;
            }
            else{
              this.message.index = 0;
              this.message.status = false;
            }
          }
        }
      }
    }, {deep:true})
  }
};
</script>

<style lang="scss" src="../toko.scss" scoped/>
