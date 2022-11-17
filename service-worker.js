// This is the service worker script, which executes in its own context
// when the extension is installed or refreshed (or when you access its console).
// It would correspond to the background script in chrome extensions v2.

console.log("This prints to the console of the service worker (background script)")

// Importing and using functionality from external files is also possible.



//importScripts('./popup/js/storage.service.js')


//importScripts(location.origin+'/popup/js/storage.service.js'); //parceljs
// above line is throwing error as not loaded as the name is not getting transformed.




// If you want to import a file that is deeper in the file hierarchy of your
// extension, simply do `importScripts('path/to/file.js')`.
// The path should be relative to the file `manifest.json`.



chrome.runtime.onInstalled.addListener(async () => {
    
    // remove existing menu items
    chrome.contextMenus.removeAll();

    chrome.contextMenus.create({
        title: "Hoper",
        contexts:["all"],
        id: "hoper_l0",
    }, ()=>{
        
        chrome.contextMenus.create({
            type: "separator",
            contexts:["selection"],
            parentId: "hoper_l0",
            id: "seperator1",
        });
        chrome.contextMenus.create({
            title: "Post to Console",
            contexts:["selection"],
            parentId: "hoper_l0",
            id: "post-to-console",
        });
        chrome.contextMenus.create({
            type: "separator",
            contexts:["selection"],
            parentId: "hoper_l0",
            id: "seperator2",
        });
    });
});


chrome.contextMenus.onClicked.addListener((info, tab)=> {
    
    switch (info.menuItemId) {
        case "post-to-console":
            sendToForeground("post-to-console",info.selectionText)
            break;
    
        default:
            validateAndRedirect(info.menuItemId);
            break;
    }
})



async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }


function sendToForeground(action, message) {
    getCurrentTab().then((tab) => {
        console.log(tab);
        chrome.tabs.sendMessage(
            tab.id,
             {
                action: action,
                message: message
            },
              (response) => {
                console.log(response);
        });
    });
}


function validateAndRedirect(val){
    val = val || '';
    if(val.length < 1 ){
        return;
    }
    // ORIGINAL_URL = U2FsdGVkX1/WV2oG/amvIEg3PvdMLFcueHgMUlJhloOnRWFKjuCPetH3KvntnkD3mDhNLCtUt2DdckNiwvqzw+O/93cuG1uAJVl+fTX96/VSHtNdHTyChQa+RhViU8VY
    let _url = "https://www.google.com/search?q=" + val;

    chrome.tabs.create({ url: _url });
}





// listener
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request,sender);

        try {
            switch (request.action) {
                case "add-instance":
                    addInstanceEntryToContextMenu(request.data)
                    break;
                case "remove-instance":
                    removeInstanceEntryToContextMenu(request.data)
                    break;
            
                default:
                    break;
            }
            
        } catch (error) {
            sendResponse({response: `Action ${request.action} failed.`});
        }
        sendResponse({response: `Action ${request.action} successfull.`});
    
});


function addInstanceEntryToContextMenu(menuItem){
    try {
        chrome.contextMenus.create({
            title: `🚀 ${menuItem.instance_name}`,
            contexts:["all"],
            parentId: "hoper_l0",
            id: menuItem.instance_name,
            });
    } catch (error) {
        console.log("failed to add instance to menu", menuItem);
    }
}


function removeInstanceEntryToContextMenu(menuItemId){
    try {
        chrome.contextMenus.remove(menuItemId);
    } catch (error) {
        console.log("failed to remove instance to menu", menuItemId);
    }
}
