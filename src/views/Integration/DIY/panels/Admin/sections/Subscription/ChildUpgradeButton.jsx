import React, { useState } from 'react';
import Spinner from '../../../../../../../components/Spinner';
import FilledButton from '../../../../../../../components/Buttons/FilledButton';

export default function ChildUpgradeButton() {
  const [isInProgress] = useState(false);
  const [isInQueue] = useState(false);

  // Next all the logic for upgrade button will be written
  if (isInProgress) {
    return (
      <>
        {isInQueue ? (
          <Spinner centerAll size="small">Loading...</Spinner>
        ) : (
          <Spinner centerAll size="small">Loading...</Spinner>
        )}
      </>
    );
  }

  return (
    <FilledButton
      disabled
    >
      Upgrade
    </FilledButton>
  );
}
