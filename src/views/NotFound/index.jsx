import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

export default function NotFound() {
  return (
    <Fragment>
      <Typography variant="h4">404: Page not found</Typography>
      <Link to="/pg">Home</Link>
    </Fragment>
  );
}
