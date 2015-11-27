/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../node_modules/angular-ui-router/api/angular-ui-router.d.ts" />

/// <reference path="shared/sharedModule.ts" />
/// <reference path="components/torrents/rpcService.ts" />
/// <reference path="components/torrents/torrentsService.ts" />

(function(){	
	var app = angular.module("app", ['ui.router', 'ui.bootstrap', 'eehNavigation', 'pascalprecht.translate', 'shared']);
	
		
	app.config(["$stateProvider", "$urlRouterProvider", "$translateProvider",
		function($stateProvider: ng.ui.IStateProvider, $urlRouterProvider : ng.ui.IUrlRouterProvider, $translateProvider){			
			
		// sanitaze html (escape)
		$translateProvider.useSanitizeValueStrategy('escape');	
		
		// default route	
		$urlRouterProvider.otherwise("/torrents");
		
		$stateProvider
			.state({
				name: "app",
				abstract: true,
				templateUrl: "app/layout.html",
				controller: ["app-menus", function(appMenus){
					
				}]
			})	
			.state({
				name: "app.torrents",
				url: "/torrents",
				template: '<torrent-list torrents="torrents"></torrent-list>',
				controller: ["$scope", "TorrentService", function($scope: any, ts: Shared.Services.TorrentService){
					$scope.torrents = ts.getAllTorrents();
				}]
			})
			.state({
				name: "app.downloading",
				url: "/downloading",
				template: "downloading torrents",
			})		
			.state({
				name: "app.seeding",
				url: "/seeding",
				template: "seeding torrents",
			}); 				       	
	}]);
})();	