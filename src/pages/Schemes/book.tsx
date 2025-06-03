import { useState, useEffect, useCallback, useRef } from "react";
import Button from "../../base-components/Button";
import {
  FormLabel,
  FormSelect,
  FormInput,
  FormTextarea,
} from "../../base-components/Form";
import * as ApiService from "../../services/auth";
import Notification, {
  NotificationElement,
} from "../../base-components/Notification";
import LoadingIcon from "../../base-components/LoadingIcon";
import Lucide from "../../base-components/Lucide";

function SchemeOfWorkSelectionBuilder() {
  const [step, setStep] = useState(1);
  const [grades, setGrades] = useState([]);
  const [learningAreas, setLearningAreas] = useState([]);
  const [strands, setStrands] = useState([]);
  const [substrands, setSubstrands] = useState([]);
  const [selectedSubstrands, setSelectedSubstrands] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [grokLoading, setGrokLoading] = useState(false); // New state for Grok loading
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const notify = useRef(null);
  const [generatedLessons, setGeneratedLessons] = useState([]); // Store Grok-generated lessons

  const [formData, setFormData] = useState({
    grade: "",
    learningArea: "",
    term: "1",
    year: new Date().getFullYear().toString(),
    numberOfLessonsPerWeek: "",
    lessonDuration: "1",
    termBreaks: "",
    progressCheckInterval: "",
    assessmentMethods: "",
    firstLessonDetails: "",
    firstWeekOfTeaching: "",
    firstLessonOfTeaching: "",
    lastLessonDetails: "",
    lastWeekOfTeaching: "",
    lastLessonOfTeaching: "",
    remarks: "",
  });

  const fetchGrades = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ApiService.getGrades({ page: 1 });
      setGrades(response.data || []);
    } catch (error) {
      setSuccess(false);
      setMessage(error.message || "Failed to fetch grades.");
      notify.current?.showToast();
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLearningAreas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ApiService.getLearningAreas({});
      setLearningAreas(response.data || []);
    } catch (error) {
      setSuccess(false);
      setMessage(error.message || "Failed to fetch learning areas.");
      notify.current?.showToast();
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStrands = useCallback(async () => {
    if (!formData.learningArea) return;
    setLoading(true);
    try {
      const response = await ApiService.getStrands(
        { page: 1, limit: 1000 },
        { learning_area: formData.learningArea, term: formData.term }
      );
      setStrands(response.data || []);
    } catch (error) {
      setSuccess(false);
      setMessage(error.message || "Failed to fetch strands.");
      notify.current?.showToast();
    } finally {
      setLoading(false);
    }
  }, [formData.learningArea, formData.term]);

  const fetchSubstrands = useCallback(async () => {
    setLoading(true);
    setSubstrands([]);
    try {
      const promises = strands.map(async (strand) => {
        const response = await ApiService.getSubstrandByStrand(
          { limit: 10000 },
          strand._id
        );
        return (response.data || []).map((substrand) => ({
          ...substrand,
          strandId: strand._id,
          strandName: strand.name,
        }));
      });
      const substrandsArray = (await Promise.all(promises)).flat();
      setSubstrands(substrandsArray);
    } catch (error) {
      setSuccess(false);
      setMessage(error.message || "Failed to fetch substrands.");
      notify.current?.showToast();
    } finally {
      setLoading(false);
    }
  }, [strands]);

  const calculateTotalLessonsAndHours = () => {
    const totalLessons = selectedSubstrands.reduce((sum, substrandId) => {
      const substrand = substrands.find((ss) => ss._id === substrandId);
      return sum + (substrand?.number_of_lessons || 0);
    }, 0);
    const totalHours = totalLessons * parseFloat(formData.lessonDuration || 1);
    return { totalLessons, totalHours };
  };

  const generateLessonsWithGrok = async () => {
    setGrokLoading(true);
    try {
      const schedule = [];
      let lessonCount = 1;
      let weekCount = 1;
      const lessonsPerWeek = parseInt(formData.numberOfLessonsPerWeek) || 1;

      for (const substrandId of selectedSubstrands) {
        const substrand = substrands.find((ss) => ss._id === substrandId);
        if (!substrand) continue;

        const totalLessons = substrand.number_of_lessons;
        const outcomes =
          substrand.learning_outcome.match(/[a-z]\)\s*[^<]+/g) || [];
        const experiences =
          substrand.suggested_learning_experiences.match(/●\s*[^<]+/g) || [];

        // Distribute outcomes across lessons
        const lessonsPerOutcome = Math.ceil(totalLessons / outcomes.length);
        let outcomeIndex = 0;

        for (let i = 0; i < totalLessons; i++) {
          if (lessonCount > lessonsPerWeek) {
            weekCount++;
            lessonCount = 1;
          }

          const currentOutcome = outcomes[outcomeIndex] || "N/A";
          const currentExperience =
            experiences[i % experiences.length] || "Collaborative discussion";

          schedule.push({
            week: weekCount,
            lesson: lessonCount,
            strand: substrand.strandName,
            subStrand: substrand.name,
            specificLearningOutcomes: `<p>${currentOutcome}</p>`,
            keyInquiryQuestions: substrand.key_inquiry_questions,
            learningExperiences: `<p>${currentExperience}</p>`,
            learningResources: substrand.suggested_learning_resources,
            assessment:
              formData.assessmentMethods ||
              substrand.suggested_assessment_methods,
            remarks: formData.remarks || "N/A",
          });

          lessonCount++;
          if (
            (i + 1) % lessonsPerOutcome === 0 &&
            outcomeIndex < outcomes.length - 1
          ) {
            outcomeIndex++;
          }
        }
      }

      setGeneratedLessons(schedule);
      setSuccess(true);
      setMessage("Lessons generated successfully with Grok!");
      notify.current?.showToast();
    } catch (error) {
      setSuccess(false);
      setMessage(error.message || "Failed to generate lessons with Grok.");
      notify.current?.showToast();
    } finally {
      setGrokLoading(false);
    }
  };

  const saveScheme = useCallback(async () => {
    const { totalLessons } = calculateTotalLessonsAndHours();
    if (
      !formData.grade ||
      !formData.learningArea ||
      !formData.numberOfLessonsPerWeek ||
      !formData.firstWeekOfTeaching ||
      !formData.firstLessonOfTeaching ||
      !formData.lastWeekOfTeaching ||
      !formData.lastLessonOfTeaching ||
      selectedSubstrands.length === 0 ||
      generatedLessons.length === 0
    ) {
      setSuccess(false);
      setMessage(
        "Please fill all required fields, select at least one substrand, and generate lessons."
      );
      notify.current?.showToast();
      return;
    }
    const weeks = Math.ceil(
      totalLessons / parseInt(formData.numberOfLessonsPerWeek)
    );
    const minWeeks = Math.ceil(
      (new Date(formData.lastWeekOfTeaching) -
        new Date(formData.firstWeekOfTeaching)) /
        (1000 * 60 * 60 * 24 * 7)
    );
    if (weeks > minWeeks) {
      setSuccess(false);
      setMessage(
        `The number of lessons per week (${formData.numberOfLessonsPerWeek}) is too low to cover ${totalLessons} lessons in the given timeframe (${minWeeks} weeks).`
      );
      notify.current?.showToast();
      return;
    }
    setLoading(true);
    try {
      const response = await ApiService.createScheme({
        grade: formData.grade,
        learning_area: formData.learningArea,
        term: formData.term,
        year: formData.year,
        substrands: selectedSubstrands,
        numberOfLessonsPerWeek: formData.numberOfLessonsPerWeek,
        lessonDuration: formData.lessonDuration,
        termBreaks: formData.termBreaks,
        progressCheckInterval: formData.progressCheckInterval,
        assessmentMethods: formData.assessmentMethods,
        firstLessonDetails: formData.firstLessonDetails,
        firstWeekOfTeaching: formData.firstWeekOfTeaching,
        firstLessonOfTeaching: formData.firstLessonOfTeaching,
        lastLessonDetails: formData.lastLessonDetails,
        lastWeekOfTeaching: formData.lastWeekOfTeaching,
        lastLessonOfTeaching: formData.lastLessonOfTeaching,
        remarks: formData.remarks,
        lessons: generatedLessons,
        createdAt: "08:38 PM EAT, Thursday, May 29, 2025",
      });
      setSchemes([...schemes, response.data]);
      setSuccess(true);
      setMessage("Scheme saved successfully.");
      notify.current?.showToast();
      setFormData({
        grade: "",
        learningArea: "",
        term: "1",
        year: new Date().getFullYear().toString(),
        numberOfLessonsPerWeek: "",
        lessonDuration: "1",
        termBreaks: "",
        progressCheckInterval: "",
        assessmentMethods: "",
        firstLessonDetails: "",
        firstWeekOfTeaching: "",
        firstLessonOfTeaching: "",
        lastLessonDetails: "",
        lastWeekOfTeaching: "",
        lastLessonOfTeaching: "",
        remarks: "",
      });
      setSelectedSubstrands([]);
      setGeneratedLessons([]);
      setStep(1);
    } catch (error) {
      setSuccess(false);
      setMessage(error.message || "Failed to save scheme.");
      notify.current?.showToast();
    } finally {
      setLoading(false);
    }
  }, [formData, schemes, selectedSubstrands, generatedLessons]);

  useEffect(() => {
    fetchGrades();
    fetchLearningAreas();
  }, [fetchGrades, fetchLearningAreas]);

  useEffect(() => {
    if (formData.learningArea) fetchStrands();
  }, [formData.learningArea, formData.term, fetchStrands]);

  useEffect(() => {
    if (strands.length > 0) fetchSubstrands();
  }, [strands, fetchSubstrands]);

  const handleSubstrandSelection = (substrandId) => {
    setSelectedSubstrands((prev) =>
      prev.includes(substrandId)
        ? prev.filter((id) => id !== substrandId)
        : [...prev, substrandId]
    );
  };

  const groupedSubstrands = strands.map((strand) => ({
    strand,
    substrands: substrands.filter((ss) => ss.strandId === strand._id),
  }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Create a Scheme of Work
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Select Grade, Term, and Learning Area
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Fields marked with asterisks (*) are mandatory
            </p>
            <div className="space-y-4">
              <div>
                <FormLabel>Grade *</FormLabel>
                <FormSelect
                  value={formData.grade}
                  onChange={(e) =>
                    setFormData({ ...formData, grade: e.target.value })
                  }
                  className="w-full"
                >
                  <option value="">Select Grade</option>
                  {grades.map((grade) => (
                    <option key={grade._id} value={grade._id}>
                      {grade.name}
                    </option>
                  ))}
                </FormSelect>
              </div>
              <div>
                <FormLabel>Learning Area *</FormLabel>
                <FormSelect
                  value={formData.learningArea}
                  onChange={(e) =>
                    setFormData({ ...formData, learningArea: e.target.value })
                  }
                  className="w-full"
                >
                  <option value="">Select Learning Area</option>
                  {learningAreas
                    .filter((area) => area.grade_id?._id === formData.grade)
                    .map((area) => (
                      <option key={area._id} value={area._id}>
                        {area.name}
                      </option>
                    ))}
                </FormSelect>
              </div>
              <div>
                <FormLabel>Term *</FormLabel>
                <FormSelect
                  value={formData.term}
                  onChange={(e) =>
                    setFormData({ ...formData, term: e.target.value })
                  }
                  className="w-full"
                >
                  <option value="1">Term 1</option>
                  <option value="2">Term 2</option>
                  <option value="3">Term 3</option>
                </FormSelect>
              </div>
              <div>
                <FormLabel>Number of Lessons Per Week *</FormLabel>
                <FormInput
                  type="number"
                  value={formData.numberOfLessonsPerWeek}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numberOfLessonsPerWeek: e.target.value,
                    })
                  }
                  className="w-full"
                  min="1"
                />
              </div>
              <div>
                <FormLabel>Year *</FormLabel>
                <FormSelect
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  className="w-full"
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    );
                  })}
                </FormSelect>
              </div>
            </div>

            {formData.learningArea && groupedSubstrands.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">
                  Select Strands and Substrands
                </h2>
                {groupedSubstrands.map((group) => (
                  <div key={group.strand._id} className="mb-6">
                    <h3 className="text-lg font-medium text-blue-600 mb-2">
                      {group.strand.name}
                    </h3>
                    <ul className="space-y-4">
                      {group.substrands.map((substrand) => (
                        <li
                          key={substrand._id}
                          className="flex items-start space-x-3 border-b pb-2"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSubstrands.includes(substrand._id)}
                            onChange={() =>
                              handleSubstrandSelection(substrand._id)
                            }
                            className="h-5 w-5 text-blue-600 mt-1"
                          />
                          <div className="flex-1">
                            <div className="meta-row flex items-center mb-2">
                              <label className="font-semibold text-md text-gray-700">
                                Strand:
                              </label>
                              <span className="text-md text-gray-800 ml-2">
                                {group.strand.name || "N/A"}
                              </span>
                            </div>
                            <div className="meta-row flex items-center mb-2">
                              <label className="font-semibold text-md text-gray-700">
                                Substrand:
                              </label>
                              <span className="text-md text-gray-800 ml-2">
                                <div
                                  className="font-medium inline-block richtext"
                                  dangerouslySetInnerHTML={{
                                    __html: substrand.name || "N/A",
                                  }}
                                />
                              </span>
                            </div>
                            <div className="meta-row flex items-center">
                              <label className="font-semibold text-md text-gray-700">
                                Recommended Hours:
                              </label>
                              <span className="text-md text-gray-800 ml-2">
                                {substrand.number_of_lessons} lessons,{" "}
                                {(
                                  substrand.number_of_lessons *
                                  parseFloat(formData.lessonDuration)
                                ).toFixed(1)}{" "}
                                hours
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex space-x-4">
              <Button
                onClick={generateLessonsWithGrok}
                disabled={
                  !formData.grade ||
                  !formData.learningArea ||
                  !formData.term ||
                  !formData.year ||
                  !formData.numberOfLessonsPerWeek ||
                  selectedSubstrands.length === 0 ||
                  grokLoading ||
                  loading
                }
                className="bg-green-600 text-white w-full"
              >
                {grokLoading ? (
                  <LoadingIcon
                    icon="spinning-circles"
                    color="white"
                    className="w-4 h-4 mr-2 animate-spin"
                  />
                ) : (
                  "Generate Lessons with Grok"
                )}
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={
                  !formData.grade ||
                  !formData.learningArea ||
                  !formData.term ||
                  !formData.year ||
                  selectedSubstrands.length === 0 ||
                  generatedLessons.length === 0 ||
                  loading
                }
                className="bg-blue-600 text-white w-full"
              >
                {loading ? (
                  <LoadingIcon
                    icon="spinning-circles"
                    color="white"
                    className="w-4 h-4 mr-2 animate-spin"
                  />
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Configure Lesson Schedule
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Fields marked with asterisks (*) are mandatory
            </p>
            <div className="space-y-4">
              <div>
                <FormLabel>Lesson Duration (hours per lesson) *</FormLabel>
                <FormInput
                  type="number"
                  step="0.1"
                  value={formData.lessonDuration}
                  onChange={(e) =>
                    setFormData({ ...formData, lessonDuration: e.target.value })
                  }
                  className="w-full"
                  min="0.1"
                />
              </div>
              <div>
                <FormLabel>Progress Check Interval (every X lessons)</FormLabel>
                <FormInput
                  type="number"
                  value={formData.progressCheckInterval}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      progressCheckInterval: e.target.value,
                    })
                  }
                  className="w-full"
                  min="1"
                  placeholder="e.g., 5"
                />
              </div>
              <div>
                <FormLabel>Term Breaks or Interruptions</FormLabel>
                <FormTextarea
                  value={formData.termBreaks}
                  onChange={(e) =>
                    setFormData({ ...formData, termBreaks: e.target.value })
                  }
                  className="w-full"
                  placeholder="e.g., School holidays from 2025-07-01 to 2025-07-15"
                />
              </div>
              <div>
                <FormLabel>Custom Assessment Methods (optional)</FormLabel>
                <FormTextarea
                  value={formData.assessmentMethods}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      assessmentMethods: e.target.value,
                    })
                  }
                  className="w-full"
                  placeholder="Override suggested methods if needed"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Suggested Methods (per Substrand):
                </p>
                <ul className="text-sm text-gray-500 list-disc pl-5">
                  {selectedSubstrands.map((substrandId) => {
                    const substrand = substrands.find(
                      (ss) => ss._id === substrandId
                    );
                    return (
                      <li key={substrandId}>
                        <div
                          className="inline-block richtext"
                          dangerouslySetInnerHTML={{
                            __html: substrand?.name || "N/A",
                          }}
                        />
                        :{" "}
                        <div
                          className="inline-block richtext"
                          dangerouslySetInnerHTML={{
                            __html:
                              substrand?.suggested_assessment_methods || "N/A",
                          }}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div>
                <FormLabel>Remarks (optional)</FormLabel>
                <FormTextarea
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  className="w-full"
                  placeholder="e.g., Adjust pace based on student progress"
                />
              </div>
              <div>
                <FormLabel>First Lesson Details</FormLabel>
                <FormTextarea
                  value={formData.firstLessonDetails}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      firstLessonDetails: e.target.value,
                    })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <FormLabel>First Week of Teaching *</FormLabel>
                <FormInput
                  type="date"
                  value={formData.firstWeekOfTeaching}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      firstWeekOfTeaching: e.target.value,
                    })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <FormLabel>First Lesson of Teaching *</FormLabel>
                <FormInput
                  type="date"
                  value={formData.firstLessonOfTeaching}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      firstLessonOfTeaching: e.target.value,
                    })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <FormLabel>Last Lesson Details</FormLabel>
                <FormTextarea
                  value={formData.lastLessonDetails}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastLessonDetails: e.target.value,
                    })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <FormLabel>Last Week of Teaching *</FormLabel>
                <FormInput
                  type="date"
                  value={formData.lastWeekOfTeaching}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastWeekOfTeaching: e.target.value,
                    })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <FormLabel>Last Lesson of Teaching *</FormLabel>
                <FormInput
                  type="date"
                  value={formData.lastLessonOfTeaching}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastLessonOfTeaching: e.target.value,
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <Button
                onClick={() => setStep(1)}
                className="bg-gray-500 text-white"
              >
                Previous
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={
                  !formData.numberOfLessonsPerWeek ||
                  !formData.lessonDuration ||
                  !formData.firstWeekOfTeaching ||
                  !formData.firstLessonOfTeaching ||
                  !formData.lastWeekOfTeaching ||
                  !formData.lastLessonOfTeaching ||
                  loading
                }
                className="bg-blue-600 text-white"
              >
                {loading ? (
                  <LoadingIcon
                    icon="spinning-circles"
                    color="white"
                    className="w-4 h-4 mr-2 animate-spin"
                  />
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Preview Scheme of Work
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">Week</th>
                    <th className="border border-gray-300 p-2">Lesson</th>
                    <th className="border border-gray-300 p-2">Strand</th>
                    <th className="border border-gray-300 p-2">Sub-strand</th>
                    <th className="border border-gray-300 p-2">
                      Specific Learning Outcomes
                    </th>
                    <th className="border border-gray-300 p-2">
                      Key Inquiry Questions
                    </th>
                    <th className="border border-gray-300 p-2">
                      Learning Experiences
                    </th>
                    <th className="border border-gray-300 p-2">
                      Learning Resources
                    </th>
                    <th className="border border-gray-300 p-2">Assessment</th>
                    <th className="border border-gray-300 p-2">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedLessons.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                    >
                      <td className="border border-gray-300 p-2 text-center">
                        {row.week}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        {row.lesson}
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div
                          className="richtext"
                          dangerouslySetInnerHTML={{
                            __html: row.strand || "N/A",
                          }}
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div
                          className="richtext"
                          dangerouslySetInnerHTML={{
                            __html: row.subStrand || "N/A",
                          }}
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div
                          className="richtext"
                          dangerouslySetInnerHTML={{
                            __html: row.specificLearningOutcomes || "N/A",
                          }}
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div
                          className="richtext"
                          dangerouslySetInnerHTML={{
                            __html: row.keyInquiryQuestions || "N/A",
                          }}
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div
                          className="richtext"
                          dangerouslySetInnerHTML={{
                            __html: row.learningExperiences || "N/A",
                          }}
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div
                          className="richtext"
                          dangerouslySetInnerHTML={{
                            __html: row.learningResources || "N/A",
                          }}
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div
                          className="richtext"
                          dangerouslySetInnerHTML={{
                            __html: row.assessment || "N/A",
                          }}
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div
                          className="richtext"
                          dangerouslySetInnerHTML={{
                            __html: row.remarks || "N/A",
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <div className="meta-row flex items-center">
                <label className="font-semibold text-md text-gray-700">
                  School:
                </label>
                <span className="text-md text-gray-800 ml-2">
                  [School Name]
                </span>
              </div>
              <div className="meta-row flex items-center">
                <label className="font-semibold text-md text-gray-700">
                  Learning Area:
                </label>
                <span className="text-md text-gray-800 ml-2">
                  {learningAreas.find((la) => la._id === formData.learningArea)
                    ?.name || "N/A"}
                </span>
              </div>
              <div className="meta-row flex items-center">
                <label className="font-semibold text-md text-gray-700">
                  Class:
                </label>
                <span className="text-md text-gray-800 ml-2">
                  {grades.find((g) => g._id === formData.grade)?.name || "N/A"}
                </span>
              </div>
              <div className="meta-row flex items-center">
                <label className="font-semibold text-md text-gray-700">
                  Term:
                </label>
                <span className="text-md text-gray-800 ml-2">
                  Term {formData.term}
                </span>
              </div>
              <div className="meta-row flex items-center">
                <label className="font-semibold text-md text-gray-700">
                  Year:
                </label>
                <span className="text-md text-gray-800 ml-2">
                  {formData.year}
                </span>
              </div>
              <div className="meta-row flex items-center">
                <label className="font-semibold text-md text-gray-700">
                  Created At:
                </label>
                <span className="text-md text-gray-800 ml-2">
                  08:38 PM EAT, Thursday, May 29, 2025
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <Button
                onClick={() => setStep(2)}
                className="bg-gray-500 text-white"
              >
                Previous
              </Button>
              <Button
                onClick={saveScheme}
                disabled={loading}
                className="bg-blue-600 text-white"
              >
                {loading ? (
                  <LoadingIcon
                    icon="spinning-circles"
                    color="white"
                    className="w-4 h-4 mr-2 animate-spin"
                  />
                ) : (
                  "Save Scheme"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      <Notification
        options={{ duration: 3000 }}
        getRef={(el) => (notify.current = el)}
        className="flex rounded-lg shadow-md"
      >
        <Lucide
          icon={success ? "CheckCircle" : "XCircle"}
          className={success ? "text-success" : "text-danger"}
        />
        <div className="ml-4 mr-4">
          <div className="font-medium">{success ? "Success" : "Error"}</div>
          <div className="mt-1 text-slate-500">{message}</div>
        </div>
      </Notification>
    </div>
  );
}

export default SchemeOfWorkSelectionBuilder;
