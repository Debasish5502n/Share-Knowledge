import React, { useState, useEffect, useRef } from "react";
import { MdMoreVert, MdEdit, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ title, instructor, duration, lessons, image, onClicked, course }) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef();

  const navigate = useNavigate();

  const goSideContent = () => {
    navigate(`/addSubject?courseId=${course.course_id}`);
  };

  const handleCardClick = () => {
    onClicked(course);
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onClicked(course);
    setShowOptions(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="course-card" onClick={goSideContent}>
      <div className="image-container">
        <img src={image} alt={title} className="course-img" />
        <div className="more-icon" onClick={handleMoreClick}>
          <MdMoreVert size={24} />
        </div>

        {showOptions && (
          <div className="options-dropdown" ref={optionsRef}>
            <div className="option-item" onClick={handleEditClick}>
              <MdEdit size={18} style={{ marginRight: "8px" }} />
              Edit
            </div>
            {/* Future: Add Delete etc */}
            {/* <div className="option-item">
              <MdDelete size={18} style={{ marginRight: "8px" }} />
              Delete
            </div> */}
          </div>
        )}
      </div>

      <div className="course-content">
        <div className="course-title">{title}</div>
        <div className="course-description">{instructor}</div>
        <div className="course-details">
          <span>{lessons} Lessons</span>
          <span>{duration} Hours</span>
        </div>
        <button className="course-btn">View Course</button>
      </div>
    </div>
  );
};

export default CourseCard;