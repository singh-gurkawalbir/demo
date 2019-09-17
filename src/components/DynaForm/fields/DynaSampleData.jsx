import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import CodeEditor from '../../CodeEditor';
import * as selectors from '../../../reducers';

const useStyles = makeStyles(() => ({
  container: {
    height: '25vh',
    width: '80%',
  },
}));

export default function DynaSampleData(props) {
  const classes = useStyles();
  const { label, mode, resourceId, id, onFieldChange } = props;
  const [isSampleDataSet, setIsSampleDataSet] = useState(false);
  // Fetches sample data from the state
  const { data: sampleData } = useSelector(state =>
    selectors.getResourceSampleDataWithStatus(state, resourceId, 'sample')
  );

  useEffect(() => {
    if (!isSampleDataSet && sampleData) {
      setIsSampleDataSet(true);
      onFieldChange(id, sampleData);
    }
  }, [id, isSampleDataSet, onFieldChange, sampleData]);

  return (
    <div>
      <Typography>{label}</Typography>
      <div className={classes.container}>
        <CodeEditor
          name="sampleData"
          value={sampleData}
          mode={mode || 'json'}
          readOnly
        />
      </div>
    </div>
  );
}
