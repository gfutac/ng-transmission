

module.exports = function(app, rp){
		
	var allTorrentsIds = [];
	for (var i = 1; i < 100; ++i){
		allTorrentsIds.push(i);
	}	
				
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
				"ids": allTorrentsIds
			},
			"method": "torrent-get"
		};
		
		var result = {
		"arguments": {
			"removed": [],
			"torrents": [
			{
				"addedDate": 1449568145,
				"error": 0,
				"errorString": "",
				"eta": 240944,
				"id": 1,
				"isFinished": false,
				"isStalled": false,
				"leftUntilDone": 2266326818,
				"name": "Infini.2015.1080p.BluRay.H264.AAC-RARBG",
				"peersConnected": 7,
				"peersGettingFromUs": 0,
				"peersSendingToUs": 4,
				"percentDone": 0.0001,
				"rateDownload": 9000,
				"rateUpload": 0,
				"status": 4,
				"totalSize": 2266769186,
				"uploadedEver": 0
			}
			]
		},
		"result": "success"
		};			
		
		//res.send(result);	
		
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
	});
	
	app.post("/transmission/rpc/pausetorrent", function(req, res){
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
				"ids": [req.body.torrentId]				
			},
			"method": "torrent-stop"
		};	
		
		options.body = requestData;
		
		rp(options).then(function(response){
			res.send(response);
		}, function(err){
			res.send(err)
		});								
	});

	app.post("/transmission/rpc/resumetorrent", function(req, res){
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
				"ids": [req.body.torrentId]				
			},
			"method": "torrent-start"
		};	
		
		options.body = requestData;
		
		rp(options).then(function(response){
			res.send(response);
		}, function(err){
			res.send(err)
		});								
	});

	app.post("/transmission/rpc/movetop", function(req, res){
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
				"ids": [req.body.torrentId]				
			},
			"method": "queue-move-top"
		};	
		
		options.body = requestData;
		
		rp(options).then(function(response){
			res.send(response);
		}, function(err){
			res.send(err)
		});		
	});
	

	app.post("/transmission/rpc/moveup", function(req, res){
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
				"ids": [req.body.torrentId]				
			},
			"method": "queue-move-up"
		};	
		
		options.body = requestData;
		
		rp(options).then(function(response){
			res.send(response);
		}, function(err){
			res.send(err)
		});		
	});	
	
	app.post("/transmission/rpc/movedown", function(req, res){
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
				"ids": [req.body.torrentId]				
			},
			"method": "queue-move-down"
		};	
		
		options.body = requestData;
		
		rp(options).then(function(response){
			res.send(response);
		}, function(err){
			res.send(err)
		});		
	});
	

	app.post("/transmission/rpc/movebot", function(req, res){
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
				"ids": [req.body.torrentId]				
			},
			"method": "queue-move-bottom"
		};	
		
		options.body = requestData;
		
		rp(options).then(function(response){
			res.send(response);
		}, function(err){
			res.send(err)
		});		
	});	
	
	app.post("/transmission/rpc/removetorrent", function(req, res){
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
				"ids": [req.body.torrentId],
				"delete-local-data": req.body.deleteLocalData				
			},
			"method": "torrent-remove"
		};	
		
		options.body = requestData;
		
		rp(options).then(function(response){
			res.send(response);
		}, function(err){
			res.send(err)
		});			
	})

}