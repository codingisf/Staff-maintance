"use client";
import React, { useEffect, useState } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import {Trash , Search} from 'lucide-react'
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import GlobalApi from '@/app/_services/GlobalApi'



ModuleRegistry.registerModules([AllCommunityModule]);


const pagination = true;
const paginationPageSize = 10;
const paginationPageSizeSelector = [10,25,50];


function EmployeesListTable({ data , refreshData }) {


  const deleteRecord=(id) =>{
  GlobalApi.DeleteEmployeeRecord(id).then(res=>{
    if(res){
      toast.success('Record deleted successfully!');
      refreshData();
    }
  })
}

const CustomButtons =(props) =>{
  return(<AlertDialog>
  <AlertDialogTrigger><Button variant="destructive" className='mx-auto w-full'><Trash/></Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your Employee details
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={()=>{
      deleteRecord(props.data.id)
      }}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
)
}

  const [colDefs] = useState([
    { field: "id", filter: true },
    { field: "name", filter: true },
    { field: "role", filter: true },
    { field: "salary", filter: true },
    {field:"action",cellRenderer:CustomButtons}
  ]);

  const [rowData, setRowData] = useState([]);
  const [serachInput, setserachInput] = useState('');

  useEffect(() => {
    if (data) {
      setRowData(data);
    }
  }, [data]);

  return (
    <div style={{ height: 500 }} className="pt-5">
      <div className="p-2 rounded-lg border shadow-sm flex gap-2 mb-4 max-w-sm">
        <Search/>
        <input type="text" placeholder="Search on Employees..." className="outline-none" onChange={(event)=>{setserachInput(event.target.value)}}/>
      </div>
  <AgGridReact rowData={rowData} columnDefs={colDefs} pagination={pagination} paginationPageSize={paginationPageSize} paginationPageSizeSelector={paginationPageSizeSelector} quickFilterText={serachInput}/>
</div>

  );
}

export default EmployeesListTable;
