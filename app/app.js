(function () {
    angular.module("shared", []);
})();
/// <reference path="shared/sharedModule.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
var Shared;
(function (Shared) {
    var Services;
    (function (Services) {
        var RpcService = (function () {
            function RpcService($http) {
                var _this = this;
                this.getTorrents = function () {
                    _this.$http.get('http://localhost:9091/transmission/rpc', {
                        headers: {
                            'Authorization': 'Basic Z29yYW46Y2FuZXN0ZW4=',
                        }
                    }).
                        then(function (response) {
                        console.log(response);
                    }, function (response) {
                        console.log(response);
                    });
                    // this.$http.jsonp('http://localhost:9091/transmission/rpc', {
                    // 	headers: {
                    // 		'Accept': 'application/json',
                    // 		'Content-Type': 'application/json',
                    // 		'Authorization': 'Basic Z29yYW46Y2FuZXN0ZW4=',
                    // 		'X-Transmission-Session-Id': 'pxd9iRrzyOT9lKqvAYPqlgYQTkRylMyRYqykCNwNt8BUkJNN',
                    // 	}				
                    // }).then(function (response){
                    // 	console.log(response);
                    // }, function (response){
                    // 	console.log(response);
                    // });
                };
            }
            RpcService.$inject = ["$http"];
            return RpcService;
        })();
        Services.RpcService = RpcService;
        angular.module("shared").service("RpcService", RpcService);
    })(Services = Shared.Services || (Shared.Services = {}));
})(Shared || (Shared = {}));
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="shared/sharedModule.ts" />
/// <reference path="shared/rpcService.ts" />
var Shared;
(function (Shared) {
    var Services;
    (function (Services) {
        var TorrentService = (function () {
            function TorrentService(rpc) {
                var _this = this;
                this.torrents = [];
                this.addTorrent = function (torrent) {
                    _this.torrents.push(torrent);
                };
                this.getAllTorrents = function () {
                    _this.rpc.getTorrents();
                    return _this.torrents;
                };
                this.rpc = rpc;
                this.torrents = [];
                this.torrents.push({ id: 1, name: "torrent 1" });
                this.torrents.push({ id: 2, name: "torrent 2" });
                this.torrents.push({ id: 3, name: "torrent 3" });
                this.torrents.push({ id: 4, name: "torrent 4" });
                this.torrents.push({ id: 5, name: "torrent 5" });
                this.torrents.push({ id: 6, name: "torrent 6" });
                this.torrents.push({ id: 7, name: "torrent 7" });
            }
            TorrentService.$inject = ["RpcService"];
            return TorrentService;
        })();
        Services.TorrentService = TorrentService;
        angular.module("shared").service("TorrentService", TorrentService);
    })(Services = Shared.Services || (Shared.Services = {}));
})(Shared || (Shared = {}));
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../node_modules/angular-ui-router/api/angular-ui-router.d.ts" />
/// <reference path="shared/sharedModule.ts" />
/// <reference path="components/torrents/rpcService.ts" />
/// <reference path="components/torrents/torrentsService.ts" />
(function () {
    var app = angular.module("app", ['ui.router', 'ui.bootstrap', 'eehNavigation', 'pascalprecht.translate', 'shared']);
    app.config(["$stateProvider", "$urlRouterProvider", "$translateProvider",
        function ($stateProvider, $urlRouterProvider, $translateProvider) {
            // sanitaze html (escape)
            $translateProvider.useSanitizeValueStrategy('escape');
            // default route	
            $urlRouterProvider.otherwise("/torrents");
            $stateProvider
                .state({
                name: "app",
                abstract: true,
                templateUrl: "app/layout.html",
                controller: ["app-menus", function (appMenus) {
                    }]
            })
                .state({
                name: "app.torrents",
                url: "/torrents",
                template: '<torrent-list torrents="torrents"></torrent-list>',
                controller: ["$scope", "TorrentService", function ($scope, ts) {
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
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="appModule.ts" />
(function () {
    angular.module("app").factory("app-menus", ["eehNavigation", function (eehNavigation) {
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
            return eehNavigation;
        }]);
})();
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="appModule.ts" />
(function () {
    angular.module("app")
        .directive("torrentEntry", [function () {
            return {
                restrict: "E",
                scope: {
                    torrent: "=",
                },
                replace: true,
                templateUrl: "app/components/torrents/torrent.html",
                link: function (scope, element, attributes) {
                }
            };
        }]);
})();
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="appModule.ts" />
(function () {
    angular.module("app")
        .directive("torrentList", [function () {
            return {
                restrict: "E",
                scope: {
                    torrents: "=",
                },
                transclude: true,
                replace: true,
                template: '<ul> <li ng-Repeat="torrent in torrents"> <torrent-entry torrent="torrent"> </torrent-entry> </li> </ul>',
            };
        }]);
})();
//# sourceMappingURL=app.js.map