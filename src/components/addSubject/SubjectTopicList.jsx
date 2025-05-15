import React, { useEffect, useState } from 'react';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import CustomDialog from './CustomDialog';
import axios from 'axios';

const SubjectTopicList = ({ selectedSubject, onSelectTopic }) => {
    const [topics, setTopics] = useState([]);
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [editIndex, setEditIndex] = useState(null);

    // Fetch topics whenever selectedSubject changes
    useEffect(() => {
        if (selectedSubject?.subject_id) {
            fetchTopics(selectedSubject.subject_id);
        } else {
            setTopics([]);
        }
    }, [selectedSubject]);

    const fetchTopics = async (subjectId) => {
        try {
            const res = await axios.get(`https://share-knowledge-api-production.up.railway.app/api/subject-topic-by-subject-id?id=${subjectId}`);
            setTopics(res.data.data || []);
        } catch (err) {
            console.error("Error fetching topics:", err);
        }
    };

    const handleSave = async () => {
        if (!input.trim() || !selectedSubject) return;

        try {
            if (editIndex !== null) {
                // Update existing topic
                const topicToEdit = topics[editIndex];
                const res = await axios.put(`https://share-knowledge-api-production.up.railway.app/api/subject-topic?id=${topicToEdit.subjects_topic_id}`, {
                    title: input
                });

                if (res.data?.data) {
                    const updatedTopics = [...topics];
                    updatedTopics[editIndex] = res.data.data;
                    setTopics(updatedTopics);
                }
            } else {
                // Add new topic
                const response = await axios.post('https://share-knowledge-api-production.up.railway.app/api/subject-topic', {
                    subject_id: selectedSubject.subject_id,
                    title: input
                });

                if (response.data?.data) {
                    setTopics([...topics, response.data.data]);
                }
            }
        } catch (err) {
            console.error("Error saving topic:", err);
        }

        handleClose();
    };

    const handleClose = () => {
        setOpen(false);
        setInput('');
        setEditIndex(null);
    };

    return (
        <div className="subject-topic-container">
            <div className={`add-content ${!selectedSubject ? 'disabled' : ''}`} onClick={() => selectedSubject && setOpen(true)}>
                <div>
                    <span>Add Topic</span>
                    {selectedSubject && <div className="subtitle">For "{selectedSubject.subject_title}"</div>}
                </div>
                <AiOutlinePlus className="plus-icon" />
            </div>

            <div className="item-list">
                {topics.map((topic, i) => (
                    <div
                        key={topic.subjects_topic_id}
                        onClick={() => onSelectTopic({ ...topic, "language": selectedSubject.language })}
                        className="item-row">
                        <span>{topic.title}</span>
                        <div className="actions">
                            <AiOutlineEdit onClick={(e) => {
                                e.stopPropagation();
                                setEditIndex(i);
                                setInput(topic.title);
                                setOpen(true);
                            }} />
                            <AiOutlineDelete
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    const topicToDelete = topics[i];
                                    try {
                                        await axios.delete(`https://share-knowledge-api-production.up.railway.app/api/subject-topic?id=${topicToDelete.subjects_topic_id}`);
                                        setTopics(topics.filter((_, idx) => idx !== i));
                                    } catch (err) {
                                        console.error("Error deleting topic:", err);
                                    }
                                }}
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
                title="Subject Topic"
            />
        </div>
    );
};

export default SubjectTopicList;