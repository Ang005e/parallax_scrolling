

// debounce time between moves of the background parallax to avoid excessive overhead
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

class Parallax {
    constructor(elemSelector, scrollParentSelector) {

        this.parallax = document.querySelector(elemSelector) ;
        this.scrollParent = document.querySelector(scrollParentSelector);

        this.updateCurrentY()
        this.updateTargetY() // this will set "this.targetY" //document.documentElement.getBoundingClientRect().top + 1
        this.lastTargetY = this.targetY

        this.toggle = false

        // Initial calculations
        this.updateCurrentY();
        this.updateTargetY();

        let lockedParallaxScroll = this.onScroll.bind(this)

        document.addEventListener('scroll', ()=> {
            lockedParallaxScroll()
        });
    }

    // the reason why its laggy may be because the events are firing so often that
    // it jumps multiple pixels in one frame. #NO so, use the frame queue thingy and #NO
    // nevermind, I need variable speed, so just reduce the total number of
    // scroll events registered (for the moment)

    onScroll() {

        this.toggle = !this.toggle

        if (true) {

            this.updateCurrentY();
            this.updateTargetY();

            // console.log(this.targetY, this.lastTargetY);
            let pix

            let currentTransform = parseFloat(getComputedStyle(this.parallax).transform.split(',')[5]) || 0;

            if (this.scrollDirection() === 'down'){
                pix = currentTransform - 2;
            }else if (this.scrollDirection() === 'up'){
                pix = currentTransform + 2;
            }

            window.requestAnimationFrame(() => {this.shiftParallax(pix)});

            // this.animationLoop();
        }
    }

    nonZero(num) {
        return Math.abs(num) === 0 ? 1 : num
    }

    shiftParallax(pix) {
        // function w/loop to move the parallax, given a modifier.

        this.parallax.style.transform = `translateY(${pix}px)`;
        // console.log(pix);
        // console.log(this.parallax.style.transform)
    }

    // helpers:
    updateCurrentY() {
        this.currentY = this.parallax.getBoundingClientRect().top
    }

    updateTargetY() {
        this.targetY = this.scrollParent.getBoundingClientRect().top
    }

    scrollDirection() {
        let direction
        if (this.lastTargetY > this.targetY) direction = "down"
        else direction = "up"
        this.lastTargetY = this.targetY;
        return direction

    }
}


const parallax = new Parallax('#parallax-bg-image',
    'body')




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





Your code seems to have the right idea but contains several issues that might prevent it from working effectively. Let’s address the problems and improve your implementation step by step.

Issues Identified
Event Binding and Throttling: You're adding and removing scroll event listeners in the onEvent method, which can lead to unexpected behavior. Instead, use throttling or debouncing to control the rate of scroll events.

Animation Logic: The velocity calculation and the animationLoop are not correctly handling the distance left or updating the position of the parallax element effectively.

Distance Calculation: Your distanceLeft is calculated but not used effectively to update the animation.

Transform Update: translateY(${this.velocity}px) isn't the right way to use the velocity in your case. Instead, you should be using it to adjust the position based on the current scroll state.

Refactored Code
Here’s a revised version of your class with improvements:

javascript
Copy code
// Debounce function to limit the rate at which a function is invoked
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

class Parallax {
    constructor(elemSelector, scrollParentSelector) {
        this.parallax = document.querySelector(elemSelector);
        this.scrollParent = document.querySelector(scrollParentSelector);

        this.velocity = 0;
        this.isMoving = false;

        // Bind scroll event with debouncing
        this.handleScroll = debounce(this.onScroll.bind(this), 10);
        window.addEventListener('scroll', this.handleScroll);

        // Initial calculations
        this.updateCurrentY();
        this.updateTargetY();
    }

    onScroll() {
        this.updateCurrentY();
        this.updateTargetY();

        if (!this.isMoving) {
            this.isMoving = true;
            this.animationLoop();
        }
    }

    animationLoop() {
        // Update distance and velocity
        this.updateDistance();
        this.calcVelocity();

        // Apply the velocity to the parallax element
        this.shiftParallax();

        // If still moving, continue the animation
        if (this.distanceLeft > 1) {
            window.requestAnimationFrame(() => this.animationLoop());
        } else {
            this.isMoving = false;
        }
    }

    calcVelocity() {
        const distanceToMove = this.targetY - this.currentY;
        this.velocity = distanceToMove * 0.1; // Adjust the multiplier for desired effect
    }

    shiftParallax() {
        const currentTransform = parseFloat(getComputedStyle(this.parallax).transform.split(',')[5]) || 0;
        const newPosition = currentTransform + this.velocity;
        this.parallax.style.transform = `translateY(${newPosition}px)`;
    }

    updateCurrentY() {
        this.currentY = window.scrollY || window.pageYOffset;
    }

    updateTargetY() {
        const rect = this.scrollParent.getBoundingClientRect();
        this.targetY = rect.top * 0.25 + window.scrollY;
    }

    updateDistance() {
        this.distanceLeft = Math.abs(this.currentY - this.targetY);
    }
}

// Initialize the Parallax effect
const parallax = new Parallax('#parallax-bg-image', 'body');
Explanation of Changes
Debounce: Added a debounce function to limit the rate at which the onScroll method is called. This reduces the number of times the scroll event fires, improving performance.

Animation Loop: Simplified the animation loop. It now continuously updates the parallax effect until the distance left is negligible.

Velocity Calculation: Simplified the calculation of velocity to move the parallax element. You can adjust the multiplier (0.1 in this case) to control the intensity of the effect.

Transform Application: Used the transform property directly to adjust the position based on the calculated velocity.

Update Methods: Improved the updateTargetY and updateCurrentY methods to get consistent values for calculations.

This should give you a smoother and more responsive parallax effect. Adjust the parameters (like the velocity multiplier) to fine-tune the animation to your liking.
 */