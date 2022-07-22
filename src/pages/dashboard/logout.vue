<template>
    <div>

    </div>
</template>

<script>
import helper from "@/assets/js/helper.js";

    export default {
        name: 'Logout',

        mixins: [helper],
        methods: {
            _logout(){
                localStorage.clear()
                this.$router.push('/')
            }
        },

        mounted(){
            this._logout()
        }
    }
</script>
