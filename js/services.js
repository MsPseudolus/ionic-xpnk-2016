angular.module('xpnk.services', ['ngTwitter'])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})


.factory('getTweetsJSON', function ($http, $rootScope, $stateParams) {

	var data = [];

	var tweetsJSONObj = {

		getJSON: function(){

			var group_name = $stateParams.groupName;
			var group_data = 'http://45.55.208.97:8000/static/'+group_name+'_tweets.json';

			return $http({method: 'GET', url: group_data}).success(function(data){
					data = (data);
					$rootScope.checkdata = data;
					console.log("I AM DATA:");
					console.log(data);
					console.log("I AM CHECKDATA:");
					console.log($rootScope.checkdata);

				});//end GET

		}	// getJSON

	};	//tweetsJSONObj


	return tweetsJSONObj;

}) //getTweetsJSON

.factory('isolateNewTweets', function($rootScope, newTweetsService) {

	var tweetsToAdd = [];

	var tweetsToAddObj = {

		iterateTweets: function() {

			return newTweetsService.fetchNewTweets().then(function(newTweetsObj) {

				var newTweets = newTweetsObj;

				var newTweetsLength = newTweetsObj.length;

				for(var i = 0; i < (newTweets.length); i++) {
					var tweetID = newTweets[i].tweet_ID;
					if (_.findWhere($rootScope.oldTweets, {tweet_ID: tweetID})){
						console.log("THIS TWEET ALREADY EXISTS");
						console.log(tweetID);
					} else {
						console.log("A NEW TWEET WAS FOUND");
						console.log(tweetID);
						tweetsToAdd.push(tweetID);
					}//end if statement
				}//end for loop
				console.log("I AM tweetsToAdd");
				console.log(tweetsToAdd.length);

			});//end return newTweetsService

		}//iterateTweets

	};//tweetsToAddObj

	return tweetsToAddObj;

})//isolateNewTweets

.factory('tweetsCompare', function($rootScope, $q, newTweetsService) {

	var compareObj = {

		compareTweets: function() {

			return newTweetsService.fetchNewTweets().then(function(newTweetsObj){
				var newOrNotNew = angular.equals(newTweetsObj, $rootScope.oldTweets);
				//var newOrNotNew = newTweetsObj.length - $rootScope.oldTweets.length;
				$rootScope.oldTweets = newTweetsObj;
				return newOrNotNew;
			});//

		}//compareTweets

	}; //compareObj

	return compareObj;
}) //tweetsCompare

.factory('newTweetsService', function($http, $stateParams, $rootScope, $q) {

		var group_name = $stateParams.groupName;
		var group_data = './data/'+group_name+'_tweets.json';

			var newTweetsObj = {

				fetchNewTweets: function() {

				console.log("newTweetsService IS WATCHING newData");


					return $http.get(group_data).then(function(result){
						$rootScope.newData = result.data;
						//newTweets = _.groupBy(newData, "twitter_user");
						//return newTweets;
						//tweetscount = _.size(newTweets);
						//tweeters = _.keys(newTweets);

						//tweet_count = newData.length;

						//console.log("THIS IS THE FACTORY OUTPUT:");
						//console.log(newTweets);

						});//end GET

				}//fetchNewTweets


			};//newTweetsObj


		return newTweetsObj;

})	//end newTweetsService

.factory('addNewTweetsService', function($rootScope, isolateNewTweets) {

	var addTheseTweets = ["610557817343377408", "610048807984852992"];

	var addTweetsLength = addTheseTweets.length;

	var addNewTweetsObj = {

		addNewTweets: function() {

			for(var i = 0; i < (addTweetsLength); i++) {



			} //for loop

		} // addNewTweets

	}; // addNewTweetsObj

	return addNewTweetsObj;

});//addNewTweetsService

