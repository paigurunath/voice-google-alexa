var express = require("express");
var alexa = require("alexa-app");
var config = require('./Config');
var mongoose = require('mongoose');
var UserDetails = require('./models/UserDetails');
var express_app = express();
const bodyParser = require("body-parser");

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl);

var podcastURL = "https://am.jpmorgan.com/blob-gim/1383559896296/83456/WeeklyNotes.mp3";

var stream = {
  "url": podcastURL,
  "token": "0",
  "expectedPreviousToken": null,
  "offsetInMilliseconds": 0
};

var app = new alexa.app("guide_to_market");
app.launch(function(request,response) {
  response.say("<audio src='https://am.jpmorgan.com/blob-gim/1383544277367/83456/general_intro_prompt_phase1.mp3'/> ")
  .reprompt("<audio src='https://am.jpmorgan.com/blob-gim/1383544277367/83456/general_intro_prompt_phase1.mp3'/> ")
  .shouldEndSession(false);
});

app.intent('AMAZON.YesIntent', {
},
function(req, res) {
  res.audioPlayerPlayStream("REPLACE_ALL", stream);
  }
);

app.intent('AMAZON.NoIntent', {
  },
function(req, res) {
      res.say("Thanks for Listening.. Good Bye " );
  }
);

app.intent('AMAZON.StopIntent', {
 
},
function(req, res) {
  console.log('app.AMAZON.StopIntent');
  res.say("Thanks. Goodbye.");
  res.send();
}
);

app.intent('AMAZON.PauseIntent', {},
  function(req, res) {
    console.log('app.AMAZON.PauseIntent');
    res.audioPlayerStop();
    res.send();
  }
);

app.intent('AMAZON.ResumeIntent', {},
  function(req, res) {
    console.log('app.AMAZON.ResumeIntent');
    if (req.context.AudioPlayer.offsetInMilliseconds > 0 && req.context.AudioPlayer.playerActivity === 'STOPPED') {
      res.audioPlayerPlayStream('REPLACE_ALL', {
        token: req.context.AudioPlayer.token,
        url: req.context.AudioPlayer.token, // hack: use token to remember the URL of the stream
        offsetInMilliseconds: req.context.AudioPlayer.offsetInMilliseconds
      });
    }
    res.send();
  }
);


app.express({ expressApp: express_app });

express_app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

express_app.use(bodyParser.json());

// express_app.post("/echo", function(req, res) {

//   console.log("--req--");
//   console.log(req);
//   console.log("--body--");
//   console.log(req.body);
//   console.log("--result--");
//   console.log(req.body.queryResult);
//   console.log("--param--");
//   console.log(req.body.queryResult.parameters);
//   console.log("--echoText--");
//   console.log(req.body.queryResult.parameters.echoText);
  

//   var speech =
//     req.body.queryResult &&
//     req.body.queryResult.parameters &&
//     req.body.queryResult.parameters.echoText
//       ? req.body.queryResult.parameters.echoText
//       : "Seems like some problem. Speak again.";
//   return res.json({
//     fulfillmentText: speech,
//     source: "webhook-echo-sample"
//   });
// });

// express_app.post("/audio", function(req, res) {
//   var speech = "";

//   console.log(JSON.stringify(req.body));


//   console.log(req.body.queryResult.parameters.AudioSample.toLowerCase());

//   var UserDetailsObj = new UserDetails({
//     "userId":"Guru",
//     "conversationId": "12453",
//     "mobile" : "+918108402986",
//     "email": "pai.gurunath@gmail.com"
//   }); 

//   UserDetailsObj.save(function(error) {
//       console.log("Your UserDetailsObj has been saved!");
//     if (error) {
//        console.error(error);
//      }
//    });

//   switch (req.body.queryResult.parameters.AudioSample.toLowerCase()) {
//     //Speech Synthesis Markup Language 
//     case "music one":
//       speech =
//         '<speak><audio src="https://am.jpmorgan.com/blob-gim/1383559896296/83456/WeeklyNotes.mp3">did not get your audio file</audio></speak>';
//       break;
//     case "music two":
//       speech =
//         '<speak><audio clipBegin="1s" clipEnd="3s" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
//       break;
//     case "music three":
//       speech =
//         '<speak><audio repeatCount="2" soundLevel="-15db" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
//       break;
//     case "music four":
//       speech =
//         '<speak><audio speed="200%" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
//       break;
//     case "music five":
//       speech =
//         '<audio src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio>';
//       break;
//     case "delay":
//       speech =
//         '<speak>Let me take a break for 3 seconds. <break time="3s"/> I am back again.</speak>';
//       break;
//     //https://www.w3.org/TR/speech-synthesis/#S3.2.3
//     case "cardinal":
//       speech = '<speak><say-as interpret-as="cardinal">12345</say-as></speak>';
//       break;
//     case "ordinal":
//       speech =
//         '<speak>I stood <say-as interpret-as="ordinal">10</say-as> in the class exams.</speak>';
//       break;
//     case "characters":
//       speech =
//         '<speak>Hello is spelled as <say-as interpret-as="characters">Hello</say-as></speak>';
//       break;
//     case "fraction":
//       speech =
//         '<speak>Rather than saying 24+3/4, I should say <say-as interpret-as="fraction">24+3/4</say-as></speak>';
//       break;
//     case "bleep":
//       speech =
//         '<speak>I do not want to say <say-as interpret-as="bleep">F&%$#</say-as> word</speak>';
//       break;
//     case "unit":
//       speech =
//         '<speak>This road is <say-as interpret-as="unit">50 foot</say-as> wide</speak>';
//       break;
//     case "verbatim":
//       speech =
//         '<speak>You spell HELLO as <say-as interpret-as="verbatim">hello</say-as></speak>';
//       break;
//     case "date one":
//       speech =
//         '<speak>Today is <say-as interpret-as="date" format="yyyymmdd" detail="1">2017-12-16</say-as></speak>';
//       break;
//     case "date two":
//       speech =
//         '<speak>Today is <say-as interpret-as="date" format="dm" detail="1">16-12</say-as></speak>';
//       break;
//     case "date three":
//       speech =
//         '<speak>Today is <say-as interpret-as="date" format="dmy" detail="1">16-12-2017</say-as></speak>';
//       break;
//     case "time":
//       speech =
//         '<speak>It is <say-as interpret-as="time" format="hms12">2:30pm</say-as> now</speak>';
//       break;
//     case "telephone one":
//       speech =
//         '<speak><say-as interpret-as="telephone" format="91">09012345678</say-as> </speak>';
//       break;
//     case "telephone two":
//       speech =
//         '<speak><say-as interpret-as="telephone" format="1">(781) 771-7777</say-as> </speak>';
//       break;
//     // https://www.w3.org/TR/2005/NOTE-ssml-sayas-20050526/#S3.3
//     case "alternate":
//       speech =
//         '<speak>IPL stands for <sub alias="indian premier league">IPL</sub></speak>';
//       break;
//   }
//   return res.json({
//     fulfillmentText: speech,
//     source: "webhook-echo-sample"
//   });
// });


express_app.post("/guidetoretirement", function(req, res) {
  var speech = "";

  
  //console.log(JSON.stringify(req.body));
  console.log(req.body.queryResult.parameters)
  // console.log(req.body.queryResult.parameters.retirement)


  if(req.body.queryResult.parameters.retirement || req.body.queryResult.parameters.insights) {
    speech =
    '<speak> Welcome, here is the preview of simplify the complex with the Guide to Retirement'+
    '<audio src="https://am.jpmorgan.com/blob-gim/1383559729729/83456/WeeklyStory.mp3"></audio>' +
    '<break time="2s"/>Do you want to continue Retirement Program Introduction ?' +
    '</speak>';
  }

  if(req.body.queryResult.parameters.userResponse) {
    speech =
    '<speak><audio src="https://am.jpmorgan.com/blob-gim/1383421019357/83456/Slide_15_KR.mp3"></audio>'+
    '<break time="2s"/>would you like to hear more on retirement plans ? <break time="2s"/></speak>';
  }

  if(req.body.queryResult.parameters.mobile || req.body.queryResult.parameters.email) {

    var mobile = "";
    var email = "";

    if(req.body.queryResult.parameters.mobile) {
      mobile = req.body.queryResult.parameters.mobile;
    } 

    if(req.body.queryResult.parameters.email) {
      email = req.body.queryResult.parameters.email;
    } 

    var UserDetailsObj = new UserDetails({
      "userId":req.body.originalDetectIntentRequest.payload.user.userId,
      "conversationId": req.body.originalDetectIntentRequest.payload.conversation.conversationId,
      "mobile" : mobile,
      "email": email
    }); 
    
    console.log(JSON.stringify(UserDetailsObj));

    UserDetailsObj.save(function(error) {
        console.log("Your UserDetailsObj has been saved!");
        
      if (error) {
         console.error(error);
       }
     });

     speech = "Thank you, come back again";
    }



  // if(req.body.queryResult.parameters.userResponse) {
  //   speech =
  //   '<speak><audio src="https://am.jpmorgan.com/blob-gim/1383421019357/83456/Slide_15_KR.mp3">did not get your audio file</audio>'+
  //   '<break time="2s"/>would you like to hear more on retirement plans ? <break time="2s"/></speak>';
  // }
  
  // if(req.body.queryResult.parameters.insights) {
  //   speech =
  //   '<speak> Ok, here is the preview of simplify the complex with the Guide to Retirement'+
  //   '<audio src="https://am.jpmorgan.com/blob-gim/1383559729729/83456/WeeklyStory.mp3">did not get your audio file</audio>' +
  //   '<break time="2s"/>Do you want to continue Retirement Program Introduction' +
  //   '<audio src="https://am.jpmorgan.com/blob-gim/1383421019357/83456/Slide_15_KR.mp3">did not get your audio file</audio>'+
  //   '</speak>';
  // }
  

  

  // if(req.body.queryResult.parameters.continueRetrieve) {
  //   speech =
  //   '<speak><audio src="https://am.jpmorgan.com/blob-gim/1383559729729/83456/WeeklyStory.mp3">did not get your audio file</audio>'+
  //   '<break time="2s"/>would i like to hear more on retirement plans ? if yes, kindly share you email and mobile number.</speak>';
  // }
  
  

  //   // speech = 'Got it';
  // }
 
  if(speech == '' ) {
    speech =
    '<speak> Welcome, here is the preview of simplify the complex with the Guide to Retirement'+
    '<audio src="https://am.jpmorgan.com/blob-gim/1383559729729/83456/WeeklyStory.mp3">did not get your audio file</audio>' +
    '<break time="2s"/>Do you want to continue Retirement Program Introduction ?' +
    '</speak>'
  }

  return res.json({
    fulfillmentText: speech,
    source: "webhook-echo-sample"
  });
});

express_app.listen(process.env.PORT);
//express_app.listen(80);