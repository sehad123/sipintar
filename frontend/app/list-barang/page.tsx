import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import ListBarang from "./list/page";
import BarangList from "./list/page";
export default function Home() {
  return (
    <>
      <Navbar />
      <ListBarang />
      <Footer />
    </>
  );
}
