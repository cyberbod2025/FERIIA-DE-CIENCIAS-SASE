import React from "react";
import { Layout } from "../components/Layout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, Target, ChevronRight } from "lucide-react";
import { SaseNeuralCore } from "../components/SaseNeuralCore";
import { getStudentSession } from "../lib/studentSession";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

export const TutorialView: React.FC = () => {
  const navigate = useNavigate();
  const { studentName } = getStudentSession();
  const userName = studentName || "Artista";

  return (
    <Layout title="📘 Manual de Misión">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-6 p-6 pb-24 min-h-full"
      >
        <motion.div
          variants={sectionVariants}
          className="surface-card-strong text-center py-8"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-[40px] rounded-full animate-pulse"></div>
              <SaseNeuralCore size={140} />
            </div>
          </div>
          <h2 className="title-sase text-2xl mb-2">
            ¡Hola, {userName}!
          </h2>
          <p className="text-sm text-white/70 leading-relaxed px-4">
            Estás a punto de entrar a la <strong className="text-white">FERIA DE CIENCIAS 2026 ESD-310</strong>,
            una experiencia donde el conocimiento y la innovación se unen.
          </p>
        </motion.div>

        <motion.section
          variants={sectionVariants}
          className="flex flex-col gap-4"
        >
          <div className="surface-card flex gap-4 items-start p-5">
            <div className="bg-blue-500/20 p-3 rounded-2xl border border-blue-500/30">
              <Target size={24} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-black text-sm uppercase tracking-widest mb-1">
                El Objetivo
              </h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Recorrer los stands de <strong className="text-white/80">Física, Biología, Química y Geografía</strong>. ¡Y por primera vez, las <strong className="text-white/80">Matemáticas</strong> se unen a la función!
              </p>
            </div>
          </div>

          <div className="surface-card flex gap-4 items-start p-5">
            <div className="bg-amber-500/20 p-3 rounded-2xl border border-amber-500/30">
              <BookOpen size={24} className="text-amber-400" />
            </div>
            <div>
              <h3 className="text-white font-black text-sm uppercase tracking-widest mb-1">
                Protocolo de Misión
              </h3>
              <ul className="text-xs text-white/50 space-y-2 list-none p-0">
                <li className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-amber-500/40"></div>
                  Sigue el <strong>Mapa</strong> para encontrar tu stand asignado.
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-amber-500/40"></div>
                  Haz <strong>Check-in</strong> con el QR al llegar.
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-amber-500/40"></div>
                  Gana puntos resolviendo la <strong>Trivia Final</strong>.
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        <motion.button
          variants={sectionVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/mapa")}
          className="mt-auto py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(37,99,235,0.25)]"
        >
          Iniciar Recorrido <ChevronRight size={20} />
        </motion.button>
      </motion.div>
    </Layout>
  );
};
