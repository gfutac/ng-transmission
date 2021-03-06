(function () {
    angular.module("shared", [])
        .directive("torrentUploader", function () {
        return {
            restrict: "E",
            replace: true,
            templateUrl: "app/shared/layouts/uploader.html",
            link: function (scope, elem, attributes) {
                scope.url = attributes.url;
                var input = $("input:file", elem);
                var reader = new FileReader();
                if (angular.isDefined(elem.attr("accept"))) {
                    input[0].setAttribute("accept", elem.attr("accept"));
                    elem.removeAttr("accept");
                }
                reader.onloadend = function () {
                    var prefix = "data:application/x-bittorrent;base64,";
                    scope.torrent.torrentMetainfo = reader.result.replace(prefix, "");
                };
                input.on("change", function (changeEvent) {
                    scope.$apply(function () {
                        var file = changeEvent.target.files[0];
                        scope.file = reader.readAsDataURL(file);
                        scope.statusMessage = "";
                    });
                    $("input:text", elem).val(changeEvent.target.files[0].name);
                });
            },
            controller: ["$scope", "$http", function ($scope, $http) {
                }],
        };
    });
    angular.module("shared")
        .directive('contextMenu', ["$parse", function ($parse) {
            var renderContextMenu = function ($scope, event, options, model) {
                if (!$) {
                    var $ = angular.element;
                }
                $(event.currentTarget).addClass('context');
                var $contextMenu = $('<div>');
                $contextMenu.addClass('dropdown clearfix');
                var $ul = $('<ul>');
                $ul.addClass('dropdown-menu');
                $ul.attr({ 'role': 'menu' });
                $ul.css({
                    display: 'block',
                    position: 'absolute',
                    left: event.pageX + 'px',
                    top: event.pageY + 'px'
                });
                angular.forEach(options, function (item, i) {
                    var $li = $('<li>');
                    if (item === null) {
                        $li.addClass('divider');
                    }
                    else {
                        var $a = $('<a>');
                        $a.attr({ tabindex: '-1', href: '#' });
                        var text = item.text;
                        $a.text(text);
                        $li.append($a);
                        var enabled = angular.isDefined(item.enabled) ? item.enabled.call($scope, $scope, event, text, model) : true;
                        if (enabled) {
                            $li.on('click', function ($event) {
                                $event.preventDefault();
                                $scope.$apply(function () {
                                    $(event.currentTarget).removeClass('context');
                                    $contextMenu.remove();
                                    item.click.call($scope, $scope, event, model);
                                });
                            });
                        }
                        else {
                            $li.on('click', function ($event) {
                                $event.preventDefault();
                            });
                            $li.addClass('disabled');
                        }
                    }
                    $ul.append($li);
                });
                $contextMenu.append($ul);
                var height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
                $contextMenu.css({
                    width: '100%',
                    height: height + 'px',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 9999
                });
                $(document).find('body').append($contextMenu);
                $contextMenu.on("mousedown", function (e) {
                    if ($(e.target).hasClass('dropdown')) {
                        $(event.currentTarget).removeClass('context');
                        $contextMenu.remove();
                    }
                }).on('contextmenu', function (event) {
                    $(event.currentTarget).removeClass('context');
                    event.preventDefault();
                    $contextMenu.remove();
                });
            };
            return function ($scope, element, attrs) {
                element.on('contextmenu', function (event) {
                    event.stopPropagation();
                    $scope.$apply(function () {
                        event.preventDefault();
                        var options = $scope.$eval(attrs.contextMenu);
                        var model = $scope.$eval(attrs.model);
                        if (options instanceof Array) {
                            if (options.length === 0) {
                                return;
                            }
                            renderContextMenu($scope, event, options, model);
                        }
                        else {
                            throw '"' + attrs.contextMenu + '" not an array';
                        }
                    });
                });
            };
        }]);
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
                    _this.$http.post('/transmission/rpc/gettorrents', {}, {
                        headers: {
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
                this.addTorrent = function (data) {
                    var deferred = _this.$q.defer();
                    _this.$http.post('/transmission/rpc/addtorrent', data, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).
                        then(function (response) {
                        deferred.resolve(response);
                    }, function (response) {
                        deferred.reject({ msg: "Something gone wrong while adding a torrent." });
                    });
                    return deferred.promise;
                };
                this.resumeAllTorrents = function () {
                    var deferred = _this.$q.defer();
                    _this.$http.post('/transmission/rpc/resumealltorrents', {}, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).
                        then(function (response) {
                        deferred.resolve(response);
                    }, function (response) {
                        deferred.reject({ msg: "Something gone wrong while resuming torrents." });
                    });
                    return deferred.promise;
                };
                this.pauseAllTorrents = function () {
                    var deferred = _this.$q.defer();
                    _this.$http.post('/transmission/rpc/pausealltorrents', {}, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).
                        then(function (response) {
                        deferred.resolve(response);
                    }, function (response) {
                        deferred.reject({ msg: "Something gone wrong while pausing torrents." });
                    });
                    return deferred.promise;
                };
                this.resumeTorrent = function (id) {
                    var deferred = _this.$q.defer();
                    _this.$http.post('/transmission/rpc/resumetorrent', { torrentId: id }, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).
                        then(function (response) {
                        deferred.resolve(response);
                    }, function (response) {
                        deferred.reject({ msg: "Something gone wrong while resuming torrent." });
                    });
                    return deferred.promise;
                };
                this.pauseTorrent = function (id) {
                    var deferred = _this.$q.defer();
                    _this.$http.post('/transmission/rpc/pausetorrent', { torrentId: id }, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).
                        then(function (response) {
                        deferred.resolve(response);
                    }, function (response) {
                        deferred.reject({ msg: "Something gone wrong while pausing torrent." });
                    });
                    return deferred.promise;
                };
                this.moveTop = function (id) {
                    var deferred = _this.$q.defer();
                    _this.$http.post('/transmission/rpc/movetop', { torrentId: id }, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).
                        then(function (response) {
                        deferred.resolve(response);
                    }, function (response) {
                        deferred.reject({ msg: "Something gone wrong while moving torrent to the top of the queue." });
                    });
                    return deferred.promise;
                };
                this.moveUp = function (id) {
                    var deferred = _this.$q.defer();
                    _this.$http.post('/transmission/rpc/moveup', { torrentId: id }, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).
                        then(function (response) {
                        deferred.resolve(response);
                    }, function (response) {
                        deferred.reject({ msg: "Something gone wrong while moving torrent up in the queue." });
                    });
                    return deferred.promise;
                };
                this.moveDown = function (id) {
                    var deferred = _this.$q.defer();
                    _this.$http.post('/transmission/rpc/movedown', { torrentId: id }, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).
                        then(function (response) {
                        deferred.resolve(response);
                    }, function (response) {
                        deferred.reject({ msg: "Something gone wrong while moving torrent down in the queue." });
                    });
                    return deferred.promise;
                };
                this.moveBot = function (id) {
                    var deferred = _this.$q.defer();
                    _this.$http.post('/transmission/rpc/movebot', { torrentId: id }, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).
                        then(function (response) {
                        deferred.resolve(response);
                    }, function (response) {
                        deferred.reject({ msg: "Something gone wrong while moving torrent to the bottom of the queue." });
                    });
                    return deferred.promise;
                };
                this.removeTorrent = function (id, trashData) {
                    var deferred = _this.$q.defer();
                    _this.$http.post('/transmission/rpc/removetorrent', { torrentId: id, deleteLocalData: trashData }, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).
                        then(function (response) {
                        deferred.resolve(response);
                    }, function (response) {
                        deferred.reject({ msg: "Something gone wrong while removing torrent." });
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
            function TorrentService(rpc, $q, us, $modal) {
                var _this = this;
                this.torrents = [];
                this.torrentFilters = {};
                this.showAddTorrentDialog = function () {
                    if (_this.addTorrentModalInstancePromise)
                        return _this.addTorrentModalInstancePromise;
                    var self = _this;
                    _this.addTorrentModalInstance = _this.$modal.open({
                        windowClass: "login-dialog-window",
                        templateUrl: "app/components/torrents/layouts/addTorrent.html",
                        controller: ["$scope", function ($scope) {
                                $scope.torrent = {};
                                $scope.cancel = function () {
                                    $scope.$dismiss();
                                };
                                $scope.add = function () {
                                    if (!!!$scope.torrent.url && !!!$scope.torrent.torrentMetainfo) {
                                        $scope.statusMessage = "Enter torrent URL or upload torrent file";
                                        $scope.messageClass = "alert-warning";
                                        return;
                                    }
                                    var data = {};
                                    if (!!$scope.torrent.url) {
                                        data.filename = $scope.torrent.url;
                                    }
                                    else {
                                        data.metainfo = $scope.torrent.torrentMetainfo;
                                    }
                                    self.rpc.addTorrent(data).then(function (response) {
                                        if (response.data.result !== "success") {
                                            $scope.statusMessage = "Something gone wrong while adding torrent";
                                            $scope.messageClass = "alert-error";
                                        }
                                        else {
                                            $scope.$close({});
                                        }
                                    });
                                };
                            }]
                    });
                };
                this.getAndFilterTorrents = function (filterType) {
                    var deferred = _this.$q.defer();
                    var filterFunc = _this.torrentFilters[filterType];
                    _this.rpc.getTorrents().then(function (response) {
                        if (angular.isDefined(response.data["token"])) {
                            _this.us.storeXSessionId(response.data["token"]);
                        }
                        if (response.data.result === "success") {
                            _this.torrents = response.data.arguments.torrents.filter(filterFunc);
                            deferred.resolve(_this.torrents);
                        }
                        else {
                            deferred.reject({ msg: "Something wrong happened." });
                        }
                    }, function (err) {
                        deferred.reject(err);
                    });
                    return deferred.promise;
                };
                /**
                 *
                 * Methods for getting torrents
                 *
                 *  */
                this.getRecentlyActiveTorrents = function () {
                    return _this.getAndFilterTorrents(FilterEnum.All);
                };
                this.getDownloadingTorrents = function () {
                    return _this.getAndFilterTorrents(FilterEnum.Downloading);
                };
                this.getSeedingTorrents = function () {
                    return _this.getAndFilterTorrents(FilterEnum.Seeding);
                };
                /**
                 * Resumes all torrents
                 *  */
                this.resumeAllTorrents = function () {
                    return _this.rpc.resumeAllTorrents();
                };
                /**
                 * Pauses all torrents.
                 */
                this.pauseAllTorrents = function () {
                    return _this.rpc.pauseAllTorrents();
                };
                /**
                 * Resumes selected torrent.
                 */
                this.resumeTorrent = function (id) {
                    return _this.rpc.resumeTorrent(id);
                };
                /**
                 * Pauses selected torrent.
                 *  */
                this.pauseTorrent = function (id) {
                    return _this.rpc.pauseTorrent(id);
                };
                /**
                 * Moves torrent to the top of the queue.
                 */
                this.moveTop = function (id) {
                    return _this.rpc.moveTop(id);
                };
                /**
                 * Moves torrent one place up in the queue.
                 */
                this.moveUp = function (id) {
                    return _this.rpc.moveUp(id);
                };
                /**
                 * Moves torrent one place down in the queue.
                 */
                this.moveDown = function (id) {
                    return _this.rpc.moveDown(id);
                };
                /**
                 * Moves torrent to the bottom of the queue.
                 */
                this.moveBot = function (id) {
                    return _this.rpc.moveBot(id);
                };
                /**
                 * Removes torrent from the list (and trash data if trashData is set to true)
                 */
                this.removeTorrent = function (id, trashData) {
                    return _this.rpc.removeTorrent(id, trashData);
                };
                this.rpc = rpc;
                this.$q = $q;
                this.us = us;
                this.$modal = $modal;
                this.torrentFilters[FilterEnum.All] = function (torrent) { return true; };
                this.torrentFilters[FilterEnum.Stopped] = function (torrent) { return torrent.status === 0; };
                this.torrentFilters[FilterEnum.Downloading] = function (torrent) { return torrent.status === 4; };
                this.torrentFilters[FilterEnum.Seeding] = function (torrent) { return torrent.status === 6; };
            }
            TorrentService.$inject = ["RpcService", "$q", "UserService", "$modal"];
            return TorrentService;
        })();
        Services.TorrentService = TorrentService;
        angular.module("shared").service("TorrentService", TorrentService);
    })(Services = Shared.Services || (Shared.Services = {}));
})(Shared || (Shared = {}));
/// <reference path="sharedModule.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />
var Shared;
(function (Shared) {
    var Services;
    (function (Services) {
        Number.prototype.toTruncFixed = function (place) {
            var ret = Math.floor(this * Math.pow(10, place)) / Math.pow(10, place);
            return ret.toFixed(place);
        };
        var Helper = (function () {
            function Helper() {
                var _this = this;
                // constatns
                this.speed_K = 1000;
                this.speed_B_str = 'B/s';
                this.speed_K_str = 'kB/s';
                this.speed_M_str = 'MB/s';
                this.speed_G_str = 'GB/s';
                this.speed_T_str = 'TB/s';
                this.size_K = 1000;
                this.size_B_str = 'B';
                this.size_K_str = 'kB';
                this.size_M_str = 'MB';
                this.size_G_str = 'GB';
                this.size_T_str = 'TB';
                this.mem_K = 1024;
                this.mem_B_str = 'B';
                this.mem_K_str = 'KiB';
                this.mem_M_str = 'MiB';
                this.mem_G_str = 'GiB';
                this.mem_T_str = 'TiB';
                /**
                 * only public method - accepts Torrent and prettyfies it
                 */
                this.prettyfyTorrent = function (torrent) {
                    var copy = angular.merge({}, torrent);
                    copy.addedDate = new Date(torrent.addedDate * 1000);
                    copy.eta = _this.timeInterval(torrent.eta == -1 ? 0 : torrent.eta);
                    copy.rateDownload = _this.speed(_this.toKBps(torrent.rateDownload));
                    copy.rateUpload = _this.speed(_this.toKBps(torrent.rateUpload));
                    copy.percentDone = _this.percentString(torrent.percentDone * 100);
                    copy.totalSize = _this.size(torrent.totalSize);
                    copy.leftUntilDone = _this.size(torrent.leftUntilDone);
                    copy.isFinished = torrent.leftUntilDone === 0;
                    return copy;
                };
                /**
                 * string representation of the estimated time until completetion
                 */
                this.timeInterval = function (seconds) {
                    var days = Math.floor(seconds / 86400), hours = Math.floor((seconds % 86400) / 3600), minutes = Math.floor((seconds % 3600) / 60), seconds = Math.floor(seconds % 60), d = days + ' ' + (days > 1 ? 'days' : 'day'), h = hours + ' ' + (hours > 1 ? 'hours' : 'hour'), m = minutes + ' ' + (minutes > 1 ? 'minutes' : 'minute'), s = seconds + ' ' + (seconds > 1 ? 'seconds' : 'second');
                    if (days) {
                        if (days >= 4 || !hours)
                            return d;
                        return d + ', ' + h;
                    }
                    if (hours) {
                        if (hours >= 4 || !minutes)
                            return h;
                        return h + ', ' + m;
                    }
                    if (minutes) {
                        if (minutes >= 4 || !seconds)
                            return m;
                        return m + ', ' + s;
                    }
                    return s;
                };
                this.timestamp = function (seconds) {
                    if (!seconds)
                        return 'N/A';
                    var myDate = new Date(seconds * 1000);
                    var now = new Date();
                    var date = "";
                    var time = "";
                    var sameYear = now.getFullYear() === myDate.getFullYear();
                    var sameMonth = now.getMonth() === myDate.getMonth();
                    var dateDiff = now.getDate() - myDate.getDate();
                    if (sameYear && sameMonth && Math.abs(dateDiff) <= 1) {
                        if (dateDiff === 0) {
                            date = "Today";
                        }
                        else if (dateDiff === 1) {
                            date = "Yesterday";
                        }
                        else {
                            date = "Tomorrow";
                        }
                    }
                    else {
                        date = myDate.toDateString();
                    }
                    var hours = myDate.getHours();
                    var period = "AM";
                    if (hours > 12) {
                        hours = hours - 12;
                        period = "PM";
                    }
                    if (hours === 0) {
                        hours = 12;
                    }
                    if (hours < 10) {
                        hours = "0" + hours;
                    }
                    var minutes = myDate.getMinutes();
                    if (minutes < 10) {
                        minutes = "0" + minutes;
                    }
                    var seconds = myDate.getSeconds();
                    if (seconds < 10) {
                        seconds = "0" + seconds;
                    }
                    time = [hours, minutes, seconds].join(':');
                    return [date, time, period].join(' ');
                };
                this.mem = function (bytes) {
                    if (bytes < _this.mem_K)
                        return [bytes, _this.mem_B_str].join(' ');
                    var convertedSize;
                    var unit;
                    if (bytes < Math.pow(_this.mem_K, 2)) {
                        convertedSize = bytes / _this.mem_K;
                        unit = _this.mem_K_str;
                    }
                    else if (bytes < Math.pow(_this.mem_K, 3)) {
                        convertedSize = bytes / Math.pow(_this.mem_K, 2);
                        unit = _this.mem_M_str;
                    }
                    else if (bytes < Math.pow(_this.mem_K, 4)) {
                        convertedSize = bytes / Math.pow(_this.mem_K, 3);
                        unit = _this.mem_G_str;
                    }
                    else {
                        convertedSize = bytes / Math.pow(_this.mem_K, 4);
                        unit = _this.mem_T_str;
                    }
                    // try to have at least 3 digits and at least 1 decimal
                    return convertedSize <= 9.995 ? [convertedSize.toTruncFixed(2), unit].join(' ')
                        : [convertedSize.toTruncFixed(1), unit].join(' ');
                };
                this.size = function (bytes) {
                    if (bytes < _this.size_K)
                        return [bytes, _this.size_B_str].join(' ');
                    var convertedSize;
                    var unit;
                    if (bytes < Math.pow(_this.size_K, 2)) {
                        convertedSize = bytes / _this.size_K;
                        unit = _this.size_K_str;
                    }
                    else if (bytes < Math.pow(_this.size_K, 3)) {
                        convertedSize = bytes / Math.pow(_this.size_K, 2);
                        unit = _this.size_M_str;
                    }
                    else if (bytes < Math.pow(_this.size_K, 4)) {
                        convertedSize = bytes / Math.pow(_this.size_K, 3);
                        unit = _this.size_G_str;
                    }
                    else {
                        convertedSize = bytes / Math.pow(_this.size_K, 4);
                        unit = _this.size_T_str;
                    }
                    // try to have at least 3 digits and at least 1 decimal
                    return convertedSize <= 9.995 ? [convertedSize.toTruncFixed(2), unit].join(' ')
                        : [convertedSize.toTruncFixed(1), unit].join(' ');
                };
                this.speedBps = function (Bps) {
                    return _this.speed(_this.toKBps(Bps));
                };
                this.toKBps = function (Bps) {
                    return Math.floor(Bps / _this.speed_K);
                };
                this.speed = function (KBps) {
                    var speed = KBps;
                    if (speed <= 999.95)
                        return [speed.toTruncFixed(0), _this.speed_K_str].join(' ');
                    speed /= _this.speed_K;
                    if (speed <= 99.995)
                        return [speed.toTruncFixed(2), _this.speed_M_str].join(' ');
                    if (speed <= 999.95)
                        return [speed.toTruncFixed(1), _this.speed_M_str].join(' ');
                    // insane speeds
                    speed /= _this.speed_K;
                    return [speed.toTruncFixed(2), _this.speed_G_str].join(' ');
                };
                this.percentString = function (x) {
                    if (x < 10.0)
                        return x.toTruncFixed(2);
                    else if (x < 100.0)
                        return x.toTruncFixed(1);
                    else
                        return x.toTruncFixed(0);
                };
                this.ratioString = function (x) {
                    if (x === -1)
                        return "None";
                    if (x === -2)
                        return '&infin;';
                    return _this.percentString(x);
                };
            }
            return Helper;
        })();
        Services.Helper = Helper;
        angular.module("shared").service("HelperService", Helper);
    })(Services = Shared.Services || (Shared.Services = {}));
})(Shared || (Shared = {}));
/// <reference path="sharedModule.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-ui-bootstrap.d.ts" />
var Shared;
(function (Shared) {
    var Services;
    (function (Services) {
        var UserService = (function () {
            function UserService($window, $modal, $http) {
                var _this = this;
                this.auth = null;
                this.isLoggedIn = function () {
                    return !!_this.auth;
                };
                this.storeUserData = function (token) {
                    _this.auth = token;
                    _this.$window.localStorage.setItem("auth_token", _this.auth);
                    _this.$http.defaults.headers.common["Authorization"] = _this.auth;
                };
                this.storeXSessionId = function (sessionid) {
                    _this.$window.localStorage.setItem("X-transmission-session-id", sessionid);
                    _this.$http.defaults.headers.common["X-transmission-session-id"] = sessionid;
                };
                this.logout = function () {
                    _this.auth = null;
                    _this.$window.localStorage.removeItem("auth_token");
                    delete _this.$http.defaults.headers.common["Authorization"];
                };
                this.clearXSessionId = function () {
                    _this.$window.localStorage.removeItem("X-transmission-session-id");
                    delete _this.$http.defaults.headers.common["X-transmission-session-id"];
                };
                this.shoLoginWindow = function () {
                    var self = _this;
                    if (_this.loginModalInstancePromise)
                        return _this.loginModalInstancePromise;
                    _this.logout();
                    _this.loginModalInstance = _this.$modal.open({
                        windowClass: "login-dialog-window",
                        templateUrl: "app/shared/layouts/login.html",
                        controller: ["$scope", function ($scope) {
                                $scope.user = {};
                                $scope.login = function () {
                                    if (!$scope.user.username) {
                                        $scope.messageClass = "alert-warning";
                                        $scope.statusMessage = "Please enter username.";
                                        return;
                                    }
                                    $scope.isBusy = true;
                                    self.$http.post("/transmission/rpc/login", {}, {
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': "Basic " + btoa($scope.user.username + ":" + $scope.user.password)
                                        }
                                    }).then(function success(response) {
                                        var statusCode = response.data.statusCode;
                                        if (statusCode === 200) {
                                            self.auth = "Basic " + btoa($scope.user.username + ":" + $scope.user.password);
                                            $scope.$close(self.auth);
                                        }
                                        else {
                                            $scope.messageClass = "alert-danger";
                                            $scope.statusMessage = "Login failed.";
                                        }
                                    }).finally(function () {
                                        $scope.isBusy = false;
                                    });
                                };
                                $scope.cancel = function () {
                                    $scope.$dismiss();
                                };
                            }]
                    });
                    _this.loginModalInstancePromise = self.loginModalInstance.result.then(function (data) {
                        self.storeUserData(data);
                    }).finally(function () {
                        self.loginModalInstance = undefined;
                        self.loginModalInstancePromise = undefined;
                    });
                    return self.loginModalInstancePromise;
                };
                this.$window = $window;
                this.$modal = $modal;
                this.$http = $http;
                try {
                    this.auth = this.$window.localStorage.getItem("auth_token");
                    if (this.auth) {
                        this.$http.defaults.headers.common["Authorization"] = this.auth;
                    }
                }
                catch (e) {
                }
            }
            UserService.$inject = ["$window", "$modal", "$http"];
            return UserService;
        })();
        Services.UserService = UserService;
        angular.module("shared").service("UserService", UserService);
    })(Services = Shared.Services || (Shared.Services = {}));
})(Shared || (Shared = {}));
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-ui-router.d.ts" />
/// <reference path="shared/sharedModule.ts" />
/// <reference path="components/torrents/rpcService.ts" />
/// <reference path="components/torrents/torrentsService.ts" />
/// <reference path="shared/HelperService.ts" />
/// <reference path="shared/userService.ts" />
(function () {
    var app = angular.module("app", ['ui.router', 'ui.bootstrap', 'eehNavigation', 'pascalprecht.translate', 'shared']);
    app.config(["$stateProvider", "$urlRouterProvider", "$translateProvider",
        function ($stateProvider, $urlRouterProvider, $translateProvider) {
            // sanitaze html (escape)
            $translateProvider.useSanitizeValueStrategy('escape');
            // default route	
            $urlRouterProvider.otherwise(function ($injector, $location) {
                var $state = $injector.get("$state");
                $state.go("app.torrents");
            });
            $stateProvider
                .state({
                name: "app",
                abstract: true,
                templateUrl: "app/layout.html",
                controller: ["appMenus", function (appMenus) { }]
            })
                .state({
                name: "app.torrents",
                url: "/torrents",
                template: '<torrent-list torrents="torrents"></torrent-list>',
                controller: ["$scope", "$interval", "TorrentService", "UserService", function ($scope, $interval, ts, us) {
                        ts.getRecentlyActiveTorrents().then(function (torrents) {
                            $scope.torrents = torrents;
                        });
                        var stop = $interval(function () {
                            ts.getRecentlyActiveTorrents().then(function (torrents) {
                                $scope.torrents = torrents;
                            });
                        }, 1500);
                        $scope.$on("$stateChangeStart", function () {
                            $interval.cancel(stop);
                            stop = undefined;
                        });
                    }]
            })
                .state({
                name: "app.downloading",
                url: "/downloading",
                template: '<torrent-list torrents="torrents"></torrent-list>',
                controller: ["$scope", "$interval", "TorrentService", function ($scope, $interval, ts) {
                        ts.getDownloadingTorrents().then(function (torrents) {
                            $scope.torrents = torrents;
                        });
                        var stop = $interval(function () {
                            ts.getDownloadingTorrents().then(function (torrents) {
                                $scope.torrents = torrents;
                            });
                        }, 1500);
                        $scope.$on("$stateChangeStart", function () {
                            $interval.cancel(stop);
                            stop = undefined;
                        });
                    }]
            })
                .state({
                name: "app.seeding",
                url: "/seeding",
                template: '<torrent-list torrents="torrents"></torrent-list>',
                controller: ["$scope", "$interval", "TorrentService", function ($scope, $interval, ts) {
                        ts.getSeedingTorrents().then(function (torrents) {
                            $scope.torrents = torrents;
                        });
                        var stop = $interval(function () {
                            ts.getSeedingTorrents().then(function (torrents) {
                                $scope.torrents = torrents;
                            });
                        }, 1500);
                        $scope.$on("$stateChangeStart", function () {
                            $interval.cancel(stop);
                            stop = undefined;
                        });
                    }]
            });
        }]);
    app.run(["$rootScope", "UserService", "$state", function ($rootScope, userService, $state) {
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if (!userService.isLoggedIn()) {
                    event.preventDefault();
                    userService.shoLoginWindow().then(function () {
                        $state.go(toState.name, toParams);
                    });
                }
            });
        }]);
})();
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="appModule.ts" />
(function () {
    angular.module("app").factory("appMenus", ["eehNavigation", "UserService", "TorrentService",
        function (eehNavigation, userService, torrentService) {
            // navbar
            eehNavigation
                .menuItem("navbar.user", {
                text: "User",
                iconClass: "fa fa-user",
                weight: 1,
                click: function () {
                    userService.shoLoginWindow();
                }
            })
                .menuItem("navbar.addTorrent", {
                text: "Add torrent",
                iconClass: "fa fa-upload",
                weight: -2,
                click: function () {
                    torrentService.showAddTorrentDialog();
                }
            })
                .menuItem("navbar.resumeAll", {
                text: "Resume all",
                iconClass: "fa fa-play-circle",
                weight: -1,
                click: function () {
                    torrentService.resumeAllTorrents();
                }
            })
                .menuItem("navbar.pauseAll", {
                text: "Pause all",
                iconClass: "fa fa-pause-circle",
                weight: -1,
                click: function () {
                    torrentService.pauseAllTorrents();
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
                templateUrl: "app/components/torrents/layouts/torrent.html",
                link: function (scope, element, attributes) {
                },
                controller: ["$scope", "HelperService", "TorrentService", function ($scope, hp, ts) {
                        var torrent = $scope.torrent;
                        $scope.hasError = torrent.error !== 0 || torrent.errorString !== "";
                        $scope.isPaused = torrent.status === 0;
                        $scope.isDownloading = torrent.status === 4;
                        $scope.isSeeding = torrent.status === 6;
                        $scope.torrent.percentDone = torrent.percentDone * 100;
                        $scope.torrent.eta = torrent.eta == -1 ? 0 : torrent.eta;
                        $scope.totalSize = torrent.totalSize;
                        $scope.torrent.rateDownload = hp.speed(hp.toKBps($scope.torrent.rateDownload));
                        $scope.torrent.rateUpload = hp.speed(hp.toKBps($scope.torrent.rateUpload));
                        $scope.torrent.eta = hp.timeInterval($scope.torrent.eta);
                        $scope.torrent.downloadedSize = hp.size(torrent.totalSize - torrent.leftUntilDone);
                        $scope.torrent.totalSize = hp.size(torrent.totalSize);
                        $scope.torrent.uploadedEver = hp.size(torrent.uploadedEver);
                        $scope.menuOptions = [
                            {
                                text: "Pause",
                                click: function ($itemScope) {
                                    var torrentId = $itemScope.torrent.id;
                                    ts.pauseTorrent(torrentId);
                                },
                                enabled: function ($itemScope) {
                                    return $itemScope.torrent.status !== 0;
                                }
                            },
                            {
                                text: "Resume",
                                click: function ($itemScope) {
                                    var torrentId = $itemScope.torrent.id;
                                    ts.resumeTorrent(torrentId);
                                },
                                enabled: function ($itemScope) {
                                    return $itemScope.torrent.status === 0;
                                }
                            },
                            null,
                            {
                                text: 'Move to Top',
                                click: function ($itemScope) {
                                    var torrentId = $itemScope.torrent.id;
                                    ts.moveTop(torrentId);
                                },
                            },
                            {
                                text: 'Move Up',
                                click: function ($itemScope) {
                                    var torrentId = $itemScope.torrent.id;
                                    ts.moveUp(torrentId);
                                },
                            },
                            {
                                text: 'Move Down',
                                click: function ($itemScope) {
                                    var torrentId = $itemScope.torrent.id;
                                    ts.moveDown(torrentId);
                                },
                            },
                            {
                                text: 'Move Move to Bottom',
                                click: function ($itemScope) {
                                    var torrentId = $itemScope.torrent.id;
                                    ts.moveBot(torrentId);
                                },
                            },
                            null,
                            {
                                text: 'Remove From List',
                                click: function ($itemScope) {
                                    var torrentId = $itemScope.torrent.id;
                                    ts.removeTorrent(torrentId, false);
                                },
                            },
                            {
                                text: 'Trash Data and Remove From List',
                                click: function ($itemScope) {
                                    var torrentId = $itemScope.torrent.id;
                                    ts.removeTorrent(torrentId, true);
                                },
                            },
                        ];
                    }]
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
                templateUrl: 'app/components/torrents/layouts/torrentList.html',
            };
        }]);
})();
//# sourceMappingURL=core.js.map