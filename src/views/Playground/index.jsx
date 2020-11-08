// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import CeligoPageBar from '../../components/CeligoPageBar';

const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function Editors() {
  const classes = useStyles();
  // const history = useHistory();
  // const [editorName, setEditorName] = useState();
  // const [rawData, setRawData] = useState();
  // const [rawDataKey, setRawDataKey] = useState(1);

  return (
    <>
      <CeligoPageBar title="Dev playground" />
      <main className={classes.content}>
        Dev playground
      </main>
    </>
  );
}
