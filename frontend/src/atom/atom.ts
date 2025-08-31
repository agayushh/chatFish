import { atom } from "recoil";


export const roomIdAtom = atom<string | null>({
  key: "roomId",
  default: null,
});