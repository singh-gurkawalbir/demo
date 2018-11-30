import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import CodeEditor from '../../components/CodeEditor';

const sampleData = {
  json: { id: 123, name: 'Bob', active: true },
  csv: `id,name,active\n123,bob,true`,
  xml: `<user id="123"><name>bob<name><active>true</active></user>`,
};

@hot(module)
@withStyles(theme => ({
  paper: {
    padding: `${theme.spacing.double}px`,
  },
  rawDataContainer: {
    height: '25vh',
  },
  caption: {
    marginTop: `${theme.spacing.unit}px`,
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
  },
}))
export default class WorkArea extends Component {
  state = {
    sampleType: 'json',
  };

  handleChange = event => {
    const { onChange } = this.props;
    const sampleType = event.target.value;

    this.setState({ sampleType });
    onChange(sampleData[sampleType]);
  };
  render() {
    const { rawData, onChange, classes } = this.props;
    const { sampleType } = this.state;
    const mode = sampleType === 'csv' ? 'text' : sampleType;

    return (
      <Fragment>
        <Typography className={classes.title} variant="h5">
          Editor Playground
        </Typography>

        <Paper className={classes.paper}>
          <Typography variant="body1">
            Click on a processor in the left margin to launch it. The raw data
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
                  displayEmpty
                  className={classes.selectEmpty}>
                  <MenuItem value="json">JSON Sample</MenuItem>
                  <MenuItem value="csv">CSV Sample</MenuItem>
                  <MenuItem value="xml">XML Sample</MenuItem>
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
