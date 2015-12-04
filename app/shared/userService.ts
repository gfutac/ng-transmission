/// <reference path="sharedModule.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-ui-bootstrap.d.ts" />

module Shared.Services {
	
	export class UserService {
		
		static $inject = ["$window", "$modal", "$http"];
		
		private $window: angular.IWindowService;

		private $modal: angular.ui.bootstrap.IModalService;
		private $http: angular.IHttpService; 

        private loginModalInstance: angular.ui.bootstrap.IModalServiceInstance; 
        private loginModalInstancePromise; // keep it to prevent double dialogs
		
		private auth: any = null;
		private currentUser: string;
				
		constructor($window, $modal, $http){
			this.$window = $window;
			this.$modal = $modal;
			this.$http = $http;
			
			try{
				this.auth = this.$window.localStorage.getItem("auth_token");
				if (this.auth){
					this.$http.defaults.headers["Authorization"] = this.auth;
				}
			} catch (e){
				// ignorable				
			}
		}
		
		public isLoggedIn = (): boolean => {
			return angular.isDefined(this.auth);
		}
		
		public storeUserData = (username: string, password: string) => {
			var combined = username + ":" + password;
			var encoded = "Basic " + btoa(combined);
			this.$window.localStorage.setItem("auth_token", encoded);
			this.$http.defaults.headers["Authorization"] = this.auth;
		}
		
		public storeXSessionId = (sessionid: string) => {
			this.$window.localStorage.setItem("X-transmission-session-id", sessionid);
			this.$http.defaults.headers["X-transmission-session-id"] = sessionid;
		}
				
		public logout =() => {
			this.auth = null;
			this.$window.localStorage.removeItem("auth_token");			
			delete this.$http.defaults.headers["Authorization"];
		}
		
		public clearXSessionId = () => {
			this.$window.localStorage.removeItem("X-transmission-session-id");
			delete this.$http.defaults.headers["X-transmission-session-id"];	
		}
		
		public shoLoginWindow = () => {
			var self = this;
			
			if (self.loginModalInstancePromise) return self.loginModalInstancePromise;
			self.logout();
			
			self.loginModalInstance = self.$modal.open({
				windowClass:"login-dialog-window",
				templateUrl: "app/shared/layouts/login.html",
				controller: ["$scope", function($scope){
					$scope.user = {};
					
					$scope.login = () => {
						if (!$scope.user.username) {
                            $scope.messageClass = " alert-warning";
                            $scope.statusMessage = "Please enter username.";
                            return;
                        }
						
						// $scope.isBusy = true;
						
						self.storeUserData($scope.user.username, $scope.user.password);						
					}
					
					$scope.cancel = function () {
                        $scope.$dismiss();                     
                    }
				}]
			})											
		}
	}
	
	angular.module("shared").service("UserService", UserService);
}