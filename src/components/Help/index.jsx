import React, { useCallback } from 'react';
import { Help } from '@celigo/fuse-ui';
import { useDispatch } from 'react-redux';
import retry from '../../utils/retry';
import actions from '../../actions';

let _helpTextMap = {};

export function getHelpTextMap() {
  return _helpTextMap;
}

retry(() => import(/* webpackChunkName: "HelpTextMap", webpackPreload: true */ './helpTextMap').then(({ default: tm }) => {
  _helpTextMap = tm || {};
}).catch(() => {}));

export default function HelpWrapper({ fieldId, resourceType, helpKey, helpText, supportFeedback = true, title, ...rest }) {
  const id = fieldId || helpKey || title;
  const dispatch = useDispatch();
  const onHelpfulClick = useCallback(() => {
    dispatch(actions.app.postFeedback(resourceType, id, true));
  }, [dispatch, id, resourceType]);
  const onSupportFeedback = useCallback(feedback => {
    dispatch(
      actions.app.postFeedback(resourceType, id, false, feedback)
    );
  }, [dispatch, id, resourceType]);

  return (
    <Help
      {...rest}
      title={title}
      text={helpText || getHelpTextMap()[helpKey]}
      supportFeedback={supportFeedback}
      onHelpfulClick={onHelpfulClick}
      onFeedbackSubmit={onSupportFeedback}
      sx={{
        ml: 0.5,
        width: theme => theme.spacing(3),
        height: theme => theme.spacing(3),
      }}
    />
  );
}
