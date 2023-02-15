// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.

window.hoper_debug = [];


function parseToJSON(jsonString){

    /*UIkit.notification(
        {message: 'Warning message…',
        status: 'warning',
        pos: 'bottom-right',
        timeout: 5000
    });*/
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        return {};
    }
}


// insert log stmt

function insertLogStatementAtCursor(ele) {
    let stmt = `gs.info("::DEBUG:: ${ele || ''} > "+JSON.stringify(${ele || ''}));`;
    try {
        let el = document.activeElement;
        let val = el.value;

        let endIndex;
        let range;
        var doc = el.ownerDocument;
        if (typeof el.selectionStart === 'number' &&
            typeof el.selectionEnd === 'number') {
            endIndex = el.selectionEnd;
            el.value = val.slice(0, endIndex) + stmt + val.slice(endIndex);
            el.selectionStart = el.selectionEnd = endIndex + stmt.length;
        } else if (doc.selection !== 'undefined' && doc.selection.createRange) {
            el.focus();
            range = doc.selection.createRange();
            range.collapse(false);
            range.text = stmt;
            range.select();
        }
    } catch (error) {
        
    }

    navigator.clipboard.writeText(stmt).then(function() {
        console.log('Hoper: Copied to clipboard.', stmt);
      }, function(err) {
        console.error('Hoper: Failed to copy text to clipboard: ', err);
    });
}



// listener
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        
        try {
            switch (request.action) {
                case "post-to-console":
                    window.hoper_debug.push({
                        str : request.message,
                        json: parseToJSON(request.message)
                    })
                    console.log(window.hoper_debug[window.hoper_debug.length - 1]);
                    break;

                case "add-log-stmt":
                    debugger
                    insertLogStatementAtCursor(request.message)
                    break;
            
                default:
                    break;
            }
            
        } catch (error) {
            sendResponse({response: `Action ${request.action} failed.`});
        }
        sendResponse({response: `Action ${request.action} successfull.`});
    }
);


