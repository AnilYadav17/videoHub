"use client"

import Navigation from "./components/navigation";
import HeroSection from "./components/HeroSection";
import Footer from "./components/Fotter";
import { useSession } from "next-auth/react";

export default function Home() {
   const { data: session } = useSession();
   
  return (
    <>
      <Navigation isLoggedIn={!!session}/>
      <HeroSection/>
      <Footer/>
    </>
  );
}
