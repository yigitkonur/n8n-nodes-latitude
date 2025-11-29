const { src, dest, parallel } = require('gulp');

function buildNodeIcons() {
  return src('nodes/**/*.{png,svg,jpg}')
    .pipe(dest('dist/nodes'));
}

function buildCredentialIcons() {
  return src('icons/**/*.{png,svg,jpg}')
    .pipe(dest('dist/icons'));
}

exports['build:icons'] = parallel(buildNodeIcons, buildCredentialIcons);
