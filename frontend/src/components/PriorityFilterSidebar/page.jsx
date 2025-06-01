import React from 'react';
import PropTypes from "prop-types";
import styles from "./priorityFilter.module.css";
const priorities = ["High", "Medium", "Low"];

const PriorityFilterSidebar = ({ selectedPriority, onSelectPriority }) => {
  return (
    <div className={styles.sidebar}>
      <div className="prioritySidebar">
        <h3>FILTER</h3>
        <ul className={styles.priorityList}>
          <li>
            <button
              className={`${styles.priorityButton} ${
                selectedPriority === null ? styles.selected : ""
              }`}
              onClick={() => onSelectPriority(null)}
              aria-pressed={selectedPriority === null}
            >
              All
            </button>
          </li>
          {priorities.map((priority) => (
            <li key={priority}>
              <button
                className={`${styles.priorityButton} ${
                  selectedPriority === priority ? styles.selected : ""
                }`}
                onClick={() => onSelectPriority(priority)}
                aria-pressed={selectedPriority === priority}
              >
                {priority}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

PriorityFilterSidebar.propTypes = {
  selectedPriority: PropTypes.string.isRequired,
  onSelectPriority: PropTypes.func.isRequired,
};

export default PriorityFilterSidebar;
