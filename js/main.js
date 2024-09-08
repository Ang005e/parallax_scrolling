

let lastScrollIncrement = 0;
let queuedParallaxFrames = []
let progress = 0
let storedStartY = 0

// debounce time between moves of the background parallax to avoid excessive overhead
let timeout = 50


// top of main box
// top of

//ToDo:
// if theres already an animation running, grab the original start pos and any speed modifiers,
// then use those values in the new animation


class Parallax {
    constructor(elem, scrollParent) {

        this.parallax = elem;
        this.scrollParent = scrollParent;

        this.startY = this.getY(elem) + 1
        this.currentY = this.startY + 1
        this.targetY = this.getY(scrollParent) //document.documentElement.getBoundingClientRect().top + 1

        this.velocity = 1
        this.isMoving = false // flag to check if transition is running

        // Bind animationLoop to ensure `this` context is correct
        // this.animationLoop = this.animationLoop.bind(this);

        document.addEventListener("scroll", this.setTarget.bind(this))
    }

    checkTarget() {
        // function to check for (meaningful) changes to target position. handle debounce separately?

    }

    setTarget() {
        this.targetY = (document.body.scrollTop + document.documentElement.scrollTop) /
            (document.documentElement.scrollHeight - document.documentElement.clientHeight);

        if (!this.isMoving) {
            this.isMoving = true
            this.animationLoop()
        }
    }

    calcVelocity() {
        // function to calculate the velocity based on start, target and current position
        this.velocity = 10 //this.velocity = (this.targetY - this.currentY) * 0.1
        console.log(this.velocity, this.startY, this.currentY, this.targetY)
    }

    moveFrame() {
        // function w/loop to move the parallax, given a modifier. Can accept changes to target.

        this.isMoving = true // reset at the end of the loop
        this.parallax.style.transform = `translateY(-${this.currentY}px)`;
    }

    animationLoop() {
        // loop that can be updated midway through to allow for mid-animation recalculations

        console.log("animationLoop")
        this.calcVelocity()
        this.moveFrame()

        window.requestAnimationFrame((timestamp) => {
            this.animationLoop()
        });

        // check if the target has been reached yet
        if (this.targetY < this.getY(this.parallax)) {
            this.isMoving = false
            this.startY = this.getY(this.parallax) // update the start position, for the next animation
        }
    }

    // helpers:
    getY(elem) {
        return elem.getBoundingClientRect().y;
    }

    /*
    eventDebounce() {
        // console.log("scroll event")
        document.removeEventListener("scroll", scrollEvent)

        // replace event listener after timeout. Reduces unneeded repositioning (by a factor of 10!!!)
        setTimeout(() => {
            document.addEventListener("scroll", scrollEvent)
        }, timeout)
    }
    */
}



const parallax = new Parallax(document.querySelector('#parallax-bg-image'),
    document.querySelector('main'))


/*
function moveParallax(startY = NaN, currentY = 1) {
    let mainScrollY = (document.documentElement.scrollTop || document.body.scrollTop);
    let directionalVelocity = 1 // assign velocity modifier (based on direction)
    // perhaps find a way to catch the current transition right in the middle, and recalculate then?
    // prevent rubber-banding and motion-sickness
    //if ((targetY > lastScrollIncrement+2) || (targetY < lastScrollIncrement-2)) {
        //lastScrollIncrement = targetY
    //ToDo: throttling for high FPS monitors
    function update(timestamp, id) {
        let cond1 = mainScrollY; let cond2 = startY; let cond3 = currentY
        console.log(cond1 + ' + ' + cond2 + ' < ' + cond3)

        try {
            queuedParallaxFrames.splice(queuedParallaxFrames.indexOf(id), 1)
        } catch(e) {console.log(e)}


        if (cond1 > cond3 + currentY) {
            let id = window.requestAnimationFrame((timestamp) => {
                update(timestamp, id)
            });
            queuedParallaxFrames.push(id);                              console.assert(id >= 0);
        }
    }
    window.requestAnimationFrame(update);
}
*/

/*
function moveParallax() {

    let scrollPercent = (document.body.scrollTop + document.documentElement.scrollTop) /
        (document.documentElement.scrollHeight - document.documentElement.clientHeight);
    let scrollAmount = scrollPercent * 600;

    // prevent rubber-banding and motion-sickness
    if ((scrollAmount > lastScrollIncrement+2) || (scrollAmount < lastScrollIncrement-2)) {

        // perhaps find a way to catch the current transition right in the middle, and recalculate then?

        lastScrollIncrement = scrollAmount
        const parallax = document.querySelector('#parallax-bg-image');

        // According to my research, transform: translate seems to be the most efficient and smoothest
        // way to animate movement in vanilla JS.
        parallax.style.transform = `translateY(-${scrollAmount}px)`;

        // check that the final position has not yet been reached:

    }
}
 */