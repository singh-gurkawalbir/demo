import {
  AccordionSummary,
  AccordionDetails,
  Accordion,
} from '@mui/material';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState, useEffect } from 'react';
import ExpandMoreIcon from '../icons/ArrowDownIcon';

const useStyles = makeStyles(theme => ({
  accordionDetails: {
    borderTop: 'none',
    flexDirection: 'column',
    padding: theme.spacing(0, 2, 2),
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
}));

export default function CollapsableContainer(props) {
  const classes = useStyles();
  const { title, forceExpand = false, children, className } = props;
  const [shouldExpand, setShouldExpand] = useState(forceExpand);

  useEffect(() => {
    setShouldExpand(forceExpand);
  }, [forceExpand]);

  if (!children) return null;

  return (
    <Accordion
      elevation={0}
      square
      className={clsx(classes.accordionWrapper, className)}
      expanded={shouldExpand}>
      <AccordionSummary
        className={classes.accordionSummary}
        expandIcon={<ExpandMoreIcon onClick={() => setShouldExpand(expand => !expand)} />}>
        {title}
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
