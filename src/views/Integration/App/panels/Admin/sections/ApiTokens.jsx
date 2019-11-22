// import { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
// import { Typography } from '@material-ui/core';
// import PanelHeader from '../../../../common/PanelHeader';

export default function ApiTokenSection() {
  // TODO: My guess is that we want to render the access tokens within the IA admin
  // panel like all other admin panels. Redirecting to the resource list view since
  // this is exactly what the /connector/ IA code does.
  return <Redirect to="/pg/accessTokens" />;
}
