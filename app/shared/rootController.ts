
module Shared{
	class RootController{
		
		static $inject = ["$rootScope", "$state", "userService", "appMenus"];
		
		constructor($rootScope, $state: angular.ui.IStateService, userService: Shared.Services.UserService, appMenus){
            $rootScope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) { 
					console.log(toState);
					if (!userService.isLoggedIn()){
						event.preventDefault();
						userService.shoLoginWindow().then(function(){
							$state.go(toState.name, toParams);
						})
					}					
				});
		}
	}
	
	angular.module("shared").controller("root-controller", RootController)	
}