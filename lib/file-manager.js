'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const YAML = require('yaml');

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const JSONFile = data => JSON.parse(data);
const YAMLFile = data => YAML.parse(data);

const getFiles = (context, directory, fileTransform = directory.endsWith('json') ? JSONFile : YAMLFile) =>
  readDir(directory)
    .then(files =>
      files.map(
        filePath => ({ filePath, async load() { return fileTransform(await readFile(path.join(directory, filePath), 'utf8')); } })
      )
    );

module.exports = { getFiles };
