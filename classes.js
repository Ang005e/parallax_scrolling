"use strict";
let time = 0
// abstract, since static classes don't exist in JS or TS
class GlobalScroll {
    // "(() => void) | null" is a typescript "union" type stating that this property either...
    // a: takes no arguments and returns nothing, OR
    // b: can be of value "null"
    static AppendScrollCallbacks(callback) {
        // 1. remove previous (outdated) initialisation
        this.ClearLoadInitialisation();
        // 2. collect the new callback and append it to the existing list
        this.eventCallbacks.push(callback);
        // 3. reset the DOMLoad initialisation with the new callback
        this.SetListenerOnLoad(this.eventCallbacks);
    }
    // Initialise the master scroll event listener on DOMContentLoaded
    static SetListenerOnLoad(callbackIterable) {
        // group ALL callback functions under a single master scroll event
        this.eventHandler = () => {
            document.addEventListener('scroll', () => {
                time+=1
                callbackIterable.forEach(callback => callback())
            })
        }
        // set the scroll event on load
        document.addEventListener('DOMContentLoaded', this.eventHandler);
    }
    // clear previously set (outdated) onload event.
    static ClearLoadInitialisation() {
        if (this.eventHandler != null) { // if the eventHandler function has a value:
            // remove the load event listener referencing it
            document.removeEventListener('DOMContentLoaded', this.eventHandler);
        }
    }
}
// an array of function (always wanted to put those words next to each other)
//...to be executed on the firing of a (single!) scroll listener
GlobalScroll.eventCallbacks = [];
// reference functions, to allow the removal of listeners (as opposed to anonymous functions which cannot be referenced)
GlobalScroll.eventHandler = null;
//# sourceMappingURL=classes.js.map