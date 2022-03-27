import React, { useCallback } from 'react';
// import { useSelector, shallowEqual } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
// import { useDispatch } from 'react-flow-renderer';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import DrawerFooter from '../../drawer/Right/DrawerFooter';
// import actions from '../../../actions';
// import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
// import { selectors } from '../../../reducers';
import { FilledButton } from '../../Buttons';
import CodePanel from '../../AFE/Editor/panels/Code';

const useStyles = makeStyles(theme => ({
  helpTextButton: {
    padding: 0,
  },
  appLogo: {
    paddingRight: theme.spacing(2),
    borderRight: `1px solid ${theme.palette.secondary.lightest}`,
  },
  titleHeader: {
    '& > h4': {
      marginRight: `${theme.spacing(-0.5)}px !important`,
    },
  },
}));

function RouterWrappedContent({ handleClose }) {
  const classes = useStyles();
  //   const dispatch = useDispatch();

  //   useEffect(() => {
  //     dispatch(actions.resourceFormSampleData.request(formKey, { refreshCache: true }));
  //   }, [dispatch, formKey]);
  //   const availablePreviewStages = useSelector(state =>
  //     selectors.getAvailableResourcePreviewStages(state, resourceId, resourceType, flowId),
  //   shallowEqual
  //   );
  //   const previewStages = useMemo(() => availablePreviewStages.map(({value}) => value), [availablePreviewStages]);

  //   const previewStageDataList = useSelectorMemo(selectors.mkPreviewStageDataList, resourceId, previewStages);

  return (
    <>
      <DrawerHeader title="Edit mock input" helpKey="import.editMockInput" hideBackButton className={classes.titleHeader} />
      <DrawerContent noPadding >
        <CodePanel
          name="data"
          mode="json"
    />
      </DrawerContent>
      <DrawerFooter>
        <FilledButton
          data-test="saveandcloseinputdata"
          onClick={handleClose}>
          Done
        </FilledButton>
      </DrawerFooter>
    </>
  );
}

export default function MockInput({formKey, resourceId, resourceType, flowId}) {
  const history = useHistory();
  const match = useRouteMatch();

  const handleClose = useCallback(() => {
    if (history.length > 2) {
      history.goBack();
    } else {
      history.replace(match.url);
    }
  }, [history, match.url]);

  return (
    <RightDrawer
      path="inputData"
      variant="permanent"
      height="tall"
      width="medium"
      onClose={handleClose} >
      <RouterWrappedContent
        formKey={formKey} resourceId={resourceId} resourceType={resourceType} flowId={flowId}
        handleClose={handleClose} />
    </RightDrawer>
  );
}
