import { Fragment, useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import CodeEditor from '../../components/CodeEditor';
import sampleData from './sampleData';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    height: '100%',
  },
  rawDataContainer: {
    height: 'calc(100% - 84px)',
  },
  caption: {
    marginTop: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  rawDataTitleBar: {
    display: 'flex',
  },
  titleBarItem: {
    flex: 'auto',
  },
  sampleType: {
    float: 'right',
    paddingBottom: theme.spacing(1),
  },
}));

export default function WorkArea({ onChange, rawData }) {
  const classes = useStyles();
  const [sampleType, setSampleType] = useState('json2');
  const handleSampleTypeChange = useCallback(event => {
    setSampleType(event.target.value);
  }, []);

  // any time the sample type changes, we want tp publish this change
  // to the parent (onChange)
  useEffect(() => {
    onChange(sampleData[sampleType].data);
  }, [onChange, sampleType]);

  const { mode } = sampleData[sampleType];

  return (
    <Fragment>
      <Paper className={classes.paper}>
        <Typography variant="body1">
          Click on any editor in the left margin to launch it. The sample data
          below will be used as the input to the editor.
        </Typography>

        <div className={classes.rawDataTitleBar}>
          <div className={classes.titleBarItem}>
            <Typography
              color="textSecondary"
              className={classes.caption}
              variant="caption">
              Sample Data
            </Typography>
          </div>
          <div className={classes.titleBarItem}>
            <FormControl className={classes.sampleType}>
              <Select
                value={sampleType}
                onChange={handleSampleTypeChange}
                displayEmpty>
                {Object.keys(sampleData).map(key => (
                  <MenuItem key={key} value={key}>
                    {sampleData[key].name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        <div className={classes.rawDataContainer}>
          <CodeEditor
            name="rawData"
            value={rawData}
            mode={mode}
            onChange={onChange}
            skipDelay
          />
        </div>
      </Paper>
    </Fragment>
  );
}
