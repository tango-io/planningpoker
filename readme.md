TangoSource Poker Estimate
==========================
[![Code Climate](https://codeclimate.com/github/tangosource/tangoestimate/badges/gpa.svg)](https://codeclimate.com/github/tangosource/tangoestimate)

##Description

This project aims to help SCRUM estimation process by using [Planning Poker technique](http://es.wikipedia.org/wiki/Planning_poker)
It allows to create game sessions for your sprint estimation where you and all of your teammates can participate in real time.

##Requirements
- [Node >= 0.10.0](http://nodejs.org/)

##Getting Started

###Install Dependencies

####Development dependencies

In order to keep our development process high-speed, we are taking advantages of these great tools:

 - [Grunt](http://gruntjs.com/using-the-cli)
 - [Bower](http://bower.io/)
 - [AngularJS Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack)

Please install them if you have not done it yet.

```sh
$ npm install -g generator-angular-fullstack
```

```sh
$ npm install -g grunt-cli
```

```sh
$ npm install -g bower
```

We asume that you have some experience with these tools, if not, please take a look on their pages.

####Project dependencies
To install all of npm and bower dependencies please run:

```sh
$ npm install && bower install
```
You are ready to run the server with this comand

```sh
$ grunt serve
```

##Development

Since we are using AngularJS Full-Stack Generator development is much
easier:

To generate a controller, directive, route, endpoint, service, etc.
We do it like this:

```sh
yo angular-fullstack:type name
```
To generate an angular controller for example we run

```sh
yo angular-fullstack:controller user
```
The generator will ask if we want to place it in default path or we can
choose another one

This command generates:

```sh
client/app/user/user.controller.js
client/app/user/user.controller.spec.js
```

Since we are using [grunt-injector](https://github.com/klei/grunt-injector) we do not need to
require this file our index or layout.

We have our spec file as well, and we are ready to use our user
controller. Awesome!

##Tests

Pretty simple commands to run our tests.
In order to run integration test please run this command first:

```sh
npm run update-webdriver
```

To run all tests

```sh
$ grunt test
```
To run Integration tests

```sh
$ grunt test:e2e
```
To run unit angular tests

```sh
$ grunt test:client
```

To run unit server tests

```sh
$ grunt test:server
```
##Contribution Guide lines

Want to contribute? Great!!

Please fork the project and make a pull request
to our repository.

##License

The MIT License (MIT)

Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
