let filterWaitTime = 300; // mixitup 觸發時間; 0.3s
let mixer;
let mixerDatasets = []; // firebase api 資料暫存包
let database = firebase.database(); // firebase 資料庫介面
let timer = null;
let currentFilterValue = 'all'; // 目前 filter tag, 預設為 all
let numberOfPagesPerPage = 10; // 每頁筆數

// load more button 管理器
let loadMoreBtnObj = {
    jQDom: $('#loadmore-btn'),

    // 取得列表中最小值，方便做為下次 load more 的起始值
    setMinimalId: function(tagList) {
        let minimalIndex = Object.keys(tagList)[0]; // 因 object index 會自動排序, 第一個 index key 值為該 object 內最小值
        this.jQDom.data('minimal', minimalIndex);
    },

    getMinimalId: function() {
        return this.jQDom.data('minimal');
    },

    // 將 load more 文字變更為讀取中
    setStatusToLoading: function() {
        this.jQDom.show().prop('disabled', true)
            .find('#loadmore-btn--normal').hide().end()
            .find('#loadmore-btn--loading').fadeIn('slow');
    },

    // 將 load more 文字變更為一般狀態
    setStatusToNormal: function() {
        this.jQDom.show().prop('disabled', false)
            .find('#loadmore-btn--loading').hide().end()
            .find('#loadmore-btn--normal').fadeIn('slow');
    },

    // 沒有更多資料時，隱藏 load more button
    setStatusToNoMore: function() {
        this.jQDom.hide();
    }
};

// API -> Firebase: Get data rows ID of urlTags
let getTagList = function(tag, endAt) {

    loadMoreBtnObj.setStatusToLoading();

    let _ref = database.ref(`urlTags/${tag}`);
    _ref = _ref.orderByKey();

    if (endAt) {
        _ref = _ref.limitToLast(numberOfPagesPerPage + 1).endAt(endAt.toString());
    } else {
        _ref = _ref.limitToLast(numberOfPagesPerPage)
    }

    _ref.once('value', function(resultTags) { // api url : urlTags/html
        let tagObjectList = resultTags.val();
        loadMoreBtnObj.setMinimalId(tagObjectList);

        let tagList = [];
        Object.keys(tagObjectList).reverse().forEach(function(key) {
            tagList.push(tagObjectList[key].toString());
        });

        // console.log(tagList) // for debug; api return value e.g. [26, 27, 28, 29, 30]

        $.each(tagList, function(key, dataId){
            if (dataId == endAt) {
                return true;
            }

            getDataById(dataId);
        });

    }, function (error) {
        console.error("getTagList() Error: " + error.code);
    });
}

// API -> Get each code cards data with urlTag's ID
let getDataById = function(dataId) {
    database.ref(`urlData/${dataId}`).once('value', function(resultData) { // api url : urlData/0 or urlData/3
        clearTimeout(timer);
        // console.log(resultData.val());
        // e.g. { "desc": "url desc",
        //        "title": "url title",
        //        "image"： "http://"，
        //        "tags": ["html", "css"],
        //        "url": "http://"
        //  }

        mixerDatasets.push(resultData.val());
        timer = setTimeout(executeMixerFilter, filterWaitTime); // 0.3s 後將資料包塞入 mixitup

    }, function (error) {
        console.error("getDataById Error: " + error.code);
    });
}

// 將資料填入 html; mixitiup 將自動觸發
let fillDOM = function(dataObj) {
    let tagLiHtml = '';
    let tagClassList = dataObj.tags.join(' ');
    $.each(dataObj.tags, function(key, value) { // Tags of each card
        tagLiHtml += `<li>${value}</li>`;
    });

    return `<div class="mix code-card ${tagClassList}" id="data-${dataObj.id}" data-order="${dataObj.id}">
                <a class="card-url" href="${dataObj.url}" target="_blank">
                    <img class="card-img" src="${dataObj.image}">
                </a>
                <div class="card-textarea">
                    <h3 class="card-title">
                        <a class="card-title-url" href="${dataObj.url}" target="_blank">${dataObj.title}</a>
                    </h3>
                    <p class="card-description">${dataObj.desc}</p>
                    <div class="card-alltags">
                        <i class="card-tagicon fa fa-tags"></i>
                        <ul class="card-tag">${tagLiHtml}</ul>
                    </div>
                </div>
                <a class="card-btn-url" href="${dataObj.url}" target="_blank">
                    <button type="button" class="card-btn">View Demo</button>
                </a>
            </div>`;
}

// To execute the Mixitup filter according to the current tag value
let executeMixerFilter = function() {
    clearTimeout(timer);

    if (mixer.isMixing()) { // 若 mixitup 動畫還在執行 稍後重試
        timer = setTimeout(executeMixerFilter, filterWaitTime);
        return;
    }

    mixer.dataset(mixerDatasets); // mixitup API; 一次塞入多筆資料至 mixitup

    // 當資料 id <= 0 表示後面沒有資料
    if (loadMoreBtnObj.getMinimalId() <= 0) {
        loadMoreBtnObj.setStatusToNoMore();
    } else {
        loadMoreBtnObj.setStatusToNormal();
    }
}

// 初始化/第一次建立 mixitiup
let initMixitup = function() {
    mixer = mixitup('.code-work', {
        data: {
            uidKey: 'id'
        },
        render: {
            target: fillDOM
        },
        load: {
            sort: 'order:desc'
        }
    });
}


$(function(){
    initMixitup();

    getTagList(currentFilterValue);
    $(`button[value="${currentFilterValue}"]`).addClass('filter-btn-isActive');

    $('.filter-btn').click(function() {

        if (currentFilterValue != this.value) {
            mixerDatasets = []; // 和前次選則不同，清除資料暫存包
            loadMoreBtnObj.setStatusToNormal();
        }

        currentFilterValue = this.value;
        getTagList(currentFilterValue);
        $('.filter-btn').removeClass('filter-btn-isActive');
        $(this).addClass('filter-btn-isActive');
    });

    // load more button
    loadMoreBtnObj.jQDom.click(function(){
        getTagList(currentFilterValue, loadMoreBtnObj.getMinimalId());
    });
});
