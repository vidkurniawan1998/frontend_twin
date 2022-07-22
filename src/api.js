import axios from 'axios'
import store from '@/store'
import helper from "@/assets/js/helper";
import router from "./Routes";

const $axios = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

$axios.interceptors.request.use(
    function (config) {
        // const token = store.state.token
        const token = localStorage.getItem('token')
        if (token) config.headers.Authorization = `Bearer ${token}`
        store.commit('SET_LOADING', true)
        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)

$axios.interceptors.response.use(
    response => {
        if ((response.status == 200 || response.status == 201) && typeof response.data.message != 'undefined' )
        {
            helper.methods.toast(response.data.message)
        }
        store.commit('SET_LOADING', false)
        return response
    }, error => {
        store.commit('SET_LOADING', false)
        let msg = error.response.data.message
        if (error.response.status === 401) {
            localStorage.removeItem('token')
            store.commit('SET_TOKEN', null)
            router.push( { name: 'Login'} )
        }

        if (error.response.status === 400) {
            if (typeof msg !== 'undefined') {
                helper.methods.toast(msg);
            } else {
                helper.methods.toast('Gagal menyimpan data, coba beberapa saat lagi');
            }

        }

        if (error.response.status === 403) {
            helper.methods.toast(msg)
        }

        if (error.response.status === 404) {
            helper.methods.toast('End point tidak ditemukan');
        }

        if (error.response.status === 422) {
            for (const err in error.response.data) {
                helper.methods.toast(error.response.data[err][0])
            }
        }

        if (error.response.status === 500) {
            helper.methods.toast('Internal Server Error, Hubungi Support :-)')
        }
        store.commit('SET_LOADING', false)
        return Promise.reject(error)
    }
)

export default $axios
