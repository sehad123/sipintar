import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import PeminjamanStatusCard from "./card/page";
import PeminjamanList from "./list/page";

export default function Home() {
  return (
    <>
      <Navbar />
      <PeminjamanStatusCard />
      <PeminjamanList />
      <Footer />
    </>
  );
}
