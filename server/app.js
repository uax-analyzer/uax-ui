import express, { response } from 'express';
import { Eta } from 'eta';
import _ from 'lodash';

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = join(dirname(fileURLToPath(import.meta.url)), '../');

const metricDescription = new Map([
  ["AMNOI",
    `This metric quantifies the degree to which 
    the various overload definitions of a function yield 
    disparate return types. The lesser the metric score, 
    the greater is the number of overloads that return different types`
  ],
  ["AMNCI",
    `The metric is based on three name-abuse patterns. 
    The greater the number of confusing names, the lesser tends to be the metric score.`
  ],
  ["AMGI",
    `It measures the extent to which semantically similar functions are grouped rather 
    than dispersed. The semantic similarity is defined based on keywords extracted 
    from the function names; for instance, a function called mergeMap, concatMap and switchMap
     could all be considered semantically similar.`
  ],
  ["APLCI",
    `It assess the consistency in terms of parameter name ordering across functions' definitions`
  ],
  ["APXI",
    `This metric deals with the length of function parameter and the runs of parameters of the same type.
    Long lists of parameter and sequences of parameters with the same data type are likely to worsen the user experience`
  ],
  ["ADI",
    `This metric examines the number of words (e.g., 50 words) contained in the functions' documentation.`
  ]
])


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

  // temporary
  app.get('/favicon.ico', (req, res, next) => {
    res.writeHead(200, { 'Content-Type': 'image/x-icon' });
    res.end();
  });

  app.get('/', (req, res) => {
    const renderedTemplate = eta.render("index",
      { chunkOfKeys: chunkizeKeys(resultsProject), resultsProject, projectScores, resultsMetric });
    res.status(200).send(renderedTemplate);
  });

  app.get('/:api', (req, res) => {
    const api = req.params.api;
    const renderedTemplate = eta.render("api-details",
      { api, resultsProject: resultsProject[api], projectScore: projectScores[api], resultsMetric,
        metricDescription
       });
    res.status(200).send(renderedTemplate);
  });

  return addErrorHandling(app);
}

function chunkizeKeys(content) {
  return _.chunk(Object.keys(content), 3);
}