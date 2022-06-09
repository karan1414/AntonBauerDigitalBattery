const puppeteer = require('puppeteer');
const fs = require('fs');


(async()=>{
    const productUrl = "https://teradek.com/collections/colr/products/anton-bauer-digital-battery" 

    try{
        const browser = await puppeteer.launch({headless: false})

        const page = await browser.newPage()

        await page.goto(productUrl)

        let capacityCount = 0
        let mountCount = 0
        let resourceArr = []

        try {
            resourceArr = await page.evaluate(()=>{
                let productsObj = window.BOLD.products
                let resourceArr = []
                for(key in productsObj){
                   let variants = productsObj[key].variants
                   variants.forEach(variant => {
                       let name = variant.name
                       let sku = variant.sku
                       let price = "$" + variant.price / 100

                       resourceArr.push({
                           "name": name, "sku": sku, "price": price
                       })
                    });
                }
                return resourceArr
            })
        } catch (error) {
            console.log(error);
        }

        if (resourceArr.length === 0){
            const variantSections = await page.$$('div.variant-section.clearfix')
            for (const variantSection of variantSections){
                try {
                    const isCapacity = await page.evaluate(
                        (el) => el.querySelector('label.variant_label.grid__item.one-whole.medium-down--one-half').textContent, variantSection)
                    
                    if (isCapacity == "Capacity"){
                        capacityCount = await page.evaluate((el)=> el.querySelectorAll('label.arrow_box').length, variantSection)
                    }else if (isCapacity == "Mount"){
                        mountCount = await page.evaluate((el)=> el.querySelectorAll('label.arrow_box').length, variantSection)
                    }
                } catch (error) {
                    console.log(error);
                }
            }
    
            for (i = 1; i <= capacityCount; i++){
                productDetailDict = {}
                for(j = mountCount; j >= 1; j--){
                
                    let capacitySelector = `#AddToCartForm > div.variant_settings > div > div > div > div:nth-child(${i}) > div > div:nth-child(${j}) > label`
                
                    await page.click(capacitySelector);
                
                    let mountSelector = `#AddToCartForm > div.variant_settings > div > div > div > div:nth-child(${j}) > div > div:nth-child(${i}) > label`
    
                    await page.waitForSelector(mountSelector);
                    await page.click(mountSelector);
    
                    let title_element = await page.waitForSelector('h1.title');
                    let title = await title_element.evaluate(el => el.textContent)
    
                    let sku_element = await page.waitForSelector('div.sku.grid__item.one-whole');
                    let sku = await sku_element.evaluate(el => el.textContent)
    
                    let price_element = await page.waitForSelector('#current-price');
                    let price = await price_element.evaluate(el=> el.textContent)
    
                    resourceArr.push({
                        "Product Name": title.trim(),
                        "SKU": sku.trim().replace(/[\[\]']+/g,''),
                        "Price": price.trim() 
                    })
                }
            }
    
        }

        
        fs.writeFile(
            'antonBauerDigitalBatteryVariants.json', 
            JSON.stringify(resourceArr, null, 2), 
            (err)=>{
                if(err){console.log(err);}
                else{console.log('Saved Successfully !');}
            })
        
        await browser.close();
    }
    catch (error){
        console.log(error);
    }
})();
