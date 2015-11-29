

module.exports = function(app, rp){
		
	app.get("/", function(req, res){
		res.sendFile(__dirname + './public/index.html');
	});
	
	app.post("/transmission/rpc", function(req, res) {
	
		var options = {
			url: "http://localhost:9091/transmission/rpc", 
			method: "POST", 
			headers: {
				'Authorization' : req.headers['authorization']
			}
		};
		
		rp(options).then(function success(response){
			
		}, function error(err) {
			if (err.statusCode === 409){
				var token = err.response.headers['x-transmission-session-id'];
				
				options.json = true;
				options.headers['X-transmission-session-id'] = token;
				options.headers['Content-type'] = 'application/json';
				options.body = res.req.body;
								
				rp(options).then(function(transmissionResponse){
					res.send(transmissionResponse);
				})
			}
		});      
	});

}