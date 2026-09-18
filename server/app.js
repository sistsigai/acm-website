// cPanel Phusion Passenger entry point
// By default, cPanel looks for 'app.js' in the application root directory.
// This file simply delegates execution to the compiled TypeScript server in 'dist/server.js'.

require('./dist/server.js');
