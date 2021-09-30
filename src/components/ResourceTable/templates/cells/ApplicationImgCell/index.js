import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import {ToggleButtonGroup} from '@material-ui/lab';
import { connectorsList } from '../../../../../constants/applications';
import ApplicationImg from '../../../../icons/ApplicationImg';
import RemoveMargin from '../../../flows/cells/RemoveMargin';

const useStyles = makeStyles(theme => ({
  img: {
    maxWidth: '70px',
    padding: theme.spacing(0, 1),
    verticalAlign: 'middle',
  },
  optionImg: {
    verticalAlign: 'middle',
  },
  toggleImgs: {
    border: '1px solid',
    margin: theme.spacing(1, 0),
    borderColor: theme.palette.secondary.lightest,
    '& > .MuiToggleButtonGroup-groupedHorizontal': {
      borderColor: theme.palette.secondary.lightest,
      padding: theme.spacing(0.5),
    },
  },

}));

export default function ApplicationImgCell({ applications }) {
  const classes = useStyles();
  const connectors = connectorsList();

  // we are rendering max of 4 logos as of now
  const apps = applications.slice(0, 4).map(application => {
    const connector = connectors.find(connector => connector.value === application);

    if (!connector) {
      // eslint-disable-next-line no-console
      console.warn('Invalid application', application);

      return null;
    }
    const { value, type, icon} = connector;

    return (
      <div key={value}>
        <span className={classes.optionImg}>
          <ApplicationImg
            markOnly
            type={type === 'webhook' ? value : type}
            assistant={icon}
            className={classes.img}
          />
        </span>
      </div>
    );
  });

  return (
    <RemoveMargin>
      <ToggleButtonGroup size="small" className={classes.toggleImgs}>
        {apps}
      </ToggleButtonGroup>
    </RemoveMargin>
  );
}
