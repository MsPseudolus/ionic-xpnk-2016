angular.module('xpnk.directives', [])


.directive('twender', function(){
	return{
		//templateUrl: './templates/xpnk-tweets.html'
    templateUrl: './templates/xpnk-grp-overview.html'
	}
})

.directive('firstTweet', function() {
	return {
		link: function($scope, $element){
			twttr.widgets.createTweet('511181794914627584',$element [0],{ align: 'left' });
			}
	}
})

.directive('embedTemplate', function() {
	return {
		link: function($scope, $element, $attr){
			twttr.widgets.createTweet($attr.id,$element [0],{ align: 'left' }).then(
                console.log("I am TWITTER.WIDGETS"));
			}
	}
})

.directive('profileImage', function() {
	return {
		link: function($scope, $element, $attr){
			transclude: true,
			$scope.thisProfileImage = $scope.tweet[0].profile_image;
			}
	}
})//end profileImage directive
