import React, { useState, useEffect } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import Button from '../../../base-components/Button';
import Card from '../../../base-components/Card';
import { Download, Eye, ArrowLeft, Loader2 } from 'lucide-react';
import PortfolioPDFDocumentComprehensive from './PortfolioPDFDocumentComprehensive';
import { createPortfolioDataFromHistory } from '../../../services/portfolioStudentService';

// Certificates array for testing
const certificates = [
  {
    certificateName: "Best Academic Performance",
    certificateType: "Academic",
    issueDate: "2025-10-01T00:00:00.000+00:00",
    expiryDate: "2025-10-31T00:00:00.000+00:00",
    certificateFile: {
      fileName: "best-academic-performance.pdf",
      fileUrl: "https://school-portfolio.s3.amazonaws.com/certificates/best-academic-performance.pdf",
      fileType: "application/pdf"
    },
    issuedBy: "School Administration",
    status: "Active"
  },
  {
    certificateName: "Exemplary Leadership Award",
    certificateType: "Co-curricular",
    issueDate: "2025-09-15T00:00:00.000+00:00",
    expiryDate: "2026-09-15T00:00:00.000+00:00",
    certificateFile: {
      fileName: "leadership-award.pdf",
      fileUrl: "https://school-portfolio.s3.amazonaws.com/certificates/leadership-award.pdf",
      fileType: "application/pdf"
    },
    issuedBy: "Student Council",
    status: "Active"
  },
  {
    certificateName: "Science Fair Participation",
    certificateType: "Academic",
    issueDate: "2025-08-20T00:00:00.000+00:00",
    expiryDate: "2025-12-31T00:00:00.000+00:00",
    certificateFile: {
      fileName: "science-fair.pdf",
      fileUrl: "https://school-portfolio.s3.amazonaws.com/certificates/science-fair.pdf",
      fileType: "application/pdf"
    },
    issuedBy: "Science Department",
    status: "Active"
  },
  {
    certificateName: "Sportsmanship Award",
    certificateType: "Sports",
    issueDate: "2025-07-01T00:00:00.000+00:00",
    expiryDate: "2026-06-30T00:00:00.000+00:00",
    certificateFile: {
      fileName: "sportsmanship-award.pdf",
      fileUrl: "https://school-portfolio.s3.amazonaws.com/certificates/sportsmanship-award.pdf",
      fileType: "application/pdf"
    },
    issuedBy: "Games Department",
    status: "Active"
  },
  {
    certificateName: "Environmental Club Recognition",
    certificateType: "Club Activity",
    issueDate: "2025-06-10T00:00:00.000+00:00",
    expiryDate: "2026-06-10T00:00:00.000+00:00",
    certificateFile: {
      fileName: "environmental-club.pdf",
      fileUrl: "https://school-portfolio.s3.amazonaws.com/certificates/environmental-club.pdf",
      fileType: "application/pdf"
    },
    issuedBy: "Environmental Club",
    status: "Active"
  },
  {
    certificateName: "Sportsmanship Award",
    certificateType: "Sports",
    issueDate: "2025-07-01T00:00:00.000+00:00",
    expiryDate: "2026-06-30T00:00:00.000+00:00",
    certificateFile: {
      fileName: "sportsmanship-award.pdf",
      fileUrl: "https://school-portfolio.s3.amazonaws.com/certificates/sportsmanship-award.pdf",
      fileType: "application/pdf"
    },
    issuedBy: "Games Department",
    status: "Active"
  },
  {
    certificateName: "Sportsmanship Award",
    certificateType: "Sports",
    issueDate: "2025-07-01T00:00:00.000+00:00",
    expiryDate: "2026-06-30T00:00:00.000+00:00",
    certificateFile: {
      fileName: "sportsmanship-award.pdf",
      fileUrl: "https://school-portfolio.s3.amazonaws.com/certificates/sportsmanship-award.pdf",
      fileType: "application/pdf"
    },
    issuedBy: "Games Department",
    status: "Active"
  },
  {
    certificateName: "Sportsmanship Award",
    certificateType: "Sports",
    issueDate: "2025-07-01T00:00:00.000+00:00",
    expiryDate: "2026-06-30T00:00:00.000+00:00",
    certificateFile: {
      fileName: "sportsmanship-award.pdf",
      fileUrl: "https://school-portfolio.s3.amazonaws.com/certificates/sportsmanship-award.pdf",
      fileType: "application/pdf"
    },
    issuedBy: "Games Department",
    status: "Active"
  }
];

// Comprehensive sample data for testing
const samplePortfolioData = {
  student: {
    _id: "test_student_001",
    first_name: 'Samwel',
    last_name: 'Mwendwa',
    surname: 'Kiprop',
    fullName: 'Samwel Mwendwa Kiprop',
    adm_no: 'ELM/2024/001',
  },
  academicYear: '2024',
  term: 'Term 3',
  generatedAt: new Date(),
  statistics: {
    totalEvidences: 25,
    totalCompetencies: 8,
    totalLearningAreas: 5,
    averageRating: 4.3,
    evidenceByType: {
      photo: 15,
      video: 8,
      document: 2
    },
    photoCount: 15,
    videoCount: 8
  },
  competenciesAchieved: [
    { 
      competency: { _id: "comp101", name: "Communication & Collaboration", code: "CC101" },
      count: 15,
      rating: 4.5
    },
    { 
      competency: { _id: "comp102", name: "Critical Thinking", code: "CT102" },
      count: 12,
      rating: 4.2
    },
    { 
      competency: { _id: "comp103", name: "Creativity & Innovation", code: "CI103" },
      count: 18,
      rating: 4.8
    },
    { 
      competency: { _id: "comp104", name: "Digital Literacy", code: "DL104" },
      count: 10,
      rating: 4.0
    },
  ],
  learningAreasCovered: [
    {
      learningArea: { _id: "la101", name: "Mathematics", code: "MATH" },
      count: 7
    },
    {
      learningArea: { _id: "la102", name: "Science", code: "SCI" },
      count: 5
    },
    {
      learningArea: { _id: "la103", name: "English", code: "ENG" },
      count: 6
    }
  ],
  reflections: [
    {
      title: 'Community Garden Project',
      reflection: 'This term has been transformative. I discovered my passion for environmental science through our conservation projects.',
      learningArea: 'Science',
      competency: 'Social Responsibility',
      date: '2024-02-20'
    },
    {
      title: 'Peer Tutoring',
      reflection: 'Mathematics used to be challenging, but through systematic problem-solving approaches, I\'ve developed confidence.',
      learningArea: 'Mathematics',
      competency: 'Critical Thinking',
      date: '2024-03-05'
    }
  ],
  teacherFeedbacks: [
    {
      evidenceTitle: 'Community Garden',
      comment: 'Samwel demonstrates exceptional leadership qualities and consistently shows initiative in group projects.',
      rating: 5,
      feedbackBy: 'Ms. Sarah Kimani',
      date: '2024-02-25',
      authenticityApproved: true
    },
    {
      evidenceTitle: 'Mathematics Project',
      comment: 'Outstanding mathematical reasoning and problem-solving skills.',
      rating: 5,
      feedbackBy: 'Mr. John Mwangi',
      date: '2024-03-30',
      authenticityApproved: true
    }
  ],
  strengths: [
    'Demonstrates exceptional leadership and initiative',
    'Strong analytical and critical thinking skills',
    'Excellent communication abilities',
    'Creative problem-solving approach',
    'Works well collaboratively in teams',
    'Shows remarkable resilience and perseverance in challenging tasks',
    'Exhibits strong ethical values and integrity in all activities',
    'Displays excellent time management and organizational skills',
    'Demonstrates initiative in seeking additional learning opportunities',
    'Shows exceptional ability to mentor and support peers',
    'Displays creative thinking and innovative solutions to problems',
    'Exhibits strong research skills and attention to detail',
    'Shows excellent adaptability to new situations and challenges',
    'Demonstrates consistent commitment to personal growth',
    'Exhibits strong presentation and public speaking skills',
  ],
  improvements: [
    'Continue developing time management skills',
    'Enhance public speaking confidence',
    'Strengthen organizational skills',
    'Practice more advanced mathematical concepts',
    'Continue building independence in research projects',
    'Develop more confidence in taking calculated risks',
    'Work on seeking feedback more proactively'

  ],
  projectEvidences: [
    {
      _id: "ev001",
      title: "Science Project - Solar System Model",
      caption: "My 3D model of the solar system using recycled materialsy 3D model of the solar system using recycled materialsy 3D model of the solar system using recycled materialsy 3D model of the solar system using recycled materialsy 3D model of the solar system using recycled materials",
      description: "A creative representation of the solar system demonstrating planetary motion.A creative representation of the solar system demonstrating planetary motion.A creative representation of the solar system demonstrating planetary motion.A creative representation of the solar system demonstrating planetary motion.A creative representation of the solar system demonstrating planetary motion.",
      reflection: "I learned about planet sizes and distances while being creative with recycled materials.I learned about planet sizes and distances while being creative with recycled materials.I learned about planet sizes and distances while being creative with recycled materials.I learned about planet sizes and distances while being creative with recycled materials.I learned about planet sizes and distances while being creative with recycled materials.",
      evidenceType: "photo",
      mediaUrl: "https://school-portfolio.s3.amazonaws.com/evidence/solar-system.jpg",
      thumbnailUrl: "https://school-portfolio.s3.amazonaws.com/evidence/thumbnails/solar-system-thumb.jpg",
      pci: "PCI-SC-2025-001",
      competency: { _id: "comp101", name: "Critical Thinking", code: "CT101" },
      learningArea: { _id: "la102", name: "Science" },
      submittedAt: "2025-10-15T08:00:00Z",
      status: "Approved",
      googleDriveFiles: [],
      googleDriveUrl: "https://drive.google.com/file/d/abcdef123456/view",
      googleDriveFileId: "abcdef123456",
      teacherFeedback: [
        {
          comment: "Well thought out and neatly done project.",
          rating: 4.7,
          authenticityApproved: true,
          feedbackBy: "Mr. Kamau",
          feedbackDate: "2025-10-17T09:00:00Z"
        }
      ]
    },
    {
      _id: "ev002",
      title: "English Presentation - My Favorite Book",
      caption: "An oral presentation about ‘The River and The Source’.An oral presentation about ‘The River and The Source’.An oral presentation about ‘The River and The Source’.An oral presentation about ‘The River and The Source’.An oral presentation about ‘The River and The Source’.      ",
      description: "A five-minute presentation summarizing key themes and lessons.A five-minute presentation summarizing key themes and lessons.A five-minute presentation summarizing key themes and lessons.A five-minute presentation summarizing key themes and lessons.A five-minute presentation summarizing key themes and lessons.  ",
      reflection: "I gained confidence speaking in front of others.",
      evidenceType: "video",
      mediaUrl: "https://school-portfolio.s3.amazonaws.com/evidence/english-presentation.mp4",
      thumbnailUrl: "https://school-portfolio.s3.amazonaws.com/evidence/thumbnails/english-thumb.jpg",
      pci: "PCI-EN-2025-002",
      competency: { _id: "comp102", name: "Teamwork", code: "TW102" },
      learningArea: { _id: "la103", name: "English" },
      submittedAt: "2025-10-10T09:00:00Z",
      status: "Reviewed",
      googleDriveFiles: [],
      googleDriveUrl: null,
      googleDriveFileId: null,
      teacherFeedback: [
        {
          comment: "Very engaging presentation. Work on eye contact.",
          rating: 4.0,
          authenticityApproved: true,
          feedbackBy: "Ms. Njeri",
          feedbackDate: "2025-10-12T10:30:00Z"
        }
      ]
    },
    {
      _id: "ev002",
      title: "English Presentation - My Favorite Book",
      caption: "An oral presentation about ‘The River and bout ‘The River and The Source’.      ",
      description: "A five-minute presentation summarizing key themes and lessons.  ",
      reflection: "I gained confidence speaking in front of others.",
      evidenceType: "video",
      mediaUrl: "https://school-portfolio.s3.amazonaws.com/evidence/english-presentation.mp4",
      thumbnailUrl: "https://school-portfolio.s3.amazonaws.com/evidence/thumbnails/english-thumb.jpg",
      pci: "PCI-EN-2025-002",
      competency: { _id: "comp102", name: "Teamwork", code: "TW102" },
      learningArea: { _id: "la103", name: "English" },
      submittedAt: "2025-10-10T09:00:00Z",
      status: "Reviewed",
      googleDriveFiles: [],
      googleDriveUrl: null,
      googleDriveFileId: null,
      teacherFeedback: [
        {
          comment: "Very engaging presentation. Work on eye contact.",
          rating: 4.0,
          authenticityApproved: true,
          feedbackBy: "Ms. Njeri",
          feedbackDate: "2025-10-12T10:30:00Z"
        }
      ]
    },
    {
      _id: "ev002",
      title: "English Presentation - My Favorite Book",
      caption: "An oral presentation about ‘The River and The Source’.An oral presentation about ‘The River and The Source’.An oral presentation about ‘The River and The Source’.An oral presentation about ‘The River and The Source’.An oral presentation about ‘The River and The Source’.  ",
      description: "A five-minute presentation summarizing key themes and lessons.A five-minute presentation summarizing key themes and lessons.A five-minute presentation summarizing key themes and lessons.A five-minute presentation summarizing key themes and lessons.A five-minute presentation summarizing key themes and lessons. ",
      reflection: "I gained confidence speaking in front of others.I gained confidence speaking in front of others.I gained confidence speaking in front of others.I gained confidence speaking in front of others.I gained confidence speaking in front of others. ",
      evidenceType: "video",
      mediaUrl: "https://school-portfolio.s3.amazonaws.com/evidence/english-presentation.mp4",
      thumbnailUrl: "https://school-portfolio.s3.amazonaws.com/evidence/thumbnails/english-thumb.jpg",
      pci: "PCI-EN-2025-002",
      competency: { _id: "comp102", name: "Teamwork", code: "TW102" },
      learningArea: { _id: "la103", name: "English" },
      submittedAt: "2025-10-10T09:00:00Z",
      status: "Reviewed",
      googleDriveFiles: [],
      googleDriveUrl: null,
      googleDriveFileId: null,
      teacherFeedback: [
        {
          comment: "Very engaging presentation. Work on eye contact.",
          rating: 4.0,
          authenticityApproved: true,
          feedbackBy: "Ms. Njeri",
          feedbackDate: "2025-10-12T10:30:00Z"
        }
      ]
    },
    {
      _id: "ev003",
      title: "Mathematics Project - Geometry Shapes",
      caption: "Created geometric models demonstrating understanding of 3D shapes and their properties. Used various materials to build pyramids, cubes, and cylinders.",
      description: "A hands-on project exploring 3D geometric shapes, their properties, surface areas, and volumes. The project included models and calculations.",
      reflection: "This project helped me visualize geometric concepts better. I understood how to calculate surface areas and volumes practically.",
      evidenceType: "photo",
      mediaUrl: "https://school-portfolio.s3.amazonaws.com/evidence/geometry-shapes.jpg",
      thumbnailUrl: "https://school-portfolio.s3.amazonaws.com/evidence/thumbnails/geometry-thumb.jpg",
      pci: "PCI-MATH-2025-003",
      competency: { _id: "comp103", name: "Critical Thinking", code: "CT103" },
      learningArea: { _id: "la101", name: "Mathematics", code: "MATH" },
      submittedAt: "2025-09-20T10:00:00Z",
      status: "Approved",
      googleDriveFiles: [],
      googleDriveUrl: "https://drive.google.com/file/d/xyz789/view",
      googleDriveFileId: "xyz789",
      teacherFeedback: [
        {
          comment: "Excellent understanding of geometric concepts. Well-constructed models.",
          rating: 4.8,
          authenticityApproved: true,
          feedbackBy: "Mr. Ochieng",
          feedbackDate: "2025-09-22T11:00:00Z"
        },
        {
          comment: "Great presentation of calculations. Keep up the good work.",
          rating: 4.5,
          authenticityApproved: true,
          feedbackBy: "Mrs. Wanjiru",
          feedbackDate: "2025-09-23T09:15:00Z"
        }
      ]
    },
    {
      _id: "ev004",
      title: "Science Experiment - Water Cycle",
      caption: "Conducted an experiment demonstrating the water cycle using a closed system with condensation and evaporation.",
      description: "Created a model showing evaporation, condensation, and precipitation. Documented observations over several days.",
      reflection: "I learned how the water cycle works through practical observation. It made the concept much clearer than reading about it.",
      evidenceType: "video",
      mediaUrl: "https://school-portfolio.s3.amazonaws.com/evidence/water-cycle.mp4",
      thumbnailUrl: "https://school-portfolio.s3.amazonaws.com/evidence/thumbnails/water-cycle-thumb.jpg",
      pci: "PCI-SCI-2025-004",
      competency: { _id: "comp104", name: "Scientific Inquiry", code: "SI104" },
      learningArea: { _id: "la102", name: "Science", code: "SCI" },
      submittedAt: "2025-09-15T14:30:00Z",
      status: "Approved",
      googleDriveFiles: [],
      googleDriveUrl: null,
      googleDriveFileId: null,
      teacherFeedback: [
        {
          comment: "Well-executed experiment with clear documentation. Great scientific method.",
          rating: 4.6,
          authenticityApproved: true,
          feedbackBy: "Dr. Muthoni",
          feedbackDate: "2025-09-18T10:20:00Z"
        }
      ]
    },
    {
      _id: "ev005",
      title: "Creative Arts - Mural Painting",
      caption: "Collaborated with classmates to create a school mural celebrating cultural diversity.",
      description: "Led a team of 8 students to design and paint a large mural on the school wall. Incorporated elements from different cultures.",
      reflection: "Working with my peers taught me about collaboration and cultural appreciation. The mural is now a permanent part of our school.",
      evidenceType: "photo",
      mediaUrl: "https://school-portfolio.s3.amazonaws.com/evidence/mural-painting.jpg",
      thumbnailUrl: "https://school-portfolio.s3.amazonaws.com/evidence/thumbnails/mural-thumb.jpg",
      pci: "PCI-ART-2025-005",
      competency: { _id: "comp105", name: "Creativity & Innovation", code: "CI105" },
      learningArea: { _id: "la104", name: "Creative Arts", code: "ART" },
      submittedAt: "2025-08-25T16:00:00Z",
      status: "Approved",
      googleDriveFiles: [],
      googleDriveUrl: "https://drive.google.com/file/d/art123/view",
      googleDriveFileId: "art123",
      teacherFeedback: [
        {
          comment: "Outstanding leadership and creativity. The mural is beautiful and meaningful.",
          rating: 5.0,
          authenticityApproved: true,
          feedbackBy: "Ms. Achieng",
          feedbackDate: "2025-08-28T13:45:00Z"
        },
        {
          comment: "Excellent collaboration skills demonstrated throughout the project.",
          rating: 4.9,
          authenticityApproved: true,
          feedbackBy: "Mr. Otieno",
          feedbackDate: "2025-08-29T10:30:00Z"
        }
      ]
    },
    {
      _id: "ev006",
      title: "Social Studies - Historical Timeline",
      caption: "Created an interactive timeline of Kenya's independence journey from colonization to independence.",
      description: "Researched and documented key events, dates, and figures in Kenya's history. Presented using a visual timeline with images and descriptions.",
      reflection: "I gained a deeper appreciation for our nation's history and the sacrifices made by our freedom fighters.",
      evidenceType: "document",
      mediaUrl: "https://school-portfolio.s3.amazonaws.com/evidence/historical-timeline.pdf",
      thumbnailUrl: "https://school-portfolio.s3.amazonaws.com/evidence/thumbnails/timeline-thumb.jpg",
      pci: "PCI-SS-2025-006",
      competency: { _id: "comp106", name: "Research Skills", code: "RS106" },
      learningArea: { _id: "la105", name: "Social Studies", code: "SS" },
      submittedAt: "2025-10-01T11:00:00Z",
      status: "Reviewed",
      googleDriveFiles: [],
      googleDriveUrl: "https://drive.google.com/file/d/hist456/view",
      googleDriveFileId: "hist456",
      teacherFeedback: [
        {
          comment: "Thorough research with well-organized presentation. Very informative timeline.",
          rating: 4.7,
          authenticityApproved: true,
          feedbackBy: "Mr. Kipchoge",
          feedbackDate: "2025-10-03T14:20:00Z"
        }
      ]
    },
    {
      _id: "ev007",
      title: "Kiswahili - Story Writing",
      caption: "Wrote and illustrated an original short story in Kiswahili about friendship and community values.",
      description: "Created a 5-page story with original characters and illustrations. Demonstrated understanding of Kiswahili grammar and vocabulary.",
      reflection: "Writing in Kiswahili improved my language skills and allowed me to express creativity through storytelling.",
      evidenceType: "document",
      mediaUrl: "https://school-portfolio.s3.amazonaws.com/evidence/kiswahili-story.pdf",
      thumbnailUrl: "https://school-portfolio.s3.amazonaws.com/evidence/thumbnails/story-thumb.jpg",
      pci: "PCI-KSW-2025-007",
      competency: { _id: "comp107", name: "Communication", code: "COM107" },
      learningArea: { _id: "la106", name: "Kiswahili", code: "KSW" },
      submittedAt: "2025-09-10T09:30:00Z",
      status: "Approved",
      googleDriveFiles: [],
      googleDriveUrl: null,
      googleDriveFileId: null,
      teacherFeedback: [
        {
          comment: "Creative storytelling with excellent use of Kiswahili language. Well illustrated.",
          rating: 4.5,
          authenticityApproved: true,
          feedbackBy: "Mrs. Wanjala",
          feedbackDate: "2025-09-12T10:00:00Z"
        }
      ]
    },
    {
      _id: "ev008",
      title: "Mathematics - Fraction Model",
      caption: "Built interactive fraction models using paper cutouts to demonstrate addition and subtraction of fractions.",
      description: "Created visual models showing how fractions work. Demonstrated operations with like and unlike denominators.",
      reflection: "Using physical models made fractions much easier to understand. I can now visualize fraction operations.",
      evidenceType: "photo",
      mediaUrl: "https://school-portfolio.s3.amazonaws.com/evidence/fraction-model.jpg",
      thumbnailUrl: "https://school-portfolio.s3.amazonaws.com/evidence/thumbnails/fraction-thumb.jpg",
      pci: "PCI-MATH-2025-008",
      competency: { _id: "comp103", name: "Problem Solving", code: "PS103" },
      learningArea: { _id: "la101", name: "Mathematics", code: "MATH" },
      submittedAt: "2025-08-30T13:15:00Z",
      status: "Approved",
      googleDriveFiles: [],
      googleDriveUrl: "https://drive.google.com/file/d/frac789/view",
      googleDriveFileId: "frac789",
      teacherFeedback: [
        {
          comment: "Innovative approach to learning fractions. Clear demonstration of understanding.",
          rating: 4.6,
          authenticityApproved: true,
          feedbackBy: "Mr. Ochieng",
          feedbackDate: "2025-09-02T11:30:00Z"
        }
      ]
    },
    {
      _id: "ev009",
      title: "Science - Plant Growth Experiment",
      caption: "Conducted an experiment comparing plant growth under different light conditions over 4 weeks.",
      description: "Set up three identical plants under different light conditions: full sunlight, partial shade, and artificial light. Measured growth weekly.",
      reflection: "This experiment taught me about photosynthesis and the importance of light for plant growth. I enjoyed the hands-on learning.",
      evidenceType: "photo",
      mediaUrl: "https://school-portfolio.s3.amazonaws.com/evidence/plant-growth.jpg",
      thumbnailUrl: "https://school-portfolio.s3.amazonaws.com/evidence/thumbnails/plant-thumb.jpg",
      pci: "PCI-SCI-2025-009",
      competency: { _id: "comp104", name: "Scientific Inquiry", code: "SI104" },
      learningArea: { _id: "la102", name: "Science", code: "SCI" },
      submittedAt: "2025-07-20T08:00:00Z",
      status: "Approved",
      googleDriveFiles: [],
      googleDriveUrl: "https://drive.google.com/file/d/plant456/view",
      googleDriveFileId: "plant456",
      teacherFeedback: [
        {
          comment: "Excellent experimental design and data collection. Well-documented findings.",
          rating: 4.8,
          authenticityApproved: true,
          feedbackBy: "Dr. Muthoni",
          feedbackDate: "2025-08-18T15:00:00Z"
        },
        {
          comment: "Patient and thorough observation skills demonstrated throughout the experiment.",
          rating: 4.7,
          authenticityApproved: true,
          feedbackBy: "Ms. Chebet",
          feedbackDate: "2025-08-19T09:20:00Z"
        }
      ]
    },
    {
      _id: "ev010",
      title: "English - Poetry Recitation",
      caption: "Memorized and performed a classic English poem with appropriate gestures and voice modulation.",
      description: "Selected and memorized 'The Road Not Taken' by Robert Frost. Performed with expressive delivery and body language.",
      reflection: "Reciting poetry helped me improve my pronunciation and public speaking confidence. I enjoyed expressing emotions through words.",
      evidenceType: "video",
      mediaUrl: "https://school-portfolio.s3.amazonaws.com/evidence/poetry-recitation.mp4",
      thumbnailUrl: "https://school-portfolio.s3.amazonaws.com/evidence/thumbnails/poetry-thumb.jpg",
      pci: "PCI-EN-2025-010",
      competency: { _id: "comp108", name: "Communication & Expression", code: "CE108" },
      learningArea: { _id: "la103", name: "English", code: "ENG" },
      submittedAt: "2025-09-05T10:45:00Z",
      status: "Approved",
      googleDriveFiles: [],
      googleDriveUrl: null,
      googleDriveFileId: null,
      teacherFeedback: [
        {
          comment: "Expressive delivery with clear pronunciation. Well-memorized and confidently presented.",
          rating: 4.4,
          authenticityApproved: true,
          feedbackBy: "Ms. Njeri",
          feedbackDate: "2025-09-07T11:15:00Z"
        }
      ]
    },
    {
      _id: "ev011",
      title: "Technology - Coding Project",
      caption: "Created a simple interactive game using Scratch programming to teach basic math skills.",
      description: "Designed and programmed a game where players solve math problems. Used Scratch blocks to create interactive elements.",
      reflection: "Coding this game helped me understand logic and problem-solving. I'm excited to learn more programming.",
      evidenceType: "video",
      mediaUrl: "https://school-portfolio.s3.amazonaws.com/evidence/coding-game.mp4",
      thumbnailUrl: "https://school-portfolio.s3.amazonaws.com/evidence/thumbnails/coding-thumb.jpg",
      pci: "PCI-TECH-2025-011",
      competency: { _id: "comp109", name: "Digital Literacy", code: "DL109" },
      learningArea: { _id: "la107", name: "Science & Technology", code: "TECH" },
      submittedAt: "2025-10-05T14:00:00Z",
      status: "Approved",
      googleDriveFiles: [],
      googleDriveUrl: "https://drive.google.com/file/d/code123/view",
      googleDriveFileId: "code123",
      teacherFeedback: [
        {
          comment: "Impressive coding skills for your age. The game is engaging and educational.",
          rating: 4.9,
          authenticityApproved: true,
          feedbackBy: "Mr. Mwangi",
          feedbackDate: "2025-10-07T10:30:00Z"
        },
        {
          comment: "Great logical thinking and creativity in game design. Well done!",
          rating: 4.7,
          authenticityApproved: true,
          feedbackBy: "Mrs. Nyambura",
          feedbackDate: "2025-10-08T13:45:00Z"
        }
      ]
    },
    {
      _id: "ev012",
      title: "Physical Education - Sports Analysis",
      caption: "Recorded and analyzed performance in various track and field events, creating improvement strategies.",
      description: "Documented participation in 100m dash, long jump, and shot put. Analyzed performance data and created training goals.",
      reflection: "Tracking my performance helped me set realistic goals and see improvement over time. I learned the value of persistence.",
      evidenceType: "document",
      mediaUrl: "https://school-portfolio.s3.amazonaws.com/evidence/sports-analysis.pdf",
      thumbnailUrl: "https://school-portfolio.s3.amazonaws.com/evidence/thumbnails/sports-thumb.jpg",
      pci: "PCI-PE-2025-012",
      competency: { _id: "comp110", name: "Self-Awareness & Reflection", code: "SAR110" },
      learningArea: { _id: "la108", name: "Physical Education", code: "PE" },
      submittedAt: "2025-09-25T15:30:00Z",
      status: "Reviewed",
      googleDriveFiles: [],
      googleDriveUrl: null,
      googleDriveFileId: null,
      teacherFeedback: [
        {
          comment: "Excellent self-reflection and goal-setting. Keep working on your technique.",
          rating: 4.3,
          authenticityApproved: true,
          feedbackBy: "Coach Kimani",
          feedbackDate: "2025-09-27T16:00:00Z"
        }
      ]
    }
  ],
  awards: [
    {
      title: 'Academic Excellence Award',
      issueDate: '2024-03-15',
      category: 'Academic',
      description: 'Top performer in Mathematics'
    },
    {
      title: 'Leadership Recognition',
      issueDate: '2024-02-20',
      category: 'Leadership',
      description: 'Student Council President'
    }
  ],
  summaryInsights: {
    mostActiveLearningArea: "Mathematics",
    topCompetency: "Creativity & Innovation",
    recentActivity: "2024-04-10T10:00:00Z"
  },
  // Include the certificates array with detailed information
  certificates: certificates,
  // Subject Enrollment & Performance Data
  subjectEnrollments: [
    {
      subject: { name: "Mathematics", code: "MATH", level: "primary", category: "core" },
      enrollmentDate: "2024-01-15",
      status: "Active",
      credits: 4,
      hoursPerWeek: 5,
      performance: { grade: "A", averageScore: 92, attendance: 98 },
      teacher: "Mr. Ochieng"
    },
    {
      subject: { name: "Science", code: "SCI", level: "primary", category: "core" },
      enrollmentDate: "2024-01-15",
      status: "Active",
      credits: 4,
      hoursPerWeek: 5,
      performance: { grade: "A", averageScore: 88, attendance: 96 },
      teacher: "Dr. Muthoni"
    },
    {
      subject: { name: "English", code: "ENG", level: "primary", category: "core" },
      enrollmentDate: "2024-01-15",
      status: "Active",
      credits: 3,
      hoursPerWeek: 4,
      performance: { grade: "A", averageScore: 90, attendance: 97 },
      teacher: "Ms. Njeri"
    },
    {
      subject: { name: "Kiswahili", code: "KSW", level: "primary", category: "core" },
      enrollmentDate: "2024-01-15",
      status: "Active",
      credits: 3,
      hoursPerWeek: 4,
      performance: { grade: "A-", averageScore: 87, attendance: 95 },
      teacher: "Mrs. Wanjala"
    },
    {
      subject: { name: "Creative Arts", code: "ART", level: "primary", category: "elective" },
      enrollmentDate: "2024-01-15",
      status: "Active",
      credits: 2,
      hoursPerWeek: 3,
      performance: { grade: "A", averageScore: 94, attendance: 99 },
      teacher: "Ms. Achieng"
    },
    {
      subject: { name: "Social Studies", code: "SS", level: "primary", category: "core" },
      enrollmentDate: "2024-01-15",
      status: "Active",
      credits: 3,
      hoursPerWeek: 4,
      performance: { grade: "A-", averageScore: 86, attendance: 96 },
      teacher: "Mr. Kipchoge"
    }
  ],
  // Communication & Parent Engagement Logs
  communicationLogs: [
    {
      date: "2024-10-15",
      type: "Phone Call",
      purpose: "Academic Progress Update",
      participant: "Parent - Mrs. Mwendwa",
      duration: 15,
      summary: "Discussed student's excellent performance in Mathematics and Science. Parents very satisfied with progress.",
      outcome: "Scheduled follow-up meeting for term end"
    },
    {
      date: "2024-09-20",
      type: "Parent-Teacher Meeting",
      purpose: "Mid-Term Assessment",
      participant: "Both Parents",
      duration: 30,
      summary: "Comprehensive review of academic achievements and areas for improvement. Discussed leadership role.",
      outcome: "Parents committed to support student's continued growth"
    },
    {
      date: "2024-08-10",
      type: "Email Communication",
      purpose: "School Event Invitation",
      participant: "Parent - Mrs. Mwendwa",
      duration: null,
      summary: "Invited parents to school science fair where student's project was displayed.",
      outcome: "Parents attended and were impressed"
    },
    {
      date: "2024-07-25",
      type: "Phone Call",
      purpose: "Congratulations on Achievement",
      participant: "Parent - Mr. Kiprop",
      duration: 10,
      summary: "Called to congratulate student on being elected Student Council President.",
      outcome: "Parents expressed pride and support"
    }
  ],
  // Cohort & Class Information
  cohortInfo: {
    cohortName: "Grade 6 Class of 2024",
    academicYear: "2024",
    startDate: "2024-01-08",
    endDate: "2024-11-15",
    classTeacher: "Ms. Sarah Kimani",
    totalStudents: 28,
    classPosition: 3,
    classAverage: 87.5,
    subjects: ["Mathematics", "Science", "English", "Kiswahili", "Social Studies", "Creative Arts", "Physical Education"],
    achievements: [
      "Won School Science Fair First Prize",
      "Elected Student Council President",
      "Selected for Regional Mathematics Competition"
    ]
  },
  // Additional Records
  additionalRecords: {
    attendance: {
      totalDays: 180,
      present: 175,
      absent: 5,
      percentage: 97.2
    },
    behavior: {
      excellent: 98,
      good: 2,
      needsImprovement: 0,
      incidents: 0
    },
    participation: {
      schoolEvents: 12,
      competitions: 5,
      leadershipRoles: 2,
      communityService: 8
    }
  }
};

const PDFTestPage: React.FC = () => {
  const [isViewerReady, setIsViewerReady] = useState(false);
  const [portfolioData, setPortfolioData] = useState<any>(samplePortfolioData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch student details from database using ID: 68f74c0840395af03fdac7b2
  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      setError(null);
      try {
        const studentId = '68f74c0840395af03fdac7b2';
        console.log('Fetching student data for PDF using ID:', studentId);
        
        const data = await createPortfolioDataFromHistory(studentId, {
          includeDefaults: true,
          academicYear: new Date().getFullYear().toString(),
          term: 'All'
        });
        
        console.log('Fetched portfolio data:', data);
        setPortfolioData(data);
      } catch (err: any) {
        console.error('Error fetching student data:', err);
        setError(err?.message || 'Failed to fetch student data. Using sample data instead.');
        // Keep using sample data on error
      } finally {
        setLoading(false);
        // Delay viewer loading for better UX
        setTimeout(() => setIsViewerReady(true), 100);
      }
    };

    fetchStudentData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => window.history.back()}
                variant="outline-secondary"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Portfolio PDF Test Page</h1>
                <p className="text-gray-600">
                  {loading ? 'Loading student data from database...' : 
                   error ? 'Using sample data (database fetch failed)' : 
                   'Student data loaded from database'}
                </p>
                {error && (
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PDFDownloadLink
                document={<PortfolioPDFDocumentComprehensive data={portfolioData} />}
                fileName={`portfolio-${portfolioData.student?.adm_no || 'test'}-${Date.now()}.pdf`}
                className="flex items-center gap-2"
              >
                {({ blob, url, loading, error }) => {
                  if (error) {
                    console.error('PDF generation error:', error);
                  }
                  return (
                  <Button
                    variant="primary"
                    size="sm"
                      disabled={loading || !!error}
                    className="flex items-center gap-2"
                  >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating PDF...
                        </>
                      ) : error ? (
                        <>
                          <Download className="h-4 w-4" />
                          Error - Retry
                        </>
                      ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Download PDF
                      </>
                    )}
                  </Button>
                  );
                }}
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <div className="p-0">
            <div className="bg-gray-100 px-4 py-2 border-b">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Portfolio PDF Preview
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                This is a public test page with sample data. No authentication required.
              </p>
            </div>
            <div className="h-[800px] w-full">
              {loading || !isViewerReady ? (
                <div className="h-full w-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-green-600" />
                    <p className="text-gray-600 text-lg">
                      {loading ? 'Fetching student data from database...' : 'Loading PDF Preview...'}
                    </p>
                    {loading && (
                      <p className="text-sm text-gray-500 mt-2">Student ID: 68f74c0840395af03fdac7b2</p>
                    )}
                  </div>
                </div>
              ) : error ? (
                <div className="h-full w-full flex items-center justify-center bg-gray-50">
                  <div className="text-center max-w-md">
                    <p className="text-red-600 text-lg font-semibold mb-2">Error Loading Data</p>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <p className="text-sm text-gray-500">Using sample data instead</p>
                  </div>
                </div>
              ) : (
              <PDFViewer
                  key={`pdf-viewer-test-${portfolioData.student?._id || Date.now()}`}
                width="100%"
                height="100%"
                showToolbar={true}
                className="border-0"
              >
                  <PortfolioPDFDocumentComprehensive data={portfolioData} />
              </PDFViewer>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PDFTestPage;
