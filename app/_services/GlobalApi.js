const {default : axios} = require("axios");
const CreateNewEmployee = (data)=>axios.post('/api/employee',data)

const getAllEmployees = () =>axios.get('/api/employee');
const DeleteEmployeeRecord = (id) =>axios.delete('/api/employee?id='+id)
const getAttendance =(month)=>axios.get('/api/attendance?month='+month)
const MarkAttendence = (data)=>axios.post('/api/attendance',data)
const MarkAbsent =(EmployeeId, day, date) =>axios.delete('/api/attendance?EmployeeId='+EmployeeId+"&day="+day+"&date="+date);
export default{
    CreateNewEmployee,
    getAllEmployees,
    DeleteEmployeeRecord,
    getAttendance,
    MarkAttendence,
    MarkAbsent
} 