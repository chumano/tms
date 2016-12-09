(function () {
    'use strict';

    console.log('The session for this site will be extended automatically via userscript.');

    var minute = 60 * 1000;
    var refreshTime = 15 * minute;

    var iframe = document.createElement("iframe");
    iframe.style.width = 0;
    iframe.style.height = 0;
    iframe.style.display = "none";
    var loc = window.location;
    var src = loc.protocol + '//' + loc.host + loc.pathname;
    src += loc.search ? (loc.search + '&') : '?';
    src += 'sessionextendercachebuster=';

    var lastRefresh = new Date().getTime();
    var reloadIframe = function () {
        var time = new Date().getTime();
        
        var timeSinceLastRefresh = time - lastRefresh;
        if (!lastRefresh || timeSinceLastRefresh > refreshTime - minute) {
            console.log('Auto-extending session');
            iframe.src = src + time;
            setTimeout(reloadIframe, refreshTime);

            setTimeout(function () {
                // Unload the iframe contents since it might be taking a lot of memory
                iframe.src = 'about:blank';
                lastRefresh = new Date().getTime();
            }, 10000);
        } else {
            console.log('Another tab/window probably refreshed the session, waiting a bit longer');
            setTimeout(reloadIframe, refreshTime - timeSinceLastRefresh - minute);
        }
    };
    setTimeout(reloadIframe, refreshTime);
    $(document).ready(function () {
        //your code goes here
        $('body').append($(iframe));
    });
    
})();