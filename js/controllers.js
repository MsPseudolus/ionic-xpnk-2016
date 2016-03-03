angular.module('xpnk.controllers', [])

.controller('DashCtrl', function($scope, $rootScope, $ionicUser, $ionicPush) {


 // Handles incoming device tokens
  $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
    alert("Successfully registered token " + data.token);
    console.log('Ionic Push: Got token ', data.token, data.platform);
    $scope.token = data.token;
  });

 // Identifies a user with the Ionic User service
  $scope.identifyUser = function() {
    console.log('Ionic User: Identifying with Ionic User service');

    var user = $ionicUser.get();
    if(!user.user_id) {
      // Set your user_id here, or generate a random one.
      user.user_id = $ionicUser.generateGUID();
    }

    // Add some metadata to your user object.
    angular.extend(user, {
      name: 'Ionitron',
      bio: 'I come from planet Ion'
    });

    // Identify your user with the Ionic User Service
    $ionicUser.identify(user).then(function(){
      $scope.identified = true;
      alert('Identified user ' + user.name + '\n ID ' + user.user_id);
    });
  };

// Registers a device for push notifications and stores its token
  $scope.pushRegister = function() {
    console.log('Ionic Push: Registering user');

    // Register with the Ionic Push service.  All parameters are optional.
    $ionicPush.register({
      canShowAlert: true, //Can pushes show an alert on your screen?
      canSetBadge: true, //Can pushes update app icon badges?
      canPlaySound: true, //Can notifications play a sound?
      canRunActionsOnWake: true, //Can run actions outside the app,
      onNotification: function(notification) {
        // Handle new push notifications here
        // console.log(notification);
        return true;
      }
    });
  };


})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

/**********************************
Change where the ng-repeat gets its data from the json file variable to localStorage
use track by $index to ensure no dupes and that the localStorage object persists. Track by can be used *after* all the sorting filters.

in html: ng-repeat="item in items track by $index"
in controller: $scope.items = JSON.parse(localStorage.getItem('items'))
$scope.$watch('items',function(newValue,oldValue) {
	if(newValue != oldValue) {
		localStorage.setItem('items', JSON.stringify(newValue))
	}
}, true)		<----- true is probably a problem in our case, have to look at the other
						way of 'watching' a file, think it's watchCollection?

May also need to consider some kind of forEach approach to the ng-repeat in order to atomize the tweets.

**********************************/

.controller('Tweets', function Tweets($http, $scope, $stateParams, $anchorScroll, $location, $interval, $timeout, $compile, $interpolate, $parse, $rootScope, newTweetsService, tweetsCompare, isolateNewTweets, addNewTweetsService, getTweetsJSON, $cordovaOauth, $ionicModal) {

	$scope.group_name = $stateParams.groupName;

	//create the page
	$scope.tweetStatus = {};

	load_tweets();

//process that checks for new tweets every 60 seconds

/*
	$interval(function(){

		if ($rootScope.checkdata){$scope.olddata = $rootScope.checkdata};
		console.log("I AM OLDDATA:");
		console.log($scope.olddata);

		getTweetsJSON.getJSON().then(function(tweetsJSONObj){

			console.log("I AM INTERVAL CHECKDATA:");
			console.log($rootScope.checkdata);

			$scope.newCheck = angular.equals($scope.olddata, $rootScope.checkdata);
			if ($scope.newCheck === true){
			console.log("NO NEW TWEETS")}else{
			console.log("NEW TWEETS! NEW TWEETS!");

			//if largest tweet_ID in checkdata is bigger than largest tweet_ID in olddata, take all tweets with tweet_ID bigger than biggest tweet_ID in olddata and append to view div, then run twitterwidgets on them (or vice versa) -- ******except this doesn't drop expired tweets******

			$scope.tweetStatus.switch = "on"; //show the New Tweets button
			};

		});//.then

	;}, 60000);//end interval

*/

//can we use some kind of transition to prevent a white screen between content reloads?
	$scope.refreshTweets = function () {

		load_tweets();

	};	//refreshTweets used by the New Tweets button in the template

	function load_tweets () {
		$scope.tweetStatus.switch = "off"; //so our New Tweets button does not display
		$scope.message = "I AM LOAD_TWEETS";

		getTweetsJSON.getJSON().then(function(tweetsJSONObj){
			console.log("I AM LOAD_TWEETS DATA:");
			console.log(tweetsJSONObj.data);

			$scope.thisData = tweetsJSONObj.data;
			console.log("I AM thisData:");
			console.log($scope.thisData);


			$scope.tweets = _.groupBy($scope.thisData, "twitter_user");
			console.log("I AM $SCOPE.TWEETS:");
			console.log($scope.tweets);

			$scope.tweetscount = _.size($scope.tweets);

			$scope.tweeters = _.keys($scope.tweets);
			console.log("I AM TWEETERS:");
			console.log($scope.tweeters);

			$scope.tweet_count = $scope.thisData.length;

			$rootScope.oldTweets = $scope.thisData;

			getthetweets()

		});



	}	//end load_tweets()

	function getthetweets () {

		var tweeters = $scope.tweeters;
			tweeterscount = tweeters.length;
		for (var i = 0; i < (tweeterscount); i++) {
			var tweeter = tweeters[i];
			$scope.this_tweeter = tweeter;

			gettweetertweets(tweeter);
		}
	}	//end getthetweets()

	function gettweetertweets(tweeter) {
		console.log('I AM GETTWEETERTWEETS');

		var scopedata = $scope.thisData;
		var scopedatalength = scopedata.length;
		var tweetertweets = [];
		for (var i = 0; i < scopedatalength; i++) {
			var thistweet = scopedata[i];
			var twitteruser = thistweet["twitter_user"];
			if (twitteruser === tweeter) {
				var post_tweet = String(thistweet["tweet_ID"]);
        console.log("POST_TWEET IS A " + typeof post_tweet);
				tweetertweets.push(post_tweet);
			}

		}
		$scope.tweeter_tweets = tweetertweets;
		console.log("TWEETER_TWEETS: " + $scope.tweeter_tweets);

		//embedtweetertweets(tweetertweets);
	}//end gettweetertweets()

	//can probably delete this function eventually
	function checkNewTweets(){
		newTweetsService.fetchNewTweets().then(function(newTweetsObj) {
			$scope.tweetsUpdate = newTweetsObj;
			console.log("I AM tweetsUpdate");
			console.log($scope.tweetsUpdate);
		});
	}

	function newTweetsOrNot() {
		tweetsCompare.compareTweets().then(function(compareObj) {
			$scope.newTweetsStatus = compareObj;
			console.log("I AM newTweetsOrNot");
			console.log($scope.newTweetsStatus);
			if (compareObj === true) {
				return
			}//end if compareObj

			isolateNewTweets.iterateTweets().then(function(tweetsToAddObj){

				$scope.whatsNewObj = tweetsToAddObj.newTweetsLength;
				console.log("I AM whatsNewObj:");
				console.log($scope.whatsNewObj);
				$scope.newCount = $scope.whatsNewObj.length;
				console.log("I AM newCount:");
				console.log($scope.newCount);

			});//end isolateNewTweets.iterateTweets().then

		});//end tweetsCompare.compareTweets().then


	} //end newTweetsOrNot


/*  Twitter Actions */

$scope.twttModal = function(arg1,modaltype,tweet_oembed,twitter_user) {

  _openModalWithObject($scope, arg1, modaltype, tweet_oembed, twitter_user);
}

  var _openModalWithObject = function(_scope,_arg1, _modaltype, _tweet_oembed, _twitter_user) {

  console.log("ARG1 IS A: " + typeof _arg1);

  var charsRemain = 139 - _twitter_user.length;

  console.log("CHARSREMAIN: " + charsRemain);

  //TODO change 'arg1', 'name', 'info' to something more applicable
  _scope.contact = {
    name: _arg1,
    info: _modaltype,
    oembed: _tweet_oembed,
    tweeter: _twitter_user,
    charCount: charsRemain
  };

  if (_modaltype == 'retweet') {
    _scope.modaltempl = 'templates/retweet-modal.html';
  }
  else if (_modaltype == 'reply') {
    _scope.modaltempl = 'templates/twreply-modal.html';
  }
  else if (_modaltype == 'like') {
    _scope.modaltempl = 'templates/twlike-modal.html';
  }
  else {
    _scope.modaltempl = 'templates/twlike-modal.html';
  }

  $ionicModal.fromTemplateUrl($scope.modaltempl, {
    scope: _scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    _scope.modal = modal;

    _scope.openModal = function() {
      _scope.modal.show();
    };

    console.log(_scope.modaltempl);



  _scope.closeModal = function() {
    $scope.modal.hide();
  };

  _scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

 _scope.openModal();
 });
};

//end twttModal

  $scope.reTweet = function(msg){
    console.log("THIS IS THE MSG:" + msg);
    var tweetID = $scope.contact.name;
    var thisTweeter = $scope.contact.tweeter;
    var rtUrl = "https://twitter.com/" + thisTweeter + "/status/" + tweetID;

    var thisMsg;
    if (!angular.isUndefined(msg)) {
      thisMsg = msg;
    } else {
      thisMsg = '';
    }

    console.log("TWEETID IS A: " + typeof tweetID);
    console.log("THISTWEETER: " + thisTweeter);
    console.log("RTURL: " + rtUrl);
    console.log("STATUS: " + thisMsg + " " + rtUrl);

    OAuth.popup('twitter', {
        cache: true
      })
      .done(function(result) {
        result.post( {
          url: '/1.1/statuses/update.json',
          data: {
            status: thisMsg + rtUrl
          }
        })
      .fail(function (err) {
        //handle error with err
        console.log("This didn't work: " + err);
      });
    })
  };

  $scope.twLike = function(){
    var tweetID = $scope.contact.name;

    console.log("WE GONNA LIKE THIS ID: " + tweetID);

    OAuth.popup('twitter', {
        cache: true
      })
      .done(function(result) {
        result.post({
            url:  '/1.1/favorites/create.json',
            data: {
              id: tweetID
            }
          })
          .fail(function (err) {
            //handle error with err
            console.log("This didn't work: " + err);
          });
      })
  };

  $scope.twReply = function(msg){
    var tweetID = $scope.contact.name;
    var thisTweeter = $scope.contact.tweeter;
    var thisMsg = msg;

    console.log("tweetID IS a: " + typeof tweetID);
    console.log("THISMSG: " + thisMsg);

    OAuth.popup('twitter', {
        cache: true
      })
      .done(function(result) {
        result.post( {
            url: '/1.1/statuses/update.json',
            data: {
              in_reply_to_status_id:tweetID,
              status:"@" + thisTweeter + " " + thisMsg
            }
          })
          .fail(function (err) {
            //handle error with err
            console.log("This didn't work: " + err);
          });
      })
  };
//end Twitter actions


	//this isn't going to do anything until get_tweets_json is the repeated function
	//$scope.$watchCollection('data', function(newVal, oldVal) {

		//console.log("TWEETS CHANGED");

	//});

})//end Tweets controller
