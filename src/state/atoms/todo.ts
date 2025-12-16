import { atom } from "jotai";

import { Todo } from "@/utils/interfaces/Todo";

export const todoAtom = atom<Todo[]>([]);
