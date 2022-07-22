var interval;

function timer(time, callback) {
    interval = setInterval(function () {
        time -= 1;
        time <= 0 && clearInterval(interval) | callback()
    }, 1000);
}

let methods = {
    _role(enabled){
        let permissions = JSON.parse(localStorage.permissions)
        return permissions.indexOf(enabled) > -1
    },

    spin(el = true){ return el ? '<i class="la la-circle-notch la-spin la-lg"></i>&nbsp;' : 'la la-circle-notch la-spin la-lg' },
    loader(type){
        let loader;

        switch (type) {
            case 'bull': loader = '<div class="loader_"> <span class="bull"></span> </div>'; break;
            default:
                break;
        }

        return loader
    },

    ic(icon){
        let _icon = '';
        switch (icon) {
            case 'plus': _icon = '&nbsp;<i class="fe fe-plus"></i>&nbsp;'; break;
            case 'minus': _icon = '&nbsp;<i class="fe fe-minus"></i>&nbsp;'; break;
            case 'save': _icon = '&nbsp;<i class="fe fe-save"></i>&nbsp;'; break;
            case 'edit': _icon = '&nbsp;<i class="fe fe-edit-2"></i>&nbsp;'; break;
            case 'edit-3': _icon = '&nbsp;<i class="fe fe-edit-3"></i>&nbsp;'; break;
            case 'trash': _icon = '&nbsp;<i class="fe fe-trash"></i>&nbsp;'; break;
            case 'file': _icon = '&nbsp;<i class="fe fe-file-text"></i>&nbsp;'; break;
            case 'refresh': _icon = '&nbsp;<i class="fe fe-rotate-ccw"></i>&nbsp;'; break;
            case 'check': _icon = '&nbsp;<i class="fe fe-check"></i>&nbsp;'; break;
            case 'close': _icon = '&nbsp;<i class="fe fe-x"></i>&nbsp;'; break;
            case 'c-down': _icon = '&nbsp;<i class="fe fe-chevron-down"></i>&nbsp;'; break;
            case 'download': _icon = '&nbsp;<i class="fe fe-download"></i>&nbsp;'; break;
            case 'upload': _icon = '&nbsp;<i class="fe fe-upload"></i>&nbsp;'; break;
            case 'trending-down': _icon = '&nbsp;<i class="fe fe-trending-down"></i>&nbsp;'; break;
            case 'filter': _icon = '&nbsp;<i class="fe fe-filter"></i>&nbsp;'; break;
            case 'printer': _icon = '&nbsp;<i class="fe fe-printer"></i>&nbsp;'; break;
            case 'search': _icon = '&nbsp;<i class="fe fe-search"></i>&nbsp;'; break;
            case 'eye': _icon = '&nbsp;<i class="fe fe-eye"></i>&nbsp;'; break;
            case 'undo': _icon = '&nbsp;<i class="fe fe-rotate-ccw"></i>&nbsp;'; break;
            case 'lock': _icon = '&nbsp;<i class="fe fe-lock"></i>&nbsp;'; break;
            case 'copy': _icon = '&nbsp;<i class="fe fe-copy"></i>&nbsp;'; break;
            case 'move': _icon = '&nbsp;<i class="fe fe-move"></i>&nbsp;'; break;
            case 'maximize': _icon = '&nbsp;<i class="fe fe-maximize-2"></i>&nbsp;'; break;
            case 'minimize': _icon = '&nbsp;<i class="fe fe-minimize-2"></i>&nbsp;'; break;
            case 'keyboard': _icon = '&nbsp;<i class="la la-lg la-keyboard"></i>&nbsp;'; break;
            case 'arrow-right': _icon = '&nbsp;<i class="la la-lg la-arrow-right"></i>&nbsp;'; break;
            case 'arrow-left': _icon = '&nbsp;<i class="la la-lg la-arrow-left"></i>&nbsp;'; break;
            default:
                break;
        }

        return _icon;
    },

    // event set up
    numberOnly(e){
        // if (e.which != 8 && e.which != 0 && e.which != 45 && e.which < 48 || e.which > 57) {
        
        // jika key != dot -> prevent!
        if (e.which != 46 && e.which != 45 && e.which < 48 || e.which > 57) {
            e.preventDefault();
        }

        /*  note :
            46 = dot (.)
            45 = minus (-)
        */
    },



    toast(msg){
        document.querySelectorAll('.fn-toast').forEach(e => e.remove());

        let div = document.createElement('div');
            div.className = "fn-toast"
            div.innerHTML = msg == undefined ? 'Lorem ipsum dolor' : msg

        document.body.appendChild(div)
        document.querySelector('.fn-toast').classList.add('active')

        clearInterval(interval);
        timer(5, function () {
            document.querySelector('.fn-toast').classList.remove('active')
        });
    },
    
    // image('map.png'), image('map.png', 'images')
    image(file, dir){
        return dir == undefined ? process.env.VUE_APP_API_URL+'/images/items/'+file : process.env.VUE_APP_API_URL+'/'+dir+'/'+file
    },
  
    // asset('map.png'), asset('map.png', 'images')
    asset(file, dir){
        return dir == undefined ? require('@/assets/img/'+file) : require('@/assets/'+dir+'/'+file)
    },

    // ambil hanya angka dalam string, ex: 'l0r3m1p5um' -> 0315
    getNumberOnly(str){
        return str.match(/\d/g).join("")
    },
    
    // ribuan(1500) -> 1.500, ribuan('1500|Rp ') -> Rp 1.500, ribuan('1500.530') -> 1.500,530
    // ribuan('1500.530|,2') -> 1.500,53, ribuan('1500.530|,1|Rp ') -> Rp 1.500,5
    ribuan(number){
        function convert(n){
            if (n != undefined) {
                var reverse = n.toString().split('').reverse().join(''),
                    ribuan = reverse.match(/\d{1,3}/g);
                ribuan = ribuan.join('.').split('').reverse().join('');
                return parseInt(n) < 0 ? '-'+ribuan : ribuan;
            }
        }

        if(number != null){
            
            var split = number.toString().split('|'), char = split.slice(1,3), l = split.length, result = 0;

            switch (l) {
                case 1: {
                    let p = split[0].split('.')
                    result = p.length < 2 ? convert(split[0]) : convert(p[0])+','+p[1]; break;
                }
                
                default: {
                    let str = char.join('')

                    if(str.includes(',')){ // jika ada koma dalam string

                        // get jumlah fixed, toFixed(4) -> 4 = fixed
                        let f = this.getNumberOnly(char.join('')),

                            // get currency -> rp, $, etc
                            cur = char.join('').replace(','+f, ''),

                            // get angka.toFixed(f)
                            n = parseFloat(split[0]).toFixed(f),
                            
                            // convert angka ke format ribuan
                            c = f < 1 ? convert(n.split('.')[0]) : convert(n.split('.')[0])+','+n.split('.')[1]

                        result = cur.trim() == '' ? c : cur+''+c;
                    }else{
                        result = split[1]+''+convert(split[0])
                    } break;
                
                }
            }

            return result;
        }
    },

    // .catch(err => { handle(this, err.response) })
    error: function (el, obj) {
        // console.clear();
        // console.error(obj.status)

        switch (obj.status) {
            case 400: {
                if(obj.data != null && obj.data.message != null){
                    this.toast(obj.data.message);
                }else{
                    this.toast('Error 400, tidak ada pesan error');
                } break;
            }

            case 500: {
                this.toast('Periksa api URL, status code 500');
                break;
            }
                
            default: this.toast('Terjadi kesalahan, status code '+obj.status);
                break;
        }

        // if (obj != undefined) {
        //     if(obj.status == 404){
        //         if(obj.data != null && obj.data.message != null){
        //             this.toast(obj.data.message);
        //         }else{
        //             this.toast('Kesalahan Server');
        //         }
        //     } else if (obj.status == 401) {
        //         this.toast('Session Expired!');
        //         el.$router.push('/login');
        //         localStorage.clear();
        //     } else if (obj.status == 500) {
        //         this.toast('Kesalahan server');
        //     } else if (obj.status == 422){
        //         if(obj.data != null && obj.data.message != null){
        //             this.toast(obj.data.message);
        //         }else{
        //             this.toast('Kesalahan Server');
        //         }
        //     }else {
        //         var result = Object.keys(obj.data).map(function (key) {
        //             return [Number(key), obj.data[key]];
        //         });

        //         for (let i = 0; i < result.length; i++) {
        //             // this.toast(result[i][1][0]);
        //             this.toast(result[i][1]);

        //             if (result[i][1] == obj.data.message) {
        //                 el.$router.push('/app/dashboard');
        //             }
        //         }
        //     }
        //     // console.clear();
        //     // console.log(result);
        // }
    },

    // yyyy-mm-dd hh:mm:ii, dateFormat('2020-04-09 01:30:15') -> 09-04-2020 01:30:15, dateFormat('2020-04-09|myd', '/') -> 04/2020/09
    dateFormat(date, s){
        function _date(format){
            let res = '';

            if(date.includes(' ')){ // datetime
                let dt = date.split(' '), d = dt[0].split('-'), t = dt[1].split('|')[0];
                let sp = s == undefined ? '-' : s;
                format.forEach(k => { res += d[k]+''+sp });
                res = res.slice(0, -1)+' '+t;
            }else{
                let d = date.split('|')[0].split('-');
                let sp = s == undefined ? '-' : s;

                format.forEach(k => { res += d[k]+''+sp });
                res = res.slice(0, -1)
            }

            return res
        }

        if(date != null){
            let result = '';
            
            if(date.includes('|')){
                let f = date.split('|')[1], fi = []

                for(let i = 0; i < f.length; i++){ fi.push(f[i] == 'y' ? 0 : f[i] == 'm' ? 1 : 2) }
                result = _date(fi)
            }else{
                let format = [2,1,0];

                if(date.includes(' ')){ // datetime
                    let dt = date.split(' '), d = dt[0].split('-'), t = dt[1].split('|')[0];
                    let sp = s == undefined ? '-' : s;
                    format.forEach(k => { result += d[k]+''+sp });
                    result = result.slice(0, -1)+' '+t;
                }else{
                    let dt = date.split(' '), d = dt[0].split('-');
                    let sp = s == undefined ? '-' : s;
                    format.forEach(k => { result += d[k]+''+sp });
                    result = result.slice(0, -1)
                }
            }

            return result;
        }
    },

    dTime(k){
        let date = new Date(),
            bulan = ['januari','februari','maret','april','mei','juni','juli','agustus','september','oktober','november','desember'],
            result

        let _d = date.getDate().toString().length > 1 ? date.getDate() : '0'+date.getDate(),
            _m = date.getMonth().toString().length > 1 ? (date.getMonth() + 1) : '0'+(date.getMonth() + 1),
            _y = date.getFullYear()

        let h = date.getHours().toString().length > 1 ? date.getHours() : '0'+date.getHours(),
            m = date.getMinutes().toString().length > 1 ? date.getMinutes() : '0'+date.getMinutes(),
            s = date.getSeconds().toString().length > 1 ? date.getSeconds() : '0'+date.getSeconds()

        switch (k) {
            case 'm': result = date.getMonth().length > 1 ? date.getMonth() + 1 : '0'+(date.getMonth() + 1); break;
            case 'M': result = this.ucwords(bulan[date.getMonth()]); break;
            case 'Y-m': result = date.getFullYear()+'-'+(date.getMonth().length > 1 ? (date.getMonth() + 1) : '0'+(date.getMonth() + 1)); break;
            case 'datetime': result = _y+'-'+_m+'-'+_d+' '+h+':'+m+':'+s; break;
            case 'date': result = _y+'-'+_m+'-'+_d; break;
            case 'time': result = h+':'+m+':'+s; break;
            case 'w': result = date.getDay(); break;
            case 'dMY': result = _d+' '+this.ucwords(bulan[parseInt(date.getMonth())])+' '+_y; break;
        
            default:
                break;
        }

        return result
    },

    dConvert(dateString, k){ // yyyy-mm-dd hh:ii:ss
        let result

        switch (k) {
            case 'isos': result = new Date(dateString).toISOString(); break; // 2020-05-04T00:00:00.000Z
            default:
                break;
        }

        return result
    },

    dCalculate(d1, d2){ // parameter requred = 2020-05-04T00:00:00.000Z
        let _d1 = new Date(Date.parse(this.dConvert(d1, 'isos'))), _d2 = new Date(Date.parse(this.dConvert(d2, 'isos')))

        let d3 = new Date(_d2 - _d1);
        let d0 = new Date(0);

        return {
            getHours: function(){
                return d3.getHours() - d0.getHours();
            },
            getMinutes: function(){
                return d3.getMinutes() - d0.getMinutes();
            },
            getMilliseconds: function() {
                return d3.getMilliseconds() - d0.getMilliseconds();
            },
            toString: function(){
                return this.getMinutes() >= 60 ? this.getHours() + ' j, ' + this.getMinutes() + ' m' : this.getMinutes() + ' m'
            },
        };
    },

    // dFormat('2020-06-03', 'd')
    dFormat(dateString, k){
        let date = new Date(Date.parse(dateString)),
        bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'], result,
        bulanCarbon = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

        let _d = date.getDate().toString().length > 1 ? date.getDate() : '0'+date.getDate(),
            _m = date.getMonth() >= 9 ? date.getMonth() + 1 : '0'+(date.getMonth() + 1),
            _y = date.getFullYear()

        let h = date.getHours().toString().length > 1 ? date.getHours() : '0'+date.getHours(),
            m = date.getMinutes().toString().length > 1 ? date.getMinutes() : '0'+date.getMinutes(),
            s = date.getSeconds().toString().length > 1 ? date.getSeconds() : '0'+date.getSeconds()

        switch (k) {
            case 'd': result = date.getDate(); break;
            case 'dmY': result = _d+'-'+_m+'-'+_y; break;
            case 'dMY': result = _d+' '+(bulan[date.getMonth()])+' '+_y; break;
            case 'd_M_Y': result = _d+'-'+(bulanCarbon[date.getMonth()])+'-'+_y; break;
            case 'd.m.Y': result = _d+'.'+_m+'.'+_y; break;
        
            default:
                break;
        }

        return result

    },

    dateTime(format){
        var now = new Date(); var year = now.getFullYear(), month = now.getMonth()+1, day = now.getDate(), hour = now.getHours(), minute = now.getMinutes(), second = now.getSeconds(); 
        if(month.toString().length == 1) {  month = '0'+month; } if(day.toString().length == 1) { day = '0'+day; } if(hour.toString().length == 1) { hour = '0'+hour; } if(minute.toString().length == 1) { minute = '0'+minute; } if(second.toString().length == 1) { second = '0'+second; }   
        let datetime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;   

        let dt = datetime.split(' '), d = dt[0].split('-');
        let dateTime;

        switch (format) {
            case null: dateTime = datetime; break;
            case 'datetime': dateTime = d[2]+'-'+d[1]+'-'+d[0]+' '+dt[1]; break; // dd-mm-yyyy hh:mm:ii
            case 'date': dateTime = d[2]+'-'+d[1]+'-'+d[0]; break; // dd-mm-yyyy
            case 'ymd': dateTime = d[0]+'-'+d[1]+'-'+d[2]; break; // yyyy-mm-dd
            case 'his': dateTime = dt[1]; break; // hh:mm:ii
            default: dateTime = d[2]+'-'+d[1]+'-'+d[0]+' '+dt[1]; break; // dd-mm-yyyy hh:mm:ii
        }

        return dateTime;
    },

    // lorem IpSUM -> Lorem Ipsum
    ucwords(str, firstOnly){
        if(firstOnly == null){
            return str.replace(/\b[a-z]/g, (letter) => {
                return letter.toUpperCase();
            });
        }else{
            return str.toLowerCase().replace(/\b[a-z]/g, (letter) => {
                return letter.toUpperCase();
            });
        }
    },

    // random angka berdasarkan tanggal hari ini
    random(){
        return Math.floor(Date.now() / 1000);
    },

    randomStr(length = 5){
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

    // objectToArray({id: 10, name: 'ashta'}) -> [10,'ashta']
    objectToArray(obj){
        return Object.keys(obj).map(function (key) {
            return obj[key];
        });
    },

    // cari objek dalam array by key, contoh data -> let data = [{'id': 1}, {'id': 2}]
    // findObject(data, 'id', 1, (d, i) => { console.log(d / i) }) d = {'id': 1}, i = 0
    findObject(object, key, value, callback){
        var index = object.findIndex(obj => { return obj[key] == value; });
        callback.length == 1 ? callback(index) : callback(object[index], index);
    },

    /*  fillK -> method untuk mengisi dan memanipulasi objek
        contoh: kita punya objek -> let json = [{'id_user': 1, 'nama_user': 'lorem ipsum', 'nilai': 2}, {'id_user': 2, 'nama_user': 'dolor set', 'nilai': 5}], 
                kemudian kita ingin mengubah dan memanipulasi key dan nilainya, maka cara menggunakannya seperti berikut

                1.  deklarasikan key dari objek asli yang ingin kita ambil
                    let keys = ['nama_user','nilai'] -> get hanya nama & nilai

                2.  fillK({keys: keys, o: json}) -> result = {'Nama User': 'lorem ipsum', 'Nilai': 2}, ... 

                    let total = 0; json.forEach(o => { total += o.nilai  })
                3.  fillK({keys: keys, fill: ['nilai'], value: [total]}) -> result = {'Nilai': 7}
    */
    fillK(params){
        let object = {}, keys = params.keys, o = params.o, fill = params.fill == undefined ? [] : params.fill, value = params.value

        if(o == undefined){
            keys.forEach(k => {
                if(fill.indexOf(k) > -1){
                    object[this.ucwords(k.replace('_', ' '))] = value[fill.indexOf(k)]
                }else{
                    object[this.ucwords(k.replace('_', ' '))] = ''
                }
            })
        }else{
            keys.forEach(k => {
                if(fill.indexOf(k) > -1){
                    object[this.ucwords(k.replace('_', ' '))] = value[fill.indexOf(k)]
                }else{
                    object[this.ucwords(k.replace('_', ' '))] = o[k]
                }
            })
        }

        return object
    },


    // in data() -> return { access: {} }
    // permission({c: 'admin', r: 'admin,sales'}, (res) => { access = res }), v-if="access.c"
    permission(conf, callback){
        let role = this.getAuth(localStorage.token, 'auth').account.role;
  
        let pattern = {c: false, r: false, u: false, d: false}
        for (const k in conf) {
          if(conf[k].split(',').indexOf(role) > -1){
            pattern[k] = true;
          }
        }
  
        callback(pattern)
    },

    // onclick="copyToClipboard('idElement')"
    copyToClipboard(id){
        var range = document.createRange();
        range.selectNode(document.getElementById(id));
        window.getSelection().removeAllRanges(); // clear current selection
        window.getSelection().addRange(range); // to select text
        document.execCommand("copy");
        window.getSelection().removeAllRanges();// to deselect
    },

    dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, {type:mime});
    },

    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },

    browser(){
        function test(regexp) {return regexp.test(window.navigator.userAgent)}
        
        switch (true) {
            case test(/edg/i): return "Microsoft Edge";
            case test(/trident/i): return "Microsoft Internet Explorer";
            case test(/firefox|fxios/i): return "Mozilla Firefox";
            case test(/opr\//i): return "Opera";
            case test(/ucbrowser/i): return "UC Browser";
            case test(/samsungbrowser/i): return "Samsung Browser";
            case test(/chrome|crios/i): return "Google Chrome";
            case test(/safari/i): return "Apple Safari";
            default: return "Other";
        }
    },

    dateCalc(endDate, startDate){
        let diff = (new Date(startDate)) - (new Date(endDate));
        return diff / (1000 * 60 * 60 * 24)
    },

    onError(err, params){
        // console.log(' - '+err)

        if(err.response == undefined){
            this.toast(err)
        }else{
            let response = err.response,
            status = err.response.status;

            switch (status) {
                case 400:
                    if(response.data.message != null){
                        this.toast(response.data.message)
                    }else{
                        this.toast('404 - Not Found!')
                    }

                    break;

                case 401:
                    // this.toast('Token expired');
                    this.$router.push('/?message=unauthorized');
                    break;

                case 404:
                    if(response.data.message != null){
                        this.toast(response.data.message)
                    }else{
                        this.toast('404 - Not Found!')
                    }

                    break;

                case 422:
                    for (const key in response.data) {
                        if(response.data[key] != null){
                            this.toast(response.data[key].toString())
                        }else{
                            this.toast('422 - Form data tidak valid')
                        }
                    }

                    break;

                case 403:
                    for (const key in response.data) {
                        if(response.data[key] != null){
                            this.toast(status+' - '+response.data[key].toString()+' ('+response.config.url+')')
                        }else{
                            this.toast(status+' - Unknown error')
                        }
                    }

                    if(params != null && params.redirect != null){
                        this.$router.push('/403');
                    }

                    break;

                case 500:
                    this.toast(status+' - Internal server error')
                break;

            
                default: this.toast(status+' - Unknown error')
                    break;
            }
        }
        
    },

    _scrollTo(ref, time = 0){
        setTimeout(() => {
            let scroll = this.$refs[ref];
            scroll.scrollTop = scroll.scrollHeight;
        }, time);
    },

    scrollTo(ref, time = 0) { console.log(ref)
        setTimeout(() => {
            let element = this.$refs[ref];
            element.scrollTop = element.offsetTop;

            // window.scroll({
            //     behavior: 'smooth',
            //     left: 0,
            //     top: element.offsetTop
            // });
        }, time);
    },

    formatNpwp(nomor) {
        if (typeof nomor === 'string') {
            return nomor.replace(/(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})(\d{3})/, '$1.$2.$3.$4-$5.$6');
        }
    }
}

export default { methods }

/*  note
    'LOREM'.split(/(?=[A-Z])/) -> pecah huruf kapital A-Z -> L,O,R,E,M replace by comma -> .replace(/,/g)

    this.data.splice(0, 0, res.data.data ); // insert to first index
    this.data.splice(i, 1); -> hapus object by index, i == index, 1 = jumlah
*/
