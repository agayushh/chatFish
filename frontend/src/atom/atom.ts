import { atom } from "recoil";


export const roomIdAtom = atom<string | null>({
  key: "roomId",
  default: null,
});

export const roomNameAtom = atom<string | null>({
  key: "roomName",
  default: null,
});