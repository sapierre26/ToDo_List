import React from 'react';
import styles from './priorityFilter.module.css';

const priorities = ['High', 'Medium', 'Low'];

const PriorityFilterSidebar = ({ selectedPriority, onSelectPriority }) => {
  return (
    <div className={styles.sidebar}>
      <div className='prioritySidebar'>
        <h3>FILTER</h3>
        <ul className={styles.priorityList}>
          {priorities.map((priority) => (
            <li key={priority}>
              <button
                className={`${styles.priorityButton} ${
                  selectedPriority === priority ? styles.selected : ''
                }`}
                onClick={() => onSelectPriority(priority)}
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

export default PriorityFilterSidebar;
