# ToDo_List

Our goal is to create an intelligent and user-friendly task manager that integrates scheduling, task prioritization, and accessibility features. The app will help you stay organized with the following things implemented:
* To-do lists and being able to add and edit tasks in a list
* A calendar with a monthly, weekly, and daily spread where the added tasks will show up
* The ability to import an existing Google Calendar

## Project Structure

The repo contains both frontend and backend:
- `/frontend`: React frontend app
- `/backend`: Node.js backend API (Express, MongoDB)
- `.env`: Located inside `/backend` directory for local dev

## Scripts
* ```npm run dev``` Runs the development environment. This command is directory-specific (```frontend``` or ```backend```). 
* ```npm run frontend``` Runs the development environment for the ``````frontend`````` in the ```root``` directory
* ```npm run backend``` Runs the development environment for the ``````backend`````` in the ```root``` directory
* ```npm run lint``` Runs ```npx eslint .``` and ```npx prettier --check .``` for style consistency
* ```npm run coverage``` Runs the testing environment with coverage report
* ```npm run cypress:open``` Interactive Mode (for development & debugging)
* ```npm run cypress:run``` Headless Mode (for CI/CD or quick test runs)
*  ```npm test``` Runs the jest testing environment (```npx jest .```)

## Setup for Local Development Environment
1. Clone the entire git repository
2. Run ```npm install``` in the root directory to get all the dependencies
3. Set up environment variables by creating the ```.env``` file in the ```backend``` folder
  ```
  // ./backend/.env file example
  MONGO_URI=your_mongo_uri_here
  userDB=your_user_db_uri_here
  tasksDB=your_tasks_db_uri_here
  TOKEN_SECRET_KEY=your_token_secret
  GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_google_client_secret
  GOOGLE_REDIRECT_URI=http://localhost:8000/api/google-calendar/callback
  SESSION_SECRET=your_session_secret
  ```
4. Setup ```.gitignore``` with the following entries in the ```root``` folder
```
//./.gitignore
node_modules/
.env
.env.*
```
5. VSCode Extensions (Recommended)
   - ESLint
   - Prettier ESLint
   - GituHb Actions (for workflow visualization, optional)
  
## Acceptance Testing

[Acceptance Testing](https://docs.google.com/document/d/1hWV5syOu-bb61XjBpSeayaNnQos67DJc28cS4TUjJbg/edit?tab=t.0)
![image](https://github.com/user-attachments/assets/944b7348-fbb7-4cd0-b8bb-bd2c80b27c9d)
![image](https://github.com/user-attachments/assets/cef07fb1-dad5-4354-a87f-5587984a96df)

## Coverage Report
### Backend Coverage:

![image](https://github.com/user-attachments/assets/2c849978-5ba3-44c2-a307-0397634b84b6)


### Frontend Coverage:

![image](https://github.com/user-attachments/assets/1d520856-de15-4775-84e4-673c43828509)

## Documentation
[Team Working Assignment Document](https://docs.google.com/document/d/12NjnEgPSOmpVu56uZIuCb53jyZ99UWaMm9Lu1AdEbWU/edit?usp=sharing)

[Sprint Board Document](https://docs.google.com/document/d/1EuGFNywdZJTTFh7VyRTGtWEyB5mIP70XYuMmySDh4VY/edit?usp=sharing)

[User Stories Document](https://docs.google.com/document/d/1cIqnjSwBhxDVmm45L2qkwcy-lWUdCtKKlJM8IxcCPoI/edit?usp=sharing)

[Figma Prototype](https://www.figma.com/proto/QYPiya3v1P8lSo0FcDLt9V/CSC-308---To-Do?node-id=0-1&t=sp7B4i0P9r6X3j5t-1)

[UML Class Diagram](https://miro.com/welcomeonboard/YXgzL01wR1JOUUcvdmZ4K3dSSjhmNXJlY3VoYnhWdnRjVkxkdVNjS1dMRUpPdENMVm10THdrUDJPZTNodkhOdkZBWTJBZ041Vzk2WDNPRTQ5cy9tbFBheU5hcnlJWW8wZXVKYmdwcnZpNFFBeTJlMWk2NjQ0SGtQdVlNUXlnSUxBd044SHFHaVlWYWk0d3NxeHNmeG9BPT0hdjE=?share_link_id=753068150604)

[UML Activity Diagram](https://miro.com/welcomeonboard/QzEyck55c1RIRWJWaHlOUU8vbkpjalVXRjJWS2FnWkE3N2pUaG9IUUVlb21tb1NNbldkbW8rWGlISVAwTkU5RkMwTysvWHk4M3pIZTF0ZTVSdk5LbGZheU5hcnlJWW8wZXVKYmdwcnZpNFQ1ZGt0cXZnZEl3b0NSblF0Nkg4NnB0R2lncW1vRmFBVnlLcVJzTmdFdlNRPT0hdjE=?share_link_id=679095093147)

[Use Case Diagram](https://manmeetg2124.atlassian.net/wiki/x/AgAD)

[User Personas](https://www.canva.com/design/DAGgyBEa9AY/rUvEakiSPpsgSXwGkHJLnQ/edit?utm_content=DAGgyBEa9AY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

[Design Specification](https://docs.google.com/document/d/1hWV5syOu-bb61XjBpSeayaNnQos67DJc28cS4TUjJbg/edit?usp=sharing)
## Style
* We are using React/JavaScript. So we chose to install Prettier and added that to ESLint, to keep our code style consistent throughout our project.
