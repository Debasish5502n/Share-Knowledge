import React, { useState, useEffect } from "react";
import "./CreateCourseDialog.css";

const CreateCourseDialog = ({ open, onClose, onSave, onDelete, userId, courseToEdit }) => {
    const [courseData, setCourseData] = useState({
        course_title: "",
        course_category: "",
        course_language: "",
        course_description: "",
        course_thumbnail: null,
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isEdit = !!courseToEdit;

    useEffect(() => {
        setIsSubmitting(false)
        setIsDeleting(false);
        if (open && courseToEdit) {
            setCourseData({
                course_title: courseToEdit.course_title || "",
                course_category: courseToEdit.course_category || "",
                course_language: courseToEdit.course_language || "",
                course_description: courseToEdit.course_description || "",
                course_thumbnail: courseToEdit.course_thumbnail || null,
            });
            setPreviewUrl(courseToEdit.course_thumbnail || null);
        } else if (!open) {
            setCourseData({
                course_title: "",
                course_category: "",
                course_language: "",
                course_description: "",
                course_thumbnail: null,
            });
            setPreviewUrl(null);
            setError("");
        }
    }, [open, courseToEdit]);

    const handleChange = (e) => {
        setCourseData({
            ...courseData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCourseData({ ...courseData, course_thumbnail: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        setIsDeleting(true);
        try {
            await onDelete(isEdit ? courseToEdit.course_id : null);
        } catch (err) {
            setError("Something went wrong.");
        }
    }

    const handleSubmit = async () => {
        setError("");

        const { course_title, course_category, course_language, course_description } = courseData;
        if (!course_title || !course_category || !course_language || !course_description) {
            setError("All fields are required.");
            return;
        }

        setIsSubmitting(true);
        setIsDeleting(true);
        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("course_title", course_title);
        formData.append("course_category", course_category);
        formData.append("course_language", course_language);
        formData.append("course_description", course_description);

        if (courseData.course_thumbnail instanceof File) {
            // 🖼️ If it's a new file
            formData.append("course_thumbnail", courseData.course_thumbnail);
        } else if (typeof courseData.course_thumbnail === "string") {
            // 🔗 If it's an existing image URL
            formData.append("course_thumbnail", courseData.course_thumbnail);
        }

        try {
            await onSave(formData, isEdit ? courseToEdit.course_id : null);
        } catch (err) {
            setError("Something went wrong.");
        }
    };

    if (!open) return null;

    return (
        <div className="dialog-backdrop" onClick={onClose}>
            <div className="custom-dialog" onClick={(e) => e.stopPropagation()}>
                <h3>{isEdit ? "Update Course" : "Create Course"}</h3>

                <div className="dialog-row">
                    <div className="dialog-field">
                        <label>Course Title</label>
                        <input
                            type="text"
                            name="course_title"
                            value={courseData.course_title}
                            onChange={handleChange}
                            placeholder="Enter course title"
                        />
                    </div>
                    <div className="dialog-field">
                        <label>Course Category</label>
                        <input
                            type="text"
                            name="course_category"
                            value={courseData.course_category}
                            onChange={handleChange}
                            placeholder="Enter category"
                        />
                    </div>
                </div>

                <div className="dialog-row">
                    <div className="dialog-field">
                        <label>Course Language</label>
                        <input
                            type="text"
                            name="course_language"
                            value={courseData.course_language}
                            onChange={handleChange}
                            placeholder="Enter language"
                        />
                    </div>
                    <div className="dialog-field">
                        <label>Course Thumbnail</label>
                        <input style={{ border: "none", outline: "none", padding: 10 }}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange} />
                        {previewUrl && (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="thumbnail-preview"
                            />
                        )}
                    </div>
                </div>

                <div className="dialog-field">
                    <label>Course Description</label>
                    <textarea
                        name="course_description"
                        value={courseData.course_description}
                        onChange={handleChange}
                        placeholder="Write a short description..."
                        rows={4}
                    />
                </div>

                {error && <p className="error-text">{error}</p>}

                <div className="dialog-actions">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}>
                        Cancel
                    </button>
                    {
                        courseToEdit ?
                            <button
                                className="dialog-course-delete"
                                disabled={isDeleting}
                                onClick={handleDelete}>
                                {isDeleting ? "Deleting..." : isEdit ? "Delete" : "Save"}
                            </button> :
                            <></>
                    }
                    <button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : isEdit ? "Update" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateCourseDialog;