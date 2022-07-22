<template>
    <div>
        <div class="row" v-if="type == 'row'">
            <div :class="'col-lg-'+column" v-for="(row, i) in length" :key="i">
                <div class="card">
                    <div class="empty">

                        <div class="skeleton circle mb-5"/>
                        
                        <div class="skeleton bar mb-3"/>
                        <div class="skeleton bar"/>
                        <div class="skeleton bar"/>
                        
                    </div>
                </div>
            </div>
        </div>

        <div class="row" v-if="type == 'row-1'">
            <div :class="'col-lg-'+column" v-for="(row, i) in length" :key="i">
                <div class="card">
                    <div class="empty">

                        <div class="skeleton circle mb-5"/>
                        
                        <div class="skeleton bar mb-2" style="width: 100px"/>
                        <div class="skeleton bar" style="width: 150px"/>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" v-if="type == 'row-2'">
            <div :class="'col-lg-'+column" v-for="(row, i) in length" :key="i">
                <div class="card card-sm card-social">
                <div class="card-body d-flex align-items-center">
                    <div class="skeleton square m-0 mr-3"/>
                  
                  <div class="mr-3 lh-sm">
                    <div class="skeleton bar m-0" style="width: 100px"/> <br/>
                    <div class="skeleton bar m-0" style="width: 130px"/>
                  </div>
                </div>
              </div>
            </div>
        </div>

        <ul class="list-group" v-if="type == 'list'">
            <li class="list-group-item" v-for="(row, i) in length" :key="i">
                <div class="skeleton bar m-0"/>
            </li>
        </ul>

        <ul class="list-group borderless" v-if="type == 'list-1'">
            <li class="list-group-item" v-for="(row, i) in length" :key="i">
                <div class="row">
                    <div class="col-auto">
                        <div class="skeleton square m-0" style="height: 30px; width: 30px; border-radius: 3px; display: block "/>
                    </div>
                    <div class="col " style="line-height: 15px">
                      <div class="skeleton bar m-0" :style="'width:'+(Math.floor(Math.random() * 80) + 30)+'px'" style="height: 7px; margin: 0 !important"/>
                      <div class="text-muted text-h5"> <div class="skeleton bar m-0" :style="'width:'+(Math.floor(Math.random() * 150) + 30)+'px'" style="height: 7px"/> </div>
                    </div>
                </div>
            </li>
        </ul>

        <div class="row" v-if="type == 'user'">
            <div :class="'col-lg-'+column" v-for="(row, i) in length" :key="i">
              <div class="card">
                <div class="card-body">
                  <div class="row row-sm align-items-center">
                    <div class="col-auto">
                        <div class="skeleton circle" style="height: 40px; width: 40px"/>
                    </div>
                    <div class="col mb-3">
                      <h3 class="mb-0"> <div class="skeleton bar m-0" style="width: 100px; height: 10px"/>  </h3>
                      <div class="text-muted text-h5"> <div class="skeleton bar m-0" style="width: 150px; height: 7px"/> </div>
                    </div>
                  </div>
                  <div class="row align-items-center">
                    <div class="col">
                        <div class="skeleton bar m-0" style="width: 150px; height: 5px"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        <div v-if="type == 'table'">
            <div style="overflow: hidden; width: 100%">

            <table class="table mb-0 bg-white">
                <!-- <thead>
                    <tr class="text-muted">
                    <th>Nama</th>
                    <th>Jam Masuk</th>
                    <th>Scan Masuk</th>
                    <th>Terlambat</th>
                    <th>Jam Pulang</th>
                    <th>Scan Pulang</th>
                    <th></th>
                    </tr>
                </thead> -->
                <tbody>
                    <tr v-for="(row, i) in length" :key="i" >
                        <td> <div class="skeleton bar m-0" :style="'width:'+getRand(50, 200)+'px; height: '+h"/> </td>
                        <td> <div class="skeleton bar m-0" :style="'width:'+getRand(50, 200)+'px; height: '+h"/> </td>
                        <td> <div class="skeleton bar m-0" :style="'width:'+getRand(50, 200)+'px; height: '+h"/> </td>
                        <td> <div class="skeleton bar m-0" :style="'width:'+getRand(50, 200)+'px; height: '+h"/> </td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>

        <div v-if="type == 'bar'">
            <div class="skeleton bar m-0"/>
        </div>

        <div v-if="type == 'circle'">
            <div class="skeleton circle m-0"/>
        </div>

    </div>
</template>

<script>
import helper from "@/assets/js/helper.js";

    export default {
        name: 'Skeleton',
        props: {
            length: {default: 1}, column: {default: 3},
            type: {default: 'row'},
        },

        mixins: [helper],

        data(){
            return {
                h: '10px'
            }
        },

        methods: {
            getRand(min, max){
                return Math.floor(Math.random() * (max - min + 1) + min);
            }
        }
        
    }
</script>

<style lang="scss" scoped src="./skeleton.scss"/>