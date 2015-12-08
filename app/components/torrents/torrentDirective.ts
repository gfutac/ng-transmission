/// <reference path="../../appModule.ts" />
/// <reference path="../../../typings/angularjs/angular.d.ts" />

(function(){
	angular.module("app")
		.directive("torrentEntry", [function(){
			return {
				restrict: "E",
				scope: {
					torrent: "=",				
				},
				replace: true,
				templateUrl: "app/components/torrents/layouts/torrent.html",
				link: function(scope: any, element, attributes){
					
				},
				controller: ["$scope", "HelperService", "TorrentService", function($scope, hp: Shared.Services.Helper, ts: Shared.Services.TorrentService){
					var torrent: Shared.Services.Torrent = $scope.torrent;

					$scope.hasError = torrent.error !== 0 || torrent.errorString !== "";
					$scope.isPaused = torrent.status === 0;
					$scope.isDownloading = torrent.status === 4;
					$scope.isSeeding = torrent.status === 6;
					$scope.torrent.percentDone = torrent.percentDone * 100;
					$scope.torrent.eta = torrent.eta == -1 ? 0 : torrent.eta;
					$scope.totalSize = torrent.totalSize;
										
					$scope.torrent.rateDownload = hp.speed(hp.toKBps($scope.torrent.rateDownload));
					$scope.torrent.rateUpload = hp.speed(hp.toKBps($scope.torrent.rateUpload));
					
					$scope.torrent.eta = hp.timeInterval($scope.torrent.eta);	
					$scope.torrent.downloadedSize = hp.size(torrent.totalSize - torrent.leftUntilDone);
					$scope.torrent.totalSize = hp.size(torrent.totalSize);
					$scope.torrent.uploadedEver = hp.size(torrent.uploadedEver);
					
					$scope.menuOptions = [
						['Pause', function ($itemScope) {
							var torrentId = $itemScope.torrent.id;
							ts.pauseTorrent(torrentId);
						}, function($itemScope) {
							// enable or disable pausing
							return $itemScope.torrent.status !== 0
						}],
						['Resume', function ($itemScope) {
							var torrentId = $itemScope.torrent.id;
							ts.resumeTorrent(torrentId);
						}, function($itemScope){
							// enable or disable resuming
							return $itemScope.torrent.status === 0							
						}],
						null,
						['Move to Top', function ($itemScope) {
							var torrentId = $itemScope.torrent.id;
							ts.moveTop(torrentId);
						}],
						['Move Up', function ($itemScope) {
							var torrentId = $itemScope.torrent.id;
							ts.moveUp(torrentId);
						}],
						['Move Down', function ($itemScope) {
							var torrentId = $itemScope.torrent.id;
							ts.moveDown(torrentId);
						}],
						['Move Move to Bottom', function ($itemScope) {
							var torrentId = $itemScope.torrent.id;
							ts.moveBot(torrentId);
						}],
						null,
						['Remove From List', function ($itemScope) {
							var torrentId = $itemScope.torrent.id;
							ts.removeTorrent(torrentId, false);
						}],
						['Trash Data and Remove From List', function ($itemScope) {
							var torrentId = $itemScope.torrent.id;
							ts.removeTorrent(torrentId, true);
						}],						
					];							
				}]
			};
		}]);
})();