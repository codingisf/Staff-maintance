"use client";
import React,{useEffect,useState} from "react";
import { LayoutIcon, HammerIcon, Hand, Settings ,DollarSign } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";
import {usePathname} from 'next/navigation'

function SideNav() {
  const { user } = useKindeBrowserClient();

  const menuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutIcon,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Empolyees",
      icon: HammerIcon,
      path: "/dashboard/employees",
    },
    {
      id: 3,
      name: "Attendance",
      icon: Hand,
      path: "/dashboard/attendance",
    },
    {
      id: 4,
      name: "Mark Attendance",
      icon: Hand,
      path: "/dashboard/mark-attendance",
    },
    {
      id: 5,
      name: "Salay",
      icon: DollarSign,
      path: "/dashboard/salary",
    },
    {
      id: 6,
      name: "Settings",
      icon: Settings,
      path: "/dashboard/settings",
    },
  ];
  const path = usePathname();
  useEffect(()=>{
    console.log(path);
  },[path])
  return (
    <div className=" border h-screen shadow-md p-5">
      <div className="font-semibold text-lg">Arun Engineering</div>
      <hr className="my-5" />
      {menuList.map((menu) => (
        <Link key={menu.id} href={menu.path} className={`flex items-center gap-3 text-md p-4 text-slate-800 hover:bg-primary hover:text-white hover:cursor-pointer rounded-lg my-2 ${path==menu.path && 'bg-primary text-white'}`}>
         
            <menu.icon />
            {menu.name}
        </Link>
      ))}
    </div>
  );
}

export default SideNav;
