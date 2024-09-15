import { Metadata } from "next";
import Chat from "./Chat";

export const metadata: Metadata = {
  title: "Messages",
};

export default function page() {
  return (
    <Chat />
  )
}
