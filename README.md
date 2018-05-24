# integrator-ui
This project currently holds a demo React App that uses token based authentication against the integrator.io API. 
Only minor configuration is needed to get this project to run.

Please add a file called ".env" into the root of your local copy of this project with the following content:

```
API_TOKEN = "[your own API token here]"
APP_NAME = "Playground"
API_ENDPOINT = "https://api.staging.integrator.io/v1"
```

These configuration dependencies are temporary and will be removed soon.

>Feel free to add and new pages in the "views" folder, just please fork this repo and raise PRs for code review as we do with the other integrator repos.
