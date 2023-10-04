
// TLDraw Extension

// Global Resources
const createdTabs: any[] = [];
const windows: any[] = [];
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
        persistent: true,
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
    windows.push(newWindow);
    createdTabs.push(newTab);
    countedTabs.push(nextTabNumber);
    console.log(`Window data ${JSON.stringify(windows)}`);
    console.log(`Tab data ${JSON.stringify(createdTabs)}`);
    console.log(`Websessions data ${JSON.stringify(webSessions)}`);
    }
    catch (error) { 
        // Print error
        console.error('ext.runtime.onExtensionClick', JSON.stringify(error))
    
    }
});


// Tab was Closed
ext.tabs.onClickedClose.addListener(async (deletedtab) => {
    const index = createdTabs.findIndex((tab) => tab.id === deletedtab.id)
    if (index !== -1) {
        await ext.tabs.remove(deletedtab.id)
        createdTabs.splice(index, 1)
        countedTabs.splice(index, 1)
    }
})