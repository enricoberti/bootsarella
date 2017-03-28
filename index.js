var CHANGE_VARIABLES_EXTENSIONS = [
  '.js',
  '.html',
  '.mako',
  '.less',
  '.css'
];

var FORCE_SKIPPED_EXTENSIONS = [
  '.min.js',
];

var MAPPING = {
  'container-fluid': 'container',
  'row-fluid': 'row',
  'span1': 'col-md-1',
  'span2': 'col-md-2',
  'span3': 'col-md-3',
  'span4': 'col-md-4',
  'span5': 'col-md-5',
  'span6': 'col-md-6',
  'span7': 'col-md-7',
  'span8': 'col-md-8',
  'span9': 'col-md-9',
  'span10': 'col-md-10',
  'span11': 'col-md-11',
  'span12': 'col-md-12',
  'offset1': 'col-md-offset-1',
  'offset2': 'col-md-offset-2',
  'offset3': 'col-md-offset-3',
  'offset4': 'col-md-offset-4',
  'offset5': 'col-md-offset-5',
  'offset6': 'col-md-offset-6',
  'offset7': 'col-md-offset-7',
  'offset8': 'col-md-offset-8',
  'offset9': 'col-md-offset-9',
  'offset10': 'col-md-offset-10',
  'offset11': 'col-md-offset-11',
  'offset12': 'col-md-offset-12',
  'brand': 'navbar-brand',
  'navbar nav': 'navbar-nav',
  'nav-collapse': 'navbar-collapse',
  'nav-toggle': 'navbar-toggle',
  'btn-navbar': 'navbar-btn',
  'hero-unit': 'jumbotron',
  'btn': 'btn btn-default',
  'btn-mini': 'btn-xs',
  'btn-small': 'btn-sm',
  'btn-large': 'btn-lg',
  'alert': 'alert alert-warning',
  'alert-error': 'alert-danger',
  'visible-phone': 'visible-xs',
  'visible-tablet': 'visible-sm',
  'visible-desktop': 'visible-md',
  'hidden-phone': 'hidden-xs',
  'hidden-tablet': 'hidden-sm',
  'hidden-desktop': 'hidden-md',
  'input-block-level': 'form-control',
  'control-group': 'form-group',
  'control-group warning': 'form-group has-warning',
  'control-group error': 'form-group has-error',
  'control-group success': 'form-group has-success',
  'checkbox inline': 'checkbox-inline',
  'radio inline': 'radio-inline',
  'input-prepend': 'input-group',
  'input-append': 'input-group',
  'add-on': 'input-group-addon',
  'img-polaroid': 'img-thumbnail',
  'unstyled': 'list-unstyled',
  'inline': 'list-inline',
  'muted': 'text-muted',
  'label': 'label label-default',
  'label-important': 'label-danger',
  'text-error': 'text-danger',
  'table error': 'table danger',
  'bar': 'progress-bar',
  'bar-info': 'progress-bar-info',
  'bar-warning': 'progress-bar-warning',
  'bar-danger': 'progress-bar-danger',
  'bar-success': 'progress-bar-success',
  'accordion': 'panel-group',
  'accordion-group': 'panel panel-default',
  'accordion-heading': 'panel-heading',
  'accordion-body': 'panel-collapse',
  'accordion-inner': 'panel-body'
}


var consoleColors = require('colors'),
  fs = require('fs'),
  path = require('path');

console.log('Welcome to bootsarella!'.rainbow);

var args = process.argv.slice(2);
if (args.length == 0) {
  console.log('Usage: node index.js PATH_TO_YOUR_FOLDER [--preview]')
  console.log('or')
  console.log('node index.js CSS_CLASS_YOU_WANT_TO_CONVERT')
}
else {
  console.log('Starting...');
  console.log(('Loaded ' + Object.keys(MAPPING).length + ' class mappings').green);

  if (args[0].toLowerCase().indexOf('/') == -1) {
    if (MAPPING[args[0].toLowerCase()]) {
      console.log('\t', args[0].red, '=>', MAPPING[args[0].toLowerCase()].green);
    }
    else {
      console.log('\t', 'Class', args[0].red, 'NOT FOUND');
    }
  }

  else {
    var finder = require('findit')(args[0]);

    finder.on('directory', function (dir, stat, stop) {
      var base = path.basename(dir);
      if (base === '.git' || base === 'node_modules') stop()
    });

    finder.on('file', function (file) {
      var baseName = path.basename(file);
      var readIt = false;
      CHANGE_VARIABLES_EXTENSIONS.forEach(function (ext) {
        if (baseName.toLowerCase().indexOf(ext) > -1) {
          readIt = true;
        }
      });
      FORCE_SKIPPED_EXTENSIONS.forEach(function (ext) {
        if (baseName.toLowerCase().indexOf(ext) > -1) {
          readIt = false;
        }
      });
      if (readIt) {
        fs.readFile(file, 'utf8', function (err, data) {
          if (err) {
            return console.log(err);
          }

          console.log(file);

          Object.keys(MAPPING).forEach(function (key) {
            var occurrences = 0;
            data = data.replace(new RegExp('\\b' + key + '\\b', 'gi'), function () {
              occurrences = arguments.length;
              return MAPPING[key]
            });
            if (occurrences > 0) {
              console.log('\t', key.red, '=>', (occurrences + '').green, 'occurrences found'.green);
            }
          });

          if (args[1] == null || args[1] !== '--preview') {
            fs.writeFile(file, data, 'utf8', function (err) {
              if (err) {
                return console.log(err);
              }
            });
          }
        });
      }
    });
  }
}
