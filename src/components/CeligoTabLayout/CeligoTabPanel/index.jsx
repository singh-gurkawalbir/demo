import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useTabContext } from '../CeligoTabWrapper';

const useStyles = makeStyles(theme => ({
  tabPanel: {
    flexGrow: 1,
    flexDirection: 'column',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    background: theme.palette.background.paper,
    padding: theme.spacing(1),
    marginTop: -18,
    height: '100%',
    display: 'flex',
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
