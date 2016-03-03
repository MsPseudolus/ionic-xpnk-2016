# ionic-xpnk
Multiplatform mobile client for go-xpnk, based upon angular-xpnk, using the Ionic framework

The app tracks groups of people on Twitter. It displays their tweets from only the last 24 hours. Rather than being a reverse chronological timeline, it organizes tweets by the "tweeter" (the person) and the group to which I've assigned them.

The client is a near-full featured Twitter client. You can Reply, Retweet, and Like all from within the app (vs spawning a browser window).

This app is powered by go-xpnk on a Digital Ocean server. The Go code does the work of keeping track of the groups, members of groups. The Go code queries Twitter every 60 seconds for new tweets, stores the new ones in a MySQL db and deletes any that are older than 24 hours from the db. It creates a JSON file for each group of the current 24 hour tweets, and the Ionic app runs on that JSON file. 

Currently, the Ionic app makes a request from an endpoint in the Go code, every 60 seconds, to get the latest JSON file for each group. But the plan is for the Go code to send a push notification to the Ionic app only when there are changes to the content of the JSON file and have the app then respond with a request to the REST API endpoint.

This one is really really really (really!) a work in progress :) Expect a LOT of unfinished, and not-so-well organized stuff, console.log output, comments and commented out chunks to facilitate ongoing development.
