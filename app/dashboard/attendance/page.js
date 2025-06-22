"use client";
import React, { useState } from "react";
import MonthSelection from "@/app/_components/MonthSelection";
import { Button } from "@/components/ui/button";
import GlobalApi from "@/app/_services/GlobalApi";
import moment from "moment/moment";
import Attendancegrid from "./_components/Attendancegrid"

function Attendance() {
  const [selectedMonth, setSelectedMonth] = useState();
  const [attendanceList, setAttendanceList] = useState();

  const onSearchHandler = () => {
    const month = moment(selectedMonth).format("MM/YYYY");
    if (!selectedMonth) {
      return alert("Please select a month");
    }
    GlobalApi.getAttendance(month).then((res) => {
      setAttendanceList(res.data);
    });
  };

  return (
    <div className="p-7">
      <h2 className="text-2xl font-bold py-2">Attendance</h2>
      {/* Search Option */}
      <div className="flex flex-1 gap-5  p-5 rounded-lg shadow-sm border my-2">
        <div className="flex gap-2 items-center">
          <label>Select Month :</label>
          <MonthSelection selectedMonth={(value) => setSelectedMonth(value)} />
        </div>

        <div>
          <Button onClick={onSearchHandler}>Search</Button>
        </div>
      </div>

      {/* Student Attendace grid */}
      <Attendancegrid AttendanceList={attendanceList} selectedMonth={selectedMonth}/>
    </div>
  );
}

export default Attendance;
