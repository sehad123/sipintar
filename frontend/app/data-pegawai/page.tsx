import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import PegawaiList from "./list/page";

export default function Home() {
  return (
    <>
      <Navbar />
      <PegawaiList />
      <Footer />
    </>
  );
}
