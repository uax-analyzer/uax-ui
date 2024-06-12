export const metricDescription = new Map([
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
]);