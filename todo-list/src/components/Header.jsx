import PropTypes from 'prop-types'; // Import PropTypes

export default function Header({ toggleSidebar }) {
  Header.propTypes = {
    toggleSidebar: PropTypes.func.isRequired,
  }; // Define propTypes

  return (
    <header className="header no-transition">
      <img
        src="icons/icons8-menu-32.png"
        onClick={toggleSidebar}
        className="menu-icon"
        alt=""
      />
      <div className="logo">
        <img src="icons/task-list.png" className="logo-icon" alt="" />
        <span className="taskly">
          <span className="Task">Task</span>
          <span className="ly">ly</span>
        </span>
      </div>
      <div />
    </header>
  );
}
