import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SubjectSelection from "./pages/SubjectSelection";
import ExamSelection from "./pages/ExamSelection";
import QuestionPaperView from "./pages/QuestionPaperView";
import MyPapers from "./pages/MyPapers";
import Syllabus from "./pages/Syllabus";
import SyllabusDetail from "./pages/SyllabusDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import GeneratePaper from "./pages/GeneratePaper";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/class/:classId" element={<SubjectSelection />} />
          <Route path="/class/:classId/subject/:subjectId" element={<ExamSelection />} />
          <Route path="/class/:classId/subject/:subjectId/exam/:examId" element={<QuestionPaperView />} />
          <Route path="/my-papers" element={<MyPapers />} />
          <Route path="/syllabus" element={<Syllabus />} />
          <Route path="/syllabus/:classId/:subjectId" element={<SyllabusDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/generate" element={<GeneratePaper />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
