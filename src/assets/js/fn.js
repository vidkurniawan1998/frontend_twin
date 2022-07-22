import $ from 'jquery';

var interval;

function timer(time, callback) {
    interval = setInterval(function () {
        time -= 1;
        time <= 0 && clearInterval(interval) | callback()
    }, 1000);
}

$.fn.par = function (num) {
    var elem = [];
    this.each(function () {
        var el = this;
        while (num > 0) {
            if (el.parentNode) el = el.parentNode;
            num--;
        }
        elem.push(el);
    });
    return $(elem || this);
};

Array.prototype.pull = function() {
	var what, a = arguments, L = a.length, ax;
	while (L && this.length) {
		what = a[--L];
		while ((ax = this.indexOf(what)) !== -1) {
			this.splice(ax, 1);
		}
	}
	return this;
}

$(document).ready(function(){

    $('[number-only]').on('keypress', function(e){
        if (e.which != 8 && e.which != 0 && e.which < 48 || e.which > 57) {
            e.preventDefault();
        }
    });

})



export const fn = {
    spin: '<i class="fa fa-spin fa-spinner"></i>',

    toast: function (msg) {
        if (msg == undefined) {
            msg = ''
        }
        $('.fn-toast').remove();
        $('body').append('<div class="fn-toast toastSlide"> ' + msg + ' </div>');

        clearInterval(interval);
        timer(5, function () {
            $('.fn-toast').fadeOut(500);
        });
    },

    inotif: function (options) {
        $('.imodal').remove();
        let btn;
        if (!options.btn_color) {
            btn = 'btn-danger';
        } else {
            btn = 'btn-primary';
        }

        $('body').append(
            '<div class="imodal">' +
            '<div class="imodal-body" style="display:none">' +
            '<p>' + options.msg + '</p>' +
            '<div class="text-right">' +
            '<div class="btn-group">' +
            '<button class="btn btn-secondary" onclick=\'$(".imodal").remove()\'>' + options.cancel + '</button>' +
            '<button class="btn ' + btn + '" action="' + options.action + '">' + options.ok + '</button>' +
            '</div>' +
            '</div>' +

            '</div>' +
            '</div>'
        );
        $('.imodal-body').fadeIn(300);
    },

    phone_format: function (e) {
        if (e.which != 8 && e.which != 0 && e.which < 48 || e.which > 57) {
            e.preventDefault();
        }
    },

    handle: function (el, obj) {
        if (obj != undefined) {
            if (obj.status == 401) {
                this.toast('Session Expired!');
                el.$router.push('/login');
                localStorage.clear();
            } else if (obj.status == 500) {
                this.toast('Kesalahan server');
            } else {
                var result = Object.keys(obj.data).map(function (key) {
                    return [Number(key), obj.data[key]];
                });

                for (let i = 0; i < result.length; i++) {
                    // this.toast(result[i][1][0]);
                    this.toast(result[i][1]);

                    if (result[i][1] == 'Anda tidak berhak untuk mengakses fungsi ini!') {
                        el.$router.push('/app/dashboard');
                    }
                }
            }
            // console.clear();
            // console.log(result);
        }
    },

    dateTime: function () {
        var now = new Date(); var year = now.getFullYear(), month = now.getMonth()+1, day = now.getDate(), hour = now.getHours(), minute = now.getMinutes(), second = now.getSeconds();
        if(month.toString().length == 1) {  month = '0'+month; } if(day.toString().length == 1) { day = '0'+day; } if(hour.toString().length == 1) { hour = '0'+hour; } if(minute.toString().length == 1) { minute = '0'+minute; } if(second.toString().length == 1) { second = '0'+second; }
        return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
    },

    date_time: function(date, format = 'd-m-y'){
        let split = date.split(' '), d = split[0].split('-');

        switch (format) {
            case 'd-m-y': return d[2]+'-'+d[1]+'-'+d[0];
        }
    },

    objToArr: function (obj) {
        Object.keys(obj).map(function (key) {
            return obj[key];
        });
    },

    rupiah: function (number) {
        if (number != undefined) {
            var reverse = number.toString().split('').reverse().join(''),
                ribuan = reverse.match(/\d{1,3}/g);
            ribuan = ribuan.join('.').split('').reverse().join('');
            return ribuan;
        }
    },

    generate: function () {
        return Math.floor(Date.now() / 1000);
    },

    // 404 = parameter (ex: id) tidak ditemukan
    // 401 = unautorized (ex: belum login / token expired)
    // 500 = api gagal terkoneksi / internet bermasalah
    // 422 = validasi gagal, input front-end dengan input back-end tidak sesuai
    // 200 = sukses



    // generate data table -> data json
    tableToJson: function (table) {

        var data = [];
        // first row needs to be headers
        var headers = [];
        for (let i = 0; i < table.rows[0].cells.length; i++) {
            headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, '');
        }

        // go through cells
        for (let i = 1; i < table.rows.length; i++) {
            var tableRow = table.rows[i];
            var rowData = {};
            for (var j = 0; j < tableRow.cells.length; j++) {
                rowData[headers[j]] = tableRow.cells[j].innerHTML;
            }
            data.push(rowData);
        }

        return data;
    },

    setPermissions(conf, callback){
        let role = JSON.parse(localStorage.user)['role'],
            permissions = {
                create: false,
                read: false,
                update: false,
                delete: false,
                approve: false,
                print: false
            };

        for (const k in conf) {
            if( conf[k].indexOf(role) > -1 ){
                permissions[k] = true;
            }
        }

        callback(permissions)
    },

    copyToClipboard(id) {
        var range = document.createRange();
        range.selectNode(document.getElementById(id));
        window.getSelection().removeAllRanges(); // clear current selection
        window.getSelection().addRange(range); // to select text
        document.execCommand("copy");
        window.getSelection().removeAllRanges();// to deselect
        fn.toast('Disalin');
    },

    ucwords: (str) => {
        let res = str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });

        return res;
    },

    isEmpty(str){
        return str.replace(/\s/g, '');
    },

    sparateUppercase(str){
        return str.split(/(?=[A-Z])/).toString().replace(/,/g, ' ');
    }
};
