
# Task Manager

- This is a simple Taskmanager web application that allows users to add, edit, and delete tasks.

## Hosted Link
[Click Here](http://bit.ly/42TdWR8)

## Video 
<a  href="https://www.youtube.com/watch?v=88LoXGQiGZg">
            <img src="https://cdn-icons-png.flaticon.com/512/400/400425.png" alt="video" height="60px" width="70px">
</a>


## How to setup Project 
### Clone the latest Repository
`git clone https://github.com/raj0811/taskmanagernodejs`
`cd taskmanagernodejs`

##### Installing NPM dependencies

`npm install`
`npm install passport`
`npm install nodemon`

##### Then simply start your app

`npm start`

#### The Server should now be running at http://localhost/

### Technology I  used
- Nodejs
- Express 
- mongoDB
- Passport js

# Some Features of my Web application

- Authentication :- User have to Login first to use app
- Flexibility  :- User can Create update and Delete his     task
- seprate data :- seprate task for seprate user user will see only his tasked(logged in user)

## Special Features

- As you can see Password will be stored after encryption(hashing)

![Alt text](https://i.ibb.co/mTX446y/ss1.png "Optional title")


## Folder Structure


├── controllers/ <br>
│   ├── taskController.js <br>
│   └── userController.js <br>
├── models/ <br>
│   ├── task.js <br>
│   └── user.js <br>
├── routes/ <br>
│   ├── taskRoutes.js <br>
│   └── userRoutes.js <br>
├── utils/ <br>
│   ├── auth.js <br>
│   └── error.js <br>
├── .env.example <br>
├── .gitignore <br>
├── app.js <br>
├── package.json <br>
├── README.md <br>
└── server.js <br>

 