<template>
  <div class="antialiased">
    <Sidebar/>
    <div class="page">
      <Header disabled/>
      <div class="content">
        <div class="container">
          <div class="page-header">
            <div class="row d-flex justify-content-between">
              <div class="col-auto">
                <h2 class="page-title">
                  Grup Toko Logistik
                </h2>
              </div>
              <div class="col-auto">
                <div class="row">
                  <div class="col-auto">
                    <button class="btn btn-white ml-3" @click="$router.push({name: 'Data Grup Toko'})">
                      <i class="la la-lg la-list"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="box">
            <div class="row">
              <!-- left-->
              <div class="col-md-6">
                <div class="card">
                  <div class="card-body">
                    <!-- Group -->
                    <div class="row">
                      <div class="col-10">
                        <div class="form-group">
                          <input type="text"
                                 class="form-control"
                                 v-model="grup.nama_grup"
                                 placeholder="Nama Grup">
                        </div>
                      </div>
                      <div class="col-2">
                        <div class="form-group">
                          <button
                              @click="submit"
                              class="btn btn-primary"
                              :disabled="loading">
                            Save
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Toko -->
                    <div class="row">
                      <div class="col-7">
                        <div class="form-group">
                          <input
                              type="text"
                              class="form-control"
                              v-model="cari_toko.nama_toko"
                              :disabled="loading">
                        </div>
                      </div>
                      <div class="col-1">
                        <div class="form-group">
                          <button
                              class="btn btn-primary"
                              @click="search"
                              :disabled="loading" v-html="ic('search')"></button>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="btn-group ml-3">
                          <button
                              class="btn btn-outline-primary btn-pill tt-top"
                              tooltip="Muat Sebelumnya"
                              :disabled="loading || page === 1"
                              @click="_cariToko('prev')"
                              v-html="ic('arrow-left')">
                          </button>
                          <button
                              class="btn btn-outline-primary btn-pill tt-top"
                              tooltip="Muat Lainnya"
                              :disabled="loading"
                              @click="_cariToko('next')"
                              v-html="ic('arrow-right')">
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Detail Toko -->
                    <div class="row">
                      <div class="col-12">
                        <span>Perusahaan: <span class="badge bg-blue-lt">{{ cari_toko.perusahaan }}</span></span>
                        <hr class="hr-text">
                        <span>Kode Toko: {{ cari_toko.no_acc }}</span>
                        <hr class="hr-text">
                        <span>Alamat: {{ cari_toko.alamat }}</span>
                        <hr class="hr-text">
                        <span>Salesman: {{ cari_toko.nama_tim }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- right -->
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header">
                    <div class="card-title">
                      Hasil Pencarian
                    </div>
                    <div class="card-options">
                      <input type="text" class="form-control" style="width: 45px" v-model="range">
                    </div>
                  </div>
                  <div class="card-body p-0">
                    <Nodata v-if="hasil_pencarian.length == 0"/>
                    <ul class="list-group borderless">
                      <li class="list-group-item" v-for="(toko, i) in hasil_pencarian" :key="i">
                        <div class="pull-right text-center">
                          <label class="form-check" style="position: absolute; top: 50%; transform: translate(0px, -50%); right: 10px;">
                            <input type="checkbox" class="form-check-input" :value="toko.id" v-model="grup.id_toko">
                          </label>
                        </div>
                        <div class="pull-left text-center">
                          <span style="position: absolute; top: 50%; transform: translate(0px, -50%);" class="avatar">{{ toko.skor }}</span>
                        </div>
                        <div style="margin-left: 50px">
                          <b>{{ toko.no_acc }} - {{ toko.nama_toko }}
                            <span class="badge bg-blue-lt mr-2">{{ toko.perusahaan }}</span>
                          </b>
                          <br>
                          <small class="text-muted">{{ toko.kelurahan }} | {{ toko.alamat }}</small>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import helper from "@/assets/js/helper";
import $axios from "@/api";
export default {
  name: "grup-outlet.vue",
  mixins: [helper],
  data() {
    return {
      list_toko: [],
      hasil_pencarian: [],
      cari_toko: {
        id: 0,
        no_acc: '',
        nama_toko: 'INDOMARET',
        alamat: 'Jalan Raya Denpasar',
        kelurahan: '',
        nama_tim: '',
        perusahaan: ''
      },
      grup: {
        nama_grup: '',
        id_toko: []
      },
      page: 1,
      range: 70,
    }
  },
  computed: {
    ...mapState(['loading'])
  },
  methods: {
    ...mapActions('toko', ['tokoTanpaGrupLogistik', 'omsetToko']),
    _getToko() {
      this.tokoTanpaGrupLogistik().then(res => {
        this.list_toko = res
      })
    },
    search() {
      this.hasil_pencarian  = []
      let lengthOfListToko  = this.list_toko.length
      let cari_nama_toko    = this.arrayText(this.cari_toko.nama_toko)
      let panjang_cari_nama_toko = cari_nama_toko.length
      let cari_alamat_toko  = this.arrayText(this.cari_toko.alamat)
      let panjang_cari_alamat_toko = cari_alamat_toko.length

      for (let i=0; i<lengthOfListToko; i++) {
        let nama_toko   = this.trimText(this.list_toko[i].nama_toko.toLowerCase())
        let alamat      = this.trimText(this.list_toko[i].alamat.toLowerCase())
        let kelurahan   = this.list_toko[i].kelurahan
        let no_acc      = this.list_toko[i].no_acc

        let skor_nama   = 0
        for (let x = 0; x<panjang_cari_nama_toko; x++) {
          if (nama_toko.includes(cari_nama_toko[x])) {
            skor_nama++
          }
        }

        let skor_alamat = 0
        for (let x = 0; x<panjang_cari_alamat_toko; x++) {
          if (alamat.includes(cari_alamat_toko[x])) {
            skor_alamat++
          }
        }

        let skor_nama_toko  = Math.floor(skor_nama/panjang_cari_nama_toko * 100)
        let skor_alamat_toko= Math.floor(skor_alamat/panjang_cari_alamat_toko * 100)
        let total_skor      = (skor_nama_toko + skor_alamat_toko) / 2
        if (total_skor >= this.range) {
          this.hasil_pencarian.push(
              {
                id: this.list_toko[i].id,
                no_acc: no_acc,
                nama_toko: this.list_toko[i].nama_toko,
                alamat: this.list_toko[i].alamat,
                kelurahan: kelurahan,
                perusahaan: this.list_toko[i].perusahaan,
                skor: total_skor
              }
          )
        }
      }
    },
    arrayText(text) {
      let newText = this.trimText(text)
      let combineText = newText.replace(' ', '')
      // combineText = combineText.replace(/[^a-zA-Z ]/g, "");
      let arrayData = []
      let lengthData = combineText.length - 1
      for (let i=0; i<lengthData; i++) {
        let next = i+1
        arrayData.push(`${combineText[i]}${combineText[next]}`)
      }
      return arrayData
    },
    _cariToko(more = null) {
      if (more == 'next') {
        this.page++;
      }

      if (more == 'prev') {
        if (this.page > 1) {
          this.page--;
        }
      }

      this.omsetToko({page: this.page}).then( res => {
        this.cari_toko = res
        this.search()
      })
    },
    trimText(text) {
      let replace = [
        'TOKO ',
        ' TOKO',
        ' Toko',
        'Toko ',
        'TK ',
        'Toko ',
        'CV ',
        'CV. ',
        'cv. ',
        'UD ',
        ' UD',
        'UD. ',
        ' UD.',
        'BU ',
        ' BU',
        ' PAK',
        'PAK ',
        'MART',
        'Bu ',
        ' Bu',
        'bu ',
        'Warung',
        'warung',
        'Wr ',
        ' Wr',
        ' MM',
        'MM ',
        ' WR',
      ]

      let newText = ''
      for (let y=0; y < replace.length; y++) {
        text = text.toLowerCase()
        newText = text.replace(replace[y], '')
        if (text !== newText) {
          break;
        }
      }

      return newText;
    },
    submit() {
      $axios.post('/grup_toko_logistik', this.grup).then( res => {
          this.grup = {
            nama_grup: '',
            id_toko: []
          }

          this.tokoTanpaGrupLogistik().then(res => {
            this.list_toko = res
            this._cariToko('next')
          })
      })
    }
  },
  created() {
    this._getToko()
    this._cariToko()
  }
}
</script>

<style lang="scss" scoped src="./grup-outlet.scss"></style>