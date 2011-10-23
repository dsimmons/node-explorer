## node-explorer
**Update**: This project is currently on pause in favor of a new open source project that myself and Jeffrey Portman (ChromoX) have started, finance.js.  I may come back to it at some point in the future when I have time.

**node-explorer** is intended to be a lightweight file server built using node.js and the following:

* **MongoDB**
* **Express**
* MVC with **Backbone.js**
* HTML templating with **Jade**
* CSS templating with **Stylus**

### Why? Features (implemented and/or planned)
* **Authentication**
	* All requests default to the login screen until the user obtains a valid session.
	* While new users are able to register, accounts are disabled by default until obtaining administrator approval.
	* Administrators have full control over who is granted access (enable/disable accounts at will).
	* Administrators can additionally delegate permissions on a per-user basis from the administrative panel.
	* Administrators can assign individual download quotas per user.  Defaults to 5GB.
	* Automatically monitors for account sharing by tracking the number of unique IP addresses a user has logged in from (and number of logins).
* **Security**
	* All passwords are stored as salted SHA-256 hashes.
	* Although HTTP is supported, functionality for HTTPS over encrypted TLS/SSL is both included and encouraged.
* **Speed**
	* FAST. Node + MongoDB + Express.
	* Additional caching mechanisms to come eventually.
	* TODO: Test Node performance of varying buffer size for multiple simultaneous requests.
	* TODO: Test single process vs child workers for serving up files.

**Note**: The core functionality of this project will continue to be open-sourced and supported. However, I intend to fork the core at some later date with undisclosed additional enhancements. That portion will *not* be public.

### Install
	git clone git@github.com:dsimmons/node-explorer.git
	cd node-explorer
	npm install -d
	node app

You should now be able to access the server at http://serverip:3000/ (or https://serverip:3000);

### License

The MIT License (MIT)
Copyright (c) 2011 Dan Simmons

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
