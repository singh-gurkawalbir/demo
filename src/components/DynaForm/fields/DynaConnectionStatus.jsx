// import { useEffect, useState, useMemo } from 'react';
// import { makeStyles } from '@material-ui/styles';
// import { useSelector, useDispatch } from 'react-redux';
// import * as selectors from '../../../reducers';
// import actions from '../../../actions';
// import { Typography } from '@material-ui/core';
// import getRoutePath from '../../../utils/routePaths';
// import Button from '@material-ui/core/Button';
// import WarningIcon from '../../icons/WarningIcon';
// import ErrorIcon from '../../icons/ErrorIcon';
// import SuccessIcon from '../../icons/SuccessIcon';
// import { PING_STATES } from '../../../reducers/comms/ping';

// const useStyles = makeStyles(theme => ({
//   contentWrapper: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     border: '1px solid #ffa10d',

//     // justifyContent: 'space-between',
//     // marginTop: theme.spacing(3),
//     // paddingLeft: theme.spacing(2),
//   },
//   warningIcon: {
//     color: theme.palette.warning.main,
//     marginTop: 'auto',
//     marginBottom: 'auto',
//   },
//   content: {
//     display: 'flex',
//     marginBottom: theme.spacing(1),
//     '&:before': {
//       content: '""',
//       width: '3px',
//       height: '100%',
//       position: 'absolute',
//       background: theme.palette.warning.main,
//       left: '0px',
//     },

//     // width: '90%',
//     // padding: [[0, 10, 0, 10]],
//     // clear: 'both',
//     // height: theme.spacing(8),
//     // overflowY: 'auto',
//   },
//   link: {
//     color: theme.palette.text.secondary,
//     '& > button': {
//       color: theme.palette.primary.main,
//     },
//   },
//   // fixConnectionBtn: {
//   //   color: theme.palette.primary.main,
//   // },
// }));

// export default function DynaConnectionStatus(props) {
//   console.log('props', props);
//   const { connectionId } = props;
//   const dispatch = useDispatch();
//   const classes = useStyles();

//   // console.log('history', history);
//   // useEffect(() => {
//   //   dispatch(actions.resource.connections.pingAndUpdate(resourceId));
//   // }, [dispatch, resourceId]);

//   // const connStatus = useSelector(state =>
//   //   selectors.connectionStatus(state, resourceId)
//   // );
//   const connectionOffline = useSelector(
//     state => selectors.connectionStatus(state, connectionId).offline
//   );

//   console.log('connectionOffline', connectionOffline);
//   const testConnectionStatus = useSelector(
//     state => selectors.testConnectionCommState(state, connectionId).commState
//   );

//   console.log('connectionRequestStatus', connectionOffline);
//   console.log('testConnectionStatus', testConnectionStatus);

//   const showConnectionOffline =
//     connectionOffline &&
//     (!testConnectionStatus ||
//       testConnectionStatus === PING_STATES.requestStatus);
//   const pingError = testConnectionStatus === PING_STATES.ERROR;
//   const pingSuccess = testConnectionStatus === PING_STATES.SUCCESS;

//   // console.log('st', st);

//   // const connectionOffline = useSelector(
//   //   state => selectors.connectionStatus(state, resourceId).offline
//   // );
//   // const connectionRequestStatus = useSelector(
//   //   state => selectors.connectionStatus(state, resourceId).requestStatus
//   // );

//   // console.log('connectionOffline', connectionOffline);
//   // console.log('connectionRequestStatus', connectionRequestStatus);

//   // if (
//   //   !connectionOffline ||
//   //   !connectionRequestStatus ||
//   //   connectionRequestStatus === 'failed' ||
//   //   connectionRequestStatus === 'requested'
//   // ) {
//   //   return null;
//   // }
//   // /connections/edit/${connectionId}

//   return (
//     <div className={classes.contentWrapper}>
//       {showConnectionOffline && (
//         <div>
//           <ErrorIcon className={classes.warningIcon} />
//           <div className={classes.content}>
//             <Typography variant="h6">
//               Review and test this form to bring your connections back online.
//             </Typography>
//           </div>
//         </div>
//       )}

//       {pingError && (
//         <div>
//           <ErrorIcon className={classes.warningIcon} />
//           <div className={classes.content}>
//             <Typography variant="h6">
//               Your test was not successful. Check your information and try again
//             </Typography>
//           </div>
//         </div>
//       )}
//       {pingSuccess && (
//         <div>
//           <SuccessIcon className={classes.warningIcon} />
//           <div className={classes.content}>
//             <Typography variant="h6">
//               Your connection is working great! Nice Job!
//             </Typography>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
