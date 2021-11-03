import React from 'react';
import { selectors } from '../../../../../reducers';
import LogoStrip from '../../../../LogoStrip';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';

// todo: ashu css

export default function ApplicationsCell({ tile }) {
  const applications = useSelectorMemo(selectors.mkTileApplications, tile);

  return (
    <LogoStrip applications={applications} />
  );
}
