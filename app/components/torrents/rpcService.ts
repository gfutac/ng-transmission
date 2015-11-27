/// <reference path="shared/sharedModule.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />

module Shared.Services {
	
	interface PostOptions {
		url: string;
		method: string;
		headers: any;
	}
	
	export class RpcService {
		private $http: ng.IHttpService;
		
		static $inject = ["$http"];
		
		constructor($http) {
		}	
		
		public getTorrents = () => {			
			this.$http.get('http://localhost:9091/transmission/rpc', {
				headers: {
					'Authorization': 'Basic Z29yYW46Y2FuZXN0ZW4=',
				}
			}).
			then(function (response){
				console.log(response);
			}, function (response){
				console.log(response);
			});
			
						
			// this.$http.jsonp('http://localhost:9091/transmission/rpc', {
			// 	headers: {
			// 		'Accept': 'application/json',
			// 		'Content-Type': 'application/json',
			// 		'Authorization': 'Basic Z29yYW46Y2FuZXN0ZW4=',
			// 		'X-Transmission-Session-Id': 'pxd9iRrzyOT9lKqvAYPqlgYQTkRylMyRYqykCNwNt8BUkJNN',
			// 	}				
			// }).then(function (response){
			// 	console.log(response);
			// }, function (response){
			// 	console.log(response);
			// });
		}	
		
		
	}
	
	angular.module("shared").service("RpcService", RpcService);
}