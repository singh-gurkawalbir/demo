import { useSelector, useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { useState } from 'react';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as selectors from '../../reducers';
import actions from '../../actions';

const useStyles = makeStyles(() => ({
  submit: {
    marginLeft: 'auto',
    marginRight: ' auto',
  },
  textField: {
    flex: 1,
    width: '70%',
  },
}));

function General(props) {
  const classes = useStyles();
  const { match } = props;
  const { integrationId } = match.params;
  const dispatch = useDispatch();
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );
  const [name, setName] = useState(integration && integration.name);
  const [description, setDescription] = useState(
    integration && integration.description
  );
  const [readme, setReadme] = useState(integration && integration.readme);
  const handleOnChangeData = e => {
    if (!e || !e.target) {
      return false;
    }

    if (e.target.id === 'name') {
      setName(e.target.value);
    } else if (e.target.id === 'description') {
      setDescription(e.target.value);
    } else if (e.target.id === 'readme') {
      setReadme(e.target.value);
    }
  };

  const handleOnSubmit = () => {
    const patchSet = [
      {
        op: 'replace',
        path: '/name',
        value: name,
      },
      {
        op: 'replace',
        path: '/description',
        value: description,
      },
      {
        op: 'replace',
        path: '/readme',
        value: readme,
      },
    ];

    dispatch(actions.resource.patchStaged(integrationId, patchSet, 'value'));
    dispatch(
      actions.resource.commitStaged('integrations', integrationId, 'value')
    );
  };

  return (
    <div>
      <div className="form-group">
        <TextField
          id="name"
          label="Name:"
          margin="normal"
          value={name}
          className={classes.textField}
          onChange={handleOnChangeData}
        />
      </div>
      <div>
        <TextField
          id="description"
          label="Description:"
          multiline
          margin="normal"
          value={description}
          className={classes.textField}
          onChange={handleOnChangeData}
        />
      </div>
      <div>
        <TextField
          id="readme"
          label="ReadMe:"
          multiline
          margin="normal"
          value={readme}
          className={classes.textField}
          onChange={handleOnChangeData}
        />
      </div>
      {/* <div>
        <ReactQuill
          label="Readme"
          value={readme}
          id="readme"
          onChange={handleOnChangeData}
          placeholder="Name"
        />
      </div> */}
      <Divider />
      <br />
      <Button variant="contained" color="secondary" onClick={handleOnSubmit}>
        save
      </Button>
    </div>
  );
}

export default General;
