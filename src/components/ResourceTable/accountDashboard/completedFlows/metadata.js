import React from 'react';
// import Retry from '../actions/Retry';
// import Resolve from '../actions/Resolve';
// import ViewErrorDetails from '../actions/ViewErrorDetails';
// import ViewHttpRequest from '../actions/ViewHttpRequest';
// import ViewHttpResponse from '../actions/ViewHttpResponse';
// import EditRetryData from '../actions/EditRetry';
// import DownloadRetryData from '../actions/DownloadRetry';
// import SelectError from '../cells/SelectError';
// import SelectSource from '../cells/SelectSource';
// import SelectDate from '../cells/SelectDate';
// import SelectAllErrors from '../cells/SelectAllErrors';
// import CeligoTimeAgo from '../../../CeligoTimeAgo';
// import TextOverflowCell from '../../../TextOverflowCell';
// import ErrorMessage from '../cells/ErrorMessage';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import NameCell from '../../auditLog/cells/Name';

export default {
  // rowKey: 'errorId',
  useColumns: () => [
    {
      key: 'integrationName',
      heading: 'Integration',
      Value: ({rowData: al}) => {
        const tableContext = useGetTableContext();

        return <NameCell al={{resourceType: 'integration', _resourceId: al._integrationId}} actionProps={tableContext} />;
      },
      width: '10%',
    },
    {
      key: 'flow',
      heading: 'Flow',
      Value: ({rowData: al}) => {
        const tableContext = useGetTableContext();

        return <NameCell al={{resourceType: 'flow', _resourceId: al._flowId}} actionProps={tableContext} />;
      },
      width: '10%',
    },
  ],
  useRowActions: () =>
    []
    // const {actionInProgress} = useGetTableContext();

  // if (actionInProgress) return [];
  // const actions = [
  //   Resolve,
  //   ...(retryDataKey ? [Retry] : []),
  //   ViewErrorDetails,
  //   ...(retryDataKey ? [EditRetryData] : []),
  //   // IO-19304, for errors occuring at FTP bridge, retry data returned will be metadata and not actual retry data,
  //   // hence show download option
  //   ...(retryDataKey && source === 'ftp_bridge' ? [DownloadRetryData] : []),
  // ];

  // if (reqAndResKey) {
  //   actions.push(ViewHttpRequest, ViewHttpResponse);
  // }

  // return actions;
  ,
};

// import TableCell from '@material-ui/core/TableCell';
// import TableRow from '@material-ui/core/TableRow';
// import Checkbox from '@material-ui/core/Checkbox';
// import IconButton from '@material-ui/core/IconButton';
// import { makeStyles } from '@material-ui/core';
// import clsx from 'clsx';
// import React, { } from 'react';
// import { useDispatch } from 'react-redux';

// // import { selectors } from '../../../../reducers';
// import actions from '../../../../actions';
// import { JOB_STATUS } from '../../../../utils/constants';
// import JobStatus from '../../JobStatus';
// import { getPages, getSuccess } from '../../util';
// import JobActionsMenu from './JobActionsMenu';
// // import Spinner from '../Spinner';
// // import ArrowDownIcon from '../icons/ArrowDownIcon';
// // import ArrowUpIcon from '../icons/ArrowUpIcon';
// import DateTimeDisplay from '../../../DateTimeDisplay';
// import ErrorCountCell from '../../ErrorCountCell';
// import NameCell from '../../../ResourceTable/auditLog/cells/Name';
// import { useGetTableContext } from '../../../CeligoTable/TableContext';

// const useStyles = makeStyles(theme => ({
//   checkAction: {
//     listStyle: 'none',
//     padding: 0,
//     margin: 0,
//     display: 'flex',
//     justifyContent: 'flex-start',
//     '& li': {
//       float: 'left',
//       '&:empty': {
//         marginLeft: 22,
//       },
//     },
//   },
//   moreIcon: {
//     padding: 0,
//   },
//   checkIcon: {
//     padding: 0,
//   },
//   name: {
//     width: '18.15%',
//   },
//   status: {
//     width: '10.15%',
//   },
//   success: {
//     width: '9%',
//     textAlign: 'right',
//   },
//   ignore: {
//     width: '7.5%',
//     textAlign: 'right',
//   },
//   error: {
//     width: '10.15%',
//     textAlign: 'right',
//   },
//   errorCount: {
//     color: theme.palette.error.dark,
//   },
//   resolved: {
//     width: '9%',
//     textAlign: 'right',
//   },
//   pages: {
//     width: '7.5%',
//     textAlign: 'right',
//   },
//   duration: {
//     width: '9%',
//     textAlign: 'right',
//   },
//   completed: {
//     width: '11.5%',
//     whiteSpace: 'nowrap',
//   },
//   actions: {
//     width: '7.5%',
//     textAlign: 'center',
//   },
//   checkActionBorder: {
//     paddingLeft: '13px',
//     borderLeft: `5px solid ${theme.palette.primary.main}`,
//   },
// }));

// export default function JobDetail({
//   job,
//   userPermissionsOnIntegration,
//   onViewErrorsClick,
// }) {
//   const classes = useStyles();
//   const dispatch = useDispatch();
//   // const integration = useSelector(state =>
//   //   selectors.resource(state, 'integrations', job._integrationId)
//   // );
//   const tableContext = useGetTableContext();

//   const isJobInProgress = [
//     JOB_STATUS.QUEUED,
//     JOB_STATUS.RUNNING,
//     JOB_STATUS.RETRYING,
//   ].includes(job.uiStatus);

//   function handleViewErrorsClick(showResolved = false) {
//     if (!job.children || job.children.length === 0) {
//       dispatch(actions.job.requestFamily({ jobId: job._id }));
//     }

//     onViewErrorsClick({ jobId: job._id, showResolved, flowId: job._flowId });
//   }

//   // <TableCell className={classes.name}>Integration</TableCell>
//   //               <TableCell className={classes.name}>Flow</TableCell>
//   //               <TableCell className={classes.status}>Status</TableCell>
//   //               <TableCell className={classes.success}>Success</TableCell>
//   //               <TableCell className={classes.ignore}>Ignored</TableCell>
//   //               <TableCell className={classes.error}>Errors</TableCell>
//   //               <TableCell className={classes.resolved}>Resolved</TableCell>
//   //               <TableCell className={classes.pages}>Pages</TableCell>
//   //               <TableCell className={classes.duration}>Duration</TableCell>
//   //               <TableCell className={classes.completed}>Completed</TableCell>
//   //               <TableCell className={classes.actions}>Actions</TableCell>

//   return (
//     <>
//       <TableRow>
//         <TableCell className={classes.name} data-test={job.name || job._flowId}>

//           <NameCell al={{resourceType: 'integration', _resourceId: job._integrationId}} actionProps={tableContext} />
//         </TableCell>
//         <TableCell className={classes.name} data-test={job.name || job._flowId}>
//           <NameCell al={{resourceType: 'flow', _resourceId: job._flowId}} actionProps={tableContext} />
//         </TableCell>
//         <TableCell className={classes.status}>
//           <JobStatus job={job} />
//         </TableCell>
//         <TableCell className={classes.success}>{getSuccess(job)}</TableCell>
//         <TableCell className={classes.ignore}>{job.numIgnore}</TableCell>
//         <ErrorCountCell
//           count={job.numError}
//           isJobInProgress={isJobInProgress}
//           isError
//           onClick={() => handleViewErrorsClick(false)}
//           className={clsx(classes.error, {
//             [classes.errorCount]: job.numError > 0,
//           })}
//            />
//         <ErrorCountCell
//           count={job.numResolved}
//           isJobInProgress={isJobInProgress}
//           onClick={() => handleViewErrorsClick(true)}
//           className={classes.resolved}
//            />
//         <TableCell className={classes.pages}>{getPages(job)}</TableCell>
//         <TableCell className={classes.duration}>{job.duration}</TableCell>
//         <TableCell className={classes.completed}>
//           <DateTimeDisplay dateTime={job.endedAt} />
//         </TableCell>
//         <TableCell className={classes.actions}>
//           <JobActionsMenu
//             job={job}
//             userPermissionsOnIntegration={userPermissionsOnIntegration}
//             integrationName="integrationName"
//           />
//         </TableCell>
//       </TableRow>
//     </>
//   );
// }
