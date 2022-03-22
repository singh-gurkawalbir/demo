import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CollapsableContainer from '../CollapsableContainer';
import ConflictsDiffViewer from '../ConflictsDiffViewer';

const useStyles = makeStyles(theme => ({
  conflictsContainer: {
    margin: theme.spacing(1),
  },
}));

export default function Conflicts({ conflicts }) {
  const classes = useStyles();

  if (!conflicts || !conflicts.length) return null;
  const Title = () => <Typography variant="body2"> Conflicts </Typography>;

  return (
    <div className={classes.conflictsContainer}>
      <CollapsableContainer title={<Title />}>
        <ConflictsDiffViewer
          leftTitle="Current"
          rightTitle="Remote"
          conflicts={conflicts} />
      </CollapsableContainer>
    </div>
  );
}
