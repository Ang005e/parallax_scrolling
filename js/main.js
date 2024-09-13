class Parallax {

    #axis = 'Y'

    constructor(elemSelector, scrollSpeedModifier, offsetY) {
        this.parallax = document.querySelector(elemSelector);

        this.baseTravel = scrollSpeedModifier; // Adjust base travel speed to control parallax effect
        this.currentTransform = offsetY; // set the initial transform to the argued Y offset
        this.lastScrollTop = window.scrollY; // Track last scroll position

        // begin the 5 layer deep callback chain...
        this.throttledFunc = throttle(this.#evaluateMove.bind(this), 5);
        GlobalScroll.AppendScrollCallbacks(this.throttledFunc);

        this.#shiftParallax(offsetY); // set the current position to the passed offset

        //window.addEventListener('wheel', this.throttledFunc);
    }

    //region Private Functions

    #evaluateMove() {
        const currentScrollTop = window.scrollY;
        const distanceScrolled = currentScrollTop - this.lastScrollTop;
        this.lastScrollTop = currentScrollTop;

        this.#onScroll(distanceScrolled);
    }

    #onScroll(distanceScrolled) {
        const direction = distanceScrolled > 0 ? 'down' : 'up';
        const distance = Math.abs(distanceScrolled) * this.baseTravel;

        if (direction === 'down') {
            this.currentTransform -= distance;
        } else {
            this.currentTransform += distance;
        }

        window.requestAnimationFrame(() => {
            this.#shiftParallax(this.currentTransform);
        });
    }

    #shiftParallax(pixY) {
        this.parallax.style.transform = `translate${this.#axis}(${pixY}px)` // translateX(${pixX}px)`;
    }
    //endregion

    //region Public Functions

    setAxis(axis) {
        if (axis !== 'x' && axis !== 'y') {throw new Error("Incorrect axis argument")}
        this.#axis = axis === 'x' ? 'x' : 'y';
    }
    //endregion

}

function throttle(arguedFunc, delay, ...args) {
    let throttleOn = false;

    return (...args) => {
        if (!throttleOn) {
            throttleOn = true;
            arguedFunc(...args);
            console.log('called');
            throttleOn = setTimeout(() => {
                throttleOn = false;
            }, delay)
        }
    };
}

const parallax = new Parallax(
    '#primary-parallax-bg-image', -0.5, -1100
)
const secondaryParallax = new Parallax(
    '#secondary-parallax-bg-image', -0.32, -700
)
const tertiaryParallax = new Parallax(
    '#tertiary-parallax-bg-image', -0.18, -300
)
const bottomParallax = new Parallax(
    '#bottom-parallax-bg-image', -0.06, 0
)
const backingImageParallax = new Parallax(
    '.backing-parallax', -0.1, 0
)
backingImageParallax.setAxis('x')

/*
const wiperTransitionParallax = new Parallax(
    '.wiper-transition', 0.75, 700
)
*/

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(()=>{
        document.querySelector('#loading-overlay').style.transform = 'translateY(-100vh)'
        document.querySelector('#loading-overlay').style.opacity = '0.85'
    }, 100)
    setTimeout(()=>{
        document.querySelector('#loading-overlay').style.opacity = '0.5';
    }, 200)

})

/*
document.addEventListener('keydown', (event) => {
    keyEvent(event)
})


let flag = false
function keyEvent(event) {

    // large increments/checkpoints for enter key,
    // smooth, slow, continuous scrolls for down arrow

    if (event.code === 'Enter') {
        event.preventDefault()
        scrollSmoothly( 2450, 12000, 2)
    }
}

function throwFlag(duration) {
    flag = true
    setTimeout(()=>{
        flag = false
    }, duration)
}

function scrollSmoothly(totalPx, scrollTime, interval) {
    let startTime = performance.now();
    let startScrollY = window.scrollY;

    let handler = setInterval(() => {
        let now = performance.now()
        let elapsed = (now - startTime)
        let fraction = Math.min(elapsed / scrollTime, 1)
        let progress = totalPx * fraction;
        window.requestAnimationFrame(()=>
            window.scrollTo({top: startScrollY + progress, behavior:'instant'}))
        if (fraction >= 1) {clearInterval(handler)}
    }, interval)
}

*/

/*
const scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, c - c / 8);
    }
};
scrollToTop();
*/