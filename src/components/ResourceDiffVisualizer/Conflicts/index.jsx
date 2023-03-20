import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import CollapsableContainer from '../../CollapsableContainer';
import ConflictsDiffViewer from '../ConflictsDiffViewer';

const useStyles = makeStyles(theme => ({
  conflictsContainer: {
    margin: theme.spacing(1),
  },
}));

const Title = () => <Typography variant="body2"> Conflicts </Typography>;

export default function Conflicts({ conflicts }) {
  const classes = useStyles();

  if (!conflicts || !conflicts.length) return null;

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
