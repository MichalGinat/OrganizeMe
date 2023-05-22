import PropTypes from 'prop-types';

HighPriorityTableForHomePage.propTypes = {
  tasks: PropTypes.array.isRequired,
};

function HighPriorityTableForHomePage(props) {
  const { tasks } = props;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Task Name
            </th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Importance
            </th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Comments
            </th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task, i) => (
          <tr key={[task.taskName, task.dueDate, task.category, task.importance, task.comments, task.status]}>
          <td className="py-4 px-6">{task.taskName}</td>
              <td className="py-4 px-6">{task.dueDate}</td>
              <td className="py-4 px-6">{task.category}</td>
              <td className="py-4 px-6">{task.importance}</td>
              <td className="py-4 px-6">{task.comments}</td>
              <td className="py-4 px-6">{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HighPriorityTableForHomePage;
