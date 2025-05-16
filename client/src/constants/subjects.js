/**
 * This file contains the hardcoded list of subjects for the application.
 * To add or modify subjects, update the SUBJECTS object below.
 * 
 * Structure:
 * - Each subject has a unique code
 * - Subjects are organized by department
 * - Each subject has a name and code
 * 
 * Departments:
 * - EF: Computer Science
 * - EH: AI & Data Science
 * - EQ: Information Science
 * - EJ: CS & IT
 * - EK: Computer Science & Systems
 * - EA: AI & ML
 */

export const SUBJECTS = {
  EF: {
    name: 'Computer Science',
    subjects: [
      { code: 'CS101', name: 'Introduction to Programming' },
      { code: 'CS102', name: 'Data Structures' },
      { code: 'CS103', name: 'Object-Oriented Programming' },
      { code: 'CS201', name: 'Database Management Systems' },
      { code: 'CS202', name: 'Operating Systems' },
      { code: 'CS203', name: 'Computer Networks' },
      { code: 'CS301', name: 'Software Engineering' },
      { code: 'CS302', name: 'Web Development' },
      { code: 'CS303', name: 'Mobile Application Development' },
      { code: 'CS401', name: 'Machine Learning' },
      { code: 'CS402', name: 'Cloud Computing' },
      { code: 'CS403', name: 'Cybersecurity' },
    ],
  },
  EH: {
    name: 'AI & Data Science',
    subjects: [
      { code: 'DS101', name: 'Introduction to Data Science' },
      { code: 'DS102', name: 'Python Programming' },
      { code: 'DS103', name: 'Statistics for Data Science' },
      { code: 'DS201', name: 'Machine Learning' },
      { code: 'DS202', name: 'Data Visualization' },
      { code: 'DS203', name: 'Big Data Analytics' },
      { code: 'DS301', name: 'Deep Learning' },
      { code: 'DS302', name: 'Natural Language Processing' },
      { code: 'DS303', name: 'Computer Vision' },
      { code: 'DS401', name: 'Reinforcement Learning' },
      { code: 'DS402', name: 'AI Ethics' },
      { code: 'DS403', name: 'AI Project Management' },
    ],
  },
  EQ: {
    name: 'Information Science',
    subjects: [
      { code: 'IS101', name: 'Information Systems' },
      { code: 'IS102', name: 'Database Design' },
      { code: 'IS103', name: 'Web Technologies' },
      { code: 'IS201', name: 'Information Security' },
      { code: 'IS202', name: 'Data Mining' },
      { code: 'IS203', name: 'Business Intelligence' },
      { code: 'IS301', name: 'Enterprise Systems' },
      { code: 'IS302', name: 'Cloud Computing' },
      { code: 'IS303', name: 'Mobile Computing' },
      { code: 'IS401', name: 'IT Project Management' },
      { code: 'IS402', name: 'IT Service Management' },
      { code: 'IS403', name: 'Digital Transformation' },
    ],
  },
  EJ: {
    name: 'CS & IT',
    subjects: [
      { code: 'IT101', name: 'IT Fundamentals' },
      { code: 'IT102', name: 'Programming Basics' },
      { code: 'IT103', name: 'Web Development' },
      { code: 'IT201', name: 'Database Systems' },
      { code: 'IT202', name: 'Computer Networks' },
      { code: 'IT203', name: 'Operating Systems' },
      { code: 'IT301', name: 'Software Development' },
      { code: 'IT302', name: 'Mobile Computing' },
      { code: 'IT303', name: 'Cloud Computing' },
      { code: 'IT401', name: 'IT Project Management' },
      { code: 'IT402', name: 'IT Security' },
      { code: 'IT403', name: 'Emerging Technologies' },
    ],
  },
  EK: {
    name: 'Computer Science & Systems',
    subjects: [
      { code: 'SS101', name: 'System Programming' },
      { code: 'SS102', name: 'Computer Architecture' },
      { code: 'SS103', name: 'Operating Systems' },
      { code: 'SS201', name: 'Computer Networks' },
      { code: 'SS202', name: 'Distributed Systems' },
      { code: 'SS203', name: 'Cloud Computing' },
      { code: 'SS301', name: 'System Security' },
      { code: 'SS302', name: 'System Administration' },
      { code: 'SS303', name: 'Virtualization' },
      { code: 'SS401', name: 'System Design' },
      { code: 'SS402', name: 'System Integration' },
      { code: 'SS403', name: 'System Maintenance' },
    ],
  },
  EA: {
    name: 'AI & ML',
    subjects: [
      { code: 'AI101', name: 'Introduction to AI' },
      { code: 'AI102', name: 'Python for AI' },
      { code: 'AI103', name: 'Mathematics for AI' },
      { code: 'AI201', name: 'Machine Learning' },
      { code: 'AI202', name: 'Deep Learning' },
      { code: 'AI203', name: 'Neural Networks' },
      { code: 'AI301', name: 'Computer Vision' },
      { code: 'AI302', name: 'Natural Language Processing' },
      { code: 'AI303', name: 'Reinforcement Learning' },
      { code: 'AI401', name: 'AI Ethics' },
      { code: 'AI402', name: 'AI Project Management' },
      { code: 'AI403', name: 'AI Research Methods' },
    ],
  },
};

// Helper function to get all subjects as a flat array
export const getAllSubjects = () => {
  return Object.values(SUBJECTS).flatMap(dept => dept.subjects);
};

// Helper function to get subjects by department
export const getSubjectsByDepartment = (department) => {
  return SUBJECTS[department]?.subjects || [];
}; 