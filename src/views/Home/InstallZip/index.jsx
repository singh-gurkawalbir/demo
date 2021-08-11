
import React from 'react';
import {
  Route,
  Switch,

  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import UploadFileDialog from '../../InstallIntegration';

export default function InstallZip() {
  const history = useHistory();

  const match = useRouteMatch();

  return (

    <Switch>
      <Route path={`${match.url}/installZip`}>
        <UploadFileDialog
          data-test="closeGenerateTemplateZipDialog"
          fileType="application/zip"
          history={history}
        // eslint-disable-next-line react/jsx-handler-names
          onClose={history.goBack}
      />
      </Route>
    </Switch>
  );
}
