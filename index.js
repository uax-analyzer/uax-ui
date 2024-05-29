import { readdirSync } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';

import { Command } from 'commander';
import _ from 'lodash';

import { mean } from 'mathjs';

import { createRoutes } from './server/app.js';

const PORT = 3000;
const program = new Command();

program
  .requiredOption('-p, --path <dir>', 'the path pointing to the JSON folder')
  .parse();

const jsonLocationPath = program.opts().path;

let jsonContent = await loadJSONFiles(jsonLocationPath);

const app = createRoutes(processJSONFiles(jsonContent));

app.listen(PORT, () => {
  console.log(`The application is listing at port ${PORT}`);
})

async function loadJSONFiles(jsonLocationPath) {
  let jsonContent;
  const jsonPaths = readdirSync(jsonLocationPath).filter(file => path.extname(file) === '.json');
  try {
    if (!jsonPaths || jsonPaths?.length === 0) {
      throw new Error('No JSON files located at the provided path!')
    }

    jsonContent = await Promise.all(jsonPaths.map(jsonPath => readFile(path.join(jsonLocationPath, jsonPath), { encoding: 'utf-8' })));
    jsonContent = jsonContent.map(content => JSON.parse(content));

    if (!jsonContent || jsonContent.length === 0) {
      throw new Error('The JSON files were not loaded');
    }
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }

  return jsonContent;
}

function processJSONFiles(jsonContent) {
  let resultsProject = _.groupBy(jsonContent, content => content.projectName);
  let projectScores = Object.fromEntries(Object.keys(resultsProject).map(key =>
    ([key, mean(resultsProject[key].map(metric => metric.score || metric.usabilityResult.score)) ])));
  let resultsMetric = _.groupBy(jsonContent, content => content.metric);
  return [resultsProject, projectScores, resultsMetric];
}