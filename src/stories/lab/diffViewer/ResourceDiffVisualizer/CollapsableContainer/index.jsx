import {
  AccordionSummary,
  Typography,
  AccordionDetails,
  Accordion,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState, useEffect } from 'react';
import ExpandMoreIcon from '../../../../../components/icons/ArrowDownIcon';

const useStyles = makeStyles(theme => ({
  accordionDetails: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    display: 'block',
  },
  accordionWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    marginBottom: theme.spacing(2),
  },
}));

export default function CollapsableContainer(props) {
  const classes = useStyles();
  const { title, forceExpand = false, children } = props;
  const [shouldExpand, setShouldExpand] = useState(forceExpand);

  useEffect(() => {
    setShouldExpand(forceExpand);
  }, [forceExpand]);

  if (!children) return null;

  return (
    <Accordion
      elevation={0}
      square
      className={classes.accordionWrapper}
      expanded={shouldExpand}>
      <AccordionSummary
        data-test={title}
        onClick={() => setShouldExpand(expand => !expand)}
        expandIcon={<ExpandMoreIcon />}>
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
