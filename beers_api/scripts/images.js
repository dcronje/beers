let rp = require('request-promise')
let cheerio = require('cheerio')
let fs = require('fs')
let path = require('path')
let download = require('image-downloader')
let Promise = require('bluebird')
let changeCase = require('change-case')

let appDir = path.dirname(require.main.filename)

const options = {
  uri: `https://99designs.com/blog/creative-inspiration/inspirational-cider-packaging-designs/`,
  transform: function (body) {
    return cheerio.load(body)
  }
}
let files = []



rp(options)
.then(($) => {
  let images = []
  $('img').each((i, elem) => {
    // console.log(elem)
    if ($(elem).hasClass('size-full')) {
      // console.log(elem)
      images.push({
        image: $(elem).attr('src'),
        name: changeCase.sentenceCase($(elem).attr('alt')),
      })
    }
    // images.push($(elem).find('img').attr('src'))
  })
  // console.log(images);
  downloadImages(images)
})
.catch((err) => {
  console.log(err)
  // REQUEST FAILED: ERROR OF SOME KIND
})

function downloadImages(images) {
  Promise.each(images, (image) => {
    return downloadImage(image)
  })
  .then(() => {
    console.log('DONE')
    console.log(files)
  })
}

function downloadImage(image) {
  return new Promise((resolve, reject) => {
    const options = {
      url: image.image,
      dest: path.join(appDir, '../', './public/images/ciders/', randomString(10)+(image.image.indexOf('.jpg') !== -1 ? '.jpg' : '.png')),
    }
    download.image(options)
    .then(({ filename, imageData }) => {
      // console.log(`Downloaded: ${image} to: ${filename}`)
      files.push({
        image: filename,
        name: image.name,
      })
      resolve()
    })
    .catch(reject)
  })

}

function randomString(size) {
  var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  var randomString = ''
  for (var x = 0; x < size; x++) {
    var charIndex = Math.floor(Math.random() * characters.length)
    randomString += characters.substring(charIndex, charIndex + 1)
  }
  return randomString
}