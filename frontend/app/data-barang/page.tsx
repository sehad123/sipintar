import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import BarangList from "./list/page";
export default function Home() {
  return (
    <>
      <Navbar />
      <BarangList />
      <Footer />
    </>
  );
}
