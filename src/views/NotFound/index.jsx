import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import getRoutePath from '../../utils/routePaths';

export default function NotFound() {
  return (
    <>
      <Typography variant="h4">404: Page not found</Typography>
      <Link to={getRoutePath('')}>Home</Link>
    </>
  );
}
