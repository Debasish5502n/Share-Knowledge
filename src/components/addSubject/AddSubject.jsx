import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import "./AddSubject.css";
import SubjectList from './SubjectList';
import SubjectTopicList from './SubjectTopicList';
import LessonList from './LessonList';

const AddSubject = () => {
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get("courseId");
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');

    return (
        <div className="main-container">
            <SubjectList onSelectSubject={(sub) => setSelectedSubject(sub)} courseId={courseId} />

            <div className="divider"></div>

            <SubjectTopicList selectedSubject={selectedSubject}
             onSelectTopic={(topic) => setSelectedTopic(topic)} />

            <div className="divider"></div>

            <LessonList onSelectedTopic={selectedTopic}/>
        </div>
    );
};

export default AddSubject;