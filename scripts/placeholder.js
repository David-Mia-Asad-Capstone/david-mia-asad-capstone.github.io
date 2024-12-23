
function createPopup(message) {
    const popup = document.createElement("div");
    popup.className = 'popup';
    popup.textContent = message;
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.fontSize ="18px";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.padding = "10px";
    popup.style.backgroundColor = "#2171b5";
    popup.style.color ="black";
    popup.style.fontWeight="bold";
    popup.style.border = "1px solid black";
    popup.style.boxShadow = "0 0 12px rgba(2, 4, 6, 2.5)";
    popup.style.zIndex = "9999";
    popup.style.textAlign ="center";
    document.body.appendChild(popup);
    return popup;
}
window.addEventListener("load", function(){
    const test = document.getElementById("story_body");
    test.style.display = 'none';
    function showPopup(message) {
        const popup = createPopup(message);    
    }
    showPopup("This story is currently under embargo and is being redrafted. It will be published here in 6 months. For access to the graphics, please David Paiz-Torres at daptorz@gmail.com");
       
});

