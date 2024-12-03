import { PRIORITY_ORDER, VIEW_MODES } from '../constants/constants';

export const filterTodosByTiming = (todos, activeItem, selectedProject) => {
  console.log('Filtering todos:', { todos, activeItem, selectedProject });
  let filteredTodos = [...todos];

  // Filter by project if selected
  if (selectedProject) {
    filteredTodos = filteredTodos.filter(
      todo => {
        console.log('Comparing:', todo.project_id, selectedProject);
        return todo.project_id === selectedProject;
      }
    );
  }
  console.log('Filtered todos:', filteredTodos);

  // Filter by timing
  if (activeItem === VIEW_MODES.TODAY) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    filteredTodos = filteredTodos.filter(todo => {
      if (!todo.due_date) return false;
      const dueDate = new Date(todo.due_date);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    });
  } else if (activeItem === VIEW_MODES.NEXT_7_DAYS) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const next7Days = new Date(today);
    next7Days.setDate(today.getDate() + 7);
    
    filteredTodos = filteredTodos.filter(todo => {
      if (!todo.due_date) return false;
      const dueDate = new Date(todo.due_date);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate >= today && dueDate <= next7Days;
    });
  }

  return filteredTodos;
};

export const sortTodosByPriority = (todos) => {
  return [...todos].sort((a, b) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isOverdueA = new Date(a.due_date) < today && !a.is_completed;
    const isOverdueB = new Date(b.due_date) < today && !b.is_completed;

    // First, sort by overdue status
    if (isOverdueA && !isOverdueB) return -1;
    if (!isOverdueA && isOverdueB) return 1;

    // Then, sort by completion status
    if (!a.is_completed && b.is_completed) return -1;
    if (a.is_completed && !b.is_completed) return 1;

    // For tasks with the same completion status, sort by priority
    if (!a.is_completed && !b.is_completed) {
      if (PRIORITY_ORDER[a.priority] !== PRIORITY_ORDER[b.priority]) {
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      }
      // If priorities are the same, sort by due date
      return new Date(a.due_date) - new Date(b.due_date);
    }

    return 0;
  });
};

export const checkOverdueAndToday = (todos) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueTasks = todos.filter(todo => {
    const dueDate = new Date(todo.due_date);
    return dueDate < today && !todo.is_completed;
  });

  const todayTasks = todos.filter(todo => {
    const dueDate = new Date(todo.due_date);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime() && !todo.is_completed;
  });

  return { overdueTasks, todayTasks };
};