/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-ui-router.d.ts" />

/// <reference path="shared/sharedModule.ts" />
/// <reference path="components/torrents/rpcService.ts" />
/// <reference path="components/torrents/torrentsService.ts" />
/// <reference path="shared/HelperService.ts" />
/// <reference path="shared/userService.ts" />

(function(){	
	var app = angular.module("app", ['ui.router', 'ui.bootstrap', 'eehNavigation', 'pascalprecht.translate', 'ng-context-menu', 'shared']);
		
	app.config(["$stateProvider", "$urlRouterProvider", "$translateProvider",
		function($stateProvider: ng.ui.IStateProvider, $urlRouterProvider : ng.ui.IUrlRouterProvider, $translateProvider){			
			
		// sanitaze html (escape)
		$translateProvider.useSanitizeValueStrategy('escape');	
		
		// default route	
		$urlRouterProvider.otherwise( function($injector, $location) {
			var $state = $injector.get("$state");
			$state.go("app.torrents");
		});
		
		$stateProvider
			.state({
				name: "app",
				abstract: true,
				templateUrl: "app/layout.html",
				controller: ["appMenus", function (appMenus) {}]
			})	
			.state({
				name: "app.torrents",
				url: "/torrents",
				template: '<torrent-list torrents="torrents"></torrent-list>',
				controller: ["$scope", "$interval", "TorrentService", "UserService", function($scope: any, $interval: any, ts: Shared.Services.TorrentService, us: Shared.Services.UserService){
					ts.getRecentlyActiveTorrents().then(function(torrents: Shared.Services.Torrent[]){
						$scope.torrents = torrents;												
					});
																				
					var stop = $interval(function(){
						ts.getRecentlyActiveTorrents().then(function(torrents: Shared.Services.Torrent[]){
							$scope.torrents = torrents;
						});										 						
					}, 1500);
										
					$scope.$on("$stateChangeStart", function(){
						$interval.cancel(stop);
						stop = undefined;					
					});																				
				}]
			})
			.state({
				name: "app.downloading",
				url: "/downloading",
				template: '<torrent-list torrents="torrents"></torrent-list>',
				controller: ["$scope", "$interval", "TorrentService", function($scope: any, $interval: any, ts: Shared.Services.TorrentService){			
					ts.getDownloadingTorrents().then(function(torrents: Shared.Services.Torrent[]){
						$scope.torrents = torrents;												
					});
																				
					var stop = $interval(function(){
						ts.getDownloadingTorrents().then(function(torrents: Shared.Services.Torrent[]){
							$scope.torrents = torrents;
						});										 						
					}, 1500);
					
					$scope.$on("$stateChangeStart", function(){
						$interval.cancel(stop);
						stop = undefined;					
					});					
										 
				}]
			})		
			.state({
				name: "app.seeding",
				url: "/seeding",
				template: '<torrent-list torrents="torrents"></torrent-list>',
				controller: ["$scope", "$interval", "TorrentService", function($scope: any, $interval: any, ts: Shared.Services.TorrentService){					
					ts.getSeedingTorrents().then(function(torrents: Shared.Services.Torrent[]){
						$scope.torrents = torrents;												
					});
																				
					var stop = $interval(function(){
						ts.getSeedingTorrents().then(function(torrents: Shared.Services.Torrent[]){
							$scope.torrents = torrents;
						});										 						
					}, 1500);
					
					$scope.$on("$stateChangeStart", function(){
						$interval.cancel(stop);
						stop = undefined;					
					});					
										 
				}]
			}); 				       	
	}]);
	
	app.run(["$rootScope", "UserService", "$state", function($rootScope, userService: Shared.Services.UserService, $state: angular.ui.IStateService){
            $rootScope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) {
					if (!userService.isLoggedIn()){
						event.preventDefault();
						userService.shoLoginWindow().then(function(){
							$state.go(toState.name, toParams);
						})
					}					
				});		
		
	}]);
})();	