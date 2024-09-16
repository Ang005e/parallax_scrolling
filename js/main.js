
/*
Done:
- Scroll based on provided speed modifier X
- Switch direction of parallax when scroll direction changes X
- Prevent frame skip by using requestAnimationFrame() X
- Lock top by default to prevent over-scrolling X
- Dynamically update a single scroll listener to avoid multiple listeners in the case of many parallax effects X
- Throttle parallax move function to prevent too many function calls X
- Allow the parallax scroll axis to be changed X
ToDo:
    Dynamic position handling/infinite scroll - no need for the programmer to position backgrounds, just add a parallax and away you go
    Adjust the throttling to match device performance
    Disable parallax layers one-by-one if performance dips by too much.


 */

class Parallax {

    #axis = 'Y'
    constructor(elemSelector, scrollSpeedModifier, offsetY) {
        this.parallax = document.querySelector(elemSelector);

        this.lockAtTop = false
        this.baseTravel = scrollSpeedModifier; // Adjust base travel speed to control parallax effect
        this.currentTransform = offsetY; // set the initial transform to the argued Y offset
        this.lastScrollTop = window.scrollY; // Track last scroll position

        // Assign throttle(), with onScroll (bound to this instance of Parallax) as an argument, to a variable
        this.throttledOnScroll = throttle(this.#onScroll.bind(this), 5);
        // Begin the 5 layer deep callback chain... by passing the above function to a master scroll listener
        GlobalScroll.AppendScrollCallbacks(this.throttledOnScroll);

        (offsetY !== undefined) && (this.#shiftParallax(offsetY)); // set the current position to the passed offset
    }

    //region Private Functions
    #onScroll() {

        const currentScrollTop = window.scrollY;
        const distanceScrolled = currentScrollTop - this.lastScrollTop;
        this.lastScrollTop = currentScrollTop;

        const direction = distanceScrolled > 0 ? 'down' : 'up';
        const distance = Math.abs(distanceScrolled) * this.baseTravel;

        // add or remove the calculated travel distance from the transform value, depending on the scroll direction
        this.currentTransform += (direction === 'down') ? -(distance) : distance;
        // prevent the top bounding edge of the image from scrolling into view
        if (this.lockAtTop && this.currentTransform >= 0) {return}

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

function throttle(arguedFunc, delay /*, ...args*/ ) {
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

const parallax = new Parallax('#primary-parallax-bg-image', -0.5, -1100)
parallax.lockAtTop = true
const secondaryParallax = new Parallax('#secondary-parallax-bg-image', -0.32, -700)
secondaryParallax.lockAtTop = true
const tertiaryParallax = new Parallax('#tertiary-parallax-bg-image', -0.18, -300)
tertiaryParallax.lockAtTop = true
const bottomParallax = new Parallax('#bottom-parallax-bg-image', -0.05, -50)
bottomParallax.lockAtTop = true
// const backingImageParallax = new Parallax('.backing-parallax', -0.1, 0)
// backingImageParallax.setAxis('x')


/* **** Loading Screen *** */
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(()=>{
        document.querySelector('#loading-overlay').style.transform = 'translateY(-100vh)'
        document.querySelector('#loading-overlay').style.opacity = '0.85'
    }, 100)
    setTimeout(()=>{
        document.querySelector('#loading-overlay').style.opacity = '0.5';
    }, 200)
})


/* **** Performance Testing **** */
/*
let dist = 1
let scrollBounds = document.body.scrollHeight - document.documentElement.clientHeight
console.log(scrollBounds)

setInterval(()=>{
    if(time > 1000) {
        time = 0;
    }
    let current = document.documentElement.scrollTop
    if ((current >= scrollBounds-20 && (Math.abs(dist) !== -1)) || current <= 20 && (Math.abs(dist) !== 1)) {dist = -(dist)} // flip sign
    window.scrollBy({top: dist, left: 0, behavior: 'instant'})
}, 1)
*/