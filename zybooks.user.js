// ==UserScript==
// @name         ZyBooks AutoPlay
// @namespace    https://learn.zybooks.com/zybook/*/
// @version      0.1
// @description  Play full videos without having to constantly hit the play button on ZyBooks
// @author       Unknown
// @match        https://learn.zybooks.com/zybook/*/*
// ==/UserScript==

(function() {
    'use strict';

    // Use setInterval here because pages loaded async (over XHR)
    setInterval(() => {
        for (let control of unsafeWindow.document.getElementsByClassName("animation-controls")) {
            // Remove stray listeners
            try {
                control.removeEventListener("click", fullSend);
            } catch (err) {}

            control.addEventListener("click", fullSend);
        }
    }, 1000);
})();

// Kick the run process off -- find the root node, enable 2x speed, and run the control loop
function fullSend(e) {
    // Find root animation control node
    let root = null;
    for (let el of e.path) {
        if (el.classList.contains("animation-controls")) {
            root = el;
            break;
        }
    }

    if (root == null) {
       throw Error("ROOT NOT FOUND HELP ME PLEASE I'M LONELY");
    }

    // Find 2x speed and click it
    for (let child of root.children) {
        if (child.classList.contains("speed-control")) {
            if (child.firstElementChild.firstElementChild.checked == false) {
                child.firstElementChild.firstElementChild.click();
            } else {
                return;
            }
        }
    }

    // Send to control loop system
    setTimeout(check, 300, root);
}

// Control loop for play button
function check(root) {
    for (let child of root.children) {
        // Find play button container
        if (child.classList.contains("normalize-controls")) {
            // If play button (otherwise pause btn/back to start btn, so continue)
            if (child.firstElementChild.classList.contains("play-button")) {
                // Check if completed type play button
                if (child.firstElementChild.classList.contains("rotate-180")) {
                    console.log("ACTIVITY DONE");
                    return;
                } else {
                    // Click play button if it's there
                    child.firstElementChild.click();
                }
            }
        }
    }

    // If we haven't returned, we need to keep the loop going
    setTimeout(check, 300, root);
}
