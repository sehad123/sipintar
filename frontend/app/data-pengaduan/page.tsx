import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import PengaduanStatusCard from "./card/page";
import PengaduanList from "./list/page";

export default function Home() {
  return (
    <>
      <Navbar />
      <PengaduanStatusCard />
      <PengaduanList />
      <Footer />
    </>
  );
}
