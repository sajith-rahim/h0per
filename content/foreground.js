// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.

window.hoper_debug = [];


function parseToJSON(jsonString){
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        return {};
    }
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
            
                default:
                    break;
            }
            
        } catch (error) {
            sendResponse({response: `Action ${request.action} failed.`});
        }
        sendResponse({response: `Action ${request.action} successfull.`});
    }
);


