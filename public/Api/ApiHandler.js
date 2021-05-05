const https = require("https");
const bodyParser = require("body-parser");

module.exports = function ApiHandler(url, res, Count) {

  //https call to the external API
  https.get(url, function(response) {
    if (response.statusCode === 200) {

      //To avoid unable to parese JSON data error
      let finalData = '';
      response.on("data", function(data) {
        finalData += data.toString();
      });
      response.on("end", function() {

        //Parsing the data to render
        const comicData = JSON.parse(finalData);

        //DB search to find whether Number of visits is available
        Count.findOne({num: comicData.num}, function(err, count) {
          if (count) {
            count.count = count.count + 1;
            count.save();
            var transcript = comicData.transcript;

            //formatting transcript data
            let transArray = transcript.split("\n");

            //rendering the data to the Frontend
            res.render("comicStrip", {
              comicTitle: comicData.title,
              imageSRC: comicData.img,
              imgDescription: comicData.alt,
              comicID: comicData.num,
              year: comicData.year,
              month: comicData.month,
              day: comicData.day,
              count: count.count,
              imgTrans: transArray
            });
          } else {

            //If number of Visits is not available for the page
            const newCount = new Count({
              num: comicData.num,
              count: 1
            });
            newCount.save();
            var transcript = comicData.transcript;
            let transArray = transcript.split("\n");
            res.render("comicStrip", {
              comicTitle: comicData.title,
              imageSRC: comicData.img,
              imgDescription: comicData.alt,
              comicID: comicData.num,
              year: comicData.year,
              month: comicData.month,
              day: comicData.day,
              count: newCount.count,
              imgTrans: transArray
            });

          }
        });

      });
    } else {
      //if External API returns 404
      res.render("noStripFound");
    }
  });
}
