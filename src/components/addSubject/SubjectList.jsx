import React, { useEffect, useState } from 'react';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import CustomDialog from './CustomDialog';
import axios from 'axios';

const SubjectList = ({ onSelectSubject, courseId }) => {
    const [subjects, setSubjects] = useState([]);
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [editIndex, setEditIndex] = useState(null);

    // Fetch subjects on mount
    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const response = await axios.get(`https://share-knowledge-api-production.up.railway.app/api/subjects-by-course-id?id=${courseId}`);
            setSubjects(response.data.data || []);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    const handleSave = async () => {
        if (!input.trim()) return;

        if (editIndex !== null) {
            const subjectToUpdate = subjects[editIndex];
            try {
                const res = await axios.put(`https://share-knowledge-api-production.up.railway.app/api/subject?id=${subjectToUpdate.subject_id}`, {
                    subject_title: input
                });

                if (res.data?.data) {
                    const updated = [...subjects];
                    updated[editIndex] = res.data.data; // Use updated subject from server
                    setSubjects(updated);
                }
            } catch (err) {
                console.error("Error updating subject:", err);
            }
        } else {
            // Handle Add
            try {
                const res = await axios.post("https://share-knowledge-api-production.up.railway.app/api/subject", {
                    course_id: courseId,
                    subject_title: input,
                    "subject_video": ""
                });                

                if (res.data?.data) {
                    setSubjects([...subjects, res.data.data]);
                }
            } catch (err) {
                console.error("Error adding subject:", err);
            }
        }

        handleClose();
    };

    const handleDelete = async (e, subject_id, index) => {
        e.stopPropagation();
        try {
            await axios.delete(`https://share-knowledge-api-production.up.railway.app/api/subject?id=${subject_id}`);
            setSubjects(subjects.filter((_, i) => i !== index));
        } catch (err) {
            console.error("Error deleting subject:", err);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setInput('');
        setEditIndex(null);
    };

    return (
        <div className="subject-container">
            <div className="add-content" onClick={() => setOpen(true)}>
                <span>Add Subject</span>
                <AiOutlinePlus className="plus-icon" />
            </div>

            <div className="item-list">
                {subjects.map((subject, index) => (
                    <div
                        key={subject.subject_id}
                        className='item-row'
                        onClick={() => onSelectSubject({ ...subject, language: "java" })}
                    >
                        <span>{subject.subject_title}</span>
                        <div className='actions'>
                            <AiOutlineEdit
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditIndex(index);
                                    setInput(subject.subject_title);
                                    setOpen(true);
                                }}
                            />
                            <AiOutlineDelete
                                onClick={(e) => handleDelete(e, subject.subject_id, index)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <CustomDialog
                open={open}
                onClose={handleClose}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onSave={handleSave}
                mode={editIndex !== null ? "Edit" : "Add"}
                title="Subject"
            />
        </div>
    );
};

export default SubjectList;