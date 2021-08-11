import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextToggle from '../../TextToggle';
import { useTabContext } from '../CeligoTabWrapper';

const useStyles = makeStyles(theme => ({
  textToggleContainer: {
    textAlign: 'center',
    position: 'relative',
  },
  toggleButtons: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    padding: 0,
    borderColor: theme.palette.secondary.lightest,
    maxWidth: '100%',
    '& > button': {
      height: 30,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      padding: theme.spacing(0, 5),
      '&:first-child': {
        borderRadius: props => props.tabs?.length > 1 ? [[24, 0, 0, 24]] : 'none',
      },
      '&:last-child': {
        height: 30,
        padding: theme.spacing(0, 5),
        borderTopRightRadius: '24px !important',
        borderBottomRightRadius: '24px !important',
      },
      '&.Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
        },
      },
      '&:not(:first-child)': {
        borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
        borderRadius: 0,
      },
      '&:hover': {
        background: theme.palette.background.paper2,
      },
    },
  },
}));

export default function CeligoPillTabs(props) {
  const { tabs, defaultTab, dataPublic } = props;
  const classes = useStyles(props);
  const {activeTab, setActiveTab} = useTabContext();

  useEffect(() => {
    setActiveTab(defaultTab || tabs?.[0]?.value);
  }, [defaultTab, tabs, setActiveTab]);

  if (!tabs?.length) {
    return null;
  }

  return (
    <div className={classes.textToggleContainer}>
      <TextToggle
        data-public={!!dataPublic}
        value={activeTab}
        className={classes.toggleButtons}
        onChange={setActiveTab}
        exclusive
        options={tabs}
      />
    </div>
  );
}

