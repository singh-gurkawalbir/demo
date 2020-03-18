// import { useEffect, useState, useMemo } from 'react';
// import { makeStyles } from '@material-ui/styles';
// import { useSelector, useDispatch } from 'react-redux';
// import * as selectors from '../../../reducers';
// import actions from '../../../actions';
// import { Typography } from '@material-ui/core';
// import {
//   Link,
//   useRouteMatch,
//   useHistory,
//   Route,
//   useLocation,
// } from 'react-router-dom';
// import getRoutePath from '../../../utils/routePaths';
// import Button from '@material-ui/core/Button';
// import WarningIcon from '../../icons/WarningIcon';

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
// const CONN_OFFLINE_TEXT =
//   'The connection associated with this export is currently offline and configuration is limited';

// export default function DynaConnectionOffline(props) {
//   // console.log('props', props);
//   const { resourceId, resourceType } = props;
//   const connectionId = useSelector(state => {
//     const { merged: resource } = selectors.resourceData(
//       state,
//       resourceType,
//       resourceId
//     );

//     return resource._connectionId;
//   });

//   console.log('connectionId fetched ', connectionId);
//   const dispatch = useDispatch();
//   const classes = useStyles();
//   const match = useRouteMatch();
//   const history = useHistory();

//   // console.log('match', match);
//   // console.log('history', history);
//   useEffect(() => {
//     dispatch(actions.resource.connections.pingAndUpdate(connectionId));
//   }, [connectionId, dispatch]);

//   // const con = useSelector(state =>
//   //   selectors.connectionStatus(state, connectionId)
//   // );
//   const connectionOffline = useSelector(
//     state => selectors.connectionStatus(state, connectionId).offline
//   );
//   // const connectionRequestStatus = useSelector(
//   //   state => selectors.connectionStatus(state, connectionId).requestStatus
//   // );

//   // console.log('con', con);
//   // const connectionOfflineStatus = useSelector(
//   //   state => selectors.connectionStatus(state, connectionId).offline
//   // );
//   // const connectionRequestStatus = useSelector(
//   //   state => selectors.connectionStatus(state, connectionId).requestStatus
//   // );

//   // console.log('connectionRequestStatus', connectionRequestStatus);
//   // console.log('connectionOfflineStatus', connectionOfflineStatus);

//   if (!connectionOffline) {
//     return null;
//   }

//   // /connections/edit/${connectionId}
//   const handleClick = () => {
//     history.push(
//       `${match.path.split(':')[0]}edit/connections/${connectionId}?ebola=true`
//     );
//   };

//   return (
//     <div className={classes.contentWrapper}>
//       <WarningIcon className={classes.warningIcon} />
//       <div className={classes.content}>
//         <Typography variant="h6">{CONN_OFFLINE_TEXT}</Typography>
//         <Typography variant="h6">
//           {/* <Link */}
//           {/* to={`${history.location.pathname}/edit/connections/${connectionId}`}> */}
//           <Button
//             data-test="fixConnection"
//             size="small"
//             className={classes.fixConnectionBtn}
//             onClick={handleClick}>
//             Fix your connection
//           </Button>
//           to bring it back online
//           {/* </Link> */}
//         </Typography>
//       </div>
//     </div>
//   );
// }
