import {
  AccordionSummary,
  Typography,
  AccordionDetails,
  Accordion,
} from '@material-ui/core';
import React, { useState } from 'react';
import ExpandMoreIcon from '../../icons/ArrowDownIcon';
import CeligoTable from '../../CeligoTable';

export default function DynaCeligoTable(props) {
  const { title, collapsable = false, defaultExpand = false } = props;
  const [shouldExpand, setShouldExpand] = useState(defaultExpand);

  return collapsable ? (
    <Accordion
      elevation={0}
      square
      // eslint-disable-next-line react/no-array-index-key
      expanded={shouldExpand}>
      <AccordionSummary
        data-test={title}
        onClick={() => setShouldExpand(expand => !expand)}
        expandIcon={<ExpandMoreIcon />}>
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <CeligoTable {...props} />
      </AccordionDetails>
    </Accordion>
  ) : (
    <CeligoTable {...props} />
  );
}
