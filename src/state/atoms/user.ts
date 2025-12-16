import { atom } from "jotai";

import { User } from "@/utils/interfaces/User";

export const userAtom = atom<User | null>(null);