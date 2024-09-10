
/**
 * Форматирует дату в строку формата ClickHouse.
 * @param {string} date - Дата в формате ISO 8601.
 * @returns {string} - Отформатированная дата в формате ClickHouse.
 */
function formatDateToClickhouse(date) {
    const msDelimiter = date.indexOf('.');
    if (msDelimiter === -1) {
        // Если миллисекунды отсутствуют, просто заменяем 'T' на пробел
        return date.replace('T', ' ');
    }

    // Заменяем 'T' на пробел и обрезаем миллисекунды
    return date.replace('T', ' ').substring(0, msDelimiter);
}

module.exports = {
    formatDateToClickhouse
};
