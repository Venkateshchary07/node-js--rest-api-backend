const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = 3000;
const db = require('./db');
const cors = require('cors');
app.use(cors()); 

app.use(express.json());

let employees_data = [{
    id: 1001,
    name: "Ram",
    age: 22,
    mobile: "9948926391",
    city: "Hyderabad",
    salary: 30000,
    department: "Development"
}];

console.log(employees_data);


app.post('/api/employees/data', async (req, res) => {
    const data = req.body;
    console.log(`Data from frontend:`, JSON.stringify(data));

    try {
        await db.query('CREATE DATABASE IF NOT EXISTS nodeassignment');
        await db.query('USE nodeassignment');

        await db.query(`CREATE TABLE IF NOT EXISTS employees(
            emp_id varchar(10) PRIMARY KEY,
            name varchar(30),
            age varchar(10),
            mobile varchar(13),
            city varchar(15),
            department varchar(20),
            salary varchar(10)
        )`);

        await db.query(
    `INSERT INTO employees(emp_id,name,age,mobile,city,department,salary) VALUES(?,?,?,?,?,?,?)`,
    [data.emp_id, data.name, data.age, data.mobile, data.city, data.department, data.salary]
);

        console.log('Data stored successfully');
        res.json({ success: true, employee: data });
    }catch (err) {
        console.log(err.message);
        res.status(500).json({ error: err.message });
    }
});


app.get('/api/employees', async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM employees');
        console.log(result);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/employees/:EMP_ID', async (req, res) => {
    const emp_id = req.params.EMP_ID;

    try {
        const [result] = await db.query('SELECT * FROM employees WHERE emp_id = ?', [emp_id]);
        if (result.length === 0){
             return res.status(404).json({ error: "Employee not found" });
        }
        res.json(result[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/api/salaries/:EMP_ID', (req, res) => {
    const emp_id = req.params.EMP_ID;
    const data = employees_data.filter(e => e.id == emp_id);
    if (data.length === 0) return res.status(404).json({ error: "Employee not found" });
    res.json({ id: emp_id, salary: data[0].salary });
});

app.get('/api/departments/:EMP_ID', (req, res) => {
    const emp_id = req.params.EMP_ID;
    const data = employees_data.filter(e => e.id == emp_id);
    if (data.length === 0) return res.status(404).json({ error: "Employee not found" });
    res.json({ id: emp_id, department: data[0].department });
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
