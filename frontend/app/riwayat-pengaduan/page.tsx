"use client";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { useState, useEffect } from "react";
import PengaduanList from "./list/page";

export default function Home() {
  const [user, setUser] = useState({ name: "", role: "", email: "", id: null }); // Initial id as null
  const [isLoading, setIsLoading] = useState(true); // Loading state to ensure data is fetched first

  useEffect(() => {
    // Fetch user data from localStorage (or any other storage method)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser); // Set user data from storage
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
    setIsLoading(false); // Set loading to false after fetching user data
  }, []);

  // Don't render the PeminjamanList until we have the userId
  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  if (!user || !user.id) {
    return <div>Error: Invalid user ID</div>; // Show error if userId is missing
  }

  return (
    <>
      <Navbar />
      <PengaduanList userId={user.id} /> {/* Render only when userId is valid */}
      <Footer />
    </>
  );
}
