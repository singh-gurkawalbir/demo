import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import TextToggle from '../../TextToggle';
import { useTabContext } from '../CeligoTabWrapper';

const toggleButtonCss = {
  backgroundColor: theme => theme.palette.background.paper,
  border: '1px solid',
  padding: 0,
  borderColor: theme => theme.palette.secondary.lightest,
  maxWidth: '100%',
  '& > button': {
    height: 30,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: theme => theme.spacing(0, 5),
    '&:first-child': {
      borderRadius: props => props.tabs?.length > 1 ? [[24, 0, 0, 24]] : 'none',
    },
    '&:last-child': {
      height: 30,
      padding: theme => theme.spacing(0, 5),
      borderTopRightRadius: '24px !important',
      borderBottomRightRadius: '24px !important',
    },
    '&.Mui-selected': {
      backgroundColor: theme => theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme => theme.palette.primary.light,
      },
    },
    '&:not(:first-child)': {
      borderLeft: theme => `1px solid ${theme.palette.secondary.lightest}`,
      borderRadius: 0,
    },
    '&:hover': {
      background: theme => theme.palette.background.paper2,
    },
  },
};

export default function CeligoPillTabs(props) {
  const { tabs, defaultTab } = props;
  const {activeTab, setActiveTab} = useTabContext();

  useEffect(() => {
    setActiveTab(defaultTab || tabs?.[0]?.value);
  }, [defaultTab, tabs, setActiveTab]);

  if (!tabs?.length) {
    return null;
  }

  return (
    <Box textAlign="center" position="relative">
      <TextToggle
        value={activeTab}
        className={toggleButtonCss}
        onChange={setActiveTab}
        exclusive
        options={tabs}
      />
    </Box>
  );
}

