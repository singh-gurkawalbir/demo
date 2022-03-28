import {
  AccordionSummary,
  Typography,
  AccordionDetails,
  Accordion,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import React, { useState } from 'react';
import ExpandMoreIcon from '../../icons/ArrowDownIcon';
import CeligoTable from '../../CeligoTable';

const useStyles = makeStyles(theme => ({
  accordianDetails: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
  },
  accordianWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    marginBottom: theme.spacing(2),
  },
  noDataMessage: {
    padding: theme.spacing(1),
  },
}));
export default function DynaCeligoTable(props) {
  const classes = useStyles();
  const { title, collapsable = false, defaultExpand = false, data, noDataMessage, isTitleBold } = props;
  const [shouldExpand, setShouldExpand] = useState(defaultExpand);

  return collapsable ? (
    <Accordion
      elevation={0}
      square
      className={classes.accordianWrapper}
      // eslint-disable-next-line react/no-array-index-key
      expanded={shouldExpand}>
      <AccordionSummary
        data-test={title}
        onClick={() => setShouldExpand(expand => !expand)}
        expandIcon={<ExpandMoreIcon />}>
        <Typography variant={isTitleBold ? 'h6' : ''}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordianDetails}>
        {(!data?.length && noDataMessage) ? <Typography className={classes.noDataMessage}>{noDataMessage}</Typography> : <CeligoTable {...props} />}
      </AccordionDetails>
    </Accordion>
  ) : (
    <CeligoTable {...props} />
  );
}
