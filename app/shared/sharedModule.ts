
(function (){
	
	angular.module("shared", [])	
	.directive("torrentUploader", function () {
		return {
			restrict: "E",
			replace: true,
			templateUrl: "app/shared/layouts/uploader.html",
			link: function (scope, elem, attributes: any) {
				scope.url = attributes.url;
				var input = $("input:file", elem);
				var reader = new FileReader();
	
				if (angular.isDefined(elem.attr("accept"))) {
					input[0].setAttribute("accept", elem.attr("accept"));
					elem.removeAttr("accept");
				}
	
				reader.onloadend = function(){
					var prefix = "data:application/x-bittorrent;base64,";
					scope.torrent.torrentMetainfo = reader.result.replace(prefix, "");									
				}
	
				input.on("change", function (changeEvent: any) {
					scope.$apply(function () {
						var file = changeEvent.target.files[0];
						scope.file = reader.readAsDataURL(file);
						scope.statusMessage = "";
					});
	
					$("input:text", elem).val(changeEvent.target.files[0].name);
				});
			},
			controller: ["$scope", "$http", function ($scope, $http: angular.IHttpService) {
				
			}],
		};
	});
	

	angular.module("shared", [])
	// https://github.com/Templarian/ui.bootstrap.contextMenu
	.directive('contextMenu', ["$parse", function ($parse) {
		var renderContextMenu = function ($scope, event, options, model) {
			if (!$) { var $ = angular.element; }
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
				} else {
					var $a = $('<a>');
					$a.attr({ tabindex: '-1', href: '#' });
					var text = typeof item[0] == 'string' ? item[0] : item[0].call($scope, $scope, event, model);
					$a.text(text);
					$li.append($a);
					var enabled = angular.isDefined(item[2]) ? item[2].call($scope, $scope, event, text, model) : true;
					if (enabled) {
						$li.on('click', function ($event) {
							$event.preventDefault();
							$scope.$apply(function () {
								$(event.currentTarget).removeClass('context');
								$contextMenu.remove();
								item[1].call($scope, $scope, event, model);
							});
						});
					} else {
						$li.on('click', function ($event) {
							$event.preventDefault();
						});
						$li.addClass('disabled');
					}
				}
				$ul.append($li);
			});
			$contextMenu.append($ul);
			var height = Math.max(
				document.body.scrollHeight, document.documentElement.scrollHeight,
				document.body.offsetHeight, document.documentElement.offsetHeight,
				document.body.clientHeight, document.documentElement.clientHeight
			);
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
						if (options.length === 0) { return; }
						renderContextMenu($scope, event, options, model);
					} else {
						throw '"' + attrs.contextMenu + '" not an array';
					}
				});
			});
		};
	}]);	
	
})();