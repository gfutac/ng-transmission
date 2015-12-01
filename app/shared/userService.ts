/// <reference path="sharedModule.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />

module Shared.Services {
	
	export class UserServices{
		
		static $inject = ["$window"];
		
		private $window: ng.IWindowService;
		private currentUser: string;
		
		constructor($window){
			this.$window = $window;
		}
		
		public storeUserData = (username: string, password: string) => {
			var combined = username + ":" + password;
			var encoded = "Basic " + btoa(combined);
			this.$window.localStorage.setItem("username", encoded);
		}
		
		//public getUserData
	}	
}