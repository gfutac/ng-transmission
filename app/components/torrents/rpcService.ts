/// <reference path="../../shared/sharedModule.ts" />
/// <reference path="../../../typings/angularjs/angular.d.ts" />

module Shared.Services {
	
	interface PostOptions {
		url: string;
		method: string;
		headers: any;
	}
	
	export class RpcService {
		private $http: angular.IHttpService;
		private $q: angular.IQService;
		
		static $inject = ["$http", "$q"];
		
		constructor($http, $q) {
			this.$http = $http;
			this.$q = $q;
		}	
		
		public getTorrents = () => {			
			
			var deferred = this.$q.defer();
			
			var data = {  
				"arguments":{
					"fields": [ "id", "name", "status", "error", "errorString", "isFinished", "isStalled", "addedDate", "eta", "rateDownload", "rateUpload", "percentDone", "peersSendingToUs", "peersGettingFromUs",  "peersConnected", "totalSize", "leftUntilDone", "uploadedEver"],
					"ids": "recently-active"
				},
				"method": "torrent-get"
			};
			
			this.$http.post('/transmission/rpc', data, {
				headers: {
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