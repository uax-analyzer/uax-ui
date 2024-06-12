import { readdirSync } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';

import { Command } from 'commander';
import _ from 'lodash';
import { mean } from 'mathjs';

import { createRoutes } from './server/app.js';

const program = new Command();

program
  .requiredOption('-i, --input-path <dir>', 'the path pointing to the JSON folder')
  .option('-p, --port <number>', 'the server port', 3000)
  .parse();

const jsonLocationPath = program.opts().inputPath;
const PORT = program.opts().port;

const jsonContent = await loadJSONFiles(jsonLocationPath);

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
  const resultsProject = _.groupBy(jsonContent, content => content.projectName);
  const projectScores = Object.fromEntries(Object.keys(resultsProject).map(key =>
    ([key, mean(resultsProject[key].map(metric => metric.usability.score)) ])));
  const resultsMetric = _.groupBy(jsonContent, content => content.metricName);
  return [resultsProject, projectScores, resultsMetric];
}