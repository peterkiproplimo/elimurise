import React from "react";

interface LearningAreaProps {
  learningArea: any; // Ideally, you should replace 'any' with the actual type of the learningArea object.
  scale: any; // Replace 'any' with the type for scale, if known.
  setScale: (value: any) => void; // Adjust 'any' to match the expected type of scale.
  index: number;
  setUpdated: (value: boolean) => void;
}

const LearningArea: React.FC<LearningAreaProps> = ({
  learningArea,
  scale,
  setScale,
  index,
  setUpdated,
}) => {
  const handleGradingChange = (e: any, gradingIndex: any) => {
    const updatedGradings = [...learningArea.gradings];
    updatedGradings[gradingIndex] = {
      ...updatedGradings[gradingIndex],
      [e.target.name]: e.target.value,
    };

    const updatedLearningAreas = [...scale.learningAreas];
    updatedLearningAreas[index] = {
      ...learningArea,
      gradings: updatedGradings,
    };
    //sss
    setScale({
      ...scale,
      learningAreas: updatedLearningAreas,
    });
    setUpdated(true);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="font-semibold">{learningArea.learning_area.name}</h3>

      {/* Table for Gradings */}
      <table className="min-w-full bg-gray-100 rounded mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Mark</th>
            <th className="px-4 py-2 text-left">Score</th>
            <th className="px-4 py-2 text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {learningArea.gradings.map((grading: any, gradingIndex: any) => (
            <tr key={grading._id}>
              <td className="px-4 py-2">
                <input
                  type="number"
                  name="mark"
                  value={grading.mark}
                  onChange={(e: any) => handleGradingChange(e, gradingIndex)}
                  className="w-full p-2 border rounded"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  name="score"
                  value={grading.score}
                  onChange={(e: any) => handleGradingChange(e, gradingIndex)}
                  disabled
                  className="w-full p-2 border rounded disabled"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  name="description"
                  value={grading.description}
                  onChange={(e: any) => handleGradingChange(e, gradingIndex)}
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LearningArea;
