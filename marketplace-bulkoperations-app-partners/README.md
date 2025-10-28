# marketplace-bulkoperations-app

## Environment Variables

-   `.env` files are required in both ui and api. Rename `.env.example` files to `.env` and add the following values.

-   UI (<APP_DIRECTORY>/ui/.env) ENVIRONMENT VARIABLES 

    ```
    REACT_APP_NAME = 'BulkOperations'
    REACT_APP_API_URL = YOUR BACKEND API URL
    REACT_APP_REGION_MAPPING = '{"NA": {"DOMAIN_URL": "https://app.contentstack.com"},"EU": {"DOMAIN_URL": "https://eu-app.contentstack.com"},"AZURE_NA": {"DOMAIN_URL": "https://azure-na-app.contentstack.com"},"AZURE_EU": {"DOMAIN_URL": "https://azure-eu-app.contentstack.com"},"GCP_NA": {"DOMAIN_URL": "https://gcp-na-app.contentstack.com"}}'
    ```

- API (<APP_DIRECTORY>/api/.env) ENVIRONMENT VARIABLES 

    ```
    STACK_API_KEY = YOUR STACK API KEY
    STACK_MANAGEMENT_TOKEN = YOUR STACK MANAGEMENT TOKEN
    REGION_MAPPING = '{"NA": {"API_URL": "https://api.contentstack.io"},"EU": {"API_URL": "https://eu-api.contentstack.io"},"AZURE_NA": {"API_URL": "https://azure-na-api.contentstack.io"},"AZURE_EU": {"API_URL": "https://azure-eu-api.contentstack.io"},"GCP_NA": {"API_URL": "https://gcp-na-api.contentstack.io"}}'
    ```

## Install Dependencies

-   In the terminal go to APP_DIRECTORY and install the necessary packages :

    ```
    cd <APP_DIRECTORY>
    npm i
    ```

-   To install the necessary packages for ui , navigate to the ui folder
    
    ```
    cd <APP_DIRECTORY>/ui
    npm i
    ```

-   After you install the packages, run the following command in the ui folder to get started:

    - For Linux / MacOS
      
      ```
      npm run start
      ```

    - For Windows
      
      ```
      npm run winStart
      ```

    The UI server will start at port 4000.

-   To install the necessary packages for API , navigate to the api folder

    ```
    cd <APP_DIRECTORY>/api
    npm i
    ```

-   After you install the packages, run the following command in the api folder to start the dev server.

    ```
    npm run dev
    ```

    The API dev server will start at port 8080.

## Creating an app in Developer Hub/Marketplace

-   Go to developer hub at [NA Region](https://app.contentstack.com/#!/developerhub), [EU Region](https://eu-app.contentstack.com/#!/developerhub), [AZURE-NA Region](https://azure-na-app.contentstack.com/#!/developerhub), [AZURE-EU Region](https://azure-eu-app.contentstack.com/#!/developerhub).

-   Create a new app by clicking `+ New App` button at top right and Select app type as `Stack App`, add Name and Description. The app will be initially private. To make an app public on Contextstack Marketplace, refer [App Submission and Approval Guide](https://www.contentstack.com/docs/developers/marketplace-platform-guides/app-submission-and-approval-guide).

-   After creating an app, you will be redirected to the Basic Information page. Add the icon for your app.

-   Open the UI Locations tab and add the URL of your app.
    For e.g. : https://localhost:4000

-   From Available location(s) , add Satck Dashboard Location.

    -   For Satck Dashboard, add path. The value of path is the route added for Satck Dashboard in `<APP_DIRECTORY>/ui/src/containers/App/index.tsx`. Also we are using HashRouter for routing. So the value of path should be `/#/dashboard-widget`.

-   Add ConfigScreen Location.

    -   For ConfigScreen, add path. The value of path is the route added for Satck Dashboard in `<APP_DIRECTORY>/ui/src/containers/App/index.tsx`. Also we are using HashRouter for routing. So the value of path should be `/#/config`.

-   Now install the app by clicking the Install App button at top right. From the next window, select the stack in which you want to install the app.

> Note : You can give any path values but make sure the path value in `<APP_DIRECTORY>/ui/src/containers/App/index.tsx` and in UI location should be the same.

