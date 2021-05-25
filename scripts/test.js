require('globby')([process.argv[2] + '/**/*.jpg'], { }).then(files => console.log(files));
