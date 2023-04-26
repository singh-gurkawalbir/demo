import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import UpArrowIcon from '../../../../components/icons/ArrowUpIcon';
import fieldDefinitions from '../../../../forms/fieldDefinitions';
import FieldDetails from '../FieldDetails';

const useStyles = makeStyles(theme => ({
  details: {
    display: 'block',
    padding: theme.spacing(2),
  },
  summary: {
    borderTop: 'solid 1px #ddd',
    backgroundColor: theme.palette.background.paper2,
    width: '100%',
  },
}));

export default function FieldList() {
  const classes = useStyles();

  return (
    Object.keys(fieldDefinitions).map(resourceType => (
      <Accordion key={resourceType} elevation={0} TransitionProps={{ unmountOnExit: true, timeout: 500 }}>
        <AccordionSummary className={classes.summary} expandIcon={<UpArrowIcon />}>
          <Typography variant="h4">{resourceType}</Typography>
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
    ))
  );
}
