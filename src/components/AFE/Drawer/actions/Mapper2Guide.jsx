import React from 'react';
import { useSelector } from 'react-redux';
import CeligoDivider from '../../../CeligoDivider';
import { TextButton } from '../../../Buttons';
import InfoIcon from '../../../icons/InfoIcon';
import {selectors} from '../../../../reducers';

const anchorProps = {
  component: 'a',
  target: '_blank',
  href: 'https://docs.celigo.com/hc/en-us/articles/4536629083035-Mapper-2-0',
};

export default function Mapper2Guide({ editorId }) {
  const hideGuide = useSelector(state => {
    const {resourceId} = selectors.editor(state, editorId);
    const mappingVersion = selectors.mappingVersion(state);

    if (mappingVersion !== 2) return true;

    return selectors.resourceHasMappings(state, resourceId);
  });

  if (hideGuide) return null;

  return (
    <>
      <TextButton
        {...anchorProps}
        data-test="mapper2Guide"
        color="primary"
        startIcon={<InfoIcon />}>
        Mapper 2.0 advantages
      </TextButton>
      <CeligoDivider position="right" />
    </>
  );
}
