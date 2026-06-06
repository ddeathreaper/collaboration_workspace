# **Collaboration Workspace**



**A real-time collaborative development platform featuring a shared virtual Whiteboard (with shapes and synchronized sticky notes) and a live Code Editor. Built with the MERN stack (MongoDB, Express, Vanilla JS, Node.js) and powered by WebSockets via Socket.io for instant, real-time sync across connected room peers.**







### **Features**

* User Authentication: Secure signup and login powered by JWT (JSON Web Tokens) and password hashing with bcrypt.



* Persistent Custom Rooms: Create specialized working rooms using preferred programming languages or join existing rooms instantly with an alphanumeric Room ID and private password.



* Real-Time Collaborative Whiteboard: \* Smooth freehand pencil drawing tool.



&#x09;Geometric shape tools (Rectangles and Circles).



&#x09;Draggable sticky notes with multi-user text synchronization.



* Synchronized Code Space: Live-updating plain-text editor with automatic cursor caret memory management during updates.



* Reliable Auto-Save Pipelines: Automated background HTTP state synchronization to save canvas memory data URLs, sticky array elements, and editor values to MongoDB.





### **Project Structure**



**Collaboration\_Workspace/**

**├── Backend/**

**│   ├── controller/**

**│   │   ├── roomController.js**

**│   │   ├── userController.js**

**│   │   └── whiteBoardController.js**

**│   ├── models/**

**│   │   ├── room.js**

**│   │   ├── user.js**

**│   │   └── whiteboard.js**

**│   ├── routes/**

**│   │   ├── roomRoutes.js**

**│   │   ├── userRoutes.js**

**│   │   └── whiteboardRoutes.js**

**│   ├── app.js**

**│   └── socket.js**

**└── Frontend/**

&#x20;   **├── createRoom.css**

&#x20;   **├── createRoom.html**

&#x20;   **├── createRoom.js**

&#x20;   **├── login.css**

&#x20;   **├── login.html**

&#x20;   **├── login.js**

&#x20;   **├── room.css**

&#x20;   **├── room.html**

&#x20;   **├── room.js**

&#x20;   **├── signinRoom.css**

&#x20;   **├── signinRoom.html**

&#x20;   **├── signinRoom.js**

&#x20;   **├── signup.css**

&#x20;   **├── signup.html**

&#x20;   **└── signup.js**









### **Tech Stack**



###### **Frontend:**



Vanilla HTML5, CSS3, JavaScript (ES6+), Axios, FontAwesome Icons.



###### **Backend:**



Node.js, Express.js.



###### **Database \& ODM:**

MongoDB, Mongoose.



###### **Real-time Communication:**

Socket.io (WebSocket framework).



###### **Security:**

JSON Web Tokens (JWT), Bcrypt.





### **Installation \& Setup**



###### **Prerequisites**



&#x09;Node.js installed locally.

&#x09;A running MongoDB instance (Local MongoDB Community Server or MongoDB Atlas Cloud 	URI).



###### **1. Backend Configuration**

Navigate into the backend folder, install required packages, and configure environment properties:

&#x09;cd Backend

&#x09;npm install

Create a file named .env in the root of the Backend/ directory and add the following config keys:

&#x09;PORT=3000

&#x09;MONGO\_URI=your\_mongodb\_connection\_string

&#x09;JWT\_SECRET\_KEY=your\_highly\_secure\_jwt\_token\_secret



Start the server engine:

&#x09;node app.js



###### **2. Frontend Launch**



Because the client is built using pure native vanilla JavaScript modules, you do not need a compiler.



Simply open your project directory using any standard static file generator or IDE extension (such as VS Code's Live Server).



Launch login.html or signup.html in your web browser to enter the system application loop.









### **API Endpoints Reference**



###### **User Routes (/user)**



POST /user/addUser - Register a fresh workspace account profile.



POST /user/verifyUser - Log in a user and exchange valid credentials for an authentication session token.



###### **Room Routes (/room)**



POST /room/createRoom - Initialize a room instance linked to a default programming language asset channel.



POST /room/verifyRoom - Validate private access passwords to get an encrypted room authorization access payload.



GET /room/getRoomId - Retrieve structural profile metadata matching the active headers token.



POST /room/saveWhiteboard - Persist canvas memory maps and active stickies array arrays directly to the DB.



GET /room/loadWhiteboard - Gather baseline setup layout states immediately when loading panels.



POST /room/saveCode - Save current code in the code editor.



GET /room/loadCode - Retrieve the code content saved in the database for the room.







### **WebSockets Communication Pipelines**



Socket events are managed modularly in socket.js to avoid cluttering core application configurations:



joinRoom:- Registers the active network stream inside a specific roomId container.



sendCanvas:- Dispatches active canvas drawing strings out across peers.



receiveCanvas:- Redraws image canvas segments locally onto listening clients.



sendNotes:- Broadcasts an array containing modified sticky element coordinate arrays.



receiveNotes:- Clears out old layouts locally and updates stickies structures cleanly.



sendCode:- Dispatches active workspace keystrokes to connected peers.



receiveCode:- Mirrors incoming code text on remote screens, preserving typing focus.



