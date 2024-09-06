import { selector } from "recoil";
import { CreatorAtom } from "../atom/CreatorAtom";

export const CreatorSel = selector({
  key: "CreatorSel",
  get: async ({ get }) => {
    const creatorID = get(CreatorAtom);
    return creatorID;
  },
});
