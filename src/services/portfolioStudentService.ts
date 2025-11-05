import { learnerHistory } from './auth';

/**
 * Fetch student details from history endpoint and transform to PDF format
 * @param studentId - The student ID (e.g., '68f74c0840395af03fdac7b2')
 * @returns Transformed student data ready for PDF generation
 */
export async function fetchStudentDetailsForPDF(studentId: string) {
  try {
    console.log(`Fetching student history for ID: ${studentId}`);
    
    // Fetch from history endpoint
    const historyData = await learnerHistory(studentId);
    console.log('History endpoint response:', historyData);

    // Extract student info from the response
    // The history endpoint returns data in format: { data: [...] } or { data: {...} }
    const primary = Array.isArray(historyData?.data) ? historyData.data[0] : historyData?.data;
    const learner = primary?.learner || primary || {};
    const toGrade = primary?.to_grade || {};
    const toStream = primary?.to_stream || {};
    const school = primary?.school || {};

    // Transform to PDF format
    const studentData = {
      _id: studentId,
      adm_no: learner.adm_no || '',
      first_name: learner.first_name || '',
      last_name: learner.last_name || '',
      surname: learner.surname || '',
      fullName: `${learner.first_name || ''} ${learner.last_name || ''} ${learner.surname || ''}`.trim(),
      gender: learner.gender || '',
      nemis_no: learner.nemis_no || '',
      current_session: learner.current_session || primary?.to_session || '',
      grade: toGrade?._id ? { 
        _id: toGrade._id, 
        name: toGrade.name, 
        level: toGrade.level,
        code: toGrade.code,
        description: toGrade.description
      } : undefined,
      stream: toStream?._id ? { 
        _id: toStream._id, 
        name: toStream.name,
        code: toStream.code,
        description: toStream.description
      } : undefined,
      school: school?.name || undefined,
      guardian: learner?.guardian ? {
        _id: learner.guardian._id,
        first_name: learner.guardian.first_name || '',
        last_name: learner.guardian.last_name || '',
        surname: learner.guardian.surname || '',
        id_no: learner.guardian.id_no || '',
        email: learner.guardian.email || '',
        phone: learner.guardian.phone || '',
        gender: learner.guardian.gender || '',
        schoolCode: learner.guardian.schoolCode || '',
        school: learner.guardian.school || '',
        status: learner.guardian.status || '',
        createdAt: learner.guardian.createdAt,
        updatedAt: learner.guardian.updatedAt
      } : undefined,
      guardian_relationship: learner.guardian_relationship || ''
    };

    console.log('Transformed student data:', studentData);
    return studentData;
  } catch (error) {
    console.error('Error fetching student details:', error);
    throw error;
  }
}

/**
 * Create portfolio data structure for PDF using fetched student details
 * @param studentId - The student ID
 * @param options - Additional options for portfolio generation
 * @returns Complete portfolio data structure for PDF
 */
export async function createPortfolioDataFromHistory(
  studentId: string,
  options: {
    academicYear?: string;
    term?: string;
    includeDefaults?: boolean;
  } = {}
) {
  try {
    // Fetch student details
    const student = await fetchStudentDetailsForPDF(studentId);

    // Get current date for generatedAt
    const generatedAt = new Date();
    
    // Get academic year (default to current year)
    const academicYear = options.academicYear || new Date().getFullYear().toString();
    
    // Get term (default to 'All')
    const term = options.term || 'All';

    // Create base portfolio data structure
    const portfolioData = {
      student,
      academicYear,
      term,
      generatedAt,
      
      // Include default/empty data if requested
      ...(options.includeDefaults && {
        reflections: [],
        teacherFeedbacks: [],
        strengths: [],
        improvements: [],
        growthTimeline: [],
        awards: [],
        certificates: [],
        projectEvidences: [],
        statistics: {
          totalEvidences: 0,
          totalCompetencies: 0,
          totalLearningAreas: 0,
          averageRating: 0,
          evidenceByType: {
            photo: 0,
            video: 0,
            document: 0
          },
          photoCount: 0,
          videoCount: 0
        },
        competenciesAchieved: [],
        learningAreasCovered: [],
        fees: {
          term1: { amountDue: 0, amountPaid: 0, balance: 0 },
          term2: { amountDue: 0, amountPaid: 0, balance: 0 },
          term3: { amountDue: 0, amountPaid: 0, balance: 0 },
          paymentDetails: []
        },
        termPerformance: {
          term1: { averageRating: 0, evidenceCount: 0, competencyCount: 0, projectCount: 0 },
          term2: { averageRating: 0, evidenceCount: 0, competencyCount: 0, projectCount: 0 },
          term3: { averageRating: 0, evidenceCount: 0, competencyCount: 0, projectCount: 0 }
        },
        formativeAssessments: [],
        summativeAssessments: {
          term1: { exams: 0, tests: 0, averageScore: 0, grade: '' },
          term2: { exams: 0, tests: 0, averageScore: 0, grade: '' },
          term3: { exams: 0, tests: 0, averageScore: 0, grade: '' }
        },
        promotion: {
          fromGrade: student.grade?.name || '',
          fromStream: student.stream?.name || '',
          promotedToGrade: student.grade?.name || '',
          promotedToStream: student.stream?.name || '',
          promotionDate: null,
          promotedBy: null
        },
        notices: [],
        additionalNotices: [],
        feesStructure: null,
        events: []
      })
    };

    console.log('Complete portfolio data:', portfolioData);
    return portfolioData;
  } catch (error) {
    console.error('Error creating portfolio data:', error);
    throw error;
  }
}

