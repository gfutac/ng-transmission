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
				templateUrl: 'app/components/torrents/torrentList.html',
			}		
		}]);	
})();