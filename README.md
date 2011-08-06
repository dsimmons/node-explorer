## node-explorer

**node-explorer** is intended to be a lightweight file server built using node.js and the following:

* **MongoDB**
* **Express**
* MVC with **Backbone.js**
* HTML templating with **Jade**
* CSS templating with **Stylus**

### Features (planned)
* **Authentication**
	* Only authenticated users can make it to the home page.
	* New users can register, but accounts are disabled by default.
	* Administrators have full control over who is granted access.
* **Security**
	* All passwords are stored as salted SHA-256 hashes.
	* Traffic defaults to HTTPS over TLS/SSL.
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

You should now be able to access the server at http://serverip:3000/

### License

The MIT License (MIT)
Copyright (c) 2011 Dan Simmons

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
