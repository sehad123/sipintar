import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import ListTempat from "./list/page";
export default function Home() {
  return (
    <>
      <Navbar />
      <ListTempat />
      <Footer />
    </>
  );
}
