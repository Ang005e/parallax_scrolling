"use strict";
// abstract, since static classes don't exist in JS or TS
class Callbacks {
    // "(() => void) | null" is a typescript "union" type stating that this property either...
    // a: takes no arguments and returns nothing, OR
    // b: can be of value "null"
    static MasterScrollEvent(callback) {
        // 1. remove previous (outdated) initialisation
        this.ClearLoadInitialisation(this.eventCallbacks);
        // 2. collect the new callback and append it to the existing list
        this.eventCallbacks.push(callback);
        // 3. reset the DOMLoad initialisation with the new callback
        this.SetLoadInitialisation(this.eventCallbacks);
    }
    // Initialise the master scroll event listener on DOMContentLoaded
    static SetLoadInitialisation(callbackIterable) {
        // group ALL callback functions under a single master scroll event
        this.ScrollHandler = () => { document.addEventListener('scroll', () => callbackIterable.forEach(callback => callback())); };
        // set the scroll event on load
        document.addEventListener('DOMContentLoaded', this.ScrollHandler);
    }
    // clear previously set (outdated) onload event.
    static ClearLoadInitialisation(historicCallbackIterable) {
        if (this.ScrollHandler != null) { // if the ScrollHandler function has a value:
            // remove the load event listener referencing it
            document.removeEventListener('DOMContentLoaded', this.ScrollHandler);
        }
    }
}
// an array of function (always wanted to put those words next to each other)
Callbacks.eventCallbacks = [];
// reference functions, to allow the removal of listeners (as opposed to anonymous functions which cannot be referenced)
Callbacks.DOMLoadHandler = null;
Callbacks.ScrollHandler = null;
class x {
    constructor() {
        console.log("yay im called");
    }
}
//# sourceMappingURL=classes.js.map