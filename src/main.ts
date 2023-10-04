const createdTabs: any[] = [];
const countedTabs: number[] = [];

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