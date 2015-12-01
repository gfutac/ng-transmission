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
				controller: ["$scope", function($scope){
					var torrent: Shared.Services.Torrent = $scope.torrent;

					$scope.hasError = torrent.error !== 0 || torrent.errorString !== "";
					$scope.isDownloading = torrent.status === 4;
					$scope.isSeeding = torrent.status === 6;
					$scope.percentDone = torrent.percentDone;
					$scope.eta = torrent.eta;
					$scope.totalSize = torrent.totalSize;
										
				}]
			};
		}]);
})();