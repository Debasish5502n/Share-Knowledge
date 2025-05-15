import React, { useEffect, useState } from 'react';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import AddLessonDialog from './AddLessonDialog';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';
import DOMPurify from 'dompurify';

const LessonList = ({ onSelectedTopic }) => {
    const [lessons, setLessons] = useState([]);
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [editingLesson, setEditingLesson] = useState(null);

    // Fetch lessons from the API based on the selected topic
    useEffect(() => {
        if (onSelectedTopic && onSelectedTopic.subjects_topic_id) {
            fetchLessons(onSelectedTopic.subjects_topic_id);
        }
    }, [onSelectedTopic]);

    const fetchLessons = async (subjectTopicId) => {
        try {
            const response = await axios.get(`https://share-knowledge-api-production.up.railway.app/api/lessons-by-subject-topic-id?id=${subjectTopicId}`);
            setLessons(response.data.data || []);
            console.log(response)
        } catch (error) {
            console.error("Error fetching lessons:", error);
        }
    };

    const handleSaveLesson = async (formData, editingLessonId = null) => {
        try {
            if (editingLessonId) {
                // EDIT LESSON
                await axios.put(
                    `https://share-knowledge-api-production.up.railway.app/api/lesson?id=${editingLessonId}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    }
                );
            } else {
                // ADD LESSON
                await axios.post(
                    'https://share-knowledge-api-production.up.railway.app/api/lesson',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    }
                );
            }

            fetchLessons(onSelectedTopic.subjects_topic_id); // refresh list
            setOpen(false);
            setEditingLesson(null);
        } catch (error) {
            console.error("Error saving lesson:", error);
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        try {
            await axios.delete(`https://share-knowledge-api-production.up.railway.app/api/lesson?id=${lessonId}`);
            fetchLessons(onSelectedTopic.subjects_topic_id); // Refresh list after deletion
        } catch (error) {
            console.error("Error deleting lesson:", error);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setInput('');
        setEditIndex(null);
        setEditingLesson(null);
    };

    return (
        <div className="lesson-container">
            <div className={`add-content ${!onSelectedTopic ? 'disabled' : ''}`} onClick={() => {
                onSelectedTopic && setOpen(true)
                setEditingLesson(null);
            }}>
                <div>
                    <span>Add Lesson</span>
                    {onSelectedTopic && <div className="subtitle">For "{onSelectedTopic.title}"</div>}
                </div>
                <AiOutlinePlus className="plus-icon" />
            </div>

            <div className="item-list">
                {lessons.map((lesson, i) => {
                    const { lessons_type, lessons_data } = lesson;
                    const type = ["code_example", "code_output"].includes(lessons_type?.trim())
                        ? "code"
                        : lessons_type?.trim();

                    const inputText = lessons_type?.trim() === "code_example" ? "Example: " : "Output :";

                    return (
                        <div key={i}>
                            {type === "title" ? (
                                 <pre className="body_title" dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(lessons_data),
                                  }}></pre>
                            ) : type === "description" ? (
                                <pre className="body_desc" dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(lessons_data),
                                  }}></pre>
                            ) : type === "code" ? (
                                <div className="code_editor_bg">
                                    <div className="code_editor_title">{inputText}</div>
                                    <SyntaxHighlighter className="code_editor"
                                        language={onSelectedTopic.language} style={oneDark}>
                                        {lessons_data}
                                    </SyntaxHighlighter>
                                </div>
                            ) : type === "image" ? (
                                <div className='mc_image_container'>
                                    <img className='mc_image' src={lessons_data} alt="Lesson visual" />
                                </div>
                            ) : (
                                <div className="default_text">{lessons_data}</div>
                            )}
                            <div className="actions">
                                <AiOutlineEdit
                                    onClick={() => {
                                        setEditingLesson(lesson);
                                        setOpen(true);
                                    }}
                                />
                                <AiOutlineDelete onClick={() => handleDeleteLesson(lesson.lessons_id)} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <AddLessonDialog
                open={open}
                onClose={() => {
                    setOpen(false);
                    setEditingLesson(null);
                }}
                value={input}
                onSave={handleSaveLesson}
                mode={editingLesson ? "Edit" : "Add"}
                title="Lesson"
                subjectId={onSelectedTopic?.subject_id}
                topicId={onSelectedTopic?.subjects_topic_id}
                editingLesson={editingLesson}
            />

        </div>
    );
};

export default LessonList;