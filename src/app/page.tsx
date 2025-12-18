import Dashboard from "@/components/Dashboard";
import { getUser } from "@/app/actions/auth/user";
import { getTodos } from "@/app/actions/todo/todo";
import JotaiProvider  from "@/utils/providers/JotaiProvider";

export default async function Home() {
  const userData = await getUser();
  const { todos: todoList } = await getTodos();

  return (
    <JotaiProvider>
      <Dashboard todos={todoList ?? []} user={userData} />
    </JotaiProvider>
  );
}
