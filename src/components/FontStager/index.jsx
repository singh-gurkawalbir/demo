import FoutStager from 'react-fout-stager';
import React, { useMemo } from 'react';
import './index.css';

/**
 * Responsible for loading the application typefaces progressively
 * using FOUT stage techniques.
 */
export default function FontStager() {
  const stages = useMemo(
    () => [
      {
        className: 'font-stage-primary',
        families: [{ family: 'Roboto400' }],
        stages: [
          {
            className: 'font-stage-secondary',
            families: [
              { family: 'Roboto300', options: { weight: 300 } },
              { family: 'Roboto500', options: { weight: 500 } },
            ],
          },
        ],
      },
    ],
    []
  );

  return <FoutStager stages={stages} />;
}
