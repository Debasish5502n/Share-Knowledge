import './AddLessonDialog.css';
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddLessonDialog = ({
    open,
    onClose,
    mode,
    title,
    onSave,
    subjectId,
    topicId,
    editingLesson,
}) => {
    const [lessonsType, setLessonsType] = useState('title');
    const [textData, setTextData] = useState('');
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (editingLesson) {
            setLessonsType(editingLesson.lessons_type);
            if (editingLesson.lessons_type === 'image') {
                setImageFile(null);
            } else {
                setTextData(editingLesson.lessons_data);
            }
        } else {
            setLessonsType('title');
            setTextData('');
            setImageFile(null);
        }
    }, [editingLesson]);

    if (!open) return null;

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('subject_id', subjectId);
        formData.append('subjects_topic_id', topicId);
        formData.append('lessons_type', lessonsType);

        if (lessonsType === 'image') {
            formData.append('lessons_data', imageFile);
        } else {
            formData.append('lessons_data', textData);
        }

        const lessonId = editingLesson?.lessons_id || null;
        onSave(formData, lessonId); // pass lesson ID if editing
    };

    return (
        <div className="dialog-backdrop" onClick={onClose}>
            <div className="custom-dialog" onClick={(e) => e.stopPropagation()}>
                <h3>{mode} {title}</h3>

                <label>Lesson Type:</label>
                <select
                    className='dialog-select'
                    value={lessonsType}
                    onChange={(e) => {
                        setLessonsType(e.target.value);
                        setTextData('');
                        setImageFile(null);
                    }}
                >
                    <option className='dialog-options' value="title">Title</option>
                    <option className='dialog-options' value="description">Description</option>
                    <option className='dialog-options' value="code_example">Code_example</option>
                    <option className='dialog-options' value="code_output">Code_output</option>
                    <option className='dialog-options' value="image">Image</option>
                </select>

                {lessonsType === 'image' ? (
                    <>
                        <label>Upload Image:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                    </>
                ) : lessonsType === 'code_example' || lessonsType === 'code_output' ? (
                    <>
                        <label>Lesson Text ({lessonsType})</label>
                        <textarea
                            className='dialog-description'
                            placeholder={`Enter lesson text (${lessonsType})`}
                            value={textData}
                            onChange={(e) => setTextData(e.target.value)}
                        />
                    </>
                ) :
                    <>
                        <label>Lesson Text ({lessonsType})</label>
                        <ReactQuill
                            className='dialog-description'
                            placeholder={`Enter lesson text ${lessonsType}`}
                            value={textData}
                            onChange={setTextData}
                        />

                    </>
                }

                <div className="dialog-actions">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSubmit}>{mode}</button>
                </div>
            </div>
        </div>
    );
};

export default AddLessonDialog;