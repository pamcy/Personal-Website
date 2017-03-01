let filterWaitTime = 300;
let mixer = mixitup('.code-work');
let database = firebase.database();
let timer = null;
let currentFilterValue = 'all';

// API -> Firebase: Get data rows ID of urlTags
let getTagList = function(tag) {
    database.ref(`urlTags/${tag}`).once('value', function(resultTags) { // api url : urlTags/html
        mixer.hide();
        // console.log(resultTags.val()) // api return value: [0, 3]

        $.each(resultTags.val(), function(key, dataId){
            getDataById(dataId);
        });

    }, function (error) {
        console.error("Error: " + error.code);
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

        fillDOM(resultData.key, resultData.val());
        timer = setTimeout(executeMixerFilter, filterWaitTime);
        // Execute Mixitup filter after 0.3s

    }, function (error) {
        clearTimeout(timer);
        console.error("Error: " + error.code);
    });
}

// Insert data to HTML DOM
let fillDOM = function(dataKey, dataObj) {

    // 若 html dom 已存在則離開
    if ($(`#data-${dataKey}`).length > 0 ) {
        return;
    }

    // Tags of each card
    let tagLiHtml = '';
    $.each(dataObj.tags, function(key, value) {
        tagLiHtml += `<li>${value}</li>`;
    });

    let $mixTemplate = $('#code-card-template').clone()
        .attr('id', `data-${dataKey}`)
        .attr('data-order', (parseInt(dataKey) + 1) )
        .addClass(dataObj.tags.join(' ')) // e.g. html css
        .find('.card-title').text(dataObj.title).end()
        .find('.card-description').text(dataObj.desc).end()
        .find('.card-img').attr('src', dataObj.image).end()
        .find('.card-url').attr('href', dataObj.url).end()
        .find('.card-tag').html(tagLiHtml).end();

    $('.code-work').append($mixTemplate);

    // Notify Mixer to add the DOM
    mixer.insert($(`#data-${dataKey}`), (mixer.getState().totalShow - 1));
}

// To execute the Mixitup filter according to the current tag value
let executeMixerFilter = function() {
    clearTimeout(timer);

    if (mixer.isMixing()) {
        timer = setTimeout(executeMixerFilter, filterWaitTime / 2);
        return;
    }

    if (currentFilterValue == 'all') {
        filterString = 'all';
    } else {
        filterString = '.' + currentFilterValue;
    }

    // Mixer execute the filter and sort function
    mixer.multimix({
        filter: filterString,
        sort: 'order:desc'
    });
}

$(function(){
    getTagList('all');

    $('.filter-btn').click(function(){
        currentFilterValue = this.value;
        getTagList(currentFilterValue);
    });
});
