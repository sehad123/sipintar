"use client";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import ProsedurPeminjaman from "./list/page";

export default function Home() {
  return (
    <>
      <Navbar />
      <ProsedurPeminjaman />
      <Footer />
    </>
  );
}
