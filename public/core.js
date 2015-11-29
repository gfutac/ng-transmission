(function () {
    angular.module("shared", []);
})();
/// <reference path="../../shared/sharedModule.ts" />
/// <reference path="../../../typings/angularjs/angular.d.ts" />
var Shared;
(function (Shared) {
    var Services;
    (function (Services) {
        var RpcService = (function () {
            function RpcService($http, $q) {
                var _this = this;
                this.getTorrents = function () {
                    var deferred = _this.$q.defer();
                    var data = { "arguments": {
                            "fields": ["id", "name", "status", "error", "errorString", "isFinished", "isStalled", "addedDate", "eta", "rateDownload", "rateUpload", "percentDone", "peersSendingToUs", "peersConnected", "totalSize", "leftUntilDone"],
                            "ids": "recently-active"
                        },
                        "method": "torrent-get"
                    };
                    _this.$http.post('/transmission/rpc', data, {
                        headers: {
                            'Authorization': 'Basic Z29yYW46Y2FuZXN0ZW4=',
                            'Content-Type': 'application/json',
                        }
                    }).
                        then(function (response) {
                        deferred.resolve(response);
                    }, function (response) {
                        deferred.reject({ msg: "Something gone wrong." });
                    });
                    return deferred.promise;
                };
                this.$http = $http;
                this.$q = $q;
            }
            RpcService.$inject = ["$http", "$q"];
            return RpcService;
        })();
        Services.RpcService = RpcService;
        angular.module("shared").service("RpcService", RpcService);
    })(Services = Shared.Services || (Shared.Services = {}));
})(Shared || (Shared = {}));
/// <reference path="../../appModule.ts" />
/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="rpcService.ts" />
var Shared;
(function (Shared) {
    var Services;
    (function (Services) {
        var FilterEnum;
        (function (FilterEnum) {
            FilterEnum[FilterEnum["All"] = 1] = "All";
            FilterEnum[FilterEnum["Stopped"] = 2] = "Stopped";
            FilterEnum[FilterEnum["Downloading"] = 3] = "Downloading";
            FilterEnum[FilterEnum["Seeding"] = 4] = "Seeding";
        })(FilterEnum || (FilterEnum = {}));
        var TorrentService = (function () {
            function TorrentService(rpc, $q) {
                var _this = this;
                this.torrents = [];
                this.torrentFilters = {};
                this.getAndFilterTorrents = function (filterType) {
                    var filterFunc = _this.torrentFilters[filterType];
                    var deferred = _this.$q.defer();
                    _this.rpc.getTorrents().then(function (response) {
                        var _this = this;
                        if (response.data.result === "success") {
                            var data = response.data.arguments.torrents.filter(filterFunc);
                            this.torrents = [];
                            data.forEach(function (torrent) {
                                _this.torrents.push(torrent);
                            });
                            deferred.resolve(this.torrents);
                        }
                        else {
                            deferred.reject({ msg: "Something wrong happened." });
                        }
                    }, function (err) {
                        deferred.reject(err);
                    });
                    return deferred.promise;
                };
                this.getRecentlyActiveTorrents = function () {
                    return _this.getAndFilterTorrents(FilterEnum.All);
                };
                this.getDownloadingTorrents = function () {
                    return _this.getAndFilterTorrents(FilterEnum.Downloading);
                };
                this.getSeedingTorrents = function () {
                    return _this.getAndFilterTorrents(FilterEnum.Seeding);
                };
                this.rpc = rpc;
                this.$q = $q;
                this.torrentFilters[FilterEnum.All] = function (torrent) { return true; };
                this.torrentFilters[FilterEnum.Stopped] = function (torrent) { return torrent.status === 0; };
                this.torrentFilters[FilterEnum.Downloading] = function (torrent) { return torrent.status === 4; };
                this.torrentFilters[FilterEnum.Seeding] = function (torrent) { return torrent.status === 6; };
            }
            TorrentService.$inject = ["RpcService", "$q"];
            return TorrentService;
        })();
        Services.TorrentService = TorrentService;
        angular.module("shared").service("TorrentService", TorrentService);
    })(Services = Shared.Services || (Shared.Services = {}));
})(Shared || (Shared = {}));
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-ui-router.d.ts" />
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
                        ts.getRecentlyActiveTorrents().then(function (torrents) {
                            $scope.torrents = torrents;
                        });
                    }]
            })
                .state({
                name: "app.downloading",
                url: "/downloading",
                template: '<torrent-list torrents="torrents"></torrent-list>',
                controller: ["$scope", "TorrentService", function ($scope, ts) {
                        ts.getDownloadingTorrents().then(function (torrents) {
                            $scope.torrents = torrents;
                        });
                    }]
            })
                .state({
                name: "app.seeding",
                url: "/seeding",
                template: '<torrent-list torrents="torrents"></torrent-list>',
                controller: ["$scope", "TorrentService", function ($scope, ts) {
                        ts.getSeedingTorrents().then(function (torrents) {
                            $scope.torrents = torrents;
                        });
                    }]
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
/// <reference path="../../appModule.ts" />
/// <reference path="../../../typings/angularjs/angular.d.ts" />
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
/// <reference path="../../appModule.ts" />
/// <reference path="../../../typings/angularjs/angular.d.ts" />
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
//# sourceMappingURL=core.js.map