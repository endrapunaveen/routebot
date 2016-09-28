
var request = require('request');
var striptags = require('striptags');

exports.handler = (event, context, callback) => {
	//var event = {text : 'route from Hyderabad to bangalore', trigger_word : 'route'};

	console.log('starting ... : '+event['text']);

	var triggerWord = event['trigger_word'];
  var words = event['text'].split(triggerWord);

	if (typeof words[1] == 'undefined' || words[1].length == 1) {
    callback(null, {"text": "`Usage: " + triggerWord + " from <origin> to <destination>`"});
  } else {
		words = words[1].trim().split("to");
		if (words.length == 2) {
			var startPoint  = words[0].trim().split("from");

			if (startPoint.length == 2) {
				startPoint = startPoint[1].trim();

				var destPoint = words[1].trim();

				var uri = 'https://maps.googleapis.com/maps/api/directions/json?origin='+startPoint+
				'&destination='+destPoint+'&key=AIzaSyB43bAOivW7oTXyWzb04o-SkIgZPi9ZwmY';

				console.log('before asking google.. : '+uri);

				request({'url': uri}, function (error, response, body) {
					console.log('google request is done ....');
				    if (!error ) {
							if (JSON.parse(body).status == 'OK') {
								var routeLegs = JSON.parse(body).routes[0].legs[0];
								var startAddress = routeLegs.start_address;
								var endAddress = routeLegs.end_address;
								var durationTime = routeLegs.duration.text;
								var distance = routeLegs.distance.text;

								var steps = routeLegs.steps;
								var stepsDetails = '\n*Please find the directions below*\n';

								for (var stepNo = 1; stepNo < steps.length; stepNo++) {
									stepsDetails = stepsDetails + '\n '+ stepNo + '. After travelling '+
									 steps[stepNo].distance.text +', '+
									 striptags(steps[stepNo].html_instructions);
								}

								var result =
									'\n******* Route Details ******'+
									'\n*'+ startAddress +'   ======>   '+endAddress +'*'+
									'\nDuration : '+durationTime+
									', Distance: '+distance+
									'\n '+stepsDetails;

							  //console.log('result : '+result);

								callback(null, {"text": result});
							} else {
								callback(null, {"text": "Route not found"});
							}
				    } else {
							callback(null, {"text": "Route not found"});
						}
				});
			} else {
				callback(null, {"text": "`Usage: " + triggerWord + " from <origin> to <destination>`"});
			}
		} else {
			callback(null, {"text": "`Usage: " + triggerWord + " from <origin> to <destination>`"});
		}
	}
}
