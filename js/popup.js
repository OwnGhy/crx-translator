// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', function () {
    getWebStore()

    // 在这外面绑定无效
    $('#test').on('click', function () {
        $('#output').html('test')
    });
});

function noFn() {
}

function messager({
                      from = "",
                      subject = {},
                      afterSend = noFn,
                      beforeSend = noFn
                  }) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        beforeSend(tabs)
        chrome.tabs.sendMessage(
            tabs[0].id, {
                from,
                subject: JSON.stringify(subject)
            },
            function (resp = "") {
                afterSend(JSON.parse(resp))
            }
        );
    })
}

function getWebStore() {
    messager({
        from: 'getWebStore',
        subject: {},
        afterSend: initPopupShow
    })
}

function initPopupShow(store) {
    console.log('initPopupShow', store)
    $('#output').html(JSON.stringify(store))
}