export const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
};

export const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
};

export const getPriorityColor = (priority) => {
    const colors = {
        high: '#ff4d4d',
        medium: '#ffd700',
        low: '#90EE90'
    };
    return colors[priority] || colors.low;
};
