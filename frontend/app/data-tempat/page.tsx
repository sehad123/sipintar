import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import TempatList from "./list/page";
export default function Home() {
  return (
    <>
      <Navbar />
      <TempatList />
      <Footer />
    </>
  );
}
