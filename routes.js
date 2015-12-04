

module.exports = function(app, rp){
		
	app.get("/", function(req, res){
		res.sendFile(__dirname + './public/index.html');
	});
	
	app.post("/transmission/rpc/login", function(req, res){
		var options = {
			url: "http://localhost:9091/transmission/rpc", 
			method: "POST", 
			headers: {
				'Content-type': 'application/json',
				'Authorization': req.headers['authorization'],
			}
		};
		
		rp(options).then(
			function success(response){
				res.send(response)
			}, 
			function error(err){
				if (err.statusCode === 401){
					res.send(err);
				}
			})
	});
	
	app.post("/transmission/rpc", function(req, res) {
		
		var options = {
			url: "http://localhost:9091/transmission/rpc", 
			method: "POST", 
			headers: {
				'Authorization': req.headers['authorization'],
				'Content-type': 'application/json',
			}
		};
		
		if (req.headers["x-transmission-session-id"]){
			options.headers["X-transmission-session-id"] = req.headers['x-transmission-session-id'];
			
			options.json = true;
			options.body = req.body;
		}
		
		// var t = {
		// 	result: "success",
		// 	arguments: {
		// 			torrents:[{"addedDate":"2015-11-29T20:12:16.000Z","error":0,"errorString":"","eta":"0 second","id":1,"isFinished":true,"isStalled":false,"leftUntilDone":"0 B","name":"Supernatural Season 01","peersConnected":11,"peersSendingToUs":0,"percentDone":"100","rateDownload":"0 kB/s",							"rateUpload":"9 kB/s","status":4,"totalSize":"7.71 GB"
		// 			}, {"addedDate":"2015-11-29T20:12:16.000Z","error":0,"errorString":"","eta":"0 second","id":1,"isFinished":true,"isStalled":false,"leftUntilDone":"0 B","name":"Supernatural Season 01","peersConnected":11,"peersSendingToUs":0,"percentDone":"100","rateDownload":"0 kB/s",							"rateUpload":"9 kB/s","status":4,"totalSize":"7.71 GB"
		// 			}, {"addedDate":"2015-11-29T20:12:16.000Z","error":0,"errorString":"","eta":"0 second","id":1,"isFinished":true,"isStalled":false,"leftUntilDone":"0 B","name":"Supernatural Season 01","peersConnected":11,"peersSendingToUs":0,"percentDone":"100","rateDownload":"0 kB/s",							"rateUpload":"9 kB/s","status":4,"totalSize":"7.71 GB"
		// 			}]
		// 		}
		// 	
		// } ;
		// res.send(t);
		
		rp(options).then(function success(response){			
			res.send(response);			
		}, function error(err) {
			if (err.statusCode === 409){
				var token = err.response.headers['x-transmission-session-id'];
				
				options.json = true;
				options.headers['X-transmission-session-id'] = token;
				options.headers['Content-type'] = 'application/json';
				options.body = res.req.body;
								
				rp(options).then(function(transmissionResponse){
					transmissionResponse["token"] = token;		
					res.send(transmissionResponse);
				})
			}
		});      
	});

}