var dataUrls = 'src/data/codework-70eaa-export.json';
var collections = {}; // 儲存所有資料
var currentDisplayCollections = []; // 儲存目前顯示於畫面上的資料
var mixer;
var currentFilterValue = 'all'; // 目前 filter tag, 預設為 all
var numberOfPagesPerPage = 10; // 每頁筆數

// load more button 管理器
var loadMoreBtnObj = {
    jQDom: $('#loadmore-btn'),

    setPage: function(page) {
        this.jQDom.data('page', page);
    },

    // 取得目前頁數, 預設為第 0 頁
    getPage: function() {
        return this.jQDom.data('page') || 0;
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

// 將資料填入 html; mixitiup 將自動觸發
var renderDom = function(dataObj) {
    var tagLiHtml = '';
    var tagClassList = dataObj.tags.join(' ');
    $.each(dataObj.tags, function(key, value) { // Tags of each card
        tagLiHtml += '<li>' + value + '</li>';
    });

    return '<div class="mix code-card ' + tagClassList + '" id="data-' + dataObj.id + '" data-order="' + dataObj.id + '">'
            + '<a class="card-url" href="' + dataObj.url + '" target="_blank">'
                + '<img class="card-img" src="' + dataObj.image + '">'
            + '</a>'
            + '<div class="card-textarea">'
                + '<h3 class="card-title">'
                    + '<a class="card-title-url" href="' + dataObj.url + '" target="_blank">' + dataObj.title + '</a>'
                + '</h3>'
                + '<p class="card-description">' + dataObj.desc + '</p>'
                + '<div class="card-alltags">'
                    + '<i class="card-tagicon fa fa-tags"></i>'
                    + '<ul class="card-tag">' + tagLiHtml + '</ul>'
                + '</div>'
            + '</div>'
            + '<a class="card-btn-url" href="' + dataObj.url + '" target="_blank">'
                + '<button type="button" class="card-btn">View Demo</button>'
            + '</a>'
        + '</div>';
};

// 篩選資料並填至畫面上
var filter = function(category_string) {
    if (! dataCollections.urlTags) { // 以防沒資料時出錯
        console.error('missing "urlTags" data');
        return false;
    }

    loadMoreBtnObj.setStatusToLoading();

    var page = loadMoreBtnObj.getPage();
    var categoryIds = dataCollections.urlTags[category_string]
        .sort(function(a,b){return b - a}) // 排序，由大到小
        .slice(page * numberOfPagesPerPage, (page + 1) * numberOfPagesPerPage); // 分割資料為了分頁功能

    if (categoryIds.length < numberOfPagesPerPage) {
        loadMoreBtnObj.setStatusToNoMore();
    } else {
        loadMoreBtnObj.setStatusToNormal();
    }

    loadMoreBtnObj.setPage(page + 1);

    for(var i in categoryIds) {
        currentDisplayCollections.push(dataCollections.urlData[categoryIds[i]]);
    }

    mixer.dataset( currentDisplayCollections );
};

// 初始化/第一次建立 mixitiup
var initMixitup = function() {
    $.get(dataUrls, function(datas){
        dataCollections = datas;

        mixer = mixitup('.code-work', {
            data: {
                uidKey: 'id'
            },
            render: {
                target: renderDom
            },
            load: {
                sort: 'order:desc',
            }
        });

        // 第一次執行，預設使用 `all` filter
        $('button[value="' + currentFilterValue + '"]').click();

    }, 'json');
};

$(function(){
    initMixitup();

    $('.filter-btn').click(function() {
        $('.filter-btn').removeClass('filter-btn-isActive');
        $(this).addClass('filter-btn-isActive');

        currentFilterValue = this.value;
        loadMoreBtnObj.setPage(0); // 頁數歸零
        currentDisplayCollections = []; // 和前次選則不同，清除資料暫存包
        filter(this.value);
    });

    // `讀取更多` 鈕
    loadMoreBtnObj.jQDom.click(function(){
        filter(currentFilterValue);
    });
});
