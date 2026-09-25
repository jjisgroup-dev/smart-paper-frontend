import { Chapter, ClassLevel, Difficulty, Question, QuestionPaper, Subject, TextbookCatalog } from '@/types';
import { sampleChapters } from '@/data/sampleQuestions';

export interface PaperGenerationRequest {
  classLevel: string;
  subject: string;
  chapter: string;
  difficulty: string;
  examFormat: string;
  textbookContext?: TextbookCatalog;
}

const gatewayUrl = import.meta.env.VITE_AI_GATEWAY_URL as string | undefined;

const examBlueprints: Record<string, { examType: QuestionPaper['examType']; marks: number[]; duration: string }> = {
  'Unit test': { examType: '1st-internal', marks: [1, 1, 2, 2, 4, 5, 5], duration: '1 Hour' },
  'Internal examination': { examType: '2nd-internal', marks: [1, 1, 2, 2, 4, 5, 5], duration: '1 Hour' },
  '3rd internal examination': { examType: '3rd-internal', marks: [1, 1, 2, 2, 4, 5, 5], duration: '1 Hour' },
  'Annual examination': { examType: 'annual', marks: [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 5, 5, 10, 10, 11, 12], duration: '3 Hours' },
  'Practice worksheet': { examType: 'annual', marks: [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4], duration: '2 Hours' },
};

const promptSets: Record<Subject, Array<{ type: Question['type']; question: (chapter: string, classLevel: string) => string; answer: string; options?: string[] }>> = {
  English: [
    { type: 'mcq', question: (chapter) => `Which skill is most important when studying “${chapter}”?`, answer: 'Reading for meaning and supporting an answer with evidence.', options: ['Reading for meaning and supporting an answer with evidence.', 'Copying every sentence.', 'Ignoring the context.', 'Memorising unrelated words.'] },
    { type: 'short', question: (chapter) => `Write the central idea of “${chapter}” in two or three sentences.`, answer: 'The answer should state the central idea and support it with a relevant detail.' },
    { type: 'fill-blank', question: () => 'A group of words that makes complete sense is called a ________.', answer: 'sentence' },
    { type: 'short', question: (chapter) => `Describe one important character, image or event from “${chapter}”.`, answer: 'The response should name the selected element and explain its importance accurately.' },
    { type: 'long', question: (chapter, classLevel) => `Class ${classLevel}: Explain the message of “${chapter}” and connect it to a real-life situation.`, answer: 'Award marks for a clear message, textual support and a relevant real-life connection.' },
  ],
  Hindi: [
    { type: 'mcq', question: (chapter) => `“${chapter}” पाठ का मुख्य उद्देश्य क्या है?`, answer: 'पाठ के मुख्य भाव को समझकर अपने शब्दों में व्यक्त करना।', options: ['पाठ के मुख्य भाव को समझकर अपने शब्दों में व्यक्त करना।', 'केवल कठिन शब्द याद करना।', 'पाठ से असंबंधित घटना लिखना।', 'प्रश्न को बिना पढ़े उत्तर देना।'] },
    { type: 'short', question: (chapter) => `“${chapter}” पाठ का मुख्य भाव दो-तीन वाक्यों में लिखिए।`, answer: 'उत्तर में पाठ का मुख्य भाव और उससे जुड़े प्रमुख विचार होने चाहिए।' },
    { type: 'fill-blank', question: () => 'वाक्य के अंत में उचित ________ चिह्न लगाया जाता है।', answer: 'विराम' },
    { type: 'short', question: (chapter) => `“${chapter}” के किसी एक पात्र या घटना का वर्णन कीजिए।`, answer: 'उत्तर पाठ के प्रसंग के अनुसार स्पष्ट और क्रमबद्ध होना चाहिए।' },
    { type: 'long', question: (chapter, classLevel) => `कक्षा ${classLevel}: “${chapter}” से मिलने वाली सीख को अपने जीवन से जोड़कर समझाइए।`, answer: 'उत्तर में सीख, पाठ का संदर्भ और जीवन से संबंधित उदाहरण होना चाहिए।' },
  ],
  Mathematics: [
    { type: 'mcq', question: (chapter) => `Which approach is most useful when solving a problem from “${chapter}”?`, answer: 'Identify the given information, choose a method and verify the result.', options: ['Identify the given information, choose a method and verify the result.', 'Guess without working.', 'Skip the units.', 'Copy an unrelated answer.'] },
    { type: 'short', question: (chapter) => `State the main rule or formula used in “${chapter}”. Give one example.`, answer: 'The rule must be stated accurately and the example must use it correctly.' },
    { type: 'fill-blank', question: () => 'A statement that is true for all values in a given situation is called a ________.', answer: 'property' },
    { type: 'short', question: (chapter) => `Solve one representative problem from “${chapter}” and show all working.`, answer: 'Award marks for the correct method, orderly working and final answer.' },
    { type: 'long', question: (chapter, classLevel) => `Class ${classLevel}: A new situation uses the ideas from “${chapter}”. Set up the solution, solve it and explain how you checked your answer.`, answer: 'Award marks for interpretation, method, working, answer and verification.' },
  ],
  Science: [
    { type: 'mcq', question: (chapter) => `Which method best demonstrates understanding of “${chapter}”?`, answer: 'Observe carefully, identify evidence and explain the result using scientific terms.', options: ['Observe carefully, identify evidence and explain the result using scientific terms.', 'Memorise a result without evidence.', 'Change the observation.', 'Use an unrelated example.'] },
    { type: 'short', question: (chapter) => `Define the key concept in “${chapter}” and give one suitable example.`, answer: 'The definition and example must be scientifically accurate.' },
    { type: 'true-false', question: (chapter) => `Scientific explanations of “${chapter}” should be supported by observations.`, answer: 'True' },
    { type: 'short', question: (chapter) => `Explain one process, experiment or cause-and-effect relationship from “${chapter}”.`, answer: 'Award marks for correct sequence, evidence and scientific terminology.' },
    { type: 'long', question: (chapter, classLevel) => `Class ${classLevel}: Design a simple investigation related to “${chapter}”. State the question, method, observation and conclusion.`, answer: 'Award marks for a testable question, logical method, observation and conclusion.' },
  ],
  'Social Science': [
    { type: 'mcq', question: (chapter) => `Which approach gives the strongest answer about “${chapter}”?`, answer: 'Use accurate facts and explain their significance in context.', options: ['Use accurate facts and explain their significance in context.', 'List unrelated dates.', 'Give an unsupported opinion.', 'Leave out the context.'] },
    { type: 'short', question: (chapter) => `Write two important facts about “${chapter}” and explain why one matters.`, answer: 'Facts must be accurate and the explanation should show significance.' },
    { type: 'fill-blank', question: () => 'A sequence of events arranged according to time is called a ________.', answer: 'chronology' },
    { type: 'short', question: (chapter) => `Explain one cause and one effect connected with “${chapter}”.`, answer: 'Both cause and effect should be clear, accurate and connected.' },
    { type: 'long', question: (chapter, classLevel) => `Class ${classLevel}: Write a structured note on an important person, place, institution or event from “${chapter}”.`, answer: 'Award marks for context, key facts, explanation and a suitable conclusion.' },
  ],
  EVS: [
    { type: 'mcq', question: (chapter) => `Which action best reflects learning from “${chapter}”?`, answer: 'Observe the surroundings and explain how people, plants or animals are connected.', options: ['Observe the surroundings and explain how people, plants or animals are connected.', 'Ignore the surroundings.', 'Record unrelated facts.', 'Copy without understanding.'] },
    { type: 'short', question: (chapter) => `Name two things learned from “${chapter}” and explain one of them.`, answer: 'Both examples must be relevant and correctly described.' },
    { type: 'true-false', question: (chapter) => `Careful observation helps us understand “${chapter}” better.`, answer: 'True' },
    { type: 'short', question: (chapter) => `Describe one healthy, safe or responsible practice connected to “${chapter}”.`, answer: 'The answer should explain the practice and why it matters.' },
    { type: 'long', question: (chapter, classLevel) => `Class ${classLevel}: Describe an observation from your surroundings related to “${chapter}” and suggest one improvement.`, answer: 'Award marks for observation, connection to the topic and a practical improvement.' },
  ],
  'Computer Science': [
    { type: 'mcq', question: (chapter) => `Which practice shows understanding of “${chapter}”?`, answer: 'Use the correct steps, explain the purpose and follow safe digital practices.', options: ['Use the correct steps, explain the purpose and follow safe digital practices.', 'Share passwords.', 'Skip the procedure.', 'Use an unknown file.'] },
    { type: 'short', question: (chapter) => `Define one important term from “${chapter}” and give its use.`, answer: 'The term and its use must be technically accurate.' },
    { type: 'fill-blank', question: () => 'A sequence of instructions used to solve a problem is called an ________.', answer: 'algorithm' },
    { type: 'short', question: (chapter) => `List the correct steps for completing one task from “${chapter}”.`, answer: 'Steps should be complete, ordered and relevant to the task.' },
    { type: 'long', question: (chapter, classLevel) => `Class ${classLevel}: Solve a practical problem using the ideas from “${chapter}”. Explain your design and how you would test it.`, answer: 'Award marks for problem understanding, design, safe practice and testing.' },
  ],
  Sanskrit: [
    { type: 'mcq', question: (chapter) => `“${chapter}” पाठ को समझने के लिए सबसे आवश्यक क्या है?`, answer: 'शब्दार्थ, व्याकरण और संदर्भ को समझकर उत्तर देना।', options: ['शब्दार्थ, व्याकरण और संदर्भ को समझकर उत्तर देना।', 'केवल पाठ की लंबाई गिनना।', 'प्रश्न को बिना पढ़े लिखना।', 'असंबंधित उत्तर देना।'] },
    { type: 'short', question: (chapter) => `“${chapter}” पाठ से पाँच शब्दों के अर्थ लिखिए।`, answer: 'शब्दों के अर्थ पाठ के संदर्भ के अनुसार सही होने चाहिए।' },
    { type: 'fill-blank', question: () => 'संस्कृत वाक्य में क्रिया का प्रयोग ________ के अनुसार होता है।', answer: 'कर्ता' },
    { type: 'short', question: (chapter) => `“${chapter}” के आधार पर दो संस्कृत वाक्य लिखिए।`, answer: 'वाक्य शब्द-रूप और व्याकरण की दृष्टि से सही होने चाहिए।' },
    { type: 'long', question: (chapter, classLevel) => `कक्षा ${classLevel}: “${chapter}” का सरल हिंदी में भावार्थ लिखिए और उससे मिलने वाली सीख बताइए।`, answer: 'भावार्थ स्पष्ट, क्रमबद्ध और पाठ के संदर्भ के अनुसार होना चाहिए।' },
  ],
};

import { getNCERTQuestionPaper } from '@/data/ncertQuestionBank';

const createOfflinePaper = (request: PaperGenerationRequest): QuestionPaper => {
  const blueprint = examBlueprints[request.examFormat] || examBlueprints['Annual examination'];
  const subject = request.subject as Subject;
  const classLevel = request.classLevel as ClassLevel;
  const difficulty = (request.difficulty === 'easy' || request.difficulty === 'hard' ? request.difficulty : 'medium') as Difficulty;

  const basePaper = getNCERTQuestionPaper(classLevel, subject, blueprint.examType, difficulty);
  return {
    ...basePaper,
    title: `${subject} - ${request.examFormat}`,
    duration: blueprint.duration,
  };
};

export const generateQuestionPaper = async (request: PaperGenerationRequest): Promise<QuestionPaper> => {
  if (!gatewayUrl) return createOfflinePaper(request);

  const configuredUrl = gatewayUrl.replace(/\/$/, '');
  const endpoint = configuredUrl.endsWith('/api/generate-paper')
    ? configuredUrl
    : `${configuredUrl}/api/generate-paper`;

  const textbookContext = request.textbookContext;
  const groundedChapters = textbookContext?.chapters.map((chapter: Chapter) => ({
    name: chapter.name,
    sections: chapter.sections || [],
    concepts: chapter.concepts || [],
    learningOutcomes: chapter.learningOutcomes || [],
    sourceUrl: chapter.sourceUrl || null,
  })) || [];

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      classLevel: request.classLevel,
      subject: request.subject,
      chapter: request.chapter,
      difficulty: request.difficulty,
      examFormat: request.examFormat,
      totalMarks: examBlueprints[request.examFormat]?.marks.reduce((total, marks) => total + marks, 0) || 25,
      textbookContext: groundedChapters,
    }),
  });

  const payload = await response.json().catch(() => ({})) as { error?: string; details?: string } & Partial<QuestionPaper>;
  if (!response.ok) throw new Error(payload.details || payload.error || `AI Gateway request failed (${response.status}).`);
  if (!payload.questions || !Array.isArray(payload.questions)) throw new Error('The AI Gateway returned an invalid paper.');
  return payload as QuestionPaper;
};
