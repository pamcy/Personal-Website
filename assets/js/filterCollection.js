var dataUrls = 'assets/data/codework-70eaa-export.json',
    dataCollections,
    currentDisplayCollections = [], // Store all projects on the current screen
    mixer,
    currentFilterValue = 'all', // Current filter tag value, set 'all' as default
    numberOfPagesPerPage = 10;

// Load more button
var loadMoreBtnObj = {
    jQDom: $('#loadmore-btn'),

    setPage: function(page) {
        this.jQDom.data('page', page);
    },

    // Get current page number, 0 as default
    getPage: function() {
        return this.jQDom.data('page') || 0;
    },

    // Change 'Load More' to 'Loading..'
    setStatusToLoading: function() {
        this.jQDom.show().prop('disabled', true)
            .find('#loadmore-btn--normal').hide().end()
            .find('#loadmore-btn--loading').fadeIn('slow');
    },

    // Change 'Loading..' to 'Load More'
    setStatusToNormal: function() {
        this.jQDom.show().prop('disabled', false)
            .find('#loadmore-btn--loading').hide().end()
            .find('#loadmore-btn--normal').fadeIn('slow');
    },

    // Hide Load More button if projects numbers are <= 10
    setStatusToNoMore: function() {
        this.jQDom.hide();
    }
};

// Insert HTML
var renderDom = function(dataObj) {
    var tagLiHtml = '',
        tagClassList = dataObj.tags.join(' ');

    $.each(dataObj.tags, function(key, value) { // Tags of each card
        tagLiHtml += '<li>' + value + '</li>';
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
            </a>`
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
        .sort(function(a,b){return b - a}) // Sort form max to min
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

// Initialize Mixitiup
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
        $('.code-work').empty();
        loadMoreBtnObj.setPage(0); // Page number set to 0
        currentDisplayCollections = []; // 和前次選則不同，清除資料暫存包
        filter(this.value);
    });

    // Load more contents
    loadMoreBtnObj.jQDom.click(function(){
        filter(currentFilterValue);
    });
});
