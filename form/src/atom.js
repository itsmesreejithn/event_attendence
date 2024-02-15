import { atom } from "recoil";

const participantsState = atom({
  key: "participantState",
  default: [],
});

const eventIdState = atom({
  key: "eventIdState",
  default: "",
});

export { participantsState, eventIdState };
