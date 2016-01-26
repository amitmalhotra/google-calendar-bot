# Google Calendar Bot (Google App Script)


A Google App Script for automated crawling of other people's calendar to find keyword matched interesting events to publish to a shared calendar.
For more information see [the blog article][medium.com].


## Getting Started

To use this script, navigate to https://script.google.com and create a brand new project. 
Then one by one, import each file in this project while keeping the name same. 

Change the Source Accounts to relevant accounts to crawl. (You must have access to these accounts. To ensure the script can get to the accounts, go to your Google Calendar and add each account manually first to your account to see their events)

Change the recepients for weekly emails, and Target Google Calendar Id (To create a brand new shared calendar, simply add a new Google Calendar in your account and set it to Shared Calendar setting)


Setting Triggers:

1. Set the calendars() function to run every hour in the Google Script Trigger
2. Set the customerCallSummary() function to run weekly at the desired day and time. 


## How Do I Contribute?

fork and pr. 

## Dependencies

We use the following libraries as dependencies:

  - Date.js
  - moment.js
  - moment-timezone.js

## License

```
Copyright (c) 2015-present, iQScaleSolutions, LLC.
All rights reserved.

This source code is licensed under the MIT-style license 