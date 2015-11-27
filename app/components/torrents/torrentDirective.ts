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
				templateUrl: "app/components/torrents/torrent.html",
				link: function(scope: any, element, attributes){
					
				}
			};
		}]);
})();