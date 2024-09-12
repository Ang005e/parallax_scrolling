class Parallax {

    constructor(elemSelector, scrollSpeedModifier, offsetY/*, xModifier*/) {
        this.parallax = document.querySelector(elemSelector);

        this.baseTravel = scrollSpeedModifier; // Adjust base travel speed to control parallax effect
        this.currentTransform = offsetY; // set the initial transform to the argued Y offset
        this.lastScrollTop = window.scrollY; // Track last scroll position

        this.throttledFunc = throttle(this.evaluateMove.bind(this), 5);
        Callbacks.MasterScrollEvent(this.throttledFunc);

        this.shiftParallax(offsetY); // set the current position to the passed offset

        //window.addEventListener('wheel', this.throttledFunc);
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
        } else {
            this.currentTransform += distance;
        }

        window.requestAnimationFrame(() => {
            this.shiftParallax(this.currentTransform);
        });
    }

    shiftParallax(pixY) {
        this.parallax.style.transform = `translateY(${pixY}px)` // translateX(${pixX}px)`;
    }
}

function throttle(arguedFunc, delay) {
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
const secondaryParallax = new Parallax('#secondary-parallax-bg-image', -0.32, -700)
const tertiaryParallax = new Parallax('#tertiary-parallax-bg-image', -0.18, -300)
const bottomParallax = new Parallax('#bottom-parallax-bg-image', -0.06, 0)
const wiperTransitionParallax = new Parallax('.wiper-transition', 0.75, 700)


function scrollMeDaddy() {
    document.querySelector('#dummy-elem').scrollIntoView(false)
    console.log('scrolled')
}
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {scrollMeDaddy()}
})
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
const scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, c - c / 8);
    }
};
scrollToTop();
*/