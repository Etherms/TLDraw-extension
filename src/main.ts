
// TLDraw Extension

// Global Resources
const createdTabs: any[] = [];
const createdWindows: any[] = [];
const countedTabs: number[] = [];
const webSessions: any [] = [];

//Function to get what Tab Number is available
function findNextAvailableTabNumber(tabNumbers: number[]):number{
    if (tabNumbers.length === 0){
        return 1;
    };
    const min = Math.min(...tabNumbers);
    const max = Math.max(...tabNumbers);

    for( let i = min; i<=max; i++){
        if(!tabNumbers.includes(i)){
            return i;
        };
    }
    return max + 1
}




ext.runtime.onExtensionClick.addListener(async () => {

    try{
    const  nextTabNumber = findNextAvailableTabNumber(countedTabs)
    
    //Created Tab
    let newTab = await ext.tabs.create({
        text: `TLDraw - #${nextTabNumber}`,
        icon: '../src/icons/icon-1024.png',
        index: nextTabNumber - 1,
        closable: true,
    })

    //Created Window
    let newWindow = await ext.windows.create({
        title: `TLDraw - #${nextTabNumber}`,
        icon: '../src/icons/icon-1024.png',
        vibrancy: false,
        frame: true,
        minWidth: 650,
        minHeight: 460,
        aspectRatio: 650 /460
    })

    //Create Web Session
    let newWebsession = await ext.websessions.create({ 
        partition: `TLDraw - ##${nextTabNumber}`, 
        persistent: false,
        global: false,
        cache: true 
    });

    let myWindowSize = await ext.windows.getContentSize(newWindow.id)

    // Create Web View
    let myWebview = await ext.webviews.create({
        window:newWindow,
        bounds: { x: 0, y: 0, width: myWindowSize.width, height: myWindowSize.height },
        websession: newWebsession,
        autoResize: { width: true, height: true }
    })

    await ext.webviews.loadURL(myWebview.id, 'https://www.tldraw.com')


    webSessions.push(newWebsession);
    createdWindows.push(newWindow);
    createdTabs.push(newTab);
    countedTabs.push(nextTabNumber);
    console.log(`Window data ${JSON.stringify(createdWindows)}`);
    console.log(`Tab data ${JSON.stringify(createdTabs)}`);
    console.log(`Websessions data ${JSON.stringify(webSessions)}`);

    console.log(countedTabs);
    }
    catch (error) { 
        // Print error
        console.error('ext.runtime.onExtensionClick', JSON.stringify(error))
    
    }
});


// Tab Closed 
ext.tabs.onClickedClose.addListener(async (deletedTab) => {
    const indexTab = createdTabs.findIndex((tab) => tab.id === deletedTab.id);
    if (indexTab !== -1) {
        const associatedWindow = createdWindows[indexTab];
        if (associatedWindow) {
            await ext.tabs.remove(deletedTab.id);
            await ext.windows.remove(associatedWindow.id);
            createdTabs.splice(indexTab, 1);
            countedTabs.splice(indexTab, 1);
            createdWindows.splice(indexTab, 1);
        }
    }
});
ext.windows.onClosed.addListener(async (deltedWindow)=>{
    const indexWindow = createdWindows.findIndex((window) => window.id === deltedWindow.id);
    if(indexWindow !== -1){
        const associatedTab = createdTabs[indexWindow];
        if(associatedTab){
            await ext.tabs.remove(associatedTab.id);
            await ext.windows.remove(deltedWindow.id);
            createdWindows.splice(indexWindow, 1);
            createdTabs.splice(indexWindow, 1);
            countedTabs.splice(indexWindow, 1);
        }
    }
})