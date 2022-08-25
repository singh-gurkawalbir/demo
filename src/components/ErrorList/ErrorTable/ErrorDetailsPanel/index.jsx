import React, {
// useCallback,
// useEffect,
// useMemo,
// useState
} from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import {
//   useRouteMatch,
//   useHistory,
//   matchPath,
//   useLocation,
// } from 'react-router-dom';
// import RightDrawer from '../../../drawer/Right';
// import DrawerHeader from '../../../drawer/Right/DrawerHeader';
import ErrorDetails from './ErrorDetails';
// import { selectors } from '../../../../reducers';
// import actions from '../../../../actions';

export default function ErrorDetailsPanel({ flowId, resourceId, isResolved }) {
  return (
    <ErrorDetails
      flowId={flowId}
      resourceId={resourceId}
      isResolved={isResolved}
    />
  );
}
