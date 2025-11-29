const { src, dest, parallel } = require('gulp');

/**
 * Copy node icons (SVG files in nodes/ directory) to dist
 */
function buildNodeIcons() {
	return src('nodes/**/*.{png,svg,jpg}').pipe(dest('dist/nodes'));
}

/**
 * Copy credential/shared icons from icons/ directory to dist
 * These are referenced by credentials with paths like 'file:icons/...'
 */
function buildCredentialIcons() {
	return src('icons/**/*.{png,svg,jpg}').pipe(dest('dist/icons'));
}

/**
 * Copy node JSON metadata files to dist
 */
function buildNodeJson() {
	return src('nodes/**/*.json').pipe(dest('dist/nodes'));
}

exports['build:icons'] = parallel(buildNodeIcons, buildCredentialIcons, buildNodeJson);
