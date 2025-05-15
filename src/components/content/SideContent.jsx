import React, { useState, useRef } from 'react';
import './SideContent.css'
import MainContent from './MainContent';

import SideData from './SideContent.json'

const SideContent = () => {
  const resizerRef = useRef(null);
  const sidebarRef = useRef(null);
  const [selectedText, setSelectedText] = useState("");

  const handleClick = (text) => {
    setSelectedText(text); // when user clicks on Hii or Byy
  };

  // Setup effect to initialize resizer functionality after component mounts
  React.useEffect(() => {
    if (resizerRef.current && sidebarRef.current) {
      initResizerFn(resizerRef.current, sidebarRef.current);
    }
  }, []);

  return (
    <div className='sc_contener'>
      <div className="sidebar">
        {SideData.map((item, index) => (
          <div key={index} className="sidebar_content">
            {/* Assuming the JSON has 'title' and 'description' fields */}
            <div
              className='sidebar_item_text'
              style={{ fontWeight: 'bold' }}
              onClick={() => handleClick(item.title)}
            >{item.title}</div>

            <div className='sidebar_item'>
              {item.data.length > 0 ? (
                item.data.map((dataItem, i) => (
                  <div
                    className='sidebar_item_text'
                    key={i}
                    onClick={() => handleClick(dataItem.title)} 
                    style={{ marginTop: '5px' }}
                  >
                    {"> " + dataItem.title}
                  </div>
                ))
              ) : (
                <div onClick={() => handleClick('Byy')} style={{ cursor: 'pointer' }}>

                </div>
              )}
            </div>

          </div>
        ))}
      </div>
      <div className="resizer" ref={resizerRef} />

      <div className="main_contener">

        <MainContent text={
          selectedText === "" ? "Hii" : selectedText
        } />

      </div>

    </div>
  )
}

export default SideContent