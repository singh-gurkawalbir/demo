import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Paper } from '@material-ui/core';
import CodeEditor from '../../components/CodeEditor2';

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
}))
export default class WorkArea extends Component {
  render() {
    const { rawData, onChange, classes } = this.props;

    return (
      <Fragment>
        <Typography className={classes.title} variant="h5">
          Processor Playground
        </Typography>
        <Paper className={classes.paper}>
          <Typography variant="body1">
            Click on a processor in the left margin to launch it. The raw data
            below will be used as the input.
          </Typography>
          <Typography
            color="textSecondary"
            className={classes.caption}
            variant="caption">
            RAW DATA
          </Typography>
          <div className={classes.rawDataContainer}>
            <CodeEditor
              name="rawData"
              value={rawData}
              mode="json"
              onChange={onChange}
            />
          </div>
        </Paper>
      </Fragment>
    );
  }
}
