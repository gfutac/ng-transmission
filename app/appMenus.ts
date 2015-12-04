/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="appModule.ts" />

(function (){
	
	angular.module("app").factory("apMenus", ["eehNavigation", "UserService", function(eehNavigation, userService: Shared.Services.UserService){		
		
		// navbar
		eehNavigation
			.menuItem("navbar.user", {
				text: "User",
				iconClass: "fa fa-user",
				weight: 1,
				click: function(){
					userService.shoLoginWindow();
				}
			})
			.menuItem("navbar.addTorrent", {
				text: "Add torrent",
				iconClass: "fa fa-upload",
				weight: -2,
				click: function() {alert("kita")}
			})
			.menuItem("navbar.pauseAll", {
				text: "Pause all",
				iconClass: "fa fa-pause-circle",
				weight: -1,
				click: function() {
					
				}
			});			
		
		// sidebar
		eehNavigation
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

