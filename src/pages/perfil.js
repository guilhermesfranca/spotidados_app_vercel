import SearchBar from "@/components/SearchBar";
import Image from "next/image";
import { Github, Linkedin, Mail } from "lucide-react";

const TEAM = [
  {
    name: "Mishal Saheersha",
    github: "https://github.com/msaheers",
    linkedin: "https://www.linkedin.com/in/mishal-saheer",
    email: "mishalsaheersha10@gmail.com",
    image: "/Mishal.png",
  },
  {
    name: "Guilherme França",
    github: "https://github.com/guilhermesfranca",
    linkedin: "https://www.linkedin.com/in/guilhermesfranca",
    email: "guilhermesfranca@outlook.com",
    image: "/GF.jpg",
  },
  {
    name: "Jhow Tinoco",
    github: "https://github.com/Jhonathan-Tinoco",
    linkedin: "https://www.linkedin.com/in/jhonathan-tinoco",
    email: "jhonathan.tinoco.pt@gmail.com",
    image: "/profilePicJhow.jpg",
  },
  {
    name: "Miguel Sabogal",
    github: "https://github.com/MickSabogal",
    linkedin: "https://www.linkedin.com/in/miguel-alejandro-sabogal-guzman/",
    email: "miguelsabogal20@gmail.com",
    image: "/unnamed.jpg",
  },
];

function initialsFrom(name) {
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Perfil() {
  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-md pb-24 px-4">
        <SearchBar />

        <header className="mt-6 mb-4">
          <h1 className="text-2xl font-bold">Meet our team</h1>
          <p className="text-sm text-gray-400 mt-1">
            Team behind this project — links to GitHub, LinkedIn & email.
          </p>
        </header>

        <section className="grid grid-cols-2 gap-4">
          {TEAM.map((member) => (
            <article
              key={member.email}
              className="rounded-xl bg-[#121212]/80 p-4 shadow-md flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full p-1 mb-3 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 p-1">
                  <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden relative flex items-center justify-center">
                    <Image
                      src={member.image || "/cb.jpg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              <h3 className="text-white font-semibold">{member.name}</h3>
              <p className="text-gray-400 text-sm mb-3">Team Member</p>

              <div className="flex gap-3">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} GitHub`}
                  className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition"
                >
                  <Github className="w-5 h-5 text-gray-200" />
                </a>

                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} LinkedIn`}
                  className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition"
                >
                  <Linkedin className="w-5 h-5 text-gray-200" />
                </a>

                <a
                  href={`mailto:${member.email}`}
                  aria-label={`Enviar email para ${member.name}`}
                  className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition"
                >
                  <Mail className="w-5 h-5 text-gray-200" />
                </a>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
