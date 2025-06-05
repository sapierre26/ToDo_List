# ToDo_List

Our goal is to create an intelligent and user-friendly task manager that integrates scheduling, task prioritization, and accessibility features. The app will help you stay organized with the following things implemented:
* To-do lists and being able to add and edit tasks in a list
* A calendar with a monthly, weekly, and daily spread where the added tasks will show up
* The ability to import an existing Google Calendar

## Coverage Report
Backend Coverage:

![Screenshot 2025-06-03 213649](https://github.com/user-attachments/assets/32c5aa32-9963-4168-8ce1-35ded7d48947)
## Scripts
* ```npm run dev``` Runs the development environment. This command is directory-specific (```frontend```, ```backend```). Make sure you're inside the right folder before running (```root``` does not have this command)
* ```npm run frontend``` Runs the development environment for the ``````frontend`````` in the ```root``` directory
* ```npm run backend``` Runs the development environment for the ``````backend`````` in the ```root``` directory
* ```npm lint``` Runs ```npx eslint .``` and ```npx prettier --check .``` for style consistency
* ```npm test``` Runs the jest testing environment (```npx jest .```)
* ```npm coverage``` Runs the testing environment with coverage report
* ```npm cypress:open``` Interactive Mode (for development & debugging): Opens the Cypress Test Runner UI. Allows you to select and run tests manually.
* ```npm cypress:run``` Headless Mode (for CI/CD or quick test runs): Runs all Cypress tests in headless mode. Useful for automated pipelines or terminal-only environments.
## Documentation
Team Working Assignment Document: https://docs.google.com/document/d/12NjnEgPSOmpVu56uZIuCb53jyZ99UWaMm9Lu1AdEbWU/edit?usp=sharing

Sprint Board Document: https://docs.google.com/document/d/1EuGFNywdZJTTFh7VyRTGtWEyB5mIP70XYuMmySDh4VY/edit?usp=sharing

User Stories Document: https://docs.google.com/document/d/1cIqnjSwBhxDVmm45L2qkwcy-lWUdCtKKlJM8IxcCPoI/edit?usp=sharing

Figma Prototype: https://www.figma.com/proto/QYPiya3v1P8lSo0FcDLt9V/CSC-308---To-Do?node-id=0-1&t=sp7B4i0P9r6X3j5t-1

UML Class Diagram: https://miro.com/welcomeonboard/YXgzL01wR1JOUUcvdmZ4K3dSSjhmNXJlY3VoYnhWdnRjVkxkdVNjS1dMRUpPdENMVm10THdrUDJPZTNodkhOdkZBWTJBZ041Vzk2WDNPRTQ5cy9tbFBheU5hcnlJWW8wZXVKYmdwcnZpNFFBeTJlMWk2NjQ0SGtQdVlNUXlnSUxBd044SHFHaVlWYWk0d3NxeHNmeG9BPT0hdjE=?share_link_id=753068150604

UML Activity Diagram: https://miro.com/welcomeonboard/QzEyck55c1RIRWJWaHlOUU8vbkpjalVXRjJWS2FnWkE3N2pUaG9IUUVlb21tb1NNbldkbW8rWGlISVAwTkU5RkMwTysvWHk4M3pIZTF0ZTVSdk5LbGZheU5hcnlJWW8wZXVKYmdwcnZpNFQ1ZGt0cXZnZEl3b0NSblF0Nkg4NnB0R2lncW1vRmFBVnlLcVJzTmdFdlNRPT0hdjE=?share_link_id=679095093147

User Personas: https://www.canva.com/design/DAGgyBEa9AY/rUvEakiSPpsgSXwGkHJLnQ/edit?utm_content=DAGgyBEa9AY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

Tech Spec Draft: https://docs.google.com/document/d/1hWV5syOu-bb61XjBpSeayaNnQos67DJc28cS4TUjJbg/edit?usp=sharing

Style Guide: We are using React/JavaScript. So we chose to install Prettier and added that to ESLint, to keep our code style consistent throughout our project.
