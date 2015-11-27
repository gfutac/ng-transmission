/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="appModule.ts" />

(function (){
	
	angular.module("app").factory("app-menus", ["eehNavigation", function(eehNavigation){		
		eehNavigation
			// .menuItem('sidebar.torrents', {
			// 	text: "Torrents",
			// 	iconClass: 'fa fa-exchange',	
			// 	isCollapsed: true		
			// })
			.menuItem('sidebar.all', {
				text: "All torrents",
				state: "app.torrents",
				iconClass: 'fa fa-bars',
			})
			.menuItem('sidebar.downloading', {
				text: "Downloading",
				state: "app.downloading",
				iconClass: 'fa fa-download',
			})
			.menuItem('sidebar.Seeding', {
				text: "Seeding",
				state: "app.seeding",
				iconClass: 'fa fa-upload',
			});							
					
			return eehNavigation	
	}]);	

})();

