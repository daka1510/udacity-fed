# 06-website-optimization

## Getting Started
- Option 1: run locally
  - `npm install`
  - `gulp serve`
  - open [http://localhost:3020](http://localhost:3020)
- Option 2: use hosted site
  - open [https://daka1510.github.io/udacity-fend/06-website-optimization/app/](https://daka1510.github.io/udacity-fend/06-website-optimization/app/)

### PageSpeed Score
#### Critical Rendering Path
- optimized image sizes (`img/preview_*.jpg`, `img/profilepic.jpg`)
- load analytics code asynchronously
- embed CSS markup in html file
- embed JS code in html file
- hide preview images on mobile devices
- added media query for `print.css`

As a result, `index.html` achieves a `PageSpeed` score of 94 for [Mobile and Desktop](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fdaka1510.github.io%2Fudacity-fend%2F06-website-optimization%2Fapp%2F&tab=mobile).

### Getting Rid of Jank
changes in `views/js/main.js`

#### Frame Rate
- added wrapper function `updatePositionsBeforeNextRepaint` to ensure that positions are not updated in between two frame rendering cycles
- introduced two different view modes: mobile, desktop
  - added function `useAnimatedPizzaSlices` that ensures that pizza slices are not animated on mobile devices for performance reasons
  - used media query to switch mode based on device width (see `window.matchMedia("(min-width: 480px)")`
- fixed forced reflow issue in `updatePositions` function`
- reduced number of animated pizza slices to 12
- added `will-change:left;` to `.mover` class in `views/css/style.css`

 
#### Computational Efficiency
- simplified function `changePizzaSizes` and removed FSL bug in analogy to the solution presented in the course (cf. Browser Rendering Optimization > Styles and Layout > Quiz: Stop FSL) 
