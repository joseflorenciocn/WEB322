const Sequelize = require('sequelize');

var sequelize = new Sequelize('d6btthomkh5j0q', 'wskomeqphyujpe', '705bea48d8256abcd61801ccff2c1d448b76eea38c9e51bace6ff6d7baec34cd', {
    host: 'ec2-23-21-121-220.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: true
    }
    });

var employees = sequelize.define('employees', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true, // use "employeeNum" as a primary key
        autoIncrement: true // automatically increment the value
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addresCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
},{
    createdAt: false, // disable createdAt
    updatedAt: false // disable updatedAt
});

var departments = sequelize.define('departments', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true, // use "departmentId " as a primary key
        autoIncrement: true // automatically increment the value
    },
    departmentName: Sequelize.STRING
},{
    createdAt: false, // disable createdAt
    updatedAt: false // disable updatedAt
});


module.exports = {

initialize: function() 
{   
    return new Promise(function (resolve, reject) {

        sequelize.sync()
        .then(function () {
            resolve("Connection to Database was a success!");
        })
        .catch(function () {
            reject("Unable to sync the database"); 
        });  
    });
        
},

getAllEmployees: function () 
{   
    return new Promise(function (resolve, reject) {

        employees.findAll()
        .then(function(data){
           resolve(data);
        })
        .catch(function (error) {
        reject("No results returned");
        });
    });
},

getManagers: function () 
{   
    return new Promise(function (resolve, reject) {
        reject();
        });
},


getDepartments: function () 
{   
    return new Promise(function (resolve, reject) {
        departments.findAll()
        .then(function(data){
            resolve(data);
        })
        .catch(function (error) {
            reject("No results returned");
        });
    });
}, 


addEmployees: function (employeeData)
{
    return new Promise(function (resolve, reject) {

        employeeData.isManager = ((employeeData.isManager) ? true : false)
        
        for (const prop in employeeData) {
            if (employeeData[prop] == "") {employeeData[prop] = null}
        }

        employees.create({

            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addresCity: employeeData.addresCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPosta,
            maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate

            }).then(function () {
                resolve("Employee created with success!");
            }).catch(function () {
                reject("Unable to create Employee com merda"); 
            });  
        });

},

getEmployeesByNum: function (num)
{

    return new Promise(function (resolve, reject) {
        employees.findAll({ 
            where: {
                employeeNum: num
            }
        }).then(function(data){
            resolve(data);
        }).catch(function (error) {
            reject("No results returned");
        });
    });
        
},


getEmployeesByManager: function (manager)
{

    return new Promise(function (resolve, reject) {
        employees.findAll({ 
            where: {
                employeeManagerNum: manager
            }
        }).then(function(data){
            resolve(data);
        }).catch(function (error) {
            reject("No results returned");
        });
    });
},


getEmployeesByDepartment: function (num)
{

    return new Promise(function (resolve, reject) {
        employees.findAll({ 
            where: {
                department: num
            }
        }).then(function(data){
            resolve(data);
        }).catch(function (error) {
            reject("No results returned");
        });
    });

},


getEmployeesByStatus: function (status)
{

    return new Promise(function (resolve, reject) {

        employees.findAll({ 
            where: {
                status: status
            }
        }).then(function(data){
            resolve(data);
        }).catch(function (error) {
            reject("No results returned");
        });
    });

},

updateEmployee: function(employeeData) 
{
    return new Promise(function (resolve, reject) {

        employeeData.isManager = (employeeData.isManager) ? true : false;
        
        for (const prop in employeeData) {
            if (employeeData[prop] == "") {employeeData[prop] = null}
        }

        employees.update({
           
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addresCity: employeeData.addresCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPosta,
            maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate

        }, {

            where: { employeeNum: employeeData.employeeNum } // only update user with employeeNum

        }).then(function () {
            resolve("Employee updated with success!");
        }).catch(function () {
            reject("Unable to update Employee"); 
        });  
    });
},

addDepartment: function (departmentData)
{
    return new Promise(function (resolve, reject) {
        
        for (const prop in departmentData) {
            if (departmentData[prop] == "") {departmentData[prop] = null}
        }

        departments.create({

            departmentName: departmentData.departmentName

            }).then(function () {
                resolve("Department created with success!");
            }).catch(function () {
                reject("Unable to create Department"); 
        });  
    });

},

updateDepartment: function(departmentData) 
{
    return new Promise(function (resolve, reject) {

        for (const prop in departmentData) {
            if (departmentData[prop] == "") {departmentData[prop] = null}
        }

        departments.update({

            departmentName: departmentData.departmentName

            },{

                where: { departmentId: departmentData.departmentId }

            }).then(function () {
                resolve("Department updated with success!");
            }).catch(function () {
                reject("Unable to updated Department"); 
            });  
    });
},

getDepartmentByID: function (num)
{

    return new Promise(function (resolve, reject) {
        departments.findAll({ 
            where: {
                departmentId: num
            }
        }).then(function(data){
            resolve(data);
        }).catch(function (error) {
            reject("No results returned");
        });
    });
        
},

deleteEmployeeByNum: function (num)
{
    return new Promise(function (resolve, reject) {
        employees.destroy({ 
            where: {
                employeeNum: num
            }
        }).then(function(data){
            resolve(data);
        }).catch(function (error) {
            reject("No employees deleted");
        });
    });


}


};
