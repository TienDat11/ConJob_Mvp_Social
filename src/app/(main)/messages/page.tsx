import { Metadata } from "next";
import Chat from "./Chat";


export const metaData: Metadata = {
  title: "Messages",
};

export default function page() {
  return (
    <Chat />
  )
}
