import { FLAGS, type FlagKey } from "@shared/config";

export function useFlag(flag: FlagKey): boolean {
  return FLAGS[flag];
}

export function useFlags() {
  return FLAGS;
}
