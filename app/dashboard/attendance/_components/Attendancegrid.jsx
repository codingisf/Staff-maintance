"use client";
import React, { useEffect, useState } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import moment from "moment/moment";
ModuleRegistry.registerModules([AllCommunityModule]);

function Attendancegrid({ AttendanceList, selectedMonth }) {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([
    { field: "EmployeeId", headerName: "Employee ID" },
    { field: "name", headerName: "Name" },
  ]);

  const daysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const daynumberOfDays = daysInMonth(
    moment(selectedMonth).format("YYYY"),
    moment(selectedMonth).format("MM")
  );

  const daysArray = Array.from({ length: daynumberOfDays }, (_, i) => i + 1);

  useEffect(() => {
    if (AttendanceList && Array.isArray(AttendanceList)) {
      const userList = getUniqueRecord(AttendanceList);

      const dynamicCols = daysArray.map((date) => ({
        field: date.toString(),
        headerName: date.toString(),
        width: 50,
        editable: false, 
        cellRenderer: (params) =>
          params.value ? "✔️" : "",
      }));

      const enrichedList = userList.map((user) => {
        const newUser = { ...user };
        daysArray.forEach((date) => {
          newUser[date] = isPresent(user.EmployeeId, date);
        });
        return newUser;
      });

      setColDefs([
        { field: "EmployeeId", headerName: "Employee ID" },
        { field: "name", headerName: "Name" },
        ...dynamicCols,
      ]);

      setRowData(enrichedList);
    }
  }, [AttendanceList]);

  const isPresent = (EmployeeId, day) => {
    return AttendanceList.find(
      (item) => item.day == day && item.EmployeeId == EmployeeId
    )
      ? true
      : false;
  };

  const getUniqueRecord = (list) => {
    const uniqueRecord = [];
    const existingUsers = new Set();

    list.forEach((record) => {
      if (!existingUsers.has(record.EmployeeId)) {
        existingUsers.add(record.EmployeeId);
        uniqueRecord.push(record);
      }
    });

    return uniqueRecord;
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        
      />
    </div>
  );
}

export default Attendancegrid;
