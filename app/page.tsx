import type { Metadata } from "next";
import LabApp from "@/components/lab/App";

export const metadata: Metadata = {
  title: "VersionLimitada — laboratorio de ideas",
  description:
    "Sistema operativo del laboratorio: señales, expedientes, hipótesis, experimentos, resultados y decisiones build / iterate / kill.",
};

export default function Home() {
  return <LabApp />;
}