import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import JsonContent from '../../JsonContent';
import { safeParse } from '../../../utils/string';
import { HTTP_STAGES } from '../../../utils/exportPanel';
import CodeEditor from '../../CodeEditor2';

const useStyles = makeStyles(theme => ({
  sampleDataWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    background: theme.palette.background.paper,
    padding: theme.spacing(1),
    marginTop: -18,
  },

  sampleDataContainer: {
    minHeight: theme.spacing(20),
    marginTop: theme.spacing(2),
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    height: 345,
    overflow: 'auto',
    color: theme.palette.text.primary,
    '& > div': {
      wordBreak: 'break-word',
    },
  },

  error: {
    position: 'relative',
    top: theme.spacing(2),
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

  return (
    <div className={classes.sampleDataWrapper}>
      <div className={classes.sampleDataContainer}>
        {
          showDefaultErrorMessage
            ? <span className={classes.error}> { DEFAULT_ERROR } </span>
            // : <JsonContent json={error} />
            : (
              <CodeEditor
                value={error}
                mode="json"
                readOnly
                showGutter={false}
        />
            )
        }

      </div>
    </div>
  );
}
