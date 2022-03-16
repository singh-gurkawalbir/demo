// import { useSelector } from 'react-redux';
import {
  AccordionSummary,
  AccordionDetails,
  Accordion,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import React, { useState } from 'react';
import ExpandMoreIcon from '../../../../../icons/ArrowDownIcon';

const useStyles = makeStyles(theme => ({
  accordionDetails: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    display: 'block',
  },
  accordionSummary: {
    width: '100%',
    cursor: 'default !important',
  },
  accordionWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    marginBottom: theme.spacing(2),
  },
  revisionInfoRow: {
    marginBottom: theme.spacing(2),
  },
}));

export default function RevisionErrorDetails() {
  const classes = useStyles();
  const [shouldExpand, setShouldExpand] = useState(true);

  return (
    <Accordion
      elevation={0}
      square
      className={classes.accordionWrapper}
      expanded={shouldExpand}>
      <AccordionSummary
        className={classes.accordionSummary}
        expandIcon={<ExpandMoreIcon onClick={() => setShouldExpand(expand => !expand)} />}>
        Errors
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        <div> errors </div>
      </AccordionDetails>
    </Accordion>
  );
}
