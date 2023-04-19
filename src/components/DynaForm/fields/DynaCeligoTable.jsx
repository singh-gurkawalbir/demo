import {
  AccordionSummary,
  Typography,
  AccordionDetails,
  Accordion,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState } from 'react';
import ExpandMoreIcon from '../../icons/ArrowDownIcon';
import CeligoTable from '../../CeligoTable';
import NoResultTypography from '../../NoResultTypography';

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
        <Typography variant={isTitleBold ? 'h6' : undefined}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordianDetails}>
        {(!data?.length && noDataMessage) ? <NoResultTypography>{noDataMessage}</NoResultTypography> : <CeligoTable {...props} />}
      </AccordionDetails>
    </Accordion>
  ) : (
    <CeligoTable {...props} />
  );
}
