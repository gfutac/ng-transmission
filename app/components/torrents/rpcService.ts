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
						
			this.$http.post('/transmission/rpc/gettorrents', {}, {
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
		
		public addTorrent = (data) => {
			var deferred = this.$q.defer();
						
			this.$http.post('/transmission/rpc/addtorrent', data, {
				headers: {
					'Content-Type': 'application/json',
				}
			}).
			then(function (response){
				deferred.resolve(response);				
			}, function (response){
				deferred.reject({msg: "Something gone wrong while adding a torrent."})
			});	
			
			return deferred.promise;			
		}				
	}
	
	angular.module("shared").service("RpcService", RpcService);
}