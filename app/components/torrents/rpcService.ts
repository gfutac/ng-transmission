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
		
		public resumeAllTorrents = () => {
			var deferred = this.$q.defer();
			
			this.$http.post('/transmission/rpc/resumeall', {}, {
				headers: {
					'Content-Type': 'application/json',
				}
			}).
			then(function (response){
				deferred.resolve(response);				
			}, function (response){
				deferred.reject({msg: "Something gone wrong while resuming torrents."})
			});				
			
			return deferred.promise;			
		}
		
		public pauseAllTorrents = () => {
			var deferred = this.$q.defer();
			
			this.$http.post('/transmission/rpc/pauseall', {}, {
				headers: {
					'Content-Type': 'application/json',
				}
			}).
			then(function (response){
				deferred.resolve(response);				
			}, function (response){
				deferred.reject({msg: "Something gone wrong while pausing torrents."})
			});				
			
			return deferred.promise;			
		}		
		
		public resumeTorrent = (id: number) => {
			var deferred = this.$q.defer();
			
			this.$http.post('/transmission/rpc/resumetorrent', {torrentId: id}, {
				headers: {
					'Content-Type': 'application/json',
				}
			}).
			then(function (response){
				deferred.resolve(response);				
			}, function (response){
				deferred.reject({msg: "Something gone wrong while resuming torrent."})
			});				
			
			return deferred.promise;
		}		
		
		public pauseTorrent = (id: number) => {
			var deferred = this.$q.defer();
			
			this.$http.post('/transmission/rpc/pausetorrent', {torrentId: id}, {
				headers: {
					'Content-Type': 'application/json',
				}
			}).
			then(function (response){
				deferred.resolve(response);				
			}, function (response){
				deferred.reject({msg: "Something gone wrong while pausing torrent."})
			});				
			
			return deferred.promise;
		}			
		
		public moveTop = (id: number) => {
			var deferred = this.$q.defer();
			
			this.$http.post('/transmission/rpc/movetop', {torrentId: id}, {
				headers: {
					'Content-Type': 'application/json',
				}
			}).
			then(function (response){
				deferred.resolve(response);				
			}, function (response){
				deferred.reject({msg: "Something gone wrong while moving torrent to the top of the queue."})
			});				
			
			return deferred.promise;			
		}		
		
		public moveUp = (id: number) => {
			var deferred = this.$q.defer();
			
			this.$http.post('/transmission/rpc/moveup', {torrentId: id}, {
				headers: {
					'Content-Type': 'application/json',
				}
			}).
			then(function (response){
				deferred.resolve(response);				
			}, function (response){
				deferred.reject({msg: "Something gone wrong while moving torrent up in the queue."})
			});				
			
			return deferred.promise;			
		}
		
		public moveDown = (id: number) => {
			var deferred = this.$q.defer();
			
			this.$http.post('/transmission/rpc/movedown', {torrentId: id}, {
				headers: {
					'Content-Type': 'application/json',
				}
			}).
			then(function (response){
				deferred.resolve(response);				
			}, function (response){
				deferred.reject({msg: "Something gone wrong while moving torrent down in the queue."})
			});				
			
			return deferred.promise;			
		}		
		
		public moveBot = (id: number) => {
			var deferred = this.$q.defer();
			
			this.$http.post('/transmission/rpc/movebot', {torrentId: id}, {
				headers: {
					'Content-Type': 'application/json',
				}
			}).
			then(function (response){
				deferred.resolve(response);				
			}, function (response){
				deferred.reject({msg: "Something gone wrong while moving torrent to the bottom of the queue."})
			});				
			
			return deferred.promise;			
		}		
		
		public removeTorrent = (id: number, trashData: boolean) => {
			var deferred = this.$q.defer();
			
			this.$http.post('/transmission/rpc/removetorrent', {torrentId: id, deleteLocalData: trashData}, {
				headers: {
					'Content-Type': 'application/json',
				}
			}).
			then(function (response){
				deferred.resolve(response);				
			}, function (response){
				deferred.reject({msg: "Something gone wrong while removing torrent."})
			});				
			
			return deferred.promise;			
		}
	}
	
	angular.module("shared").service("RpcService", RpcService);
}