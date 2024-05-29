import express from 'express';
import { Eta } from 'eta';
import _ from 'lodash';

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = join(dirname(fileURLToPath(import.meta.url)), '../');



const app = express();
const eta = new Eta({
  views: join(__dirname, "views"),
  cache: true
});

function addErrorHandling(app) {
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use((err, req, res, next) => {
    if (err.status !== 404) console.error(err.stack);
    res.status(err.status || 500).json({ err: err.message });
  });

  return app;
}

app.use(express.static(join(__dirname, 'public')));

export function createRoutes(jsonsContent) {
  let [resultsProject, projectScores, resultsMetric] = jsonsContent;
  
  app.get('/', (req, res) => {
    const renderedTemplate = eta.render("index",
      { chunkOfKeys: chunkizeKeys(resultsProject), resultsProject, projectScores, resultsMetric });
    res.status(200).send(renderedTemplate);
  })

  return addErrorHandling(app)
  //return app;
}

function chunkizeKeys(content) {
  return _.chunk(Object.keys(content), 3);
}