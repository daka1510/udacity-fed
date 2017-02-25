# 06-website-optimization

## Getting Started
- Option 1: run locally
  - `npm install`
  - `gulp serve`
  - open [http://localhost:3020](http://localhost:3020)
- Option 2: use hosted site
  - open [https://daka1510.github.io/udacity-fend/06-website-optimization/app/](https://daka1510.github.io/udacity-fend/06-website-optimization/app/)

## Performance Improvements
### PageSpeed Score
- optimized image sizes (`img/preview_*.jpg`, `img/profilepic.jpg`)
- load analytics code asynchronously
- embed CSS markup in html file
- embed JS code in html file
- hide preview images on mobile devices
- added media query for `print.css`

As a result, `index.html` achieves a `PageSpeed` score of 94 for [Mobile and Desktop](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fdaka1510.github.io%2Fudacity-fend%2F06-website-optimization%2Fapp%2F&tab=mobile).

