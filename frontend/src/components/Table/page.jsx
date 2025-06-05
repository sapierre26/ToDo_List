import PropTypes from "prop-types";
// Table Header Component
const TableHeader = () => (
  <table className="tasks-table" style={{ marginTop: '100px' }}>
    <thead>
      <tr>
        <th>Task</th>
        <th>Priority</th>
        <th>Due Date</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
  </table>
);

// Table Body Component
function TableBody(props) {
  const rows = (props.tasks || []).map((task) => {
    return (
      <tr key={task.id}>
        <td>{task.description}</td>
        <td>{task.priority}</td>
        <td>{task.dueDate}</td>
        <td>{task.status}</td>
        <td>
          <button onClick={() => props.toggleStatus(task.id)}>
            {task.status === "Pending" ? "Complete" : "Undo"}
          </button>
          <button onClick={() => props.deleteTask(task.id)}>Delete</button>
        </td>
      </tr>
    );
  });

  return <tbody>{rows}</tbody>;
}

TableBody.propTypes = {
  tasks: PropTypes.array.isRequired,
  toggleStatus: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
};

// Table Component
const Table = ({ tasks, toggleStatus, deleteTask }) => {
  return (
    <table>
      <TableHeader />
      <TableBody
        tasks={tasks}
        toggleStatus={toggleStatus}
        deleteTask={deleteTask}
      />
    </table>
  );
};

Table.propTypes = {
  tasks: PropTypes.array.isRequired,
  toggleStatus: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
};

export default Table;
