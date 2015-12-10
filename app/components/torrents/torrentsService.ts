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
		uploadedEver?: number;
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

		private $modal: angular.ui.bootstrap.IModalService;
        private addTorrentModalInstance: angular.ui.bootstrap.IModalServiceInstance; 
        private addTorrentModalInstancePromise; // keep it to prevent double dialogs
			
		static $inject = ["RpcService", "$q", "UserService", "$modal"]			
			
		constructor(rpc, $q, us, $modal) {
			this.rpc = rpc;
			this.$q = $q;
			this.us = us;
			this.$modal = $modal;
			
			this.torrentFilters[FilterEnum.All] = function(torrent: Torrent) { return true; };
			this.torrentFilters[FilterEnum.Stopped] = function(torrent: Torrent) { return torrent.status === 0; };
			this.torrentFilters[FilterEnum.Downloading] = function(torrent: Torrent) { return torrent.status === 4; };
			this.torrentFilters[FilterEnum.Seeding] = function(torrent: Torrent) { return torrent.status === 6; };
		}
				
		public showAddTorrentDialog = () => {
			if (this.addTorrentModalInstancePromise) return this.addTorrentModalInstancePromise;
			
			var self = this;
			this.addTorrentModalInstance = this.$modal.open({
				windowClass: "login-dialog-window",
				templateUrl: "app/components/torrents/layouts/addTorrent.html",
				controller: ["$scope", function($scope){
					$scope.torrent = {};
					
					$scope.cancel = function () {
                        $scope.$dismiss();                     
                    }
					
					$scope.add = function(){
						if (!!!$scope.torrent.url && !!!$scope.torrent.torrentMetainfo){
							$scope.statusMessage = "Enter torrent URL or upload torrent file";
							$scope.messageClass = "alert-warning";
							return;
						}
						
						var data: any = {};
						if (!!$scope.torrent.url){
							data.filename = $scope.torrent.url;  
						} else {
							data.metainfo = $scope.torrent.torrentMetainfo;
						}
						
						self.rpc.addTorrent(data).then(function(response: any){
							if (response.data.result !== "success"){
								$scope.statusMessage = "Something gone wrong while adding torrent";
								$scope.messageClass = "alert-error";								
							} else {
								$scope.$close({});
							}
						});
					}
				}]
			})
		}				
						
		private getAndFilterTorrents = (filterType: FilterEnum) => {
			var deferred = this.$q.defer();
			
			var filterFunc = this.torrentFilters[filterType];
						
			this.rpc.getTorrents().then((response: any) => {
				if (angular.isDefined(response.data["token"])){
					this.us.storeXSessionId(response.data["token"]);
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
								
			return deferred.promise;			
		}
		
		
		/**
		 * 
		 * Methods for getting torrents
		 *  
		 *  */							
		public getRecentlyActiveTorrents = () => {
			return this.getAndFilterTorrents(FilterEnum.All);
		}
		
		public getDownloadingTorrents = () => {
			return this.getAndFilterTorrents(FilterEnum.Downloading);			
		}
		
		public getSeedingTorrents = () => {
			return this.getAndFilterTorrents(FilterEnum.Seeding);			
		}
		
		/**
		 * Resumes all torrents
		 *  */
		 public resumeAllTorrents = () => {
			 return this.rpc.resumeAllTorrents();
		 }	
		 
		 /**
		  * Pauses all torrents.
		  */
		  public pauseAllTorrents = () => {
			  return this.rpc.pauseAllTorrents();
		  }
		
		 /**
		  * Resumes selected torrent.
		  */
		 public resumeTorrent = (id: number) => {
			 return this.rpc.resumeTorrent(id);
		 }		
		
		/**
		 * Pauses selected torrent.
		 *  */		
		 public pauseTorrent = (id: number) => {
			 return this.rpc.pauseTorrent(id);
		 }
		 		 
		 /**
		  * Moves torrent to the top of the queue.
		  */
		 public moveTop = (id: number) => {
			 return this.rpc.moveTop(id);
		 }
		 
		 /**
		  * Moves torrent one place up in the queue.
		  */
		 public moveUp = (id: number) => {
			 return this.rpc.moveUp(id);
		 }
		 
		 /**
		  * Moves torrent one place down in the queue.
		  */
		 public moveDown = (id: number) => {
			 return this.rpc.moveDown(id);
		 }
		 
		 /**
		  * Moves torrent to the bottom of the queue.
		  */
		 public moveBot = (id: number) => {
			 return this.rpc.moveBot(id);
		 }
		 
		 /**
		  * Removes torrent from the list (and trash data if trashData is set to true)
		  */
		 public removeTorrent = (id: number, trashData: boolean) => {
			 return this.rpc.removeTorrent(id, trashData);
		 }		 
	}
	
	angular.module("shared").service("TorrentService", TorrentService);		
}