import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Tooltip, Chip, Zoom } from '@material-ui/core';
import Truncate from 'react-truncate';
import ApplicationImg from '../../components/icons/ApplicationImg';

const useStyles = makeStyles(theme => ({
  description: {
    height: '120px',
    overflowY: 'auto',
    margin: theme.spacing(1, 0, 1, 0),
    fontSize: 15,
  },
  name: {
    marginTop: theme.spacing(2),
  },
  floatRight: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(3),
  },
}));

export default function ConnectorTemplateContent({ resource, application }) {
  const { name, description, free, applications } = resource;
  const classes = useStyles();
  const [isTruncated, setIsTruncated] = useState(false);
  let assistant = applications.length >= 2 && application === applications[0]
    ? applications[1]
    : applications[0];

  // Slight hack here. Both Magento1 and magento2 use same applicationId 'magento', but we need to show different images.
  if (name.indexOf('Magento 1') !== -1 && assistant === 'magento') {
    assistant = 'magento1';
  }

  return (
    <>
      <div className={classes.content}>

        <Typography className={classes.name} variant="root">
          {isTruncated ? (
            <Tooltip
              title={<span className={classes.tooltipNameFB}> {name}</span>}
              TransitionComponent={Zoom}
              placement="top"
              enterDelay={100}>
              <Truncate lines={2} ellipsis="..." onTruncate={setIsTruncated}>
                {name}
              </Truncate>
            </Tooltip>
          ) : (
            <Truncate lines={2} ellipsis="..." onTruncate={setIsTruncated}>
              {name}
            </Truncate>
          )}
        </Typography>
        <div>
          <ApplicationImg
            assistant={assistant}
            size="medium"
        />
          {!free && (
          <Chip
            variant="outlined"
            color="primary"
            size="small"
            label="Free"
            className={classes.floatRight}
          />
          )}
        </div>

        <Typography variant="body2" className={classes.description}>
          {description}
        </Typography>
      </div>
    </>
  );
}
