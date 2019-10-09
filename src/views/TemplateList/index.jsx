import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import shortid from 'shortid';
import { makeStyles } from '@material-ui/core/styles';
import CeligoPageBar from '../../components/CeligoPageBar';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import CeligoTable from '../../components/CeligoTable';
import ResourceDrawer from '../../components/drawer/Resource';
import ShowMoreDrawer from '../../components/drawer/ShowMore';
import KeywordSearch from '../../components/KeywordSearch';
import IconTextButton from '../../components/IconTextButton';
import AddIcon from '../../components/icons/AddIcon';
import GenerateZipDialog from './GenerateZipDialog';
import infoText from '../ResourceList/infoText';
import metadata from './metadata';
import CheckPermissions from '../../components/CheckPermissions';
import { PERMISSIONS } from '../../utils/constants';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));

export default function TemplateList(props) {
  const { location } = props;
  const defaultFilter = { take: 3 };
  const classes = useStyles();
  const filter =
    useSelector(state => selectors.filter(state, 'templates')) || defaultFilter;
  const list = useSelector(state =>
    selectors.resourceListWithPermissions(state, {
      type: 'templates',
      ...filter,
    })
  );
  const [showGenerateZipDialog, setShowGenerateZipDialog] = useState(false);

  return (
    <Fragment>
      <CheckPermissions
        permission={
          PERMISSIONS && PERMISSIONS.templates && PERMISSIONS.templates.view
        }>
        <ResourceDrawer {...props} />
        {showGenerateZipDialog && (
          <GenerateZipDialog
            data-test="closeGenerateTemplateZipDialog"
            onClose={() => setShowGenerateZipDialog(false)}
          />
        )}
        <CeligoPageBar title="Templates" infoText={infoText.templates}>
          <div className={classes.actions}>
            <IconTextButton
              data-test="generateTemplateZip"
              onClick={() => setShowGenerateZipDialog(true)}
              variant="text">
              Generate Template Zip
            </IconTextButton>
            <KeywordSearch
              filterKey="templates"
              defaultFilter={defaultFilter}
            />
            <IconTextButton
              data-test="addNewTemplate"
              component={Link}
              to={`${
                location.pathname
              }/add/templates/new-${shortid.generate()}`}
              variant="text"
              color="primary">
              <AddIcon /> New Template
            </IconTextButton>
          </div>
        </CeligoPageBar>
        <div className={classes.resultContainer}>
          <LoadResources required resources={['templates', 'integrations']}>
            <CeligoTable
              data={list.resources}
              filterKey="templates"
              {...metadata}
              actionProps={{ resourceType: 'templates' }}
            />
          </LoadResources>
        </div>
        <ShowMoreDrawer
          filterKey="templates"
          count={list.count}
          maxCount={list.filtered}
        />
      </CheckPermissions>
    </Fragment>
  );
}
