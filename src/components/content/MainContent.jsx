import React, { useEffect, useState } from 'react';
import './MainContent.css';
import MainJsonData from './MainContent.json';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DOMPurify from 'dompurify';

const MainContent = ({ text }) => {
  const [lessons, setLessons] = useState([]);

  const handleClick = (dataItem) => {
    console.log("Clicked:", dataItem);
  };

  return (
    <div>
      <div className="heading_text">{text}</div>
      {lessons.map((lesson, i) => {
        const { lessons_type, lessons_data } = lesson;
        const type = ["code_example", "code_output"].includes(lessons_type?.trim())
          ? "code"
          : lessons_type?.trim();

        const inputText = lessons_type?.trim() === "code_example" ? "Example: " : "Output :";

        return (
          <div key={index}>
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

              <div className="default_text">{item.data[0]}</div>

            )}
          </div>
        );
      })}
    </div>
  );
};

export default MainContent;
