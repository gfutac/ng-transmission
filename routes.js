

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
		
		console.log(options);
		
		rp(options).then(
			function success(response){
				res.send({statusCode: 200});
			}, 
			function error(err){
				if (err.statusCode === 409)
					res.send({statusCode: 200});
				else 
					res.send({statusCode: err.statusCode})
				
			})
	});
	
	app.post("/transmission/rpc/gettorrents", function(req, res) {
		
		var options = {
			url: "http://localhost:9091/transmission/rpc", 
			method: "POST", 
			headers: {
				'Authorization': req.headers['authorization'],
				'Content-type': 'application/json',
			}
		};
		
		var requestData = {  
			"arguments":{
				"fields": [ "id", "name", "status", "error", "errorString", "isFinished", "isStalled", "addedDate", "eta", "rateDownload", "rateUpload", "percentDone", "peersSendingToUs", "peersGettingFromUs",  "peersConnected", "totalSize", "leftUntilDone", "uploadedEver"],
				"ids": "recently-active"
			},
			"method": "torrent-get"
		};		
		
		if (req.headers["x-transmission-session-id"]){
			options.headers["X-transmission-session-id"] = req.headers['x-transmission-session-id'];
			
			options.json = true;
			options.body = requestData;
		}
		
		rp(options).then(function success(response){			
			res.send(response);			
		}, function error(err) {
			if (err.statusCode === 409){
				var token = err.response.headers['x-transmission-session-id'];
				
				options.json = true;
				options.headers['X-transmission-session-id'] = token;
				options.headers['Content-type'] = 'application/json';
				options.body = requestData;
								
				rp(options).then(function(transmissionResponse){
					transmissionResponse["token"] = token;		
					res.send(transmissionResponse);
				})
			}
		});      
	});
	
	app.post("/transmission/rpc/addtorrent", function(req, res){
		
		var options = {
			url: "http://localhost:9091/transmission/rpc", 
			method: "POST", 
			headers: {
				'Authorization': req.headers['authorization'],
				'X-transmission-session-id': req.headers['x-transmission-session-id'],
				'Content-type': 'application/json',
			},
			json: true
		};	
						
		var requestData = {  
			"arguments":{				
			},
			"method": "torrent-add"
		};		
		
		if (!!req.body.filename){
			requestData.arguments.filename = req.body.filename;
		} else if (!!req.body.metainfo){
			requestData.arguments.metainfo = req.body.metainfo;
		}
		
		options.body = requestData;
		
		rp(options).then(function(response){
			res.send(response);
		}, function(err){
			res.send(err)
		})
		
	})

}