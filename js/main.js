

let lastScrollIncrement = 0;
let queuedParallaxFrames = []
let progress = 0
let storedStartY = 0

// debounce time between moves of the background parallax to avoid excessive overhead
let debounceTime = 500


// top of main box
// top of

//ToDo:
// if theres already an animation running, grab the original start pos and any speed modifiers,
// then use those values in the new animation


class Parallax {
    constructor(elemSelector, scrollParentSelector) {

        this.parallax = document.querySelector(elemSelector) ;
        this.scrollParent = document.querySelector(scrollParentSelector);

        this.startY = this.getY(this.parallax) + 1
        this.currentY = this.startY + 1
        this.targetY = this.getY(this.scrollParent) //document.documentElement.getBoundingClientRect().top + 1

        this.velocity = 1
        this.isMoving = false // flag to check if transition is running
        this.tempDistanceTest = 0

        // Bind animationLoop to ensure `this` context is correct
        // this.animationLoop = this.animationLoop.bind(this);

        let soleScroll = this.handleScrollEvent.bind(this)
        document.addEventListener("scroll", soleScroll(soleScroll)); // passes this bound function so the listener can be
        // removed and added back at will.
    }

    handleScrollEvent(soleScroll) {
        // console.log("scroll event")
        document.addEventListener("scroll", soleScroll)

        this.setTarget()

        // replace event listener after debounceTime. Reduces unneeded repositioning (by a factor of 10!!!)
        setTimeout(() => {
            document.addEventListener("scroll", soleScroll)
        }, debounceTime)
    }

    checkTarget() {
        // function to check for (meaningful) changes to target position. handle debounce separately?

    }

    // get the target scroll position
    setTarget() {
        // update the target y position
        this.targetY = window.scrollY /*(document.body.scrollTop + document.documentElement.scrollTop) /
            (document.documentElement.scrollHeight - document.documentElement.clientHeight);*/

        console.log("handle scroll called")
        // if not already moving, begin an animation
        if (!this.isMoving) {
            console.log("not moving - animation called")
            this.isMoving = true
            this.animationLoop()
        }
    }

    calcVelocity() {
        // function to calculate the velocity based on start, target and current position
        this.velocity = 10 //this.velocity = (this.targetY - this.currentY) * 0.1
        // console.log(this.velocity, this.startY, this.currentY, this.targetY)
    }

    shiftParallax() {
        // function w/loop to move the parallax, given a modifier. Can accept changes to target.

        // this.currentY += this.velocity
        this.tempDistanceTest = this.getY(this.scrollParent) * 0.3
        console.log(this.tempDistanceTest)
        this.parallax.style.transform = `translateY(-${this.tempDistanceTest}px)`;
        // console.log("shiftParallax");
    }

    animationLoop() {
        // loop that can be updated midway through to allow for mid-animation recalculations

        this.isMoving = true // reset at the end of the loop

        this.calcVelocity()
        this.shiftParallax()

        // check if the target has been reached yet
        if (this.targetY <= this.getY(this.parallax)) {
            console.log("not moving")
            this.isMoving = false
            this.startY = this.getY(this.parallax) // update the start position, for the next animation
        } else {
            window.requestAnimationFrame((timestamp) => {
                this.animationLoop()
            });
        }
    }

    // helpers:
    getY(elem) {
        let st =  elem.getBoundingClientRect().top
        console.assert((st >= 0) || (st <= 0))
        return st
    }
}

const parallax = new Parallax('#parallax-bg-image',
    'body')


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