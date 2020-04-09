# Task Management REST API
This is a back-end code repository.  The front-end code repository can be found here: [https://github.com/pgmorgan/task-manager-api-frontend](https://github.com/pgmorgan/task-manager-api-frontend).

This is a full featured Task Management REST API back-end built with Node.js and MongoDB.  Features include:

- Pagination and filtering of server responses to avoid slow page load times.
- Full CRUD features for User and Task instances.
- Hash encryption of passwords and access management with JWT tokens.  
- Restricted user access to CRUD operations based on JWT tokens.

### SETUP INSTRUCTIONS

To use this code you will require an account with [SendGrid](https://signup.sendgrid.com/).  Sign-up is free and no credit card is required to access a free-tier API Key.

Node.js version 12+ and npm must be installed on your machine.  In terminal type the following commands:
```
git clone https://github.com/pgmorgan/task-manager-api.git
cd task-manger-api
sudo npm install
mkdir config
cd config
touch dev.env
vim dev.env
```

Insert the following lines in `dev.env`, replacing all `<content>` with your own information:

```
PORT=<port number>
SGMAIL_EMAIL=<your email address>
MONGODB_URL=<mongodb connection string>
SENDGRID_API_KEY=<api key>
JWT_SECRET=<unique key of your choice to generate JSON web tokens>
```

To run the web server return to the root of the repository and type:
```
npm run dev
```
Alternatively you may name `config/prod.env` or `config/staging.env` and appropriately run the web server with `npm run prod` or `npm run staging`.

### API USAGE

A front-end has been developed for this REST API with Vue.js.  The Front-end code repository can be found here: [https://github.com/pgmorgan/task-manager-api-frontend](https://github.com/pgmorgan/task-manager-api-frontend).  Also, all HTTP requests can be made from software such as [Postman](www.getpostman.com).  Postman is free and exists for all major operating systems.

For feedback or inquiries please contact Peter at petergm@gmail.com

### FRONTEND SCREENSHOTS

##### Screenshot #1

![Screenshot of Task Tracker](img/Screenshot-TaskTracker-App.png?raw=true "Screenshot of TaskTracker App")

##### Screenshot #2
	
![Screenshot of Task Tracker](img/Screenshot-TaskTracker-App-2.png?raw=true "Screenshot of TaskTracker App")
