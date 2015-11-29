/// <reference path="../../shared/sharedModule.ts" />
/// <reference path="../../../typings/angularjs/angular.d.ts" />

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
			this.$http = $http;
		}	
		
		public getTorrents = () => {			
			
			var data = {  "arguments": 
							{
								"fields": [ "id", "name" ],
								"ids": "recently-active"
							},
							"method": "torrent-get"
						};
			
			this.$http.post('/transmission/rpc', data, {
				headers: {
					'Authorization': 'Basic Z29yYW46Y2FuZXN0ZW4=',
					'Content-Type': 'application/json',
				}
			}).
			then(function (response){
				console.log(response);
			}, function (response){
				console.log(response);
			});			
		}	
		
		
	}
	
	angular.module("shared").service("RpcService", RpcService);
}