/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="shared/sharedModule.ts" />
/// <reference path="shared/rpcService.ts" />

module Shared.Services {	
	
	interface Torrent{
		id: number;
		name: string;
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
	
	export class TorrentService{
		private torrents: Torrent[] = [];
		private rpc: Shared.Services.RpcService;
			
		static $inject = ["RpcService"]			
			
		constructor(rpc) {
			this.rpc = rpc;
			
			this.torrents = [];
			this.torrents.push({id: 1, name: "torrent 1"});
			this.torrents.push({id: 2, name: "torrent 2"});
			this.torrents.push({id: 3, name: "torrent 3"});
			this.torrents.push({id: 4, name: "torrent 4"});
			this.torrents.push({id: 5, name: "torrent 5"});
			this.torrents.push({id: 6, name: "torrent 6"});
			this.torrents.push({id: 7, name: "torrent 7"});	
		}
		
		public addTorrent = (torrent: Torrent) => {
			this.torrents.push(torrent);
		}
		
		public getAllTorrents = () => {
			
			this.rpc.getTorrents();
			
			return this.torrents;
		}
		
		
	}
	
	angular.module("shared").service("TorrentService", TorrentService);		
}