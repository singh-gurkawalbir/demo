import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, makeStyles, Typography } from '@material-ui/core';
import UpArrowIcon from '../../../../components/icons/ArrowUpIcon';
import fieldDefinitions from '../../../../forms/fieldDefinitions';
import FieldDetails from '../FieldDetails';

const useStyles = makeStyles({
  details: {
    display: 'block',
    marginBottom: 8,
  },
});

export default function FormFieldBrowser() {
  const classes = useStyles();

  // console.log(fieldDefinitions);

  return (
    <div className={classes.container}>
      {Object.keys(fieldDefinitions).map(resourceType => (
        <Accordion key={resourceType}>
          <AccordionSummary expandIcon={<UpArrowIcon />}>
            <div className={classes.summary}>
              <Typography variant="subtitle1">{resourceType}</Typography>
            </div>
          </AccordionSummary>

          <AccordionDetails className={classes.details}>
            {Object.keys(fieldDefinitions[resourceType]).map(fieldId => (
              <FieldDetails
                key={fieldId}
                resourceType={resourceType}
                id={fieldId}
                field={fieldDefinitions[resourceType][fieldId]} />
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
