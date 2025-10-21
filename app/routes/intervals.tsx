import type { Route } from "./+types/intervals";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Aural Skills Intervals" },
    { name: "description", content: "Intervals practice" },
  ];
}

export default function Intervals() {
  return null;
}
