
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

const params = args.widgetParameter ? args.widgetParameter.split(",") : [];

const isDarkTheme = params?.[0] === 'dark';
const padding = 2;

const widget = new ListWidget();
if (isDarkTheme) {
 widget.backgroundColor = new Color('#1C1C1E');; 
}
widget.setPadding(padding, padding, padding, padding);

widget.url = 'https://www.coingecko.com/en/coins/crypto-com-coin';

const headerStack = widget.addStack();
headerStack.setPadding(0, 0, 25, 0);

async function buildWidget() {
    const croImage = await loadImage('https://assets.coingecko.com/coins/images/7310/small/cypto.png');
  
    const croPriceInfo = await getTokenPriceInfo('crypto-com-chain');
  
    const roundedCroPrice = Math.round(croPriceInfo.price * 1000) / 1000;
  
    addCrypto(croImage, 'CRO', `$${roundedCroPrice}`, croPriceInfo.grow);
}

function addCrypto(image, symbol, price, grow) {
   const rowStack = widget.addStack();
   rowStack.setPadding(0, 0, 20, 0);
   rowStack.layoutHorizontally();
  
   const imageStack = rowStack.addStack(); 
   const symbolStack = rowStack.addStack(); 
   const priceStack = rowStack.addStack(); 
  
   imageStack.setPadding(0, 0, 0, 10);
   symbolStack.setPadding(0, 0, 0, 8);
  
   const imageNode = imageStack.addImage(image);
   imageNode.imageSize = new Size(20, 20);
   imageNode.leftAlignImage();
  
   const symbolText = symbolStack.addText(symbol);
   symbolText.font = Font.mediumSystemFont(16);
  
   const priceText = priceStack.addText(price);
   priceText.font = Font.mediumSystemFont(16);
  
  if (isDarkTheme) {
    symbolText.textColor = new Color('#FFFFFF');
  }
  
  if (grow) {
    priceText.textColor = new Color('#4AA956');
  } else {
    priceText.textColor = new Color('#D22E2E');
  }
}

async function getTokenPriceInfo(tokenId) {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${tokenId}`;
  const req = new Request(url)
  const apiResult = await req.loadJSON() 
  return { price: apiResult[0].current_price, grow: apiResult[0].price_change_24h > 0 };
}

async function loadImage(imgUrl) {
    const req = new Request(imgUrl)
    return await req.loadImage()
}

await buildWidget();

Script.setWidget(widget);
Script.complete();
widget.presentSmall();