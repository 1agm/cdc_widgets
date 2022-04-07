
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

const headerStack = widget.addStack();
headerStack.setPadding(0, 0, 25, 0);


async function getCollection(id) {
  const payload = {
    "operationName": "GetCollection",
    "variables": {
        "collectionId": id
    },
    "query": "query GetCollection($collectionId: ID!) {\n  public {\n    collection(id: $collectionId) {\n      id\n      name\n      description\n      categories\n      banner {\n        url\n        __typename\n      }\n      logo {\n        url\n        __typename\n      }\n      creator {\n        displayName\n        __typename\n      }\n      aggregatedAttributes {\n        label: traitType\n        options: attributes {\n          value: id\n          label: value\n          total\n          __typename\n        }\n        __typename\n      }\n      metrics {\n        items\n        minAuctionListingPriceDecimal\n        minSaleListingPriceDecimal\n        owners\n        totalSalesDecimal\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
  };

  let req = new Request("https://crypto.com/nft-api/graphql");
  req.method = "post";
  req.headers = {
   "Content-Type": "application/json"
  };
  req.body = JSON.stringify(payload);
  // use loadJSON because the API answers with JSON
  let res = await req.loadJSON();
  log(JSON.stringify(res['data']['public']['collection']['name'], null, 2));
  return res['data']['public']['collection']
}

function getName(collection) {
  result = JSON.stringify(collection['name'], null, 2)
  log(result);
  return result

}

function getGIFUrl(collection) {
  result = collection['logo']['url']
  log(result);
  return result
}


function getFloorPrice(collection) {
  price = collection['metrics']['minSaleListingPriceDecimal']
  price = Math.round(price * 1000) / 1000;
  log(price);
  return price
}


async function buildWidget() {
    const ll_id = "6c7b1a68479f2fc35e9f81e42bcb7397"
    const collection = await getCollection(ll_id)
    const name = "B"
    const gifURL = await getGIFUrl(collection)
    const image = await loadImage(gifURL)
    const floorPrice = getFloorPrice(collection)
  
    addCrypto(image, name, `$${floorPrice}`);
}

function addCrypto(image, symbol, price) {
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
}


async function loadImage(imgUrl) {
    const req = new Request(imgUrl)
    return await req.loadImage()
}

await buildWidget();

Script.setWidget(widget);
Script.complete();
widget.presentSmall();
