import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/RefreshOutlined';
import { FormContext } from 'react-forms-processor/dist';
import CodeEditor from '../../CodeEditor';
import actions from '../../../actions';
import { getSampleData } from '../../../reducers';

const useStyles = makeStyles(() => ({
  rawDataContainer: {
    height: '25vh',
    width: '80%',
  },
}));

export default function DynaSampleData(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { defaultValue, label, mode, resourceId } = props;
  const rawData = useSelector(state => {
    const exportData = getSampleData(state, resourceId);

    return exportData && exportData.data && exportData.data[0];
  });
  const RefreshData = props => (
    <FormContext.Consumer {...props}>
      {form => (
        <RefreshIcon
          onClick={() => {
            dispatch(
              actions.exportData.fetch(resourceId, 'exports', form.value)
            );
          }}
        />
      )}
    </FormContext.Consumer>
  );

  return (
    <div>
      <Typography>{label || 'Sample Data'}</Typography>
      <div className={classes.rawDataContainer}>
        <CodeEditor
          name="rawData"
          value={rawData || defaultValue}
          mode={mode || 'json'}
          readOnly
        />
        <RefreshData />
      </div>
    </div>
  );
}

/*
rId: [{stage1}, {s2}, {s3}]
*/
