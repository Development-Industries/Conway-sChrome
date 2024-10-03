// Send control messages to content script
document.getElementById('playButton').addEventListener('click', () => {
    sendMessageToContentScript({ command: "play" });
});

document.getElementById('pauseButton').addEventListener('click', () => {
    sendMessageToContentScript({ command: "pause" });
});

document.getElementById('nextButton').addEventListener('click', () => {
    sendMessageToContentScript({ command: "next" });
});

document.getElementById('clearButton').addEventListener('click', () => {
    sendMessageToContentScript({ command: "clear" });
});

document.getElementById('resetButton').addEventListener('click', () => {
    sendMessageToContentScript({ command: "reset" });
});

// Settings
document.getElementById('liveCellColor').addEventListener('input', function () {
    sendMessageToContentScript({ command: "updateLiveCellColor", value: this.value });
});

document.getElementById('deadCellColor').addEventListener('input', function () {
    sendMessageToContentScript({ command: "updateDeadCellColor", value: this.value });
});

document.getElementById('backgroundColor').addEventListener('input', function () {
    sendMessageToContentScript({ command: "updateBackgroundColor", value: this.value });
});

function sendMessageToContentScript(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}
