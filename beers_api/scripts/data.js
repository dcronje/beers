let loremIpsum = require('lorem-ipsum')
let { MongoClient, Server, ObjectID } = require('mongodb')
let env = require('node-env-file')
let path = require('path')
let Promise = require('bluebird')
let _ = require('underscore')

let appDir = path.dirname(require.main.filename)
if (!process.env.ENV_LOADED) {
  let envFile = path.join(appDir, '../.env')
  env(envFile)
}

// Bar address, building
// types

let beerTypes = [
  'LAGER',
  'PILSNER',
  'AMBER_ALE',
  'INDIA_PALE_ALE',
  'BLONDE_ALE',
  'BITTER',
  'STOUT',
]

let wineTypes = [
  'SAUVIGNON_BLANC',
  'SHIRAZ',
  'CABERNET_SAUVIGNON',
  'BLANC_DE_BLANC',
  'CHARDONNAY',
  'MERLOT',
  'PINOT_NOIR',
]

let ciderTypes = [
  'APPLE',
  'PEAR',
  'PEACH',
  'LEMON',
  'ORANGE'
]

let ciderImages = [{
  image: '/images/ciders/73x8sUALgL.jpg',
  name: 'Drunken Sailor'
},
{
  image: '/images/ciders/JesMCzBRLL.jpg',
  name: 'Hardcore'
},
{
  image: '/images/ciders/XsdWC6EeEM.jpg',
  name: 'Succo di Mella'
},
{
  image: '/images/ciders/xZjdbhFOnQ.jpg',
  name: 'Glacial Till'
},
{
  image: '/images/ciders/OsOCd0ZOZJ.jpg',
  name: 'Crimson Clover'
},
{
  image: '/images/ciders/dGjelpuzeZ.jpg',
  name: 'Four Brothers'
},
{
  image: '/images/ciders/kMnQ7kbdcz.jpg',
  name: 'Varlington Mill'
},
{
  image: '/images/ciders/cfCO2mq0L0.jpg',
  name: 'Crazy Beard'
},
{
  image: '/images/ciders/6c3phBdmkM.jpg',
  name: 'Easy Tiger'
},
{
  image: '/images/ciders/dKsjudSlIw.jpg',
  name: 'Cider Winder'
},
{
  image: '/images/ciders/IrhsBA68e8.jpg',
  name: 'Sitting Ducks'
},
{
  image: '/images/ciders/RTGmsFPOXb.jpg',
  name: 'Descendent'
},
{
  image: '/images/ciders/hb25gideHP.jpg',
  name: 'Beer Cider'
},
{
  image: '/images/ciders/1thLWxN4cx.jpg',
  name: 'Black Twig'
}]

let wineImages = [{
  image: '/images/wines/sIbMjoHHxd.jpg',
  name: 'Helderberg'
},
{
  image: '/images/wines/6zE9RNpjwL.jpg',
  name: 'Uno'
},
{
  image: '/images/wines/1dagPvfaRR.jpg',
  name: 'Bandol'
},
{
  image: '/images/wines/lbdLMt6m7I.jpg',
  name: 'Sullivan'
},
{
  image: '/images/wines/Q7Z9CtHEZ3.jpg',
  name: 'Elegant'
},
{
  image: '/images/wines/OP5ym8U1c4.jpg',
  name: 'Femail'
},
{
  image: '/images/wines/WSs5DsNNTo.jpg',
  name: 'Casa de la Cera'
},
{
  image: '/images/wines/cXMdFxVXM0.png',
  name: 'Caricature'
},
{
  image: '/images/wines/nT8uMOyfHE.jpg',
  name: 'Sokol blosser'
},
{
  image: '/images/wines/Ivq2RnL2HW.jpg',
  name: 'Kangaroo'
},
{
  image: '/images/wines/9QpIjxwHta.jpg',
  name: 'Horse'
},
{
  image: '/images/wines/CsdXzYM5gw.png',
  name: 'Beyond the Grape'
},
{
  image: '/images/wines/3rYgCMMd7a.jpg',
  name: 'Gift wine'
},
{
  image: '/images/wines/6CrdB2xM5h.jpg',
  name: 'Illustrations'
},
{
  image: '/images/wines/ZLWj5KT1PX.jpg',
  name: 'Vermes'
},
{
  image: '/images/wines/bLpB5jSUMH.jpg',
  name: 'Charles le Chat'
},
{
  image: '/images/wines/iMjZhSZjfb.png',
  name: 'Barbera'
},
{
  image: '/images/wines/0JdyyYrmFL.jpg',
  name: 'Sixty Clicks'
},
{
  image: '/images/wines/90g1GTGPtc.jpg',
  name: 'He Said She Said'
},
{
  image: '/images/wines/C3xnESxEeq.jpg',
  name: 'Cooper\'s Find'
},
{
  image: '/images/wines/JwbTGtp0oB.jpg',
  name: 'Esperanza'
},
{
  image: '/images/wines/sHToIPjiZH.png',
  name: 'Zwine'
},
{
  image: '/images/wines/Q0CmqxivL2.jpg',
  name: 'Grillo'
},
{
  image: '/images/wines/5vOb5eyw9x.jpg',
  name: 'Condado de Oriza'
},
{
  image: '/images/wines/IgGA4O0xPe.jpg',
  name: 'Sicani'
},
{
  image: '/images/wines/f11aygE0yW.jpg',
  name: 'Motio'
},
{
  image: '/images/wines/GBQhHkn53x.jpg',
  name: 'Salty Hills'
},
{
  image: '/images/wines/oeOQX5NmQx.png',
  name: 'Jaspi Blanc'
},
{
  image: '/images/wines/krrbQipRqn.png',
  name: 'Cheers'
},
{
  image: '/images/wines/LXZM5yk6rP.jpg',
  name: 'Campo viejo'
}]

let beerImages = [{
  image: '/images/beers/VaQNQymCQx.jpg',
  name: 'Stejar bottle'
},
{
  image: '/images/beers/69SSMXumwS.jpg',
  name: 'Stejar can'
},
{
  image: '/images/beers/9WDJa2j4ju.jpg',
  name: 'Stejar plastic bottle'
},
{
  image: '/images/beers/qRsvuAFedv.jpg',
  name: '5 0 original cans'
},
{
  image: '/images/beers/ftLaLJxUCr.jpg',
  name: '5 0 original bottles'
},
{
  image: '/images/beers/c97T0cSjJc.jpg',
  name: 'Sleeman brewery bottles'
},
{
  image: '/images/beers/6D9iQYHber.jpg',
  name: 'Hallertau extra strength heroic beer bottles'
},
{
  image: '/images/beers/aY42oaU9X7.jpg',
  name: 'Schoefferhofer bottles'
},
{
  image: '/images/beers/X1pYDTS7SE.jpg',
  name: 'Session lager cans'
},
{
  image: '/images/beers/3usR3e2DsB.jpg',
  name: 'Ip beer'
},
{
  image: '/images/beers/ZwOyZaliIm.jpg',
  name: 'Carlsberg bottle and cans'
},
{
  image: '/images/beers/OHFTRrGzZE.jpg',
  name: 'Carlsberg 900 bottle'
},
{
  image: '/images/beers/gUe7hxQqM6.jpg',
  name: 'Bierbank bottle'
},
{
  image: '/images/beers/PE3PMe1D4p.jpg',
  name: 'Big boss brewing bad penny bottle and package'
},
{
  image: '/images/beers/7IWFn336Wr.jpg',
  name: 'Big boss brewing hell s belle bottle and package'
},
{
  image: '/images/beers/M9QbcWJog7.jpg',
  name: 'Big boss brewing angry angel bottle and package'
},
{
  image: '/images/beers/MP32Zu4AWC.jpg',
  name: 'A le coq special bottle'
},
{
  image: '/images/beers/0BpxscONt0.jpg',
  name: 'Heineken bottle'
},
{
  image: '/images/beers/oXQGMg1cWh.jpg',
  name: 'Saison 1900'
},
{
  image: '/images/beers/NAAmbQwbFs.jpg',
  name: 'Dead rabbits and carrots bottle'
},
{
  image: '/images/beers/x6iOPPLW6O.jpg',
  name: 'Westmalle bottles and package'
},
{
  image: '/images/beers/1AQPe3CWDy.jpg',
  name: 'Desperados bottle'
},
{
  image: '/images/beers/hnWyFNy0rI.jpg',
  name: 'Belle s bottles'
},
{
  image: '/images/beers/5SYCxD4KAv.jpg',
  name: 'Guiness can'
},
{
  image: '/images/beers/vAc72B5GpL.jpg',
  name: 'Little light cans'
},
{
  image: '/images/beers/WJ7zDUpRC3.jpg',
  name: 'Amstel premium quality lager bottle'
},
{
  image: '/images/beers/YUwnpf8k4j.jpg',
  name: 'Stolz bottles'
},
{
  image: '/images/beers/gXOgY8oPAW.jpg',
  name: 'Cable car brewing bottle and packaging'
},
{
  image: '/images/beers/xs0dCYrdAR.jpg',
  name: 'Drum bottles'
},
{
  image: '/images/beers/n9ECdzfFI9.jpg',
  name: 'Xxxx summer bright lager bottle'
},
{
  image: '/images/beers/c1YvkNQy0O.jpg',
  name: 'Castello bottles'
},
{
  image: '/images/beers/kzQXLhmMAm.jpg',
  name: 'Castello can'
},
{
  image: '/images/beers/wKPbeJvZul.jpg',
  name: 'Bold city brewery bottles'
},
{
  image: '/images/beers/ligwQmk1y2.jpg',
  name: 'Trouble brewing bottles'
},
{
  image: '/images/beers/VYuZoZs8JC.jpg',
  name: 'Vonu pure lager bottles'
},
{
  image: '/images/beers/LyWKzYbBp5.jpg',
  name: 'Kaliber bottle and cans'
},
{
  image: '/images/beers/8EN4g2vo9Q.jpg',
  name: 'Kirin bottles'
},
{
  image: '/images/beers/c70yUYYvvZ.jpg',
  name: 'Brøckhouse breweries'
},
{
  image: '/images/beers/m9Zc8XGbgd.jpg',
  name: 'Jever bottles'
},
{
  image: '/images/beers/XulG5GTrLE.jpg',
  name: 'Hitachine nest beer bottles'
},
{
  image: '/images/beers/9Q25JmNQZW.jpg',
  name: 'Old gold premium pils'
},
{
  image: '/images/beers/YNxOMRWTNr.jpg',
  name: 'Soho brewery bottles and package'
},
{
  image: '/images/beers/07xxRlxj7S.jpg',
  name: 'Northern united brewing company'
},
{
  image: '/images/beers/3rebbpEj6J.jpg',
  name: 'Fyne ales bottles'
},
{
  image: '/images/beers/Bd0OW1oMjV.jpg',
  name: 'Fluid bottles and cans'
},
{
  image: '/images/beers/gGvvr8hydy.jpg',
  name: 'Chambar ale bottle'
},
{
  image: '/images/beers/vQN8uBAvDt.jpg',
  name: 'Ringnes sommerøl'
},
{
  image: '/images/beers/jsWxqVBDHp.jpg',
  name: 'Erdinger weissbier dunkel bottle'
},
{
  image: '/images/beers/zhOR0FTv4t.jpg',
  name: 'Brew dog bottles'
},
{
  image: '/images/beers/Y2lhCOWxuN.jpg',
  name: 'Nelson brewing bottle'
},
{
  image: '/images/beers/QC9JwEeqJb.jpg',
  name: 'Nelson brewing bottle'
},
{
  image: '/images/beers/wUdNwXz6dQ.jpg',
  name: 'Bard s bottle and package'
},
{
  image: '/images/beers/VmKDshFezA.jpg',
  name: 'Great divide brewing co bottles'
},
{
  image: '/images/beers/x5xy9JRNaN.jpg',
  name: 'Monteith s bottles'
},
{
  image: '/images/beers/JRge52SyJm.jpg',
  name: 'Amsterdam pomegranate wheat'
},
{
  image: '/images/beers/wqCmFLu5kH.jpg',
  name: 'Moorhouse s brewery bottles'
},
{
  image: '/images/beers/R6FRLjxLgA.jpg',
  name: 'Corona bottle'
},
{
  image: '/images/beers/ook4w8rpU2.jpg',
  name: 'Duff can with homer simpson inside'
},
{
  image: '/images/beers/GcO5NFc1b2.png',
  name: 'Bitches brew beer label'
},
{
  image: '/images/beers/vBAK2eXR0N.png',
  name: 'Brand bier label design'
},
{
  image: '/images/beers/GCzIlgN0ZS.png',
  name: 'Miller high life beer label design'
},
{
  image: '/images/beers/b6FY1VEUWZ.png',
  name: 'Luminary quarters'
},
{
  image: '/images/beers/s3lXOOVjTT.png',
  name: 'Ponysaurus brewing co'
},
{
  image: '/images/beers/UxZZX06f0I.png',
  name: 'Shiner white wing'
},
{
  image: '/images/beers/oC9xcTJpKn.png',
  name: 'Maneblusser'
},
{
  image: '/images/beers/Z3uK0d152d.png',
  name: 'Copper kettle mexican stout'
},
{
  image: '/images/beers/aoGUdPeHK4.png',
  name: 'Innis and gunn'
},
{
  image: '/images/beers/XoxJNKzlEy.png',
  name: 'Double vienna'
},
{
  image: '/images/beers/1W7XpB7aQ4.png',
  name: 'Sail and anchor'
},
{
  image: '/images/beers/GLstjqEjhk.png',
  name: 'Tin man brewing co'
},
{
  image: '/images/beers/AJKpecvJ8V.png',
  name: 'Golden fleece'
},
{
  image: '/images/beers/mZbu3aXTWo.png',
  name: 'Imperial series'
},
{
  image: '/images/beers/PnTq3R0Y8O.png',
  name: 'Austin beerworks'
},
{
  image: '/images/beers/dHrrOU2kjL.png',
  name: 'Ind hed'
},
{
  image: '/images/beers/2gmfwUm7mW.png',
  name: 'Brindle dog brewing co'
},
{
  image: '/images/beers/xBk1mZrnM5.png',
  name: 'Velkopopovicky kozel'
},
{
  image: '/images/beers/GOmULINNlN.png',
  name: 'Camden town brewery'
},
{
  image: '/images/beers/si6Yj7CgVN.png',
  name: 'Devils peak brewing co'
},
{
  image: '/images/beers/1GlSvPMk7A.png',
  name: 'Matea and bernabe'
},
{
  image: '/images/beers/zeHuQcBRRR.png',
  name: 'Shiner wild hare'
},
{
  image: '/images/beers/YILEcVL1R7.png',
  name: 'Muskoka brewery'
},
{
  image: '/images/beers/PoSPTgrpbO.png',
  name: 'Republic 7'
},
{
  image: '/images/beers/mZUQUMT7af.png',
  name: 'Porsteinn'
},
{
  image: '/images/beers/p6dGFRZIx4.png',
  name: 'Back in black'
},
{
  image: '/images/beers/1VQV4CLOmY.png',
  name: 'White rabbit dark ale'
},
{
  image: '/images/beers/05LfEQWVm2.png',
  name: 'Lovells pure lager'
},
{
  image: '/images/beers/sFNktyGtOS.png',
  name: 'Grimm brothers'
},
{
  image: '/images/beers/ohShCbCpdF.png',
  name: 'Water malt hops yeast'
},
{
  image: '/images/beers/kv8rbyw1s8.png',
  name: 'A le coq premium'
},
{
  image: '/images/beers/mW5hTVNEXF.png',
  name: 'Angry scotch ale'
},
{
  image: '/images/beers/s1r2ObhpMx.png',
  name: 'Deschutes bond street series'
},
{
  image: '/images/beers/39MDSwVEjT.png',
  name: 'Work beer'
},
{
  image: '/images/beers/pvoqvnqy5L.png',
  name: 'Staropramen lager'
},
{
  image: '/images/beers/YRvIv0okCy.png',
  name: 'Legendary sunshine'
},
{
  image: '/images/beers/kLvt872uNJ.png',
  name: 'Odell myrcenary'
},
{
  image: '/images/beers/Fb6UlMRV55.png',
  name: 'Underground beer club'
},
{
  image: '/images/beers/EkpcD6uAO8.png',
  name: 'Orlando brewing'
},
{
  image: '/images/beers/xbGj84yN2D.png',
  name: 'Rats piss bitter ale'
},
{
  image: '/images/beers/ujQUfHTPT7.png',
  name: 'Abbys ale'
},
{
  image: '/images/beers/6P4suEtkgT.png',
  name: 'The seasoned traveler'
},
{
  image: '/images/beers/ujcACehSlk.png',
  name: 'Canadian band beer'
},
{
  image: '/images/beers/oEGzKfIIiD.png',
  name: 'Pioneer snakebite'
},
{
  image: '/images/beers/nrK3myMbc0.png',
  name: 'Citrus gold'
}]

let barImages = [{
  image: '/images/bars/7kBpeCWuzm.jpg',
  name: 'Mammoth Pub',
  address: '32 Bramer rd, Green Point, Cape Town',
  building: '2nd Floor the Plaza Hotel'
},
{
  image: '/images/bars/X9CTjcoutf.jpg',
  name: 'Cavalier Bar & Supper',
  address: 'Green Market Square, City Center, Cape Town',
  building: 'Shop 12'
},
{
  image: '/images/bars/YKWnKzlM26.jpg',
  name: 'The Stumbling Steer',
  address: '14 Eaton Rd, Gardens, Cape Town',
  building: 'The Advance'
},
{
  image: '/images/bars/KMFpvdJLhk.jpg',
  name: 'Ice House',
  address: '7 Bath St, Gardens Cape Town',
  building: 'Unit 22'
},
{
  image: '/images/bars/Maq26kIMYN.jpg',
  name: 'The Lighthouse Bar',
  address: '25 Bloem St, City Center, Cape Town',
  building: 'Suite 7'
},
{
  image: '/images/bars/c0H8N72RZx.jpg',
  name: 'The Tap Room',
  address: '71 Commercial St, City Center, Cape Town',
  building: 'The corner house'
},
{
  image: '/images/bars/QTJfRw9Sdf.jpg',
  name: 'Gent\'s Tavern',
  address: '12 Consiton Rd, Rondebosch, Cape Town',
  building: '4th floor, the inhouse'
},
{
  image: '/images/bars/1wS0vWAKwl.jpg',
  name: 'Digger Bar',
  address: '115 Imam Haron Rd, Claremont, Cape Town',
  building: 'Unit 7'
},
{
  image: '/images/bars/eODQkV0ESl.jpg',
  name: 'Martini House',
  address: '14 Orange Rd, Newlands, Cape Town',
  building: ''
},
{
  image: '/images/bars/ms3g0OWClY.jpg',
  name: 'Shamrock',
  address: '47 Victoria Rd, Clifton, Cape Town',
  building: 'No 7, Hamilton Court'
},
{
  image: '/images/bars/gXWYMSArpj.jpg',
  name: 'Greenwich Pub',
  address: '15 Biskop Steps, Clifton, Cape Town',
  building: ''
},
{
  image: '/images/bars/coCgNY8p93.jpg',
  name: 'Wine House',
  address: '5 Ave Alexandra, Fresnaye, Cape Town',
  building: ''
},
{
  image: '/images/bars/9RiPoeXuAH.jpg',
  name: 'Divers Pub',
  address: '33 Barkly Rd, Sea Point, Cape Town',
  building: 'Corner Shop'
},
{
  image: '/images/bars/xCG7IPekCX.jpg',
  name: 'Brookside Bar',
  address: '29 Carstens St, Tamboerskloof Cape Town',
  building: ''
},
{
  image: '/images/bars/FZkHaZjjRI.jpg',
  name: 'One Bar & Lounge',
  address: '36 Rosmead Av, Gardens, Cape Town',
  building: '3rd floor'
},
{
  image: '/images/bars/A7UyI89oP4.jpg',
  name: 'Bridges Pub & Eatery',
  address: '5 Marchmont Ave, Oranjezicht, Cape Town',
  building: ''
},
{
  image: '/images/bars/jaNpMrCKJl.jpg',
  name: 'russian ukranian',
  address: '2 Kent St, Zonnebloem, Cape Town',
  building: '74 Prestwich St, De Waterkant, Cape Town'
},
{
  image: '/images/bars/lB32GcWSTp.jpg',
  name: 'Republic Bar',
  address: '32 Braemar Rd, Green Point, Cape Town',
  building: ''
},
{
  image: '/images/bars/DeoLoJMqGq.jpg',
  name: 'Hangover Student Bar',
  address: '25 Main Rd, Green Point, Cape Town',
  building: ''
},
{
  image: '/images/bars/iUTjiCD3Y6.jpg',
  name: 'Genius Bar',
  address: '28 Vesperdene Rd, Green Point Cape Town',
  building: ''
}]

let breweryImages = [
  {
    name: 'Gap Gaspe',
    image: '/images/breweries/0nzyuLFXhY.jpg',
  }, {
    name: 'Cinema',
    image: '/images/breweries/3otBhRCkzZ.jpg',
  }, {
    name: 'Scrappy Punk',
    image: '/images/breweries/5S5lhI9EdV.jpg'
  }, {
    name: 'Fat Cat',
    image: '/images/breweries/6vG41OBd9b.jpg',
  }, {
    name: 'Stackstone and Timber',
    image: '/images/breweries/7XalPCEHu4.jpg',
  }, {
    name: 'The Brewing Network',
    image: '/images/breweries/55NGRcR11Y.png',
  }, {
    name: 'Petite Brasserie',
    image: '/images/breweries/59dDmsZorz.jpg',
  }, {
    name: 'Student',
    image: '/images/breweries/87yEyCUpDO.png',
  }, {
    name: 'Bogside',
    image: '/images/breweries/Bret5aLRT6.jpg',
  }, {
    name: 'Small Town Big City',
    image: '/images/breweries/d0GpPTBvvs.jpg',
  }, {
    name: 'Burban',
    image: '/images/breweries/ewTq5kq8zH.png',
  }, {
    name: 'La Brayonne',
    image: '/images/breweries/FavJoRyIfM.jpg',
  }, {
    name: 'Stein And 9',
    image: '/images/breweries/fu6dd7wIdM.png',
  }, {
    name: 'Rippon',
    image: '/images/breweries/G2IJAwelAB.jpg',
  }, {
    name: 'Craft Brew Girls',
    image: '/images/breweries/GFnUsTMaXt.png',
  }, {
    name: 'Flat Fish',
    image: '/images/breweries/GSiAZoA4Dq.jpg',
  }, {
    name: 'PinkPinty',
    image: '/images/breweries/Hd8h1JIFEz.jpg',
  }, {
    name: 'Deep',
    image: '/images/breweries/hURbtBZ0tJ.png',
  }, {
    name: 'Hopsy',
    image: '/images/breweries/i6W3Tecerq.png',
  }, {
    name: 'Bleding Heart',
    image: '/images/breweries/IATWCoVfkq.jpg',
  }, {
    name: 'Party Crate',
    image: '/images/breweries/ID8ed2mNtR.png',
  }, {
    name: 'Lake Wilcox',
    image: '/images/breweries/jAOdeEq3I6.png',
  }, {
    name: 'Intercourse',
    image: '/images/breweries/JFnUELxo06.jpg',
  }, {
    name: 'Tappers',
    image: '/images/breweries/jMEp6bBNkq.jpg',
  }, {
    name: 'Diggles',
    image: '/images/breweries/JqYQfRI4kK.jpg',
  }, {
    name: 'Arrowhead',
    image: '/images/breweries/K0kOIzfhFX.jpg',
  }, {
    name: 'Crafty Dee\'s',
    image: '/images/breweries/K6EV1V4cC8.jpg',
  }, {
    name: 'Biergun',
    image: '/images/breweries/l0NLaDIABD.jpg',
  }, {
    name: 'Boiler',
    image: '/images/breweries/LBMONJ8SxC.jpg',
  }, {
    name: 'Craft',
    image: '/images/breweries/M3Q48inAqv.jpg',
  }, {
    name: 'Shop Supply Co.',
    image: '/images/breweries/mdo6azeKxB.jpg',
  }, {
    name: 'Tinman',
    image: '/images/breweries/n38fc9WPk0.jpg',
  }, {
    name: 'Hopper\'s',
    image: '/images/breweries/PCk9xkwGcT.png',
  }, {
    name: 'Froth',
    image: '/images/breweries/rfo9DqWAus.jpg',
  }, {
    name: 'Noble Jay',
    image: '/images/breweries/rg0J8Mrrkq.jpg',
  }, {
    name: 'Keppo',
    image: '/images/breweries/rhuitowvnR.png',
  }, {
    name: 'Foxtrot\'s Hopyard',
    image: '/images/breweries/rJioct6Eoi.png',
  }, {
    name: 'Angel\'s Share',
    image: '/images/breweries/SBbdLdo4Kd.png',
  }, {
    name: 'Oktoberfest',
    image: '/images/breweries/SCzVPifbly.jpg',
  }, {
    name: 'Mockery',
    image: '/images/breweries/tcWqys68LM.png',
  }, {
    name: 'Nobel Road',
    image: '/images/breweries/tgavdmMAsQ.png',
  }, {
    name: 'Beers Looking at You',
    image: '/images/breweries/TNfMj0Z7I5.png',
  }, {
    name: 'Dainton',
    image: '/images/breweries/u20SqrgclU.jpg',
  }, {
    name: 'Craft Brewery Advisors',
    image: '/images/breweries/UTksDEzDzM.jpg',
  }, {
    name: 'Drink Me',
    image: '/images/breweries/V6TgIepw0J.png',
  }, {
    name: 'Storybook',
    image: '/images/breweries/ZeVVYG0RUF.jpg',
  }
]

let userCount = getRandomInt(30, 100)
let breweries = []
let bars = []
let beers = []
let wines = []
let ciders = []
let barBeers = []
let users = []
let rating = []

// connect()
// .then((db) => {
//   return saveBreweries(db)
//   .then(() => {
//     return saveBars(db)
//   })
//   .then(() => {
//     return saveBeers(db)
//   })
//   .then(() => {
//     return saveWines(db)
//   })
//   .then(() => {
//     return saveCiders(db)
//   })
//   .then(() => {
//     return saveBarBeers(db)
//   })
//   .then(() => {
//     return saveBarWines(db)
//   })
//   .then(() => {
//     return saveBarCiders(db)
//   })
//   .catch((err) => {
//     console.log(err.stack)
//   })
// })

connect()
.then((db) => {
  return Promise.resolve()
  .then(() => {
    return [
      db.collection('users').find({}).toArray(),
      db.collection('beverages').find({}).toArray(),
    ]
  })
  .spread((users, beverages) => {
    return new Promise((resolve, reject) => {
      Promise.each(beverages, (beverage) => {
        return new Promise((resolve, reject) => {
          let userCount = getRandomInt(0, users.length - 1)
          let ratingUsers = []
          for (let u = 0; u < userCount; u++) {
            let userId = users[getRandomInt(0, users.length - 1)]._id
            let foundUnique = false
            while (!foundUnique) {
              if (!_.contains(ratingUsers, userId)) {
                foundUnique = true
              } else {
                userId = users[getRandomInt(0, users.length - 1)]._id
              }
            }
            ratingUsers.push(userId)
          }
          Promise.each(ratingUsers, (ratingUser) => {
            return new Promise((resolve, rejcet) => {
              db.collection('ratings').insertOne({
                _userId: ratingUser,
                _beverageId: beverage._id,
                review: loremIpsum({ count: 3, units: 'sentence', sentenceLowerBound: 3, sentenceUpperBound: 10 }),
                value: getRandomInt(1, 5),
                createdAt: new Date(),
              })
              .then((result) => {
                ratingId = result.insertedId
                return db.collection('ratings').aggregate([{ $match: { _beverageId: ObjectID(beverage._id) } }, { $group: { _id: null, avg: { $avg: "$value" } } }]).toArray()
              })
              .then((result) => {
                return db.collection('beverages').updateOne({ _id: ObjectID(beverage._id) }, { $set: { rating: result[0].avg } })
              })
              .then(resolve)
              .catch(reject)
            })
          })
          .then(resolve)
          .catch(reject)
        })
      })
      .then(resolve)
      .catch(reject)
    })
  })
  .then(() => {
    console.log('DONE')
  })
  .catch((err) => {
    console.log(err.stack)
  });
})


function saveBreweries(db) {
  let collection = db.collection('breweries')
  return new Promise((resolve, reject) => {
    Promise.each(breweryImages, (breweryImage) => {
      return new Promise((resolve, reject) => {
        let brewery = {
          name: breweryImage.name,
          logo: breweryImage.image,
          description: loremIpsum({ count: 5, units: 'sentence', sentenceLowerBound: 10, sentenceUpperBound: 20 }),
          createdAt: new Date(),
        }
        collection.insertOne(brewery)
        .then((result) => {
          brewery._id = result.insertedId
          breweries.push(brewery)
          resolve()
        })
        .catch(reject)
      })
    })
    .then(resolve)
    .catch(reject)
  })
}

function saveBeers(db) {
  let collection = db.collection('beverages')
  return new Promise((resolve, reject) => {
    Promise.each(beerImages, (beerImage) => {
      return new Promise((resolve, reject) => {
        let beer = {
          name: beerImage.name,
          label: beerImage.image,
          description: loremIpsum({ count: 5, units: 'sentence', sentenceLowerBound: 10, sentenceUpperBound: 20 }),
          alcoholeContent: getRandomInt(5, 16),
          beerType: beerTypes[getRandomInt(0, beerTypes.length - 1)],
          rating: 0,
          _beverageTypeEnum: 'BEER',
          _breweryId: breweries[getRandomInt(0, breweries.length - 1)]._id,
          createdAt: new Date(),
        }
        collection.insertOne(beer)
        .then((result) => {
          beer._id = result.insertedId
          beers.push(beer)
          resolve()
        })
        .catch(reject)
      })
    })
    .then(resolve)
    .catch(reject)
  })
}

function saveWines(db) {
  let collection = db.collection('beverages')
  return new Promise((resolve, reject) => {
    Promise.each(wineImages, (wineImage) => {
      return new Promise((resolve, reject) => {
        let wine = {
          name: wineImage.name,
          label: wineImage.image,
          description: loremIpsum({ count: 5, units: 'sentence', sentenceLowerBound: 10, sentenceUpperBound: 20 }),
          alcoholeContent: getRandomInt(15, 25),
          wineType: wineTypes[getRandomInt(0, wineTypes.length - 1)],
          rating: 0,
          _beverageTypeEnum: 'WINE',
          _breweryId: breweries[getRandomInt(0, breweries.length - 1)]._id,
          createdAt: new Date(),
        }
        collection.insertOne(wine)
        .then((result) => {
          wine._id = result.insertedId
          wines.push(wine)
          resolve()
        })
        .catch(reject)
      })
    })
    .then(resolve)
    .catch(reject)
  })
}

function saveCiders(db) {
  let collection = db.collection('beverages')
  return new Promise((resolve, reject) => {
    Promise.each(ciderImages, (wineImage) => {
      return new Promise((resolve, reject) => {
        let cider = {
          name: ciderImages.name,
          label: ciderImages.image,
          description: loremIpsum({ count: 5, units: 'sentence', sentenceLowerBound: 10, sentenceUpperBound: 20 }),
          alcoholeContent: getRandomInt(5, 16),
          ciderType: ciderTypes[getRandomInt(0, ciderTypes.length - 1)],
          rating: 0,
          _beverageTypeEnum: 'CIDER',
          _breweryId: breweries[getRandomInt(0, breweries.length - 1)]._id,
          createdAt: new Date(),
        }
        collection.insertOne(cider)
        .then((result) => {
          cider._id = result.insertedId
          ciders.push(cider)
          resolve()
        })
        .catch(reject)
      })
    })
    .then(resolve)
    .catch(reject)
  })
}

function saveBars(db) {
  let collection = db.collection('bars')
  return new Promise((resolve, reject) => {
    Promise.each(barImages, (barImage) => {
      return new Promise((resolve, reject) => {
        let bar = {
          name: barImage.name,
          logo: barImage.image,
          email: 'someone@somewhere.com',
          contact: '0746993475',
          description: loremIpsum({ count: 5, units: 'sentence', sentenceLowerBound: 10, sentenceUpperBound: 20 }),
          address: barImage.address,
          building: barImage.building,
          createdAt: new Date(),
        }
        collection.insertOne(bar)
        .then((result) => {
          bar._id = result.insertedId
          bars.push(bar)
          resolve()
        })
        .catch(reject)
      })
    })
    .then(resolve)
    .catch(reject)
  })
}

function saveBarBeers(db) {
  let collection = db.collection('barBeverages')
  let barBeers = []
  _.each(bars, (bar) => {
    let numBeers = getRandomInt(parseInt(beers.length / 2), beers.length - 1)
    if (barBeers[bar._id] === undefined) {
      barBeers[bar._id] = []
    }
    for (let b = 0; b < numBeers; b++) {
      let beerId = beers[getRandomInt(0, beers.length - 1)]._id
      let foundUnique = false
      while (!foundUnique) {
        if (!_.contains(barBeers[bar._id], beerId)) {
          foundUnique = true
        } else {
          beerId = beers[getRandomInt(0, beers.length - 1)]._id
        }
      }
      barBeers[bar._id].push(beerId)
    }
  })
  return new Promise((resolve, reject) => {
    Promise.each(Object.keys(barBeers), (barId) => {
      return new Promise((resolve, reject) => {
        Promise.each(barBeers[barId], (beerId) => {
          return new Promise((resolve, reject) => {
            let beverageObject = getBeverage(beerId)
            let barObject = getBar(barId)
            let barBeer = {
              _barId: ObjectID(barId),
              _beverageId: beerId,
              _beverageTypeEnum: 'BEER',
              stock: getRandomInt(0, 400),
              price: getRandomInt(20, 80),
              barName: barObject.name,
              beverageName: beverageObject.name,
              createdAt: new Date(),
            }
            collection.insertOne(barBeer)
            .then((result) => {
              resolve()
            })
            .catch(reject)
          })
        })
        .then(resolve)
        .catch(reject)
      })
    })
    .then(resolve)
    .catch(reject)
  })
}

function saveBarWines(db) {
  let collection = db.collection('barBeverages')
  let barWines = []
  _.each(bars, (bar) => {
    let numWines = getRandomInt(parseInt(wines.length / 2), wines.length - 1)
    if (barWines[bar._id] === undefined) {
      barWines[bar._id] = []
    }
    for (let b = 0; b < numWines; b++) {
      let wineId = wines[getRandomInt(0, wines.length - 1)]._id
      let foundUnique = false
      while (!foundUnique) {
        if (!_.contains(barWines[bar._id], wineId)) {
          foundUnique = true
        } else {
          wineId = wines[getRandomInt(0, wines.length - 1)]._id
        }
      }
      barWines[bar._id].push(wineId)
    }
  })
  return new Promise((resolve, reject) => {
    Promise.each(Object.keys(barWines), (barId) => {
      return new Promise((resolve, reject) => {
        Promise.each(barWines[barId], (wineId) => {
          return new Promise((resolve, reject) => {
            let beverageObject = getBeverage(wineId)
            let barObject = getBar(barId)
            let barWine = {
              _barId: ObjectID(barId),
              _beverageId: wineId,
              _beverageTypeEnum: 'WINE',
              stock: getRandomInt(0, 400),
              proce: getRandomInt(20, 80),
              barName: barObject.name,
              beverageName: beverageObject.name,
              createdAt: new Date(),
            }
            collection.insertOne(barWine)
            .then((result) => {
              resolve()
            })
            .catch(reject)
          })
        })
        .then(resolve)
        .catch(reject)
      })
    })
    .then(resolve)
    .catch(reject)
  })
}

function saveBarCiders(db) {
  let collection = db.collection('barBeverages')
  let barCiders = []
  _.each(bars, (bar) => {
    let numCiders = getRandomInt(parseInt(ciders.length / 2), ciders.length - 1)
    if (barCiders[bar._id] === undefined) {
      barCiders[bar._id] = []
    }
    for (let b = 0; b < numCiders; b++) {
      let ciderId = ciders[getRandomInt(0, ciders.length - 1)]._id
      let foundUnique = false
      while (!foundUnique) {
        if (!_.contains(barCiders[bar._id], ciderId)) {
          foundUnique = true
        } else {
          ciderId = ciders[getRandomInt(0, ciders.length - 1)]._id
        }
      }
      barCiders[bar._id].push(ciderId)
    }
  })
  return new Promise((resolve, reject) => {
    Promise.each(Object.keys(barCiders), (barId) => {
      return new Promise((resolve, reject) => {
        Promise.each(barCiders[barId], (ciderId) => {
          return new Promise((resolve, reject) => {
            let beverageObject = getBeverage(ciderId)
            let barObject = getBar(barId)
            let barCider = {
              _barId: ObjectID(barId),
              _beverageId: ciderId,
              _beverageTypeEnum: 'CIDER',
              stock: getRandomInt(0, 400),
              proce: getRandomInt(20, 80),
              barName: barObject.name,
              beverageName: beverageObject.name,
              createdAt: new Date(),
            }
            collection.insertOne(barCider)
            .then((result) => {
              resolve()
            })
            .catch(reject)
          })
        })
        .then(resolve)
        .catch(reject)
      })
    })
    .then(resolve)
    .catch(reject)
  })
}

function getBeverage(id) {
  let beverage = _.find(beers, (beer) => {
    return beer._id.toString() === id.toString()
  })
  if (beverage) {
    return beverage
  }
  beverage = _.find(wines, (beer) => {
    return beer._id.toString() === id.toString()
  })
  if (beverage) {
    return beverage
  }
  beverage = _.find(ciders, (beer) => {
    return beer._id.toString() === id.toString()
  })
  if (beverage) {
    return beverage
  }
}

function getBar(id) {
  let beverage = _.find(bars, (beer) => {
    console.log(`${id} - ${beer._id}`)
    return beer._id.toString() === id.toString()
  })
  if (beverage) {
    return beverage
  }
}




function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function connect() {
  const connectionString = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_NAME}`
  return new Promise((resolve, reject) => {
    MongoClient.connect(connectionString, { promiseLibrary: Promise, poolSize: process.env.MONGO_POOL_SIZE }, (err, db) => {
      if (err) {
        return reject(err)
      }
      let connection = db.db(process.env.MONGO_NAME)
      resolve(connection)
    })
  })
}