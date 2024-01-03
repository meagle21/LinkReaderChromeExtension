
const headers = "Website,URL,Annotation,Save Time";
chrome.storage.sync.get({'savedData': headers}, function(result) {
    var existingData = result.savedData || { savedData: headers};
    chrome.storage.sync.set({'savedData': existingData}, function() {
        console.log(existingData);
    });
});

document.getElementById("collectButton").addEventListener('click', function() {
    const currentDate = new Date();
    const yearYY = currentDate.getFullYear().toString().slice(-2);
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    var hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    if(hours > 12){
        hours = hours - 12;
        var formattedDateTime = `${month}-${day}-${yearYY} ${hours}:${minutes} PM`;
        var dateForGUI = `${hours}:${minutes} PM`;
    }
    else{
        var formattedDateTime = `${month}-${day}-${yearYY} ${hours}:${minutes} AM`;
        var dateForGUI = `${hours}:${minutes} AM`;
    }    
    const currentPageData = chrome.tabs.query({ active: true, currentWindow: true });
    currentPageData.then(data => {
        const webpageInfo = data[0];
        var webpageTitle = webpageInfo.title;
        if(webpageTitle.length > 0){
            webpageTitle = webpageTitle.replace(/,/g, '-');
        }
        const webpageUrl = webpageInfo.url;
        const linkAnnotation = document.getElementById("annotation").value.replace(/,/g, '-');
        document.getElementById("saveTime").innerHTML = "New link saved at: ".concat(dateForGUI);
        var csvContent = ''.concat(webpageTitle).concat(',').concat(webpageUrl).concat(',').concat(linkAnnotation).concat(",").concat(formattedDateTime);
        chrome.storage.sync.get(['savedData'], function(result) {
            var existingData = result.savedData;
            var updatedContent = existingData.concat("\n").concat(csvContent);
            chrome.storage.sync.set({'savedData': updatedContent}, function() {
                console.log(updatedContent);
            });
        });

    });
});

document.getElementById("linkDownloader").addEventListener("click", function(){
    
    chrome.storage.sync.get(['savedData'], function(result) {
        var exportedData = result.savedData;
        var blob = new Blob([exportedData], { type: 'text/csv;charset=utf-8;' });
        chrome.downloads.download({
            url: URL.createObjectURL(blob),
            filename: 'interesting_links.csv',
            saveAs: true
          });
    });
    chrome.storage.sync.set({'savedData': headers}, function() {
        console.log("reset storage");
    });
});