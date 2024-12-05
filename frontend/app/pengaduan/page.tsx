import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import ProsedurPengaduan from "./list/page";

export default function Home() {
  return (
    <>
      <Navbar />
      <ProsedurPengaduan />
      <Footer />
    </>
  );
}
