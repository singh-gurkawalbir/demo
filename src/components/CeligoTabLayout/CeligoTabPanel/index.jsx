import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import { useTabContext } from '../CeligoTabWrapper';

const useStyles = makeStyles(theme => ({
  tabPanel: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    background: theme.palette.background.paper,
    padding: theme.spacing(1),
    marginTop: theme.spacing(-2),
  },
}));
export default function CeligoTabPanel(props) {
  const { children, panelId } = props;
  const classes = useStyles();
  const tabsContext = useTabContext();
  const {activeTab} = tabsContext;

  if (activeTab !== panelId) return null;

  return (
    <div className={classes.tabPanel}>
      { children }
    </div>
  );
}

CeligoTabPanel.propTypes = {
  children: PropTypes.node,
  panelId: PropTypes.any.isRequired,
};
