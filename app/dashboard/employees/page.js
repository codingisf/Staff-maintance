"use client";
import React, { useEffect, useState } from "react";
import AddNewStudent from "./_components/AddNewEmployee";
import EmployeesListTable from "./_components/EmployeesListTable";
import GlobalApi from "@/app/_services/GlobalApi";
function employee() {
  const [employeeList, setEmployeeList] = useState([]);
  useEffect(() => {
    getAllEmployees();
  }, []);

  // Use to get all Employee
  const getAllEmployees = () => {
    GlobalApi.getAllEmployees().then((res) => {
      setEmployeeList(res.data);
    });
  };
  console.log(employeeList);

  return (
    <div className=" p-7">
      <h2 className="font-bold text-2xl flex justify-between align-center py-2">
        Employees <AddNewStudent refreshData={getAllEmployees} />
      </h2>
      <EmployeesListTable data={employeeList} refreshData={getAllEmployees} />
    </div>
  );
}

export default employee;
