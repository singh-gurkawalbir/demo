import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { safeParse } from '../../../utils/string';
import { HTTP_STAGES } from '../../../utils/exportPanel';
import DefaultPanel from '../../CeligoTabLayout/CustomPanels/DefaultPanel';

const useStyles = makeStyles(theme => ({
  error: {
    marginTop: theme.spacing(4),
    color: theme.palette.error.main,
  },
}));

const DEFAULT_ERROR = 'No data to show - application responded with an error';

export default function ErrorPanel(props) {
  const { resourceSampleData, availablePreviewStages } = props;
  const classes = useStyles();
  const showDefaultErrorMessage = availablePreviewStages === HTTP_STAGES;
  const error = useMemo(() => {
    const sampleDataError = resourceSampleData.error;
    const errorObj = sampleDataError[0];

    errorObj.message = safeParse(errorObj.message);

    return errorObj;
  }, [resourceSampleData.error]);

  if (showDefaultErrorMessage) {
    return <span className={classes.error}> { DEFAULT_ERROR } </span>;
  }

  return <DefaultPanel value={error} />;
}
