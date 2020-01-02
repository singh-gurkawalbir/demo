import { useEffect, useState } from 'react';
import {
  Typography,
  Divider,
  IconButton,
  Select,
  makeStyles,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@material-ui/core';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ArrowBackIcon from '../../components/icons/ArrowLeftIcon';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';

const useStyles = makeStyles(() => ({
  content: {
    padding: '20px',
  },
}));

export default function CategoryMapping() {
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [amazonAttributeFilter, setAmazonAttributeFilter] = useState('all');
  const [fieldMappingsFilter, setFieldMappingsFilter] = useState('mapped');
  const { integrationId, flowId } = match.params;
  const [requestedMetadata, setRequestedMetadata] = useState(false);
  const integrationName = useSelector(state => {
    const integration = selectors.resource(
      state,
      'integrations',
      integrationId
    );

    return integration ? integration.name : null;
  });
  const handleBackClick = () => {
    history.goBack();
  };

  const metadata = useSelector(state =>
    selectors.categoryMapping(state, integrationId, flowId)
  );
  const handleAmzonAttributeChange = val => {
    setAmazonAttributeFilter(val);
  };

  const handleFieldMappingsFilterChange = val => {
    setFieldMappingsFilter(val);
  };

  useEffect(() => {
    if (!metadata && !requestedMetadata) {
      dispatch(
        actions.integrationApp.settings.requestCategoryMappingMetadata(
          integrationId,
          flowId
        )
      );
      setRequestedMetadata(true);
    }
  }, [dispatch, flowId, integrationId, metadata, requestedMetadata]);

  if (!integrationName) {
    return <LoadResources required resources="integrations" />;
  }

  return (
    <div className={classes.content}>
      <Typography variant="h3">{integrationName}</Typography>
      <Divider />
      <div>
        <IconButton data-test="back" onClick={handleBackClick} size="medium">
          <ArrowBackIcon fontSize="inherit" />
        </IconButton>
        Go Back to Settings
      </div>
      <Grid container>
        <Grid item xs>
          <Typography variant="h4">Product Mappings</Typography>
        </Grid>
        <Grid item xs>
          <FormControl className={classes.formControl}>
            <InputLabel>Amazon Attributes</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Amazon Attributes"
              value={amazonAttributeFilter || 'all'}
              onChange={handleAmzonAttributeChange}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="required">Required</MenuItem>
              <MenuItem value="preferred">Preferred</MenuItem>
              <MenuItem value="conditional">Conditional</MenuItem>
            </Select>
          </FormControl>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="sometext"
            value={fieldMappingsFilter}
            onChange={handleFieldMappingsFilterChange}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="mapped">Mapped</MenuItem>
            <MenuItem value="unmapped">Unmapped</MenuItem>
          </Select>
        </Grid>
      </Grid>
    </div>
  );
}
