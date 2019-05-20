var NwBuilder = require('nw-builder');
var nw = new NwBuilder({
    files: '../build/**',	// use the glob format
	  platforms: ['linux64', 'win64'],
    buildDir: '../dist'
});

// .build() returns a promise but also supports a plain callback approach as well
nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});
