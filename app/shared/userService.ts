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
					this.$http.defaults.headers.common["Authorization"] = this.auth;
				}
			} catch (e){
				// ignorable				
			}
		}
		
		public isLoggedIn = (): boolean => {
			return !!this.auth;
		}
		
		public storeUserData = (token: any) => {
			this.auth = token;
			this.$window.localStorage.setItem("auth_token", this.auth);
			this.$http.defaults.headers.common["Authorization"] = this.auth;
		}
		
		public storeXSessionId = (sessionid: string) => {
			this.$window.localStorage.setItem("X-transmission-session-id", sessionid);
			this.$http.defaults.headers.common["X-transmission-session-id"] = sessionid;
		}
				
		public logout =() => {
			this.auth = null;
			this.$window.localStorage.removeItem("auth_token");			
			delete this.$http.defaults.headers.common["Authorization"];
		}
		
		public clearXSessionId = () => {
			this.$window.localStorage.removeItem("X-transmission-session-id");
			delete this.$http.defaults.headers.common["X-transmission-session-id"];	
		}
		
		public shoLoginWindow = () => {
			var self = this;
			
			if (this.loginModalInstancePromise) return this.loginModalInstancePromise;
			this.logout();
			
			this.loginModalInstance = this.$modal.open({
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
						
						$scope.isBusy = true;
						
						self.$http.post("/transmission/rpc/login", {}, {
							headers: {
								'Content-Type': 'application/json',
								'Authorization': "Basic " + btoa($scope.user.username + ":" + $scope.user.password)
							}
						}).then(function success(response){
							var l  = 0;
						}, function error(response){
							var k = 0;
						})
						
						self.auth = "Basic " + btoa($scope.user.username + ":" + $scope.user.password);
						$scope.$close(self.auth);			
					}
					
					$scope.cancel = function () {
                        $scope.$dismiss();                     
                    }
				}]
			});
			
			this.loginModalInstancePromise = self.loginModalInstance.result.then(function(data){
				self.storeUserData(data);
			}).finally(function(){
				self.loginModalInstance = undefined;
				self.loginModalInstancePromise = undefined;   
			});
			
			return self.loginModalInstancePromise;											
		}
	}
	
	angular.module("shared").service("UserService", UserService);
}