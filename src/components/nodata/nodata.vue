<template>
    <div>
        <div class="no-data text-center my-3">
            <img :src="asset('no-data.png')" alt="" class="img">
            <!-- <div :style="'background: url('+asset('no-data.png')+') no-repeat; background-size: cover'" class="img"/> -->
            <div v-html="message" class="h3"></div>
        </div>
    </div>
</template>

<script>
import helper from "@/assets/js/helper.js";

    export default {
        name: 'NoData',
        props: {
            message: {default: 'Oops! Tidak ada data.'},
            align: {default: 'center'}
        },

        mixins: [helper]
    }
</script>

<style lang="scss" scoped>
    .no-data{
        &.center{
            display: inline-block;
        }

        .img{
            // height: 320px;
            // width: 500px;
            user-select: none;
            pointer-events: none;
            max-height: 200px; margin: 25px 0;
            display: inline-block; opacity: .7;
        }
    }
</style>