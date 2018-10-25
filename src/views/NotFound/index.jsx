import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

@hot(module)
export default class NotFound extends Component {
  render() {
    return (
      <Fragment>
        <Typography variant="h4">404: Page not found</Typography>
        <Link to="/">Home</Link>
      </Fragment>
    );
  }
}
