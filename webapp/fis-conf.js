// fis.match('::packager', {
//   spriter: fis.plugin('csssprites')
// });

// fis.match('*', {
//   useHash: false
// });

// fis.match('*.js', {
//   optimizer: fis.plugin('uglify-js')
// });

// fis.match('*.css', {
//   useSprite: true,
//   optimizer: fis.plugin('clean-css')
// });

// fis.match('*.png', {
//   optimizer: fis.plugin('png-compressor')
// });

//fis.match('!/js/lib/**.{js,css}', {
//	useHash: true
//});


//
// fis.match('*', {
//   useHash: true
// });
//
//fis.match('*.html:js', {
//  optimizer: fis.plugin('uglify-js')
//});
//
//fis.match('*.html:css', {
//    optimizer: fis.plugin('clean-css')
//  });



//fis.match("!/js/lib/**.{js,css}", {
//	useHash: true
//});

fis.match(/.*(?!.*\/lib\/|.*\/plugins\/)^.*\.(js|css)/, {
	useHash: true
});




//fis.match('*.js', {
//	  // fis-optimizer-uglify-js 插件进行压缩，已内置
//	  optimizer: fis.plugin('uglify-js')
//	});
//
//	fis.match('*.css', {
//	  // fis-optimizer-clean-css 插件进行压缩，已内置
//	  optimizer: fis.plugin('clean-css')
//	});
//
//	fis.match('*.png', {
//	  // fis-optimizer-png-compressor 插件进行压缩，已内置
//	  optimizer: fis.plugin('png-compressor')
//	});