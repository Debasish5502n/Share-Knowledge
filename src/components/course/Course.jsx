import React, { useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import CreateCourseDialog from "./CreateCourseDialog";
import "./Course.css";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const userId = 1; // Replace with dynamic user_id if needed

  const fetchCourses = async () => {
    try {
      const response = await fetch("https://share-knowledge-api-production.up.railway.app/api/courses");
      const data = await response.json();
      if (data.status === 200) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleOpenAdd = () => {
    setSelectedCourse(null);
    setDialogOpen(true);
  };

  const handleItemClick = (course) => {
    setSelectedCourse(course);
    setDialogOpen(true);
  };


  const handleSaveCourse = async (formData, courseId) => {
    try {
      const url = courseId
        ? `https://share-knowledge-api-production.up.railway.app/api/course?id=${courseId}`
        : "https://share-knowledge-api-production.up.railway.app/api/course";

      const method = courseId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to save course");
      }
      const result = await res.json();
      console.log("Course Created:", result);
      fetchCourses(); // Refresh list

    } catch (err) {
      console.error("Course creation failed:", err);
    }
    handleClose()
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await fetch(`https://share-knowledge-api-production.up.railway.app/api/course?id=${courseId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete course");
      }
  
      const result = await response.json();
      console.log("Course Deleted:", result);
      fetchCourses(); // Refresh list after deletion
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
    handleClose();
  };

  return (
    <div>
      <div className="course-header">
        <button className="course-create-btn" onClick={handleOpenAdd}>Create Course</button>
      </div>

      <div className="main-course-contener">
        {courses.map((course) => (

          <CourseCard
            key={course.course_id}
            title={course.course_title}
            instructor={course.course_description}
            duration={0} // Update as needed
            lessons={0} // Update as needed
            image={course.course_thumbnail}
            onClicked={handleItemClick}
            course={course}
          />

        ))}
      </div>

      <CreateCourseDialog
        open={dialogOpen}
        onClose={handleClose}
        onSave={handleSaveCourse}
        onDelete={handleDeleteCourse}
        userId={userId}
        courseToEdit={selectedCourse}
      />
    </div>
  );
};

export default Course;
