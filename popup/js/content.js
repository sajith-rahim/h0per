//globals

let _DATA_RAW_ = {};
let _DATA_ = {};

const LOCAL_KEY = "HOPER_LOCAL_KEY";


let _BASE_URL_MAP_ = new Map();
_BASE_URL_MAP_.set("REQ_CT_NEW_INST", "https://www.google.com");
_BASE_URL_MAP_.set("REQ_RETIRE_INST", "https://www.google.com");
_BASE_URL_MAP_.set("MNG_INST_DASH", "https://www.google.com");

_BASE_URL_MAP_.set("HIHOP", "https://www.google.com/search?q=")


/* Readcted internal URLs
U2FsdGVkX19ES9rfbhcXr70Xctq5KlY630F+Tv94MIIZZRfwzuKp77ubtws4Iv3wPTCfihXtQDozPM+bEvy8hGwHx42iXr4Qjnh390saHQUCAtCVBtHLmV2uVV6fX1K5HBx1Zuw0GNjNwE0iSLimDHxSvroosmvmmGe/sSc3d38BMgqohOyfR5f0bhYmxY925AuW604REhuGvga/ERZgXA06I5DRjuzebOdYJQvXbRbFWe8rfFtuny/8RxrXJEMs2OSWSj/v3xaijDBOs0Iy/I+rKj+8jwkJq5AisiEs3cT1+ULlfKXkqrkLZLWFCLLKeHoimc6FiN71JNR0HzeOBpNXarZZ/k2OUNDmT1VNcZOppbNMJWJ3NlvWcjTsUa2fXZLcgsytSHIjLReks9bBzz6DwTIVt3pyOKEyC6PL/rICzc+JaSJB0dXH2hVWJWoKz+/nuasNC0bxIw/RopiPEl0vPyCgGuqUyRXlXgu7Eju9C/VyaNdoicMk2Kqfjgbz3S1o76c8DxaGtoXeBqNrDmmX9baZDTzqZRL8aKT8g4NdTUzVxx8/Gtvytft+5actGtCpFW4im7P0KZL+6ccLeDNy0uw5plGOH+JYLsUb9moPLlByb/ZM0QSxkeoBx+MuNskDXmx3rCyrxSshtw3m41XmZldGIpbsbAxX1n1vgxJKP/WU+9jlXQdWTDfc8wP1gODrPAC33XuAc1htoZPtLY2RqBHgdZhG7I13NJYhvgxIlSNRU5JYAhIhmze0/ayE07mdQbd7UKJlXVQCpKakyHK1Sse5IW86bd2nTzmU8ry0YHtum7pSvVqwiaslnkKMSU77nDgrTzwt+SLWYxm6YNChdqt8qU7+jyCbQSRy9ic=
*/





$(".add-new-instance").on('click', handleFormOpen);

$(".close-form-btn").on('click', handleFormClose);

$(".save-btn").on('click', processForm);

$(".refresh-instance-list").on('click', retrieveEntriesFromStorage)


$("#header-search").keyup(debounce(function () {
    //debugger;
    let search = $(this).val();
    setInstanceList(_DATA_.filter(e => e.name.indexOf(search) >= 0));
}, 400));

$(".reset-instance-list").on('click', () => {
    if (confirm("Are sure you want to reset? \n \n⚠ This action cannot be undone.")) {
        let value = prompt("type 'reset' to confirm")
        if (value !== 'reset') {
            return;
        }
        StorageService.clearEntries()
            .then(retrieveEntriesFromStorage())
            .catch((error) => {
                console.log(error);
            });
    }
})


$(".catalog-req").on('click', (el) => handleURLRedirect(el));


function handleFormOpen() {
    //debugger;
    $(".content").hide();
    $(".sidebar").hide();
    $(".uk-navbar-toggle").hide();
    $(".nav-info-btn").hide();
    $(".close-form-btn").show();
    $(".form").show();
    $(".main").css('grid-template-areas', '"header header" "form form" "form form"');
    // $(".main").css('grid-template-areas','"header header" "sidebar content" "sidebar content"');
}


function handleFormClose() {
    $(".close-form-btn").hide();
    $(".uk-navbar-toggle").show();
    $(".nav-info-btn").show();
    $(".form").hide();
    $(".content").show();
    $(".sidebar").show();
    $(".main").css('grid-template-areas', '"header header" "sidebar content" "sidebar content"');
}


function processForm() {
    let _form = $('form').serializeArray();
    localStorage.setItem(LOCAL_KEY, $('.instance-form').find('#instance-name').val() || '');
    StorageService.saveEntry({ rawStr: JSON.stringify(_form) })

}

function loadInstanceData(data) {
    //debugger;

    _DATA_RAW_ = data;

    let instanceArray = [];

    data.forEach(element => {
        let _out = {};
        JSON.parse(element.rawStr).forEach(e => {
            _out[e.name] = e.value;
        })
        instanceArray.push(_out);
    });

    console.log(instanceArray);

    _DATA_ = instanceArray;
    setInstanceList(instanceArray);


}

function setInstanceList(instanceArray) {

    let instanceList = $('.instance-list');
    $("#stat-total-records").html(instanceArray.length);

    //clear
    instanceList.html('');

    if (instanceArray.length == 0) {
        $('<div class="no-records-wrapper"><p style="margin:auto; padding: 2em 0em"><span class="fill-red" uk-icon="warning"></span> No persisted instances found. </br> <span class="no-records-msg-add-action"><span class="fill-green" uk-icon="pencil"></span> Add</span></p><div>').appendTo(instanceList);
        $(".no-records-msg-add-action").on('click', handleFormOpen);
    }

    instanceArray.forEach(instance => {
        let className = parseBoolean(instance.isFavourite) ? 'fill-red' : 'fill-black';
        let favColor = '';
        let delete_icon = '🗑 DELETE'
        let html = `<li> <div class="list-card"> <div class="list-card-icon" uk-tooltip="title: ${delete_icon}; pos: top"> <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill=${favColor} class="bi bi-cpu" viewBox="0 0 16 16"> <path d="M5 0a.5.5 0 0 1 .5.5V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2A2.5 2.5 0 0 1 14 4.5h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14a2.5 2.5 0 0 1-2.5 2.5v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14A2.5 2.5 0 0 1 2 11.5H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2A2.5 2.5 0 0 1 4.5 2V.5A.5.5 0 0 1 5 0zm-.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3h-7zM5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3zM6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/> </svg> </div> <div class="list-card-content" uk-tooltip="title: ${instance.text}; pos: bottom"> ${instance.name} </div> <div class="list-card-actions"> <a href="" class=" ${className} no-action" uk-icon="icon: heart"></a> <a class="play-action-btn" uk-icon="icon: play"></a> </div> </div> </li>`;
        //console.log(html);
        if (parseBoolean(instance.isFavourite)) {
            let lastPersisted = localStorage.getItem(LOCAL_KEY) || '';
            if (lastPersisted.length > 0) {
                console.log(lastPersisted);
                if (lastPersisted === instance.name) {
                    sendToBackground('add-instance', { instance_name: instance.name });
                    localStorage.removeItem(LOCAL_KEY);
                }
            }
        }

        $(html).appendTo(instanceList);
    })

    // add event handler
    $(".list-card-icon").dblclick(el => deleteInstanceEntry(el));
    $(".play-action-btn").on('click', el => handleURLRedirect(el));

    $(".spinner-wrapper").hide();
}

function deleteInstanceEntry(el) {
    //debugger;
    let _name = $(el.currentTarget).first().siblings('.list-card-content').text().trim();
    let updatedList = _DATA_RAW_.filter(e => !checkIfPresentInValueField(e.rawStr || '', _name));
    sendToBackground('remove-instance', _name );
    StorageService.setEntries(updatedList)
        .then(retrieveEntriesFromStorage())
        .catch((error) => {
            console.log(error);
        });
};

function retrieveEntriesFromStorage() {
    //clear
    $('.instance-list').html('');
    // spinner
    $(".spinner-wrapper").show();

    new Promise((resolve) => {
        setTimeout(() => {
            StorageService.getEntries()
                .then(data => loadInstanceData(data))
                .catch((error) => {
                    console.log(error);
                });
        }, 800);
    });

}


function handleURLRedirect(el) {
    let resource = '';
    let isHiHop = $(el.currentTarget).hasClass("play-action-btn");
    if (isHiHop) {
        resource = $(el.currentTarget).parent().parent().children('.list-card-content').text().trim();
    }
    else {
        resource = $(el.currentTarget).first().text().trim();
    }

    if (isHiHop) {
        openInNewTab(makeURL(resource));
        return;
    }

    switch (resource) {
        case 'DASH':
            openInNewTab(_BASE_URL_MAP_.get('MNG_INST_DASH'));
            break;
        case 'CREATE':
            openInNewTab(_BASE_URL_MAP_.get('REQ_CT_NEW_INST'));
            break;
        case 'ZBOOT':
            openInNewTab(_BASE_URL_MAP_.get('REQ_ZBOOT_INST'));
            break;

        default:

            break;
    }
}


function makeURL(resource) {

    return _BASE_URL_MAP_.get('HIHOP')+resource+'&mode=readwrite';

}

// load
document.addEventListener('DOMContentLoaded', function () {

    retrieveEntriesFromStorage();

});




//util

function checkIfPresentInValueField(str, substr) {
    let idx = str.indexOf(substr);

    return (str.charAt(idx - 1) == '"') && (str.charAt(idx + substr.length) == '"');
}


function parseBoolean(str) {
    return str == "true" || str == "True"
}

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};



function openInNewTab(url) {
    window.open(url, '_blank').focus();
}


//sender

function sendToBackground(action, data) {
    try {
        chrome.runtime.sendMessage(
            {
                'action': action,
                'data': data
            }, (response) => {
                console.log(response);
            });
    } catch (error) {
        console.log(error);
    }
}




/*
let item_order = [0,1],
order = item_order.reduce((r, k, v) => Object.assign(r, { [k]: v }), {});

array.sort((a, b) => order[a.CODE] - order[b.CODE]);

*/

