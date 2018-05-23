import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

@hot(module)
@withStyles(theme => ({
  root: {
    margin: theme.spacing.quad,
  },
}))
export default class Dashboard extends Component {
  render() {
    return (
      <div className={this.props.classes.root}>
        <Button
          variant="raised"
          color="secondary"
          component={Link}
          to="/pipelines">
          Create a Data Pipe
        </Button>

        <Button
          variant="raised"
          color="secondary"
          component={Link}
          to="/exports">
          List your Exports
        </Button>
      </div>
    );
  }
}
