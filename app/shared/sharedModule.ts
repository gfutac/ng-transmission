
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
	
})();