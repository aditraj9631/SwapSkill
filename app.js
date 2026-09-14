const express=require("express");
const app= express();
const mysql=require("mysql2/promise");
const path=require("path");
const ejsMate=require("ejs-mate");
const { error } = require("console");
const { name } = require("ejs");
const session= require('express-session');

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



// Session middleware
app.use(session({
    secret: "ScreatKey",
    resave: false,
    saveUninitialized:false,
    cookie: {maxAge:1000*60*60}   //Here time become 60min
}))
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
        console.log(user[0].User_Id);

        // Session
        req.session.user={
            id: user[0].User_Id,
            name: user[0].Name,
            email: user[0].Email_Id
        }

        if(user.length>0){
            //Password check
            if(user[0].Password==password){

                
                        // Completing profile
                q2=`Select * from user_skill where User_Id=?`;
                console.log("User.id", req.session.user.id);
                const [userSkill]= await conn.query(q2, [req.session.user.id]);

                console.log("From userskill: ",userSkill)
                if(userSkill.length===0){
                    res.redirect("complete-profile");
                }
                else{
                    res.redirect("/dashboard");
                }
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


        console.log("Below session: ",user[0].User_Id);
        



    
        


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



// Dashboard
app.get("/dashboard", (req,res)=>{
    // const{name}= req.body'
    // console.log(name)
    console.log("From dashboard",req.session.user);
    if(!req.session.user){
        return res.redirect("login");
    }
    res.render("Dashboard.ejs",{
        user: req.session.user
    });
})


// complete-profile route
app.get("/complete-profile", async(req,res)=>{
    
    let q="Select * from skills";
    const [skills]= await conn.query(q);
    const SkillName=[];
    for(let i of skills){
        SkillName.push(i.skill_name);
        
    }

    console.log("Skill Array",SkillName);
    console.log("From complete profile",skills);
    res.render("complete-profile.ejs",{skills});
})



// Complete Profile Route

app.post("/complete-profile", async (req, res) => {

    try {

        // Check login
        if (!req.session.user) {
            return res.redirect("/login");
        }


        // Get data from form
        let {
            learnSkills,
            teachSkills,
            level,
            experience
        } = req.body;


        // Get logged-in user's ID
        const userId = req.session.user.id;


        console.log("Learn Skills:", learnSkills);
        console.log("Teach Skills:", teachSkills);
        console.log("Level:", level);
        console.log("Experience:", experience);
        console.log("User:", userId);


        // Convert single value into array
        // This is useful if only one skill is selected.

        if (!Array.isArray(learnSkills)) {

            learnSkills = learnSkills
                ? [learnSkills]
                : [];

        }


        if (!Array.isArray(teachSkills)) {

            teachSkills = teachSkills
                ? [teachSkills]
                : [];

        }


        // At least one skill should be selected
        if (
            learnSkills.length === 0 &&
            teachSkills.length === 0
        ) {

            return res.render("complete-profile.ejs", {
                error: "Please select at least one skill."
            });

        }


        // Insert Learn Skills
        for (const skillId of learnSkills) {

            const query = `
                INSERT INTO user_skill
                (skill_id, User_Id, type, level, experience)
                VALUES (?, ?, ?, ?, ?)
            `;

            await conn.query(query, [
                skillId,
                userId,
                "learn",
                level,
                experience
            ]);

        }


        // Insert Teach Skills
        for (const skillId of teachSkills) {

            const query = `
                INSERT INTO user_skill
                (skill_id, User_Id, type, level, experience)
                VALUES (?, ?, ?, ?, ?)
            `;

            await conn.query(query, [
                skillId,
                userId,
                "teach",
                level,
                experience
            ]);

        }


        // Everything successfully inserted
        return res.redirect("/dashboard");


    } catch (err) {

        console.log(err);

        return res.render("complete-profile.ejs", {
            error: "Unable to save your skills."
        });

    }

});


app.listen(8080, (req, res)=>{
    console.log("Server is running on port 8080")
});