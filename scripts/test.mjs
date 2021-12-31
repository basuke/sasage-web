import { globby } from 'globby';

globby([process.argv[2] + '/**/*.jpg'], { }).then(files => console.log(files));
