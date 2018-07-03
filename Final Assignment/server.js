/*********************************************************************************
* WEB322 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Jose Florencio Coelho Neto Student ID: 131650160 Date: 01/04/2018
*
* Online (Heroku) Link: https://serene-caverns-54089.herokuapp.com/
*
********************************************************************************/ 


var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var dserv = require('./data-service.js');
var multer = require("multer");
var fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const exphbs = require('express-handlebars');

app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ extended: true }));

//Middlewares
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
   });


//know how to handle HTML files that are formatted using handlebars
app.engine('.hbs', exphbs({ 
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: 
    {
        //Handlebars Helpers

        navLink: function(url, options){
        return '<li' +
        ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
        '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        }, 
    
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
        }
    
    } }));

app.set('view engine', '.hbs');


const storage = multer.diskStorage({
    destination: "public/image/uploaded",
    filename: function (req, file, cb) {

      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  // tell multer to use the diskStorage function for naming files instead of the default.
  const upload = multer({ storage: storage });


// setup a 'route' to listen on the default url path

///GET ROUTINES
app.get("/", (req, res) => {
    //re.render pass the hbs file
    res.render('home');
});

app.get("/home", (req, res) => {
    res.render('home');
});

app.get("/about", (req, res) => {
    res.render('about');
});

app.get("/employee/add", (req, res) => {

    var dept = dserv.getDepartments();
    dept.then(function(data) {
        if(data.length>0) res.render("addEmployee",{ departments: data });
        else res.render("addEmployee",{ departments: null }); 
        console.log(data);       
    })
    dept.catch (function (error) {
        res.render({message: error});
    });

});

app.get("/department/add", (req, res) => {
    res.render('addDepartment');
});

app.get("/images/add", (req, res) => {
    res.render('addImage');
});

//Quering routes
app.get("/employees", (req, res) => {

    if (req.query.department)
    {
        var emp = dserv.getEmployeesByDepartment(req.query.department);
        emp.then(function(data) {
            if(data.length > 0) res.render("employees",{ employees: data });
            else res.render("employees",{ message: "No results" });
        })
        emp.catch (function (error) {
            res.render({message: error});
        });
    }

    else 
    {   if (req.query.status)
        {
            var emp = dserv.getEmployeesByStatus(req.query.status);
            emp.then(function(data) {
                if(data.length > 0) res.render("employees",{ employees: data });
                else res.render("employees",{ message: "No results" });
            })
            emp.catch (function (error) {
                res.render({message: error});
            });

        }

        else
        {
            if(req.query.manager)
            {
                var emp = dserv.getEmployeesByManager(req.query.manager);
                emp.then(function(data) {
                    if(data.length > 0) res.render("employees",{ employees: data });
                    else res.render("employees",{ message: "No results" });
                })
                emp.catch (function (error) {
                    res.render({message: error});
                });    
            }

            else 
            {

                var emp = dserv.getAllEmployees();
                emp.then(function(data) {
                    if(data.length > 0) res.render("employees",{ employees: data });
                    else res.render("employees",{ message: "No results" });
                })
                emp.catch (function (error) {
                    res.render({message: error});
                });
            }
        }
    }  

});

app.get("/employee/:empNum", (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    
    var emp = dserv.getEmployeesByNum(req.params.empNum);
    emp.then(function(data) {

        if (data) {
            viewData.employee = data; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    })
    emp.catch(() => {
        viewData.employee = null; // set employee to null if there was an error

    }).then(dserv.getDepartments()
            .then((data) => {
            viewData.departments = data; // store department data in the "viewData" object as "departments"

            // loop through viewData.departments and once we have found the departmentId that matches
            // the employee's "department" value, add a "selected" property to the matching
            // viewData.departments object
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                viewData.departments[i].selected = true;
                }
            }
            }).catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
            }).then(() => {
                if (viewData.employee == null) { // if no employee - return an error
                    res.status(404).send("Employee Not Found");
                } 
                else {
                    res.render("employee", { viewData: viewData }); // render the "employee" view
                }
            }).catch (function (error) {
                res.render({message: error});
    })).catch (function (error) {
        res.render({message: error});            
    });
});


app.get("/department/:value", (req, res) => {

    var num = req.params;
    
    var depart = dserv.getDepartmentByID(num.value);
    depart.then(function(data) {
        if(data.length > 0) res.render("department",{ departments: data });
        else res.status(404).send("Department Not Found");
    })
    depart.catch (function (error) {
        res.render({message: error});
    });

});



app.get("/managers", (req, res) => {
    
    var man = dserv.getManagers();
    man.then(function(data) {
        res.send(data);
    })
    man.catch (function (error) {
        res.send(error);
    });

});

app.get("/departments", (req, res) => {

    var dept = dserv.getDepartments();
    dept.then(function(data) {
        if(data.length>0) res.render("departments",{ departments: data });
        else res.render("departments",{ message: "No results" });        
    })
    dept.catch (function (error) {
        res.render({message: error});
    });
    
});


app.get("/images", (req, res) => {

    
    fs.readdir('public/image/uploaded', function(err, items) {

      var array = { 
          images:null 
        };

        array.images = items;
        res.render("images", { data: array });

    });


});


app.get("/employees/delete/:value", (req, res) => {

    var num = req.params;
    
    var emp = dserv.deleteEmployeeByNum(num.value);
    emp = dserv.getAllEmployees();
    emp.then(function(data) {
        if(data.length > 0) res.render("employees",{ employees: data });
        else res.render("employees",{ message: "No results" });
    })
    emp.catch (function (error) {
        res.render({message: error});
    });

});


///POST ROUTINES
//Post images using the upload.single and redirecting to page images
app.post("/images/add", upload.single("imageFile"), (req, res) => {

    const formData = req.body;
    const formFile = req.file;
  
    const dataReceived = "Your submission was received:<br/><br/>" +
      "Your form data was:<br/>" + JSON.stringify(formData) + "<br/><br/>" +
      "Your File data was:<br/>" + JSON.stringify(formFile) +
      "<br/><p>This is the image you sent:<br/><img src='/public/image/uploaded" + formFile.filename + "'/>";
    console.log(dataReceived);
    res.redirect('/images');

  });

  app.post("/employee/add", (req, res) => {

    var addEmp = dserv.addEmployees(req.body);
    addEmp.then(function(data) {
        res.redirect('/employees');
    })
    addEmp.catch (function (error) {
        res.send(error);
    });

  });

  app.post("/employee/update", (req, res) => {

    var updEmp = dserv.updateEmployee(req.body);
    updEmp.then(function(data) {
        res.redirect('/employees');
    })
    updEmp.catch (function (error) {
        res.send(error);
    });

 });

 app.post("/department/add", (req, res) => {

    var addDepart = dserv.addDepartment(req.body);
    addDepart.then(function(data) {
        res.redirect('/departments');
    })
    addDepart.catch (function (error) {
        res.send(error);
    });

  });

  app.post("/department/update", (req, res) => {

    var updDepart = dserv.updateDepartment(req.body);
    updDepart.then(function(data) {
        res.redirect('/departments');
    })
    updDepart.catch (function (error) {
        res.send(error);
    });

 });



// setup http server to listen on HTTP_PORT
var init = dserv.initialize();
init.then(function (fulfilled) {
    app.listen(HTTP_PORT);
});
init.catch (function (error) {
    console.log("Unable to start server");
});

// Console will print the message
console.log("Express http server listening on port: " + HTTP_PORT);



