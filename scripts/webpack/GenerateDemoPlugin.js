const glob = require('glob');
const fs = require('fs');
const path = require('path');
const jsdoc = require('jsdoc-api');
const VirtualModulesPlugin = require('webpack-virtual-modules');

/*
General note about this file... it is very ugly.
With that said it generates demo app documented
in the README.md
*/

const normalizeDescription = function (comment) {
  if (!comment) { return null; }
  return comment.split(/\r?\n/g)
    .map(s => {
      var m = s.match(/\* ?(.*)/)[1];
      if (m.match(/^(\*|\/|@)/)) {
        return '';
      }
      return m;
    })
    .filter(s => s !== '')
    .join("\n")
}

const normalizeJSdoc = function (jsdoc) {
  // JSdoc output is very nested
  if (jsdoc.length === 0) {
    return null
  }
  const items = [];
  jsdoc.forEach(item => {
    if (item.kind !== "member") {
      return;
    }
    const props = {
      name: item.name || null,
      description: normalizeDescription(item.comment),
      kind: item.meta.code.type || "Class",
      types: item.type ? item.type.names : [],
      defaultValue: item.defaultvalue || null
    };
    if (item.tags) {
      item.tags.forEach(tag => {
        props[tag.title] = tag.value;
      });
    }
    items.push(props);
  });
  return items;
}

var walkSync = function(dir, filelist = []) {
  var path = path || require('path');
  var fs = fs || require('fs'),
      files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
      if (fs.statSync(path.join(dir, file)).isDirectory()) {
          filelist = walkSync(path.join(dir, file), filelist);
      }
      else {
          filelist.push(path.join(dir, file));
      }
  });
  return filelist;
};

const virtualModules = new VirtualModulesPlugin();

class GenerateDemoPlugin {
  constructor(options) {
    var defaultOptions = {
      excludes: ['demo'],
      modules: []
    }
    this.options = { ...defaultOptions, ...(options || {}) };
  }

  apply(compiler) {
    // Apply Virtual Modules
    virtualModules.apply(compiler);
    // Plugin Name
    var plugin = 'GenerateDemoJson';
    var demoJson = {
      namespaces: [],
      excludes: this.options.excludes || ['demo'],
      includes: this.options.includes || [],
      modules: this.options.modules || []
    };

    var toRelative = function (absolute, root) {
      return absolute.replace(root, '').replace(/\\/g, '/').replace(/^\//, '');
    };

    compiler.hooks.emit.tapAsync('emit', function (compilation, callback) {
      // Find in node_modules (good for production/local dev)
      var nodeMatches = glob.sync("node_modules/*/src/modules/*/*/*.js");
      // - Verify package.json has a root lwc obj
      
      // Find in Local Modules (good for local dev)
      var localMatches = glob.sync("src/modules/*/*/*.js");
      var icon = 'src/modules/mdi/icon/icon.js';
      compilation.fileDependencies = [];
      compilation.fileDependencies.push(path.join(compiler.context, icon));
      console.log(localMatches, '+++');
      callback();
    });

    compiler.hooks.emit.tapAsync('emit', function (compilation, callback) {
      var data = JSON.stringify(demoJson);
      // This is just for reference
      compilation.assets['demo.json'] = {
        source: function () {
          return data;
        },
        size: function () {
          return data.length;
        }
      };
      callback();
    });

    function isLightningElement(statement) {
      return statement.superClass
        && statement.superClass.name === 'LightningElement';
    }

    compiler.hooks.normalModuleFactory.tap(plugin, factory => {
      factory.hooks.parser.for('javascript/auto').tap(plugin, (parser, options) => {
        parser.hooks.statement.tap(plugin, statement => {
          switch (statement.type) {
            case 'ClassDeclaration':
              if (isLightningElement(statement)) {
                var root = parser.state.options.context;
                var resource = parser.state.module.resource;
                var fileRelative = toRelative(resource, root);
                var name = statement.id.name;
                var directory = path.dirname(resource);
                var parts = directory.split(path.sep);
                var eleName = parts.pop();
                var namespaceRelative = toRelative(parts.join(path.sep), root);
                var eleNamespace = parts.pop();
                var hasExamplesFolder = false;
                var examples = [];
                var examplesFolder = path.join(directory, '__examples__');
                // List files in directory
                var files = [];
                fs.readdir(directory, function (err, items) {
                  if (!items) { return; } // Virtual Directory
                  items.forEach(item => {
                    var stat = fs.statSync(path.join(directory, item));
                    if (stat.isFile()) {
                      files.push({
                        name: item,
                        file: toRelative(path.join(directory, item), root)
                      });
                    }
                  });
                });
                if (fs.existsSync(examplesFolder)) {
                  // This just lets us know the folder exists
                  hasExamplesFolder = true;
                  // Now we look for valid examples
                  fs.readdir(examplesFolder, function (err, items) {
                    items.forEach(item => {
                      var stat = fs.statSync(path.join(examplesFolder, item));
                      if (stat.isDirectory()) {
                        examples.push({
                          name: item,
                          folder: toRelative(path.join(examplesFolder, item), root),
                          files: [],
                          errors: [],
                          warnings: [],
                        });
                        var example = examples.find(e => e.name == item);
                        // Verify JS exists, __examples__/basic/basic.js
                        if (!(fs.existsSync(path.join(examplesFolder, item, `${item}.js`)))) {
                          example.errors.push({
                            code: 1,
                            message: `Example "${item}" is missing "${item}.js"`
                          });
                        }
                        // Verify HTML exists, __examples__/basic/basic.js
                        if (!(fs.existsSync(path.join(examplesFolder, item, `${item}.html`)))) {
                          example.errors.push({
                            code: 2,
                            message: `Example "${item}" is missing "${item}.html"`
                          });
                        }
                        // List example files
                        // TODO: Recursive
                        var exampleFolder = path.join(examplesFolder, item);
                        fs.readdir(exampleFolder, function (err, eItems) {
                          eItems.forEach(eItem => {
                            var eFile = path.join(exampleFolder, eItem);
                            var eStat = fs.statSync(eFile);
                            if (eStat.isFile()) {
                              example.files.push({
                                name: eItem,
                                file: toRelative(eFile, root),
                                source: fs.readFileSync(eFile, 'utf8')
                              });
                            }
                          });
                        });
                      }
                    });
                  });
                }
                // Skip if in options.excludes. Ex: ['demo']
                if (this.options.excludes.includes(eleNamespace)) {
                  break;
                }
                var namespace = demoJson.namespaces.find(n => n.name === eleNamespace);
                if (!namespace) {
                  demoJson.namespaces.push({
                    name: eleNamespace,
                    folder: namespaceRelative,
                    components: []
                  });
                  namespace = demoJson.namespaces.find(n => n.name === eleNamespace);
                }
                var component = namespace.components.find(c => c.name == eleName);
                if (!component) {
                  namespace.components.push({
                    name: eleName
                  });
                  component = namespace.components.find(c => c.name == eleName);
                }
                var jsdocObj = jsdoc.explainSync({
                  files: resource
                });
                var jsdocNorm = normalizeJSdoc(jsdocObj);
                var cls = jsdocNorm.find(x => x.kind == 'Class');
                component.order = cls ? cls.order : 1;
                component.file = fileRelative;
                component.files = files;
                component.name = eleName;
                component.namespace = eleNamespace;
                component.tag = `${eleNamespace}-${eleName}`
                component.hasExamplesFolder = hasExamplesFolder;
                component.examplesFolder = toRelative(examplesFolder, root);
                component.examples = examples;
                component.jsdoc = jsdocNorm;
                component.doc = 'testing';
                //fs.readFileSync(path.join(directory, `${item}.md`), 'utf8');
              }
              break;
          }
        });
      });
      console.log('generate');
      // This is the actual data imported
      var data = JSON.stringify(demoJson);
      virtualModules.writeModule(
        'node_modules/data.js',
        `const data = ${data};export default data;`
      );
    });

    compiler.hooks.afterPlugins.tap(plugin, () => {
      virtualModules.writeModule(
        'src/modules/demo/fake/fake.js',
        "import { LightningElement } from 'lwc';export default class Fake extends LightningElement {}"
      );
      virtualModules.writeModule(
        'src/modules/demo/fake/fake.html',
        '<template>Testing</template>'
      );
      fs.readdir(path.join("src", "modules"), function (err, items) {
        items.forEach(item => {
          var folder = path.join("src", "modules", item);
          var stat = fs.statSync(folder);
          if (stat.isDirectory()) {
            if (item === 'mdi'){
              var files = walkSync(folder)
                .map(f => f.replace(/\\/g, '/'))
                .forEach(f => {
                  virtualModules.writeModule(
                    f,
                    fs.readFileSync(f, 'utf8')
                  );
                });
            }
          }
        });
      });
    });
  }
}

module.exports = GenerateDemoPlugin;
