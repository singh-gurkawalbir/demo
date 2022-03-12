import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import ActionGroup from '../../../ActionGroup';
import { selectors } from '../../../../reducers';

// const useStyles = makeStyles(theme => ({
// //   titleContainer: {
// //     display: 'flex',
// //     justifyContent: 'space-bet'
// //   },
// }));

export default function DiffContainerTitle(props) {
  const { resourceId, action = 'update', resourceType} = props;
  // const classes = useStyles();
  const resourceName = useSelector(state => selectors.resourceName(state, resourceId, resourceType));

  return (
    <>
      <ActionGroup>
        <Typography variant="body2"> {resourceName} </Typography>
        <Typography variant="body2"> Action: {action} </Typography>
      </ActionGroup>
      <ActionGroup position="right">
        <div> References </div>
        <div> Full Screen Icon </div>
      </ActionGroup>
    </>
  );
}
