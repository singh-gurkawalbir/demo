import React from 'react';
import CeligoDivider from '../../../CeligoDivider';
import IconTextButton from '../../../IconTextButton';

// TODO: We need a new icon for this guide.
import Icon from '../../../icons/HelpCenterIcon';

export default function HandlebarGuide() {
  return (
    <>
      <IconTextButton variant="text"><Icon />Handlebar guide</IconTextButton>

      <CeligoDivider position="right" />
    </>
  );
}
