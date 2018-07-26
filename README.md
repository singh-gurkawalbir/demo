# integrator-ui
This project currently holds a demo React App that uses session based authentication against a seperate running instance of integrator.io. This has only been tested with a local IO instance running under localhost.io:5000. With some minor configuration changes, it probabyl would work for any instance such as staging or prod.

Only minor configuration is needed to get this project to run.

Please add a file called ".env" into the root of your local copy of this project with the following content:

```
APP_NAME = "integrator.io Playground"
API_ENDPOINT = "http://localhost.io:5000"
API_EMAIL = "[IO account username]"
API_PASSWORD = "[IO account pwd]"

```
Currently this ui project does not support CSRF tokens. To enable API calls to a local running instance of IO, make sure to set the following env var in the development config file:
```
  "IGNORE_CSRF_IN_DEV": true
```

>Feel free to add and new pages in the "/src/views" folder, just please fork this repo and raise PRs for code review as we do with the other integrator repos.
