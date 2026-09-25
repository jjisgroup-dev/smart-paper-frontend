import { ClassLevel, Subject } from '@/types';

export interface SubjectPatternInfo {
  paperStyle: string;
  styleDescription: string;
  sections: { name: string; questions: string; marks: string; description: string }[];
  markingScheme: {
    internalTotal: number;
    internalDuration: string;
    annualTotal: number;
    annualDuration: string;
    internalBreakdown: string;
    annualBreakdown: string;
    criteria: string[];
  };
  examPattern: {
    formats: string[];
    difficultyRatio: string;
    timeAllocation: string;
    curriculumAlignment: string;
  };
}

export const getSubjectExamPattern = (classLevel: ClassLevel, subject: Subject): SubjectPatternInfo => {
  const isKindergarten = classLevel === 'LKG' || classLevel === 'UKG';
  const isPrimary = ['1', '2', '3', '4', '5'].includes(classLevel);
  const isMiddle = ['6', '7', '8'].includes(classLevel);
  const isSecondary = ['9', '10'].includes(classLevel);

  // 1. KINDERGARTEN (LKG & UKG)
  if (isKindergarten) {
    if (subject === 'Mathematics') {
      return {
        paperStyle: 'Visual Counting & Pre-Math Concepts',
        styleDescription: 'Pictorial number recognition, single-digit addition, shape identification, and size comparisons.',
        sections: [
          { name: 'Section A: Visual Recognition', questions: '1-3', marks: '1 Mark each', description: 'Counting objects, identifying digits 1-20/50, and round/flat shapes.' },
          { name: 'Section B: Comparison & Sequences', questions: '4-5', marks: '1-2 Marks', description: 'Big/Small, Tall/Short, and Before/After sequence filling.' },
          { name: 'Section C: Pictorial Operations', questions: '6-7', marks: '2-5 Marks', description: 'Single-digit addition/subtraction using fingers, dots, or items.' },
        ],
        markingScheme: {
          internalTotal: 20,
          internalDuration: '1 Hour',
          annualTotal: 80,
          annualDuration: '2 Hours',
          internalBreakdown: 'Visual counting (6M), Comparisons (4M), Simple addition (10M)',
          annualBreakdown: 'Object counting (20M), Number writing 1-50 (20M), Basic addition/shapes (40M)',
          criteria: ['Accurate counting', 'Correct number formation', 'Correct shape identification'],
        },
        examPattern: {
          formats: ['Multiple Choice with Pictures', 'Fill in the Missing Digits', 'True/False', 'Pictorial Working'],
          difficultyRatio: '50% Easy • 40% Medium • 10% Challenge',
          timeAllocation: '2 minutes per question with teacher guidance',
          curriculumAlignment: 'NCERT Early Childhood Care and Education (ECCE) Guidelines',
        },
      };
    }

    if (subject === 'Hindi') {
      return {
        paperStyle: 'स्वर-व्यंजन एवं बालगीत शैली',
        styleDescription: 'स्वर और व्यंजन पहचान, बिना मात्रा वाले सरल शब्द, चित्र पहचान और बाल कविताएँ।',
        sections: [
          { name: 'खंड क: वर्ण पहचान', questions: '1-3', marks: '1 अंक प्रत्येक', description: 'स्वर (अ-औ) और व्यंजन (क-ज्ञ) पहचान तथा सही विकल्प चुनना।' },
          { name: 'खंड ख: शब्द निर्माण', questions: '4-5', marks: '1-2 अंक', description: 'दो और तीन अक्षर वाले सरल शब्द (नल, जल, घर) जोड़कर लिखना।' },
          { name: 'खंड ग: मौखिक एवं रचनात्मक', questions: '6-7', marks: '2-5 अंक', description: 'बालगीत की पंक्तियाँ और चित्रों के नाम बताना।' },
        ],
        markingScheme: {
          internalTotal: 20,
          internalDuration: '1 घंटा',
          annualTotal: 80,
          annualDuration: '2 घंटे',
          internalBreakdown: 'वर्ण पहचान (6 अंक), शब्द निर्माण (6 अंक), कविता व चित्र (8 अंक)',
          annualBreakdown: 'स्वर-व्यंजन (25 अंक), सरल शब्द (25 अंक), सुलेख व मौखिक समझ (30 अंक)',
          criteria: ['स्पष्ट वर्ण लेखन', 'सही उच्चारण व पहचान', 'शब्दों का सही मेल'],
        },
        examPattern: {
          formats: ['बहुविकल्पी (MCQ)', 'रिक्त स्थान पूर्ति', 'सही/गलत', 'लघु उत्तरीय'],
          difficultyRatio: '50% सरल • 40% मध्यम • 10% अभ्यास',
          timeAllocation: 'मौखिक निर्देश सहित 2 मिनट प्रति प्रश्न',
          curriculumAlignment: 'एनसीईआरटी आरंभिक भाषा शिक्षण ढांचा',
        },
      };
    }

    // Default Kindergarten (English / EVS)
    return {
      paperStyle: subject === 'English' ? 'Phonics, Alphabet & Rhymes' : 'Surroundings, Body Parts & Habits',
      styleDescription: subject === 'English'
        ? 'Capital/small letter recognition, phonetic starting sounds, and rhyme completion.'
        : 'Identifying body parts, sensory organs, family members, animals, and healthy habits.',
      sections: [
        { name: 'Section A: Objective Recognition', questions: '1-3', marks: '1 Mark each', description: 'Letter/organ identification, starting sounds, and basic choices.' },
        { name: 'Section B: Fill in & Matching', questions: '4-5', marks: '1-2 Marks', description: 'Missing letter completion and sensory/animal associations.' },
        { name: 'Section C: Short Explanations & Rhymes', questions: '6-7', marks: '2-5 Marks', description: 'Writing 2-letter words or naming family/good habits.' },
      ],
      markingScheme: {
        internalTotal: 20,
        internalDuration: '1 Hour',
        annualTotal: 80,
        annualDuration: '2 Hours',
        internalBreakdown: 'Recognition (6M), Vocabulary/Organs (6M), Rhymes/Habits (8M)',
        annualBreakdown: 'Foundations (20M), Word building (30M), Practical application (30M)',
        criteria: ['Legible lettering', 'Sensory organ knowledge', 'Proper vocabulary'],
      },
      examPattern: {
        formats: ['Multiple Choice with Visuals', 'Missing Blanks', 'True/False', 'Short Written Responses'],
        difficultyRatio: '50% Easy • 40% Medium • 10% Creative',
        timeAllocation: '2 minutes per question',
        curriculumAlignment: 'NCERT Early Steps Foundational Curriculum',
      },
    };
  }

  // 2. PRIMARY (Classes 1 to 5)
  if (isPrimary) {
    if (subject === 'Mathematics') {
      return {
        paperStyle: 'Concept, Computation & Word Problems',
        styleDescription: 'Numbers, basic operations (+, -, x, ÷), fractions, geometry, measurement, and daily life math puzzles.',
        sections: [
          { name: 'Section A: Objective Concept Questions', questions: 'Q1 - Q3', marks: '1 Mark each', description: 'Place value, shapes, units of measurement, and quick mental math.' },
          { name: 'Section B: Direct Computations', questions: 'Q4 - Q5', marks: '1-2 Marks', description: 'Multi-digit addition, subtraction, multiplication, and clock reading.' },
          { name: 'Section C: Word Problems & Practical Logic', questions: 'Q6 - Q7', marks: '4-5 Marks', description: 'Multi-step real-world problems (money, perimeter, sharing fractions).' },
        ],
        markingScheme: {
          internalTotal: 20,
          internalDuration: '1 Hour',
          annualTotal: 80,
          annualDuration: '2.5 Hours',
          internalBreakdown: 'Concepts (4M), Computations (6M), Word problems (10M)',
          annualBreakdown: 'MCQs & Blanks (20M), Short calculations (30M), Long word problems (30M)',
          criteria: ['Correct arithmetic method', 'Showing intermediate working steps', 'Proper units (cm, m, kg, ₹) in final answer'],
        },
        examPattern: {
          formats: ['MCQs (1M)', 'Fill in the Blanks', 'True / False', '2-Step Calculations', 'Long Word Problems (4-5M)'],
          difficultyRatio: '40% Easy • 40% Medium • 20% Application',
          timeAllocation: '1M: 1.5 mins | 2M: 3 mins | 4-5M: 8 mins',
          curriculumAlignment: 'NCERT Math-Magic / Joyful Mathematics Syllabus',
        },
      };
    }

    if (subject === 'EVS') {
      return {
        paperStyle: 'Observation, Science & Environmental Habits',
        styleDescription: 'Living vs non-living, plant/animal life, water cycle, family structures, hygiene, and shelter.',
        sections: [
          { name: 'Section A: Foundational Knowledge', questions: 'Q1 - Q3', marks: '1 Mark each', description: 'Animal senses, plant parts, states of matter, and nutritious foods.' },
          { name: 'Section B: Short Reasoning', questions: 'Q4 - Q5', marks: '1-2 Marks', description: 'Cause and effect (e.g. why water is essential, why snakes are farmers\' friends).' },
          { name: 'Section C: Descriptive & Investigative', questions: 'Q6 - Q7', marks: '4-5 Marks', description: 'Processes (digestion, seed dispersal, shelter types, experiments).' },
        ],
        markingScheme: {
          internalTotal: 20,
          internalDuration: '1 Hour',
          annualTotal: 80,
          annualDuration: '2.5 Hours',
          internalBreakdown: 'Objective (4M), Short reasoning (6M), Descriptive (10M)',
          annualBreakdown: 'Objective (20M), Conceptual questions (30M), Case/Experiment analysis (30M)',
          criteria: ['Scientific accuracy', 'Real-world environmental examples', 'Structured bullet-point answers'],
        },
        examPattern: {
          formats: ['MCQs', 'Fill in Blanks', 'True/False', 'Reasoning Questions', 'Long Descriptive'],
          difficultyRatio: '35% Easy • 45% Medium • 20% Analytical',
          timeAllocation: '1M: 1 min | 2M: 3 mins | 5M: 8 mins',
          curriculumAlignment: 'NCERT Looking Around / Our Wondrous World Curriculum',
        },
      };
    }

    if (subject === 'Computer Science') {
      return {
        paperStyle: 'Computer Basics, Input/Output & Software Tools',
        styleDescription: 'Hardware components, operating systems, MS Paint, Word Processor, storage devices, and Scratch basics.',
        sections: [
          { name: 'Section A: Hardware & Terminology', questions: 'Q1 - Q3', marks: '1 Mark each', description: 'Input/output devices, memory types, and operating system basics.' },
          { name: 'Section B: Shortcuts & Tools', questions: 'Q4 - Q5', marks: '1-2 Marks', description: 'Keyboard shortcuts (Ctrl+S, Ctrl+C), paint tools, and desktop icons.' },
          { name: 'Section C: Practical Application', questions: 'Q6 - Q7', marks: '4-5 Marks', description: 'Generations of computers, safe internet rules, and software functionality.' },
        ],
        markingScheme: {
          internalTotal: 20,
          internalDuration: '1 Hour',
          annualTotal: 80,
          annualDuration: '2 Hours',
          internalBreakdown: 'Fundamentals (6M), Shortcuts/Tools (6M), Concepts & Safety (8M)',
          annualBreakdown: 'Objective (25M), Short technical definitions (25M), Descriptive procedures (30M)',
          criteria: ['Accurate technical definitions', 'Correct shortcuts and functions', 'Practical awareness'],
        },
        examPattern: {
          formats: ['MCQs', 'Fill in Blanks', 'True/False', 'Tool Definitions', 'Application-based'],
          difficultyRatio: '40% Easy • 45% Medium • 15% Application',
          timeAllocation: '1M: 1 min | 2M: 2.5 mins | 5M: 7 mins',
          curriculumAlignment: 'CBSE Computer Science & ICT Skill Curriculum',
        },
      };
    }

    // Languages (English / Hindi Class 1-5)
    return {
      paperStyle: 'Reading, Grammar, Vocabulary & Literature',
      styleDescription: 'Prescribed textbook stories/poems, sight words, tenses, opposites, sentence formation, and moral understanding.',
      sections: [
        { name: 'Section A: Comprehension & MCQs', questions: 'Q1 - Q3', marks: '1 Mark each', description: 'Direct character and plot-based questions from NCERT lessons.' },
        { name: 'Section B: Vocabulary & Grammar', questions: 'Q4 - Q5', marks: '1-2 Marks', description: 'Rhyming words, opposites, punctuation, and fill in the blanks.' },
        { name: 'Section C: Literature & Creative Writing', questions: 'Q6 - Q7', marks: '4-5 Marks', description: 'Central theme of poems, character sketches, and paragraph writing.' },
      ],
      markingScheme: {
        internalTotal: 20,
        internalDuration: '1 Hour',
        annualTotal: 80,
        annualDuration: '2.5 Hours',
        internalBreakdown: 'Objective (4M), Vocabulary/Grammar (6M), Literature answers (10M)',
        annualBreakdown: 'Comprehension & MCQs (20M), Grammar (20M), Literature (40M)',
        criteria: ['Grammatical correctness', 'Neat handwriting & spelling', 'Answering all parts of the question'],
      },
      examPattern: {
        formats: ['MCQs', 'Fill in Blanks', 'True/False', 'Short Answer', 'Long Character/Moral Analysis'],
        difficultyRatio: '35% Easy • 45% Medium • 20% Creative',
        timeAllocation: '1M: 1 min | 2M: 3 mins | 5M: 8 mins',
        curriculumAlignment: 'NCERT Marigold / Mridang / Rimjhim / Sarangi Framework',
      },
    };
  }

  // 3. MIDDLE (Classes 6 to 8)
  if (isMiddle) {
    if (subject === 'Mathematics') {
      return {
        paperStyle: 'Algebra, Geometry, Arithmetic & Mensuration',
        styleDescription: 'Integers, rational numbers, fractions, linear equations, quadrilaterals, data handling, and exponents.',
        sections: [
          { name: 'Section A: Objective & Conceptual MCQs', questions: 'Q1 - Q3', marks: '1 Mark each', description: 'Properties of numbers, definitions of polygon types, and prime factor rules.' },
          { name: 'Section B: Short Algorithmic Computations', questions: 'Q4 - Q5', marks: '1-2 Marks', description: 'BODMAS rules, integer arithmetic, and basic equation solving.' },
          { name: 'Section C: Proofs, Constructions & Word Problems', questions: 'Q6 - Q7', marks: '4-5 Marks', description: 'Pythagoras theorem, geometric angle calculations, and algebraic applications.' },
        ],
        markingScheme: {
          internalTotal: 20,
          internalDuration: '1 Hour',
          annualTotal: 80,
          annualDuration: '3 Hours',
          internalBreakdown: 'MCQs & Blanks (4M), Short calculations (6M), Long proofs/problems (10M)',
          annualBreakdown: 'Section A: 10 MCQs (10M), Section B: 6 Short (12M), Section C: 6 Med (18M), Section D: 8 Long (40M)',
          criteria: ['Step-by-step mathematical working', 'Writing reason/theorems used', 'Correct calculation and units'],
        },
        examPattern: {
          formats: ['MCQs (1M)', 'Fill in Blanks', 'True/False', 'Short Answer (2M)', 'Long Multi-Step (4-5M)'],
          difficultyRatio: '30% Easy • 50% Medium • 20% Hard',
          timeAllocation: '1M: 1.5 mins | 2M: 3 mins | 4-5M: 8-10 mins',
          curriculumAlignment: 'CBSE / NCERT Middle School Ganita Prakash Curriculum',
        },
      };
    }

    if (subject === 'Science') {
      return {
        paperStyle: 'Physics, Chemistry & Biology Integrated Pattern',
        styleDescription: 'Experimental observations, chemical changes, organ systems, nutrition, motion, and electricity.',
        sections: [
          { name: 'Section A: Objective & Scientific Facts', questions: 'Q1 - Q3', marks: '1 Mark each', description: 'Nutrient tests, separation techniques, plant/animal cell parts, and units.' },
          { name: 'Section B: Scientific Explanations & Equations', questions: 'Q4 - Q5', marks: '1-2 Marks', description: 'Balanced equations, differences (acids vs bases, aerobic vs anaerobic).' },
          { name: 'Section C: In-depth Systems & Investigations', questions: 'Q6 - Q7', marks: '4-5 Marks', description: 'Cell diagrams, digestive/respiratory system pathways, combustion, and force.' },
        ],
        markingScheme: {
          internalTotal: 20,
          internalDuration: '1 Hour',
          annualTotal: 80,
          annualDuration: '3 Hours',
          internalBreakdown: 'Objective (4M), Short reasoning (6M), Systems/Processes (10M)',
          annualBreakdown: 'Section A: 10M Objective, Section B: 18M Conceptual, Section C: 22M Descriptive, Section D: 30M Diagrams & Experiments',
          criteria: ['Scientific terminology', 'Labeled neat diagrams', 'Balanced chemical equations'],
        },
        examPattern: {
          formats: ['MCQs', 'Fill in Blanks', 'True/False', 'Short Concept Reasoning', 'Detailed Explanations with Diagrams'],
          difficultyRatio: '30% Easy • 50% Medium • 20% Analytical',
          timeAllocation: '1M: 1 min | 2M: 3 mins | 5M: 8 mins',
          curriculumAlignment: 'NCERT Science / Curiosity Curriculum Framework',
        },
      };
    }

    if (subject === 'Social Science') {
      return {
        paperStyle: 'History, Geography & Political Life Composite',
        styleDescription: 'Chronological timelines, sources of history, Earth spheres, climate, democracy, and equality.',
        sections: [
          { name: 'Section A: Historical Facts & Geographic Terms', questions: 'Q1 - Q3', marks: '1 Mark each', description: 'Standard Meridian, battles (Plassey), layers of Earth, and constitutional articles.' },
          { name: 'Section B: Cause & Effect Analysis', questions: 'Q4 - Q5', marks: '1-2 Marks', description: 'Why colonial policies caused rebellion, why democracy is preferred, rock cycle.' },
          { name: 'Section C: Detailed Evaluative Notes & Case Studies', questions: 'Q6 - Q7', marks: '4-5 Marks', description: 'Harappan city planning, constitutional separation of powers, soil conservation.' },
        ],
        markingScheme: {
          internalTotal: 20,
          internalDuration: '1 Hour',
          annualTotal: 80,
          annualDuration: '3 Hours',
          internalBreakdown: 'Facts & Terms (4M), Short analysis (6M), Long evaluative (10M)',
          annualBreakdown: 'MCQs & Blanks (15M), Short answers (25M), Long notes (30M), Map work (10M)',
          criteria: ['Factual accuracy (dates, events, places)', 'Clear cause-and-effect explanations', 'Accurate map pointing'],
        },
        examPattern: {
          formats: ['MCQs', 'Fill in Blanks', 'True/False', 'Short Answer', 'Long Analytical / Case Study', 'Map Skill'],
          difficultyRatio: '30% Easy • 50% Medium • 20% Analytical',
          timeAllocation: '1M: 1 min | 2M: 3 mins | 5M: 9 mins',
          curriculumAlignment: 'CBSE Social Science Curriculum (Our Pasts, Earth Our Habitat, Civics)',
        },
      };
    }

    if (subject === 'Sanskrit') {
      return {
        paperStyle: 'व्याकरण, श्लोक-भावार्थ एवं कथा-अवबोधनम्',
        styleDescription: 'शब्दरूप, धातुरूप, लट्-लकार, श्लोकों का अन्वय व भावार्थ, पञ्चतन्त्र कथाएं और नैतिक शिक्षा।',
        sections: [
          { name: 'खंड क: वस्तुनिष्ठ एवं शब्दपरिचयः', questions: 'Q1 - Q3', marks: '1 अंक प्रत्येक', description: 'संस्कृत वर्णमाला, शब्दार्थ, सर्वनाम और संख्यावाची शब्द।' },
          { name: 'खंड ख: व्याकरण एवं लकार-रूपाणि', questions: 'Q4 - Q5', marks: '1-2 अंक', description: 'धातुरूप (पठ्, गम्), रिक्त स्थान पूर्ति और वाक्य प्रयोग।' },
          { name: 'खंड ग: श्लोकार्थ एवं कथासार', questions: 'Q6 - Q7', marks: '4-5 अंक', description: 'सुभाषितानि श्लोकों का सरल भावार्थ और पञ्चतन्त्र कथा की नैतिक शिक्षा।' },
        ],
        markingScheme: {
          internalTotal: 20,
          internalDuration: '1 घंटा',
          annualTotal: 80,
          annualDuration: '3 घंटे',
          internalBreakdown: 'शब्दार्थ व वस्तुनिष्ठ (4 अंक), व्याकरण (6 अंक), श्लोक व कथा (10 अंक)',
          annualBreakdown: 'अपठित अवबोधनम् (10 अंक), रचनात्मक कार्य (15 अंक), व्याकरणम् (25 अंक), पाठ्यपुस्तकम् (30 अंक)',
          criteria: ['शुद्ध वर्तनी व विसर्ग-हलन्त का सही प्रयोग', 'सटीक शब्दरूप व धातुरूप', 'श्लोक का स्पष्ट भावार्थ'],
        },
        examPattern: {
          formats: ['बहुविकल्पी (MCQ)', 'रिक्त स्थान', 'सत्य/असत्य', 'लघु उत्तरीय', 'श्लोक-भावार्थ व कथा-सार'],
          difficultyRatio: '35% सरल • 45% मध्यम • 20% उच्च स्तरीय',
          timeAllocation: '1 अंक: 1 मिनट | 2 अंक: 3 मिनट | 5 अंक: 8 मिनट',
          curriculumAlignment: 'एनसीईआरटी रुचिरा / दीपकम संस्कृत पाठ्यक्रम',
        },
      };
    }

    // English / Hindi Middle
    return {
      paperStyle: 'Reading, Grammar, Creative Writing & Literature',
      styleDescription: 'Unseen passages, formal/informal writing, grammar rules, poetry appreciation, and character studies.',
      sections: [
        { name: 'Section A: Reading & Objective Facts', questions: 'Q1 - Q3', marks: '1 Mark each', description: 'Textual comprehension, author/poet names, and specific details.' },
        { name: 'Section B: Grammar & Vocabulary', questions: 'Q4 - Q5', marks: '1-2 Marks', description: 'Idioms, antonyms, voice/narration, and sentence correction.' },
        { name: 'Section C: Literature & In-depth Analysis', questions: 'Q6 - Q7', marks: '4-5 Marks', description: 'Poetic devices, thematic essays, and character transformations.' },
      ],
      markingScheme: {
        internalTotal: 20,
        internalDuration: '1 Hour',
        annualTotal: 80,
        annualDuration: '3 Hours',
        internalBreakdown: 'Objective (4M), Grammar (6M), Literature (10M)',
        annualBreakdown: 'Reading (20M), Writing & Grammar (20M), Literature (40M)',
        criteria: ['Contextual understanding', 'Correct grammar and spelling', 'Structured critical analysis'],
      },
      examPattern: {
        formats: ['MCQs', 'Fill in Blanks', 'True/False', 'Short Answer', 'Long Interpretative'],
        difficultyRatio: '30% Easy • 50% Medium • 20% Critical',
        timeAllocation: '1M: 1 min | 2M: 3 mins | 5M: 9 mins',
        curriculumAlignment: 'NCERT Honeysuckle / Poorvi / Vasant / Honeydew Guidelines',
      },
    };
  }

  // 4. SECONDARY (Classes 9 & 10 - CBSE Board Blueprint)
  if (subject === 'Mathematics') {
    return {
      paperStyle: 'CBSE Board Standard: Standard & Basic 5-Section Pattern',
      styleDescription: 'Real numbers, polynomials, quadratic equations, trigonometry, triangles, statistics, and probability.',
      sections: [
        { name: 'Section A: 20 Objective Questions (MCQ + A/R)', questions: 'Q1 - Q3', marks: '1 Mark each', description: 'Formulas, zeroes, discriminant, trigonometric identities, and probability.' },
        { name: 'Section B: Very Short Answer Questions (VSA)', questions: 'Q4 - Q5', marks: '2 Marks each', description: '2-step calculations: HCF/LCM, irrationality proof steps, and AP common difference.' },
        { name: 'Section C, D & E: Short, Long & Case Studies', questions: 'Q6 - Q7', marks: '4-5 Marks each', description: 'Rigorous theorem proofs (√5 irrational, Thales theorem), quadratic word problems, and real-life case applications.' },
      ],
      markingScheme: {
        internalTotal: 20,
        internalDuration: '1 Hour',
        annualTotal: 80,
        annualDuration: '3 Hours',
        internalBreakdown: 'MCQs (4M), VSA (4M), Short (2M), Long proof (10M)',
        annualBreakdown: 'Sec A: 20 MCQs (20M), Sec B: 5 VSA (10M), Sec C: 6 SA (18M), Sec D: 4 LA (20M), Sec E: 3 Case Studies (12M) = 80M',
        criteria: ['Step-by-step mathematical working with statements', 'Mentioning theorem names and identities used', 'Clear units and neat geometric figures'],
      },
      examPattern: {
        formats: ['MCQs (1M)', 'Assertion-Reason', 'Very Short (2M)', 'Short (3M)', 'Long Proofs (5M)', 'Case-Based (4M)'],
        difficultyRatio: '25% Easy • 50% Medium • 25% High-Order Thinking (HOTS)',
        timeAllocation: '1M: 1.5 mins | 2M: 3 mins | 3M: 5 mins | 5M: 10 mins | Revision: 15 mins',
        curriculumAlignment: 'CBSE Class 9 & 10 Mathematics Board Examination Blueprint',
      },
    };
  }

  if (subject === 'Science') {
    return {
      paperStyle: 'CBSE Board Pattern: Physics, Chemistry & Biology Sections',
      styleDescription: 'Chemical reactions, acids/bases, life processes, light, electricity, gravitation, and carbon compounds.',
      sections: [
        { name: 'Section A: Objective & Assertion-Reason', questions: 'Q1 - Q3', marks: '1 Mark each', description: 'Formulas (Plaster of Paris), law statements (Ohm\'s law, Snell\'s law), cell organelles.' },
        { name: 'Section B: Very Short & Balanced Equations', questions: 'Q4 - Q5', marks: '2 Marks each', description: 'Balancing chemical equations, short definitions, and scientific reasoning.' },
        { name: 'Section C, D & E: Descriptive, Diagrams & Case-Based', questions: 'Q6 - Q7', marks: '4-5 Marks each', description: 'Double circulation flowcharts, micelle cleansing action, ray diagrams, and derivations.' },
      ],
      markingScheme: {
        internalTotal: 20,
        internalDuration: '1 Hour',
        annualTotal: 80,
        annualDuration: '3 Hours',
        internalBreakdown: 'Objective (4M), Equations/Reasoning (4M), Long systems & mechanisms (12M)',
        annualBreakdown: 'Sec A: 20 MCQs (20M), Sec B: 6 VSA (12M), Sec C: 7 SA (21M), Sec D: 3 LA (15M), Sec E: 3 Case/Practical (12M) = 80M',
        criteria: ['Correct chemical symbols and balanced equations', 'Sharply drawn diagrams with proper labeling', 'Accurate scientific justification'],
      },
      examPattern: {
        formats: ['MCQs (1M)', 'Assertion-Reason (1M)', 'Very Short (2M)', 'Short (3M)', 'Long Analytical (5M)', 'Case/Data-based (4M)'],
        difficultyRatio: '25% Easy • 50% Medium • 25% Analytical / HOTS',
        timeAllocation: '1M: 1 min | 2M: 2.5 mins | 3M: 5 mins | 5M: 9 mins',
        curriculumAlignment: 'CBSE Class 9 & 10 Science Curriculum and Lab Guidelines',
      },
    };
  }

  if (subject === 'Social Science') {
    return {
      paperStyle: 'CBSE Board Standard: History, Geography, Political Science & Economics',
      styleDescription: 'Nationalism in Europe/India, resources, federalism, power sharing, HDI, and sectors of economy.',
      sections: [
        { name: 'Section A: 20 Objective & Source-based MCQs', questions: 'Q1 - Q3', marks: '1 Mark each', description: 'Historical figures (Mazzini), dates (1919), definitions (HDI, secularism).' },
        { name: 'Section B: Short Analytical Arguments', questions: 'Q4 - Q5', marks: '2-3 Marks each', description: 'Reasons for calling off Non-Cooperation, horizontal vs vertical power sharing.' },
        { name: 'Section C, D & E: Long Evaluative Essays & Map Work', questions: 'Q6 - Q7', marks: '4-5 Marks each', description: 'Detailed account of Dandi March, federal features of India, and soil conservation.' },
      ],
      markingScheme: {
        internalTotal: 20,
        internalDuration: '1 Hour',
        annualTotal: 80,
        annualDuration: '3 Hours',
        internalBreakdown: 'Objective (4M), Analytical (6M), Long essays (10M)',
        annualBreakdown: 'Sec A: 20 MCQs (20M), Sec B: 4 VSA (8M), Sec C: 5 SA (15M), Sec D: 4 LA (20M), Sec E: 3 Case (12M), Sec F: Map Work (5M) = 80M',
        criteria: ['Point-wise structured answers with headings', 'Factual historical dates and geographical facts', 'Accurate map location marking'],
      },
      examPattern: {
        formats: ['MCQs (1M)', 'Short Answer (2M-3M)', 'Long Descriptive (5M)', 'Case-Based Source (4M)', 'Map Work (5M)'],
        difficultyRatio: '30% Knowledge • 45% Understanding • 25% Evaluation & Application',
        timeAllocation: '1M: 1 min | 2M: 3 mins | 5M: 10 mins | Map: 5 mins',
        curriculumAlignment: 'CBSE Class 9 & 10 Social Science Board Examination Pattern',
      },
    };
  }

  if (subject === 'Computer Science') {
    return {
      paperStyle: 'CBSE Board Pattern: Networking, Python, SQL & Cyber Ethics',
      styleDescription: 'Database querying (SQL SELECT/WHERE), Python data types and loops, network devices, and IPR.',
      sections: [
        { name: 'Section A: Objective & Tech Terms', questions: 'Q1 - Q3', marks: '1 Mark each', description: 'SQL clauses (SELECT, WHERE, ORDER BY), topologies, and Boolean data types.' },
        { name: 'Section B: Short Definitions & SQL Snippets', questions: 'Q4 - Q5', marks: '2 Marks each', description: 'Difference between DDL and DML, router functions, and binary-decimal conversions.' },
        { name: 'Section C: Code Writing, Queries & Cyber Ethics', questions: 'Q6 - Q7', marks: '4-5 Marks each', description: 'Writing SQL table queries, Python pass/fail programs, and digital footprint ethics.' },
      ],
      markingScheme: {
        internalTotal: 20,
        internalDuration: '1 Hour',
        annualTotal: 80,
        annualDuration: '3 Hours',
        internalBreakdown: 'Objective (4M), Short definitions (6M), Queries & Code (10M)',
        annualBreakdown: 'Section A: MCQs (20M), Section B: Short (20M), Section C: SQL Queries (20M), Section D: Python Code & Architecture (20M)',
        criteria: ['Accurate SQL syntax and semicolons', 'Correct Python indentation and logic', 'Precise cyber safety guidelines'],
      },
      examPattern: {
        formats: ['MCQs (1M)', 'Short Technical (2M)', 'SQL Query Writing (2M-4M)', 'Python Programming (3M-5M)', 'Case-Based Ethics'],
        difficultyRatio: '30% Theoretical • 50% Practical Coding/Queries • 20% Problem Solving',
        timeAllocation: '1M: 1 min | 2M: 2.5 mins | 5M: 8 mins',
        curriculumAlignment: 'CBSE Class 9 & 10 Information Technology / Computer Applications',
      },
    };
  }

  // Languages (English / Hindi Class 9 & 10)
  return {
    paperStyle: 'CBSE Board Standard: Reading, Writing, Grammar & Literature',
    styleDescription: 'Unseen analytical passages, formal letters, analytical paragraphs, editing/omission, and core literature.',
    sections: [
      { name: 'Section A: Reading Skills', questions: 'Q1 - Q3', marks: '1 Mark each', description: 'Inference and vocabulary questions from prescribed NCERT chapters.' },
      { name: 'Section B: Writing & Applied Grammar', questions: 'Q4 - Q5', marks: '1-2 Marks', description: 'Tenses, modals, reported speech, fill in the blanks, and sentence correction.' },
      { name: 'Section C: Literature Textbook & Long Analysis', questions: 'Q6 - Q7', marks: '4-5 Marks', description: 'Extract-based analysis, character sketches (Lencho, Mandela), and thematic evaluation.' },
    ],
    markingScheme: {
      internalTotal: 20,
      internalDuration: '1 Hour',
      annualTotal: 80,
      annualDuration: '3 Hours',
      internalBreakdown: 'Objective (4M), Grammar (6M), Literature (10M)',
      annualBreakdown: 'Section A: Reading Skills (20M), Section B: Writing & Grammar (20M), Section C: Literature (40M) = 80M',
      criteria: ['Expression, coherence, and grammatical precision', 'Textual reference and analytical depth', 'Adherence to prescribed word limits'],
    },
    examPattern: {
      formats: ['MCQs (1M)', 'Short Answer (2M-3M)', 'Long Analytical (5M-6M)', 'Extract Based Questions'],
      difficultyRatio: '25% Easy • 50% Medium • 25% High-Order Thinking',
      timeAllocation: 'Reading: 40 mins | Writing & Grammar: 50 mins | Literature: 75 mins | Revision: 15 mins',
      curriculumAlignment: 'CBSE Class 9 & 10 English Language & Literature / Hindi Course A/B',
    },
  };
};
