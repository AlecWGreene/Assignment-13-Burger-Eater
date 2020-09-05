# Design Document

## Abstract

### goals
- use MVC
- colorful interface
- use simple Animation/Graphics

### challenges
- Keep file and code structure readable
- Maintaining efficient design  
- Use unit testing

### Strategy
- Begin with the unit test files after outlining UX/UI
- Use bootstrap and mysql to deploy to heroku and Nodemon to build the UI
- Prerender graphics as much as possible

## Bonus
- Theme chooser
- Nested burger creation
- Score algorithm

## UX and UI Design

### User Experience

User Logs In
    │
    │
    │
    ├─ User is presented with burger creation
    │           │
    │           │
    │           ├─ User modifies the burger by adding or removing toppings
    │           │
    │           │
    │           └─ User saves or deletes the burger by selecting the buttoms 
    │
    │
    └─ User can select previously constructed burgers by pressing arrows 

    

### User Interface





## File Outline

### Directory

│└ ├ ─ ┌

│
│
│
│
└──

**Parent Directory**
├── config
│   ├── connection.js
│   └── orm.js
│ 
├── controllers
│   └── burgers_controller.js
│
├── db
│   ├── schema.sql
│   └── seeds.sql
│
├── models
│   └── burger.js
│ 
├── node_modules
│ 
├── package.json
│
├── public
│   └── assets
│       ├── css
│       │   └── burger_style.css
│       └── img
│           └── burger.png
│   
│
├── server.js
│
└── views
    ├── index.handlebars
    └── layouts
        └── main.handlebars

### Code Outline

