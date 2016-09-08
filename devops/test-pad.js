const exif = require('exif-parser');
const fs = require('fs');
const lwip = require('lwip');

// 1. Upload file from browser using multer
// 2. Flip file if EXIF says so
// 3. Create up to 4 sizes:
//    xl: 1501 - 2000px
//    lg: 1001 - 1500px
//    md: 501 - 1000px
//    sm: 1 - 500
// 4. Write each file to S3
// 5. Upsert Note doc with details

// width: 4128
// height: 2322
const inFile = '/home/guy/Downloads/57cf46f4b3deaa59f748927e.jpg';
const ext = 'jpg';

fs.readFile(inFile, function (err, data) {
  if (err) {throw err;}
  var exifData = false;
  if(ext === 'jpg') {
    exifData = exif.create(data).parse();
  }
  lwip.open(data, ext, function(imageOpenError, image){
    // const width = image.width();
    if(imageOpenError) {throw imageOpenError;}
    let batch = image.batch();
    if(exifData) {
      console.log('exifData.tags.Orientation:', exifData.tags.Orientation);
      switch( exifData.tags.Orientation ) {
        case 2:
          batch = batch.flip('x'); // top-right - flip horizontal
          break;
        case 3:
          batch = batch.rotate(180); // bottom-right - rotate 180
          break;
        case 4:
          batch = batch.flip('y'); // bottom-left - flip vertically
          break;
        case 5:
          batch = batch.rotate(90).flip('x'); // left-top - rotate 90 and flip horizontal
          break;
        case 6:
          batch = batch.rotate(90); // right-top - rotate 90
          break;
        case 7:
          batch = batch.rotate(270).flip('x'); // right-bottom - rotate 270 and flip horizontal
          break;
        case 8:
          batch = batch.rotate(270); // left-bottom - rotate 270
          break;
        default:
          console.log('default hit');
      }
    }

    function getFile(size) {
      return `/home/guy/Downloads/${size}.jpg`;
    }

    const outFile = getFile('orig');
    batch.writeFile(outFile, (writeFileError) => {
      console.log('writeFileError:', writeFileError);

      // var ratio = 200 / image.width();
      // batch.scale(ratio, function(scaleError, img){
      //     // ...
      // });
    });

    // image can now be used as per normal with batch
    // eg. image.resize(200, 200)....
  });
});

