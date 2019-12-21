# librus-api-relibrused
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](http://opensource.org/licenses/MIT)

Simple node.js Librus scraping API module
A fork of librus-api with a working message system

WARNING!!! Librus.authorize STOPPED BEING A PROMISE FUNCTION

## Changes
```
listInbox now lists all pages instead of only the first one
recoverMessage can move messages from trash
sendMessage has been fixed
listRecivers has been fixed
authorize now ommits promises, gets the oauth_token properly and gets a hold of 'request key', the third argument of authorize is callback
authorize will throw sensible information is case of wrong password/login, instead of spitting random data to the console
```

## Installation:
```
(not for this fork)npm install librus-api
Download and put in node_modules/librus-api or node_modules/librus-api-relibrused
```

## Usage
```javascript
const Librus = require("librus-api"); / const Librus = require("librus-api-relibrused");

let client = new Librus();
client.authorize("login", "pass",() => {

  // Send message to User 648158
  client.inbox.sendMessage(648158, "title", "body").then(() => { /** sucess */ }, () => { /** fail **/ });

  // Remove message in folder 5 with id 4534535  
  client.inbox.removeMessage(5, 4534535).then(() => { /** sucess */ }, () => { /** fail **/ });

  // Recover message with id 4534535 from trash
  client.inbox.recoverMessage(4534535).then(() => { /** sucess */ }, () => { /** fail **/ });

  // List receivers
  client.inbox.listReceivers("nauczyciel").then(data => {});

  // List announcements
  client.inbox.listAnnouncements().then(data => {});

  // List all e-mails in folder(5) in page(2)
  client.inbox.listInbox(5).then(data => {});

  // Get message with id 2133726 in folder 6
  client.inbox.getMessage(6, 2133726).then(data => {});

  // List all subjects
  client.homework.listSubjects().then(data => {});

  // List subject homeworks, -1||undefined all
  client.homework.listHomework(24374).then(list => {});

  // Download homework description
  client.homework.getHomework(257478).then(data => {});

  // Get all absences
  client.absence.getAbsences().then(data => {});

  // Get info about absence
  client.absence.getAbsence(5068489).then(data => {});

  // Get timetable
  client.calendar.getTimetable().then(data => {});

  // Get calendar
  client.calendar.getCalendar().then(data => {});

  // Get event
  client.calendar.getEvent(4242342).then(data => {});

  // Get grades
  client.info.getGrades().then(data => {});

  // Get grade
  client.info.getGrade(23424234).then(data => {});
  
  // Get scoring grade
  client.info.getPointGrade(234242234).then(data => {});
  
  // Get lucky number
  client.info.getLuckyNumber().then(data => {});

  // Get notifications
  client.info.getNotifications().then(data => {});

});

```

## License
The MIT License (MIT)

Copyright (c) 2019/2020 Mateusz Bagiński, Mikołaj Gazeel (Kod wprowadzony w forku librus-api/Code added in the librus-api fork)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
