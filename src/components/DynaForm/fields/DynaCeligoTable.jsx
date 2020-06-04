import {
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  ExpansionPanel,
} from '@material-ui/core';
import React, { useState } from 'react';
import ExpandMoreIcon from '../../icons/ArrowDownIcon';
import CeligoTable from '../../CeligoTable';

export default function DynaCeligoTable(props) {
  const { title, collapsable = false } = props;
  const [shouldExpand, setShouldExpand] = useState(false);

  return collapsable ? (
    <ExpansionPanel
      // eslint-disable-next-line react/no-array-index-key
      expanded={shouldExpand}>
      <ExpansionPanelSummary
        data-test={title}
        onClick={() => setShouldExpand(expand => !expand)}
        expandIcon={<ExpandMoreIcon />}>
        <Typography>{title}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <CeligoTable {...props} />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  ) : (
    <CeligoTable {...props} />
  );
}
