import React from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import ActionsIcon from '../../../../icons/ListViewIcon';

export default function ErrorActions({ errorId }) {
  const match = useRouteMatch();

  return <Link to={`${match.url}/error/${errorId}`}><ActionsIcon /></Link>;
}
