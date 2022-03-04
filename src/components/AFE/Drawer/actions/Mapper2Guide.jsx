import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import CeligoDivider from '../../../CeligoDivider';
import { TextButton } from '../../../Buttons';
import InfoIcon from '../../../icons/InfoIcon';
import {selectors} from '../../../../reducers';

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: '0 !important',
    color: theme.palette.primary.main,
  },
})
);

const anchorProps = {
  component: 'a',
  target: '_blank',
  href: 'https://docs.celigo.com/hc/en-us/articles/360039326071-Handlebars-helper-reference',
};

export default function Mapper2Guide() {
  const classes = useStyles();
  const showGuide = useSelector(state => selectors.isMapper2Supported(state));

  if (!showGuide) return null;

  return (
    <>
      <TextButton
        {...anchorProps}
        className={classes.button}
        startIcon={<InfoIcon />}>
        Learn about Mapper 2.0&apos;s advantages
      </TextButton>
      <CeligoDivider position="right" />
    </>
  );
}
