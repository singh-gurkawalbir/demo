import React, { useState } from 'react';
import { Typography, IconButton } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import ViewReferencesIcon from '../../../../icons/ViewReferencesIcon';
import ReferencesModal from './ReferencesModal';

const useStyles = makeStyles(theme => ({
  container: {
    width: theme.spacing(11),
  },
  icon: {
    marginRight: theme.spacing(0.5),
  },
}));

export default function ViewReferences({ resourceId, resourceType }) {
  const classes = useStyles();
  const [showReferences, setShowReferences] = useState(false);
  const handleClick = () => {
    setShowReferences(showReferences => !showReferences);
  };

  return (
    <>
      <IconButton
        size="small"
        className={classes.container}
        data-test="expandAll"
        onClick={handleClick}>
        <ViewReferencesIcon className={classes.icon} />
        <Typography variant="body2"> References</Typography>
      </IconButton>
      { showReferences && <ReferencesModal resourceId={resourceId} resourceType={resourceType} />}
    </>
  );
}

