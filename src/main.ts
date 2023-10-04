const createdTabs: any[] = [];
const windows: any[] = [];
const countedTabs: number[] = [];

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
    const  nextTabNumber = findNextAvailableTabNumber(countedTabs)
      // Tab was Created
    let newTab = await ext.tabs.create({
        text: `TLDraw - #${nextTabNumber}`,
        icon: '../src/icons/icon-1024.png',
        index: nextTabNumber - 1,
        closable: true,
    })

    let newWindow = await ext.windows.create({
        title: `TLDraw - #${nextTabNumber}`,
        icon: '../src/icons/icon-1024.png',
        vibrancy: false,
        frame: true,
        minWidth: 650,
        minHeight: 460,
        aspectRatio: 650 /460
    })

    let myWindowSize = await ext.windows.getContentSize(newWindow.id)
    let myWebview = await ext.webviews.create({
        window:newWindow,
        bounds: { x: 0, y: 0, width: myWindowSize.width, height: myWindowSize.height },
        autoResize: { width: true, height: true }
    })

    await ext.webviews.loadURL(myWebview.id, 'https://www.tldraw.com')
    
    windows.push(newWindow);
    createdTabs.push(newTab);
    countedTabs.push(nextTabNumber);
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