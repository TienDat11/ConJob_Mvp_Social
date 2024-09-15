import { usePathname } from "next/navigation";

export function useCurrentPathname() {
  return usePathname();
}
