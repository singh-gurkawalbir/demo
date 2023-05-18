import React from 'react';
import { useSelector } from 'react-redux';
import { TextButton } from '@celigo/fuse-ui';
import CeligoDivider from '../../../CeligoDivider';
import InfoIcon from '../../../icons/InfoIcon';
import {selectors} from '../../../../reducers';

const anchorProps = {
  component: 'a',
  target: '_blank',
  href: 'https://docs.celigo.com/hc/en-us/articles/4536629083035-Mapper-2-0',
};

export default function Mapper2Guide() {
  const showGuide = useSelector(state => selectors.isMapper2Supported(state));

  if (!showGuide) return null;

  return (
    <>
      <TextButton
        {...anchorProps}
        data-test="mapper2Guide"
        color="primary"
        startIcon={<InfoIcon />}>
        Learn about Mapper 2.0
      </TextButton>
      <CeligoDivider position="right" />
    </>
  );
}
