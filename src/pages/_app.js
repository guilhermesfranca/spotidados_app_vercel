import "@/styles/globals.css";
import BottomNav from "../components/BottomNav";
import SearchBar from "../components/SearchBar";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";

import { Audiowide } from "next/font/google";

const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Não mostra navbar na página index
  const mostrarNav = router.pathname !== "/";

  return (
    <div className="bg-black min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={router.route}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="min-h-screen"
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>

      {mostrarNav && <BottomNav />}
    </div>
  );
}
