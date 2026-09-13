const express=require("express");
const app= express();
const mysql=require("mysql2/promise");
const path=require("path");
const ejsMate=require("ejs-mate");
const { error } = require("console");

const conn=mysql.createPool({
    host: 'localhost',
    user: 'root', 
    database: 'SwapSkills',
    password: 'mysql@2006'
})

let q= "Show Tables";

async function checkDatabase() {
    try {

        const [result] = await conn.query(q);

        console.log(result);

    } catch (err) {

        console.log(err);

    }
}

checkDatabase();


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname,"public/css")));
app.use(express.static(path.join(__dirname, "public/js")));
app.engine("ejs", ejsMate);

app.get("/", (req, res)=>{
    res.render("index.ejs");
    // res.send("I am root");
})

// --------------Login Page -------------
// Login Route
app.get("/login",(req, res)=>{
    res.render("login.ejs");
})

app.post("/login", async (req, res)=>{
        let{username, password}= req.body;
        console.log(req.body);
        q="Select * from users where User_Id=?";
        const [user]= await conn.query(q,[username]);

        console.log("From db: ",user);
        if(user.length>0){
            //Password check
            if(user[0].Password==password){
                res.redirect("/")
                console.log("Login Sucessfull")
            }
            else{
                console.log("Password is incorrect!");
                return res.render("login", {error: "Password is incorrect!"});
            }
        }
        else{
            return res.render("login", {error: "Username not found!"});
        }

    


})

// -----------------------------Signup Page--------------------------
// SignUp Route
app.get("/SignUp",(req,res)=>{
    res.render("SignUp.ejs");
})


app.post("/SignUp", async(req, res)=>{
    try {

        // Get form data
        const {
            name,
            email,
            username,
            password
            
        } = req.body;


//  Checking Username Or Email already exist 

       const [existingData] = await conn.query(
            "SELECT * FROM users WHERE User_Id = ? OR Email_Id = ?",
            [username, email]
        );

if(existingData.length>0){
    const User=existingData[0];
    if(User.User_Id== username){
        console.log("User found!")
        return res.render("SignUp", {
            error: "Username already exist!"
        });

        // console.log("User found");
    }
    else{
        console.log("Email found")
        return res.render("SignUp", {
            error:"Email already exist!"});
        // console.log("Email found!");
        }
}

//  Inserting data into in database

        let q= `Insert into users
                    (User_Id, Name, Email_Id, Password)
                    Values(?,?,?,?)`;
        const [result] = await conn.query(
                        q,
                        [username, name, email, password]
                        );
        console.log(result);
        console.log("Sucessfully inserted the data in dbs!");
        


        // Registration successful
        res.redirect("/login");

    } catch (err) {

        console.log(err);

        res.send("Registration failed");

    }
})



app.listen(8080, (req, res)=>{
    console.log("Server is running on port 8080")
});