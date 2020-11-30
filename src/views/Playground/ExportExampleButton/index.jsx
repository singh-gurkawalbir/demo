import React from 'react';
import { useSelector } from 'react-redux';
import { Button, makeStyles } from '@material-ui/core';
import { selectors } from '../../../reducers';

const useStyles = makeStyles(theme => ({
  exportButton: {
    marginRight: theme.spacing(1),
  },
}));

const emptyObj = {};

export default function ExportExampleButton({ editorId }) {
  const classes = useStyles();
  const canExport = useSelector(state => {
    if (!editorId) return false;

    const { developer, email = '' } = selectors.userProfile(state);

    return (developer && email.endsWith('celigo.com'));
  });

  const {rule, data} = useSelector(state => canExport
    ? selectors._editor(state, editorId)
    : emptyObj);

  const handleClick = () => console.log({rule, data});

  // only Celigo developers can use this feature (currently).
  if (!canExport) return null;

  return (
    <Button
      className={classes.exportButton}
      onClick={handleClick}
      variant="text">
      Export example
    </Button>
  );
}
