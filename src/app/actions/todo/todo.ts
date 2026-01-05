import { Todo } from "@/utils/interfaces/Todo";
import { API_METHODS } from "@/utils/enum/ApiMethods";
import { getCookies } from "@/utils/actions/GetCookies";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";


const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL_API_URL}/todos`;

export const getTodos = async () => {
  try {
    const res = await fetch(BASE_URL, {
      method: API_METHODS.GET,
      headers: {
        "Content-Type": "application/json",
        Cookie: await getCookies(),
      },
      credentials: "include",
    } as RequestInit);

    const data = await res.json();
    
    if (!res.ok) {
      return {
        success: false,
        todos: [],
        message: data.message || NOTIFY_MESSAGES.SERVER_ERROR,
      };
    }


    return {
      success: true,
      todos: data.todos || [],
    };
  } catch {
    return {
      success: false,
      todos: [],
      message: NOTIFY_MESSAGES.NETWORK_ERROR,
    };
  }
};

export const addTodo = async (todo: Todo) => {
  try {
    const res = await fetch(BASE_URL, {
      method: API_METHODS.POST,
      headers: {
        "Content-Type": "application/json",
        Cookie: await getCookies(),
      },
      credentials: "include",
      body: JSON.stringify(todo),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || NOTIFY_MESSAGES.SERVER_ERROR,
      };
    }

    return {
      success: true,
      newTodo: data.newTodo,
      message: data.message,
    };
  } catch {
    return {
      success: false,
      message: NOTIFY_MESSAGES.NETWORK_ERROR,
    };
  }
};

export const updateTodo = async (todo: Partial<Todo>) => {
  try {
    const res = await fetch(`${BASE_URL}/${todo.id}`, {
      method: API_METHODS.PUT,
      headers: {
        "Content-Type": "application/json",
        Cookie: await getCookies(),
      },
      credentials: "include",
      body: JSON.stringify(todo),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || NOTIFY_MESSAGES.SERVER_ERROR,
      };
    }

    return {
      success: true,
      updatedTodo: data.updatedTodo,
      message: data.message,
    };
  } catch {
    return {
      success: false,
      message: NOTIFY_MESSAGES.NETWORK_ERROR,
    };
  }
};

export const deleteTodo = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: API_METHODS.DELETE,
      headers: {
        "Content-Type": "application/json",
        Cookie: await getCookies(),
      },
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || NOTIFY_MESSAGES.SERVER_ERROR,
      };
    }

    return {
      success: true,
      message: data.message,
    };
  } catch {
    return {
      success: false,
      message: NOTIFY_MESSAGES.NETWORK_ERROR,
    };
  }
};

export const toggleTodoStatus = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}/toggle-status`, {
      method: API_METHODS.PATCH,
      headers: {
        "Content-Type": "application/json",
        Cookie: await getCookies(),
      },
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || NOTIFY_MESSAGES.SERVER_ERROR,
      };
    }

    return {
      success: true,
      updatedTodo: data.updatedTodo,
      message: data.message,
    };
  } catch {
    return {
      success: false,
      message: NOTIFY_MESSAGES.NETWORK_ERROR,
    };
  }
};
