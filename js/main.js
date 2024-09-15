
/*
Done:
- Scroll based on provided speed modifier X
- Switch direction of parallax when scroll direction changes X
- Prevent frame skip by using requestAnimationFrame() X
- Lock top by default to prevent over-scrolling X
- Dynamically update a single scroll listener to avoid multiple listeners in the case of many parallax effects X
- Throttle parallax move function to prevent too many function calls X
- Allow the parallax scroll axis to be changed X
- Dynamic positioning - just add a parallax and away you go X
- Sit parallax flush with screen bottom or screen top, based on parallax direction
- Allow offset to be introduced, to create layered depth effects with the same image
- auto-size parallax to be large enough to scroll the whole screen, but keep the original styling if appropriate X
ToDo:
    Adjust the throttling to match device performance
    Disable parallax layers one-by-one if performance dips by too much.

 */

// THE FOLLOWING ELEMENT PROPERTIES WILL BE MODIFIED ON APPLICATION OF PARALLAX:
// height, transform (translateY/translateX)

/**
 * Gives the targeted element parallax scroll effect functionality
 * @Param elemSelector Selector of the desired element. If the selector targets multiple elements, only the first will be chosen.
 * @Param scrollSpeedModifier
 * @Param autoSize Auto-size the parallax to be large enough to scroll the whole screen. only applicable to Y axis at this stage
 */
class Parallax {
    #axis = 'Y'
    #instances = [] // so that images can be offset without being scaled differently

    constructor(elemSelector, scrollSpeedModifier, autoSize = true) {
        this.parallax = document.querySelector(elemSelector);

        this.#instances.push(this.parallax);
        this.resize = autoSize
        this.layerRef = null
        this.layeredInstances = []
        this.currentTransform = 0
        this.scrollableHeight = document.body.scrollHeight - document.documentElement.clientHeight
        this.distanceModifier = scrollSpeedModifier; // Adjust base travel speed to control parallax effect
        this.lastScrollTop = window.scrollY; // Track last scroll position
        this.selfHeight = parseInt(getComputedStyle(this.parallax).height.split('px')[0])


        // Assign throttle(), with onScroll (bound to this instance of Parallax) as an argument, to a variable
        this.throttledOnScroll = throttle(this.#onScroll.bind(this), 5);
        // Begin the 5 layer deep callback chain... by passing the above function to a master scroll listener
        GlobalScroll.AppendScrollCallbacks(this.throttledOnScroll);

        this.#placeImage()
        // this.#shift(this.currentTransform, this.#axis); // set the current position to the passed offset

        document.addEventListener('DOMContentLoaded', () => {
            if (this.layerRef === null) {return}
            this.#findLayeredInstances()
            this.#scaleToLayerGroup()
        })
    }

    //region Private Functions

    #onScroll() {

        const currentScrollTop = window.scrollY;
        const distanceScrolled = currentScrollTop - this.lastScrollTop;
        this.lastScrollTop = currentScrollTop;

        const direction = distanceScrolled > 0 ? 'down' : 'up';
        const distance = Math.abs(distanceScrolled) * this.distanceModifier;

        // add or remove the calculated travel distance from the transform value, depending on the scroll direction
        this.currentTransform += (direction === 'down') ? -(distance) : distance;
        // prevent the top bounding edge of the image from scrolling into view in an unexpected case
        if (this.currentTransform >= 0) {return}

        window.requestAnimationFrame(() => {
            this.#shift(this.#axis, this.currentTransform);
        });
    }

    #shift(axis, pixels) {
        this.parallax.style.transform = `translate${axis}(${pixels}px)` // translateX(${pixX}px)`;
    }

    offset(/*x,*/ yOffset) {
        // this.#shift('X', x);
        // do placeImage() offset for x too

        this.totalYOffset = yOffset

        let clientHeight = document.documentElement.clientHeight

        // set the starting position of the image (depending on the parallax's scroll direction)
        if (this.#directionCorrection(1) === -1) {
            // scroll direction is down:
            this.currentTransform = 0
            this.#shift('Y', this.currentTransform)
        }
        else {
            this.currentTransform = -((this.selfHeight + yOffset) - clientHeight)
            console.log(this.currentTransform)
            this.#shift('Y', this.currentTransform)
        }

    }

    #placeImage(offset = 0) {
        // get the page height and calculate the max travel distance of the parallax based on that
        // provide a way to limit travel distance

        let clientHeight = document.documentElement.clientHeight
        let maxTravel = (this.scrollableHeight + offset) * this.distanceModifier // scrollable height * distance modifier

        this.offset(offset)

        if (!this.resize) {return}
        let newHeight = Math.abs(maxTravel) + clientHeight
        if (this.selfHeight >= newHeight) {return} // if height is already appropriate, don't change it
        this.parallax.style.height = `${newHeight}px` // height of image = offset + screen height
        // set bottom of image to be flush with the screen bottom

    }

    #directionCorrection(number) {
        if (Math.sign(this.distanceModifier) === 1) {
            return -(number) // down
        } else {
            return number
        }
    }

    //ToDo: needs to be altered to account for post-load offset changes
    #findLayeredInstances() {
        this.#instances.forEach((parallax)=>{
            // if the selected instance is in the same group as this parallax, add the instance to the list
            parallax.layerRef === this.layerRef ? this.layeredInstances.push(parallax) : 0;
        })
    }

    #scaleToLayerGroup() {
        // scale the parallax relative to the size of the other parallaxes in the same layer grouping
        // takes offset into account. should be called from the offset function as it's the bottleneck.

        let highestOffset = 0
        this.layeredInstances.forEach((parallax) => {
            let offset = Math.abs(parallax.totalYOffset)
            highestOffset = offset > highestOffset ? offset : highestOffset;
        })

        // get height and add the calculated extra height to it

        this.selfHeight += highestOffset
        this.parallax.style.height = `${this.selfHeight}px`
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

const parallax = new Parallax('#primary-parallax-bg-image', -0.5)
parallax.offset(100)
parallax.layerRef = '1'
const secondaryParallax = new Parallax('#secondary-parallax-bg-image', -0.32)
secondaryParallax.layerRef = '1'
const tertiaryParallax = new Parallax('#tertiary-parallax-bg-image', -0.18)
tertiaryParallax.layerRef = '1'
const bottomParallax = new Parallax('#bottom-parallax-bg-image', -0.05)
bottomParallax.layerRef = '1'
// const backingImageParallax = new Parallax('.backing-parallax', -0.1)
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
let maxScroll = document.body.scrollHeight - document.documentElement.clientHeight
console.log(maxScroll)

setInterval(()=>{
    if(time > 1000) {
        time = 0;
    }
    let current = document.documentElement.scrollTop
    if ((current >= maxScroll-20 && (Math.abs(dist) !== -1)) || current <= 20 && (Math.abs(dist) !== 1)) {dist = -(dist)} // flip sign
    window.scrollBy({top: dist, left: 0, behavior: 'instant'})
}, 1)
*/