# AntonBauerDigitalBattery
Scraping the link https://teradek.com/collections/colr/products/anton-bauer-digital-battery?variant=14579104677933  for the product name, sku and price using puppeteer library.


What the script does and the approach:
1. I have created this script to scrape the required details using two approaches.
2. First I check for the details in the window object where it is saved under BOLD obeject inside products key. 
3. If the required information is not found in the window object, the code will then run using selectors and various functions defined in puppeteer.

To Test the code:
1. run npm install to install all the dependencies.
2. run node app.js
3. 
