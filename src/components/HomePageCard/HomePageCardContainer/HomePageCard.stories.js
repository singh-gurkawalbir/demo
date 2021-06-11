import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import HomePageCardsContainer from './index';
import CeligoTruncate from '../../CeligoTruncate';
import StatusButton from '../../CeligoButtons/StatusButton';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    maxHeight: `calc(100vh - (${theme.appBarHeight}px + ${theme.spacing(2)}px + ${theme.pageBarHeight}px))`,
    overflowY: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr));',
    gridGap: theme.spacing(2),
    position: 'relative',
    '& > div': {
      maxWidth: '100%',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'repeat(1, minmax(100%, 1fr));',
    },
    [theme.breakpoints.up('xs')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr));',
    },
  },
  wrapper: {
    maxWidth: 300,
  },
//   wrapper: {
//     borderRadius: 4,
//     padding: 22,
//     minHeight: 318,
//     width: '100%',
//     boxSizing: 'border-box',
//     border: '1px solid',
//     borderColor: fade(theme.palette.common.black, 0.1),
//     transitionProperty: 'all',
//     transitionDuration: theme.transitions.duration.short,
//     transitionTimingFunction: theme.transitions.easing.easeIn,
//     overflow: 'hidden',
//     position: 'relative',
//     display: 'inline-block',
//     '&:hover': {
//       transform: 'translateY(-5px)',
//       boxShadow: '0 0 7px rgba(0,0,0,0.1)',
//     },
//     [theme.breakpoints.between('sm', 'md')]: {
//       minWidth: '100%',
//       maxWidth: '100%',
//     },
//   },
}));
export default {
  title: 'HomePageCardsContainer',
  component: HomePageCardsContainer,
//   argTypes: {
//    backgroundColor:
//   },
};

const Template = args => {
  const classes = useStyles();

  return (
    <>
      <HomePageCardsContainer>
        <div className={classes.wrapper}>
          <StatusButton variant="success">
            Success
          </StatusButton>
          <div className={classes.container}>
            <Typography>
              <CeligoTruncate lines={2} {...args}>
                This is long text that should get truncated and a tooltip should display the full text.
                If it does not get truncated or the tooltip doesn&apos;t show up, we have a bug!
              </CeligoTruncate>
            </Typography>
          </div>
        </div>
      </HomePageCardsContainer>
    </>
  );
};

export const Defaults = Template.bind({});

HomePageCardsContainer.defaultProps = {
  ellipsis: '...',
  placement: 'right',
  lines: 2,
  delay: 500,
};
