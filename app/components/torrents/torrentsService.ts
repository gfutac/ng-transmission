/// <reference path="../../appModule.ts" />
/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="rpcService.ts" />

module Shared.Services {	
	
	export interface Torrent{
		id: number;
		name: string;
		status: number;
		error?: number;
		errorString?: string;
		isFinished?: boolean;
		isStalled?: boolean;
		addedDate?: number;
		eta?: number;
		rateDownload?: number;
		rateUpload?: number;
		percentDone?: number;
		peersSendingToUs?: number;
		peersConnected?: number;
		totalSize?: number;
		leftUntilDone?: number;
	}
	
	enum FilterEnum {
		All = 1,
		Stopped = 2,
		Downloading = 3,
		Seeding = 4
	}
	
	export class TorrentService{
		private torrents: Torrent[] = [];
		private rpc: Shared.Services.RpcService;
		private us: Shared.Services.UserService;
		private $q: angular.IQService;		
		private torrentFilters: { [filterType: number]: (torrent: Torrent) => boolean } = {};
			
		static $inject = ["RpcService", "$q", "UserService"]			
			
		constructor(rpc, $q, us) {
			this.rpc = rpc;
			this.$q = $q;
			this.us = us;
			
			this.torrentFilters[FilterEnum.All] = function(torrent: Torrent) { return true; };
			this.torrentFilters[FilterEnum.Stopped] = function(torrent: Torrent) { return torrent.status === 0; };
			this.torrentFilters[FilterEnum.Downloading] = function(torrent: Torrent) { return torrent.status === 4; };
			this.torrentFilters[FilterEnum.Seeding] = function(torrent: Torrent) { return torrent.status === 6; };
		}
				
		private getAndFilterTorrents = (filterType: FilterEnum) => {
			var deferred = this.$q.defer();
			
			if (!this.us.isLoggedIn()){
				this.us.shoLoginWindow();
												
			} else {			
				var filterFunc = this.torrentFilters[filterType];
							
				this.rpc.getTorrents().then((response: any) => {
					if (angular.isDefined(response["token"])){
						this.us.storeXSessionId(response["token"]);
					}
					
					if (response.data.result === "success"){
						this.torrents = response.data.arguments.torrents.filter(filterFunc);																			
						deferred.resolve(this.torrents);					
					} else {
						deferred.reject({msg: "Something wrong happened."});	
					}
					
	
				}, function(err){
					deferred.reject(err);
				});			
			
			}
			return deferred.promise;			
		}
						
		public getRecentlyActiveTorrents = () => {
			return this.getAndFilterTorrents(FilterEnum.All);
		}
		
		public getDownloadingTorrents = () => {
			return this.getAndFilterTorrents(FilterEnum.Downloading);			
		}
		
		public getSeedingTorrents = () => {
			return this.getAndFilterTorrents(FilterEnum.Seeding);			
		}				
	}
	
	angular.module("shared").service("TorrentService", TorrentService);		
}