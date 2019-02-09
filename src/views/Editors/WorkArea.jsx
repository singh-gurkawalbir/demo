import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import CodeEditor from '../../components/CodeEditor';
import sampleData from './sampleData';

@hot(module)
@withStyles(theme => ({
  paper: {
    padding: `${theme.spacing.double}px`,
  },
  rawDataContainer: {
    height: '25vh',
  },
  caption: {
    marginTop: `${theme.spacing.unit * 2}px`,
  },
  title: {
    marginBottom: `${theme.spacing.unit}px`,
  },
  rawDataTitleBar: {
    display: 'flex',
  },
  titleBarItem: {
    flex: 'auto',
  },
  sampleType: {
    float: 'right',
    paddingBottom: `${theme.spacing.unit}px`,
  },
}))
export default class WorkArea extends Component {
  state = {
    sampleType: 'xml1',
  };

  componentDidMount() {
    const { sampleType } = this.state;
    const { onChange } = this.props;

    onChange(sampleData[sampleType].data);
  }

  handleChange = event => {
    const { onChange } = this.props;
    const sampleType = event.target.value;

    this.setState({ sampleType });
    onChange(sampleData[sampleType].data);
  };

  render() {
    const { rawData, onChange, classes } = this.props;
    const { sampleType } = this.state;
    const { mode } = sampleData[sampleType];

    return (
      <Fragment>
        <Typography className={classes.title} variant="h5">
          Editor Playground!!!
        </Typography>

        <Paper className={classes.paper}>
          <Typography variant="body1">
            Click on any editor in the left margin to launch it. The raw data
            below will be used as the input.
          </Typography>

          <div className={classes.rawDataTitleBar}>
            <div className={classes.titleBarItem}>
              <Typography
                color="textSecondary"
                className={classes.caption}
                variant="caption">
                RAW DATA
              </Typography>
            </div>
            <div className={classes.titleBarItem}>
              <FormControl className={classes.sampleType}>
                <Select
                  value={this.state.sampleType}
                  onChange={this.handleChange}
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
            />
          </div>
        </Paper>
      </Fragment>
    );
  }
}
