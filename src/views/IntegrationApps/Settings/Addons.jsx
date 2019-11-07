import { Fragment } from 'react';
import AddOnsList from '../../../components/AddOnsList';
import CeligoPageBar from '../../../components/CeligoPageBar';

export default function Marketplace(props) {
  const { integrationId } = props.match.params;

  return (
    <Fragment>
      <CeligoPageBar title="Add-ons - Customize and Extend Your Integration Apps" />
      <AddOnsList integrationId={integrationId} />
    </Fragment>
  );
}
