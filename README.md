
# integrator-ui
This respository hosts the codebase for the Integrator Frontend.

**Folder Structure**
- ```src``` - Contains the codebase for the development code.
- ```build``` - Contains the codebase for the deployment code.
- ```src/components``` - Handles components of the Project.
- ```src/actions``` - Contains redux actions of the Project.
- ```src/constants``` - Contains all the constants details of the Project.
- ```src/forms``` - Contains forms of the Project.
- ```src/hooks``` - Contains all the hooks of the Project.
- ```src/reducers``` - Contains all the reducers of the Project.
- ```src/sagas``` - Contains all the sagas and api calls of the Project.
- ```src/store``` - Initialization of redux store.
- ```src/stories``` - Contains all the storybook stories of the Project.
- ```src/theme``` - Contains all the theming configuration of the Project.
- ```src/utils``` - Contains all the utility functions of the Project.
- ```src/views``` - Contains all the views of the Project.



**Prerequisites**
- ```Node - v14.18.1``` - Cross-platform runtime environment for developing server-side and networking applications.
   - Link: https://nodejs.org/download/release/v14.18.1/
- ```YARN``` - Used to handle packages.
- ```Travis CI`` - Used to handle PR test running and storybook deployment.

**Dependencies**
- ```Material-UI``` - Material UI is an open-source React component library that implements Google's Material Design.
    - Link: https://v4.mui.com/getting-started/installation/
- ```Redux``` - Redux is a predictable state container for JavaScript apps.
    - Link: https://redux.js.org/introduction/getting-started
- ```Redux-Saga``` - An intuitive Redux side effect manager.
    - Link: https://redux-saga.js.org/docs/introduction/GettingStarted
- ```React Router``` - React Router DOM enables you to implement dynamic routing in a web app.
    - Link: https://reactrouter.com/en/main
- ```StoryBook``` - Storybook is a development environment tool that is used as a playground for UI components.
    - Link: https://storybook.js.org/docs/ember/get-started/introduction
- ```Jest``` - JavaScript testing framework designed to ensure correctness of any JavaScript codebase
    - Link: https://jestjs.io/docs/27.x/getting-started
    


**Prerequisite Steps to Perform for initial Repo Setup**
- Install Homebrew in Mac 
    - Link: https://brew.sh/
- Install npm n package
    - run brew install n
    - run the command to install node 14.18.1 `n 14.18.1`
- For Configuration
    - Please duplicate the `.env.sample` file locally and rename the copy to `.env`.
    - This UI project can be configured to either run against a local instance of the integrator.io API, 
      or directly hit staging/prod APIs. By default, the .env file is setup to run against the Staging 
      environment (api.staging.integrator.io). Simply by changing the API endpoint, you can
      target a different environment. No other configuration is needed. Happy coding!


**Starting Local Dev Server**
- Run ``$yarn install`` inside the root directory (First time only)
- Run ``$yarn start``

**Running test cases**
- Run ``$yarn test`` inside the root directory

**Starting Documentation Server**
- Run ``$yarn storybook``

**Build**
- Run ``$yarn build``

**Further Reading**

