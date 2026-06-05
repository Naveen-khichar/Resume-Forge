import Navbar from "./components/navbar";
import Hero from "./components/hero";
import UploadCard from "./components/uploadcard";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <UploadCard />
    </main>
  );
}