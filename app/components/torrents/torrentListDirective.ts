/// <reference path="../../appModule.ts" />
/// <reference path="../../../typings/angularjs/angular.d.ts" />

(function(){
	angular.module("app")
		.directive("torrentList", [function(){
			return {
				restrict: "E",
				scope: {
					torrents: "=",
				},
				transclude: true,
				replace: true,
				template: '<ul> <li ng-Repeat="torrent in torrents"> <torrent-entry torrent="torrent"> </torrent-entry> </li> </ul>',
			}		
		}]);	
})();