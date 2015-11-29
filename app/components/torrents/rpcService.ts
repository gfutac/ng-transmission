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
		private $q: ng.IQService;
		
		static $inject = ["$http", "$q"];
		
		constructor($http, $q) {
			this.$http = $http;
			this.$q = $q;
		}	
		
		public getTorrents = () => {			
			
			var deferred = this.$q.defer();
			
			var data = {  
				"arguments":{
					"fields": [ "id", "name", "status", "error", "errorString", "isFinished", "isStalled", "addedDate", "eta", "rateDownload", "rateUpload", "percentDone", "peersSendingToUs",  "peersConnected", "totalSize", "leftUntilDone"],
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
				deferred.resolve(response);				
			}, function (response){
				deferred.reject({msg: "Something gone wrong."})
			});	
			
			return deferred.promise;		
		}	
		
		
	}
	
	angular.module("shared").service("RpcService", RpcService);
}