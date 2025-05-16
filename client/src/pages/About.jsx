import React from 'react';
import { Link } from 'react-router-dom';
import campus1 from '../assets/campus1.png';
import campus2 from '../assets/campus2.png';
import campus3 from '../assets/campus3.png';
import campus4 from '../assets/campus4.png';
import campus5 from '../assets/campus5.png';

function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <div className="about-images">
          <img src={campus1} alt="REVA University Campus" className="campus-img" />
          <img src={campus2} alt="REVA University Night View" className="campus-img" />
          <div className="image-grid">
            <img src={campus3} alt="REVA University Students" className="campus-img-small" />
            <img src={campus4} alt="REVA University Building" className="campus-img-small" />
            <img src={campus5} alt="REVA University Library" className="campus-img-small" />
          </div>
        </div>
        
        <div className="about-text">
          <p className="about-description">
            REVA University strives for academic excellence. Innovative pedagogy,
            best mentors, and faculty with vast industry experience offer modern
            education of global standards. Established in 2012 as REVA Group of
            Institutions, in less than a decade, the Government of Karnataka granted
            University status to REVA in 2013.
          </p>
          
          <div className="about-footer">
            <p>visit website <a href="https://www.reva.edu.in/" target="_blank" rel="noopener noreferrer">https://www.reva.edu.in/</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;