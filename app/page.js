"use client"
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  useEffect(()=>{
    redirect('/api/auth/login?post_login_redirect_url=/dashboard')

  },[])
  return (
    <div>
      {/* <Button>hellow</Button> */}

    </div>



  );
}
