const APPID = "20160802000026137";
const request_url_baidu = "http://api.fanyi.baidu.com/api/trans/vip/translate";
const request_url_shanbay = "https://api.shanbay.com/bdc/search";
const secret = 'IxVZcl6GoqCsnfeqkCuh';
$('body').on('click', function (e) {
    $('.popout').remove();
});
$('body').on('dblclick', function (e) {
    $('.popout').remove();
    let pageX = e.pageX,
        pageY = e.pageY;

    let txt = window.getSelection ? window.getSelection().toString() : document.selection.createRange().text.toString(),
        regEn = /[_a-zA-Z]/g,
        regZh = /^[\u4e00-\u9fa5]+$/;

    if (regEn.test(txt)) {
        $.ajax({
            url: request_url_shanbay,
            method:'GET',
            data: {
                word: txt
            },
            headers:{
                "Content-Type":"application-/x-www-form-urlencoded"
            },
            success: function (res) {
                if (res.status_code === 1) {
                    requestBaidu(pageX, pageY, txt, APPID, secret);
                } else {
                    popout(pageX, pageY, txt, res.data.definition);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    } else if (regZh.test(txt)) {
        requestBaidu(pageX, pageY, txt, APPID, secret);
    }
});

function requestBaidu( posX, posY, txt, appid, secret) {
    let data = {
        q: txt,
        from: 'auto',
        to: 'auto',
        appid: appid,
        salt: new Date().getTime(),
        sign: ''
    };
    data.sign = $.md5(appid + txt + data.salt + secret);
    $.ajax({
        url: request_url_baidu,
        method:'GET',
        data: data,
        headers:{
            "Content-Type":"application-/x-www-form-urlencoded"
        },
        success: function (res) {
            console.log(res);
            popout(posX, posY, data.q, res.trans_result[0].dst);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function popout(posX, posY, word, res) {
    const popout = $('<div class="popout" style="left:'+ (Number(posX) + 5) +'px; top:'+ (Number(posY) + 10) +'px; z-index: 9999;"></div>');
    const source = $('<p class="source">'+ word +'</p>');
    const trans_res = $('<div class="trans-res">'+ res +'</div>')
    popout.append(source);
    popout.append(trans_res);
    $('body').append(popout);
}