import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Spinner from '../../../../../../../components/Spinner';
import FilledButton from '../../../../../../../components/Buttons/FilledButton';
import ButtonWithTooltip from '../../../../../../../components/Buttons/ButtonWithTooltip';
import { selectors } from '../../../../../../../reducers';

export default function ParentUpgradeButton(props) {
  const {
    id,
    className,
    onClick,
    nextPlan,
  } = props;
  const [isInProgress, setIsInProgress] = useState(false);
  const status = useSelector(state => selectors.getStatus(state, id)?.status);

  useEffect(() => {
    if (status === 'inProgress') {
      setIsInProgress(status);
    } else {
      setIsInProgress(false);
    }
  }, [status]);

  // Next all the logic for upgrade button will be written
  if (isInProgress) {
    return (
      <Spinner centerAll size="small">Upgrading...</Spinner>
    );
  }

  return (
    <ButtonWithTooltip
      tooltipProps={{title: `Upgrade to a ${nextPlan} plan`}}
    >
      <FilledButton
        className={className}
        onClick={onClick}>
        Upgrade
      </FilledButton>
    </ButtonWithTooltip>
  );
}
