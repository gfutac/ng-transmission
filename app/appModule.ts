/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-ui-router.d.ts" />

/// <reference path="shared/sharedModule.ts" />
/// <reference path="components/torrents/rpcService.ts" />
/// <reference path="components/torrents/torrentsService.ts" />
/// <reference path="shared/HelperService.ts" />

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
				controller: ["$scope", "TorrentService", "HelperService", function($scope: any, ts: Shared.Services.TorrentService, hp: Helper.Services.Helper){					
					ts.getRecentlyActiveTorrents().then(function(torrents: Shared.Services.Torrent[]){
						$scope.torrents = torrents.map(function(torrent: Shared.Services.Torrent){
							return hp.prettyfyTorrent(torrent);
						});	
					})										 
				}]
			})
			.state({
				name: "app.downloading",
				url: "/downloading",
				template: '<torrent-list torrents="torrents"></torrent-list>',
				controller: ["$scope", "TorrentService", function($scope: any, ts: Shared.Services.TorrentService){					
					ts.getDownloadingTorrents().then(function(torrents){
						$scope.torrents = torrents;	
					})										 
				}]
			})		
			.state({
				name: "app.seeding",
				url: "/seeding",
				template: '<torrent-list torrents="torrents"></torrent-list>',
				controller: ["$scope", "TorrentService", function($scope: any, ts: Shared.Services.TorrentService){					
					ts.getSeedingTorrents().then(function(torrents){
						$scope.torrents = torrents;	
					})										 
				}]
			}); 				       	
	}]);
})();	