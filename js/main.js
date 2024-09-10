
function throttle(arguedFunc, delay) {
    let throttleOn = false;

    return (...args) => {
        if (!throttleOn) {
            throttleOn = true;
            arguedFunc(...args);
            throttleOn = setTimeout(() => {
                throttleOn = false;
            }, delay)
        }
    };
}



class Parallax {

    constructor(elemSelector, scrollParentSelector, scrollSpeedModifier, offsetY/*, xModifier*/) {
        this.parallax = document.querySelector(elemSelector);
        this.scrollParent = document.querySelector(scrollParentSelector);

        this.baseTravel = scrollSpeedModifier; // Adjust base travel speed to control parallax effect
        this.currentTransform = offsetY;
        // this.xModifier = xModifier;
        // this.xDistance = 0;

        this.updateCurrentY();
        this.updateTargetY();

        this.lastScrollTop = window.scrollY; // Track last scroll position
        this.throttledFunc = throttle(this.evaluateMove.bind(this), 10);

        window.addEventListener('scroll', this.throttledFunc);
        window.addEventListener('wheel', (e)=>{
            console.log(e.deltaY)
        });
    }

    evaluateMove() {
        const currentScrollTop = window.scrollY;
        const distanceScrolled = currentScrollTop - this.lastScrollTop;
        this.lastScrollTop = currentScrollTop;

        this.onScroll(distanceScrolled);
    }

    onScroll(distanceScrolled) {
        const direction = distanceScrolled > 0 ? 'down' : 'up';
        const distance = Math.abs(distanceScrolled) * this.baseTravel;

        if (direction === 'down') {
            this.currentTransform -= distance;
            // this.xDistance -= this.baseTravel * this.xModifier;
            // console.log(this.xDistance)
        } else {
            this.currentTransform += distance;
            // this.xDistance += this.baseTravel * this.xModifier;
        }

        window.requestAnimationFrame(() => {
            this.shiftParallax(this.currentTransform/*, this.xDistance*/);
        });
    }

    shiftParallax(pixY, pixX) {
        this.parallax.style.transform = `translateY(${pixY}px)` // translateX(${pixX}px)`;
    }

    updateCurrentY() {
        this.currentY = this.parallax.getBoundingClientRect().top + window.scrollY;
    }

    updateTargetY() {
        this.targetY = this.scrollParent.getBoundingClientRect().top + window.scrollY;
    }
}



/*
let wheel =0
document.addEventListener('wheel', (event) => {console.log(wheel++)})


setInterval(()=>{
    console.log(`${parallax.scrolls} | ${parallax.wheelScrolls} \n${translatePix}`);
}, 10)
*/

const parallax = new Parallax('#primary-parallax-bg-image',
    'body', 0.5, -800, -4)
const secondaryParallax = new Parallax('#secondary-parallax-bg-image',
    'body', 0.32, -400)
const tertiaryParallax = new Parallax('#tertiary-parallax-bg-image',
    'body', 0.18, 0, 5)




/*
function moveParallax() {

    let scrollPercent = (document.body.scrollTop + document.documentElement.scrollTop) /
        (document.documentElement.scrollHeight - document.documentElement.clientHeight);
    let scrollAmount = scrollPercent * 600;

    // prevent rubber-banding and motion-sickness
    if ((scrollAmount > lastScrollIncrement+2) || (scrollAmount < lastScrollIncrement-2)) {

        // perhaps find a way to catch the current transition right in the middle, and recalculate then?

        lastScrollIncrement = scrollAmount
        const parallax = document.querySelector('#primary-parallax-bg-image');

        // According to my research, transform: translate seems to be the most efficient and smoothest
        // way to animate movement in vanilla JS.
        parallax.style.transform = `translateY(-${scrollAmount}px)`;

        // check that the final position has not yet been reached:

    }
}

 */