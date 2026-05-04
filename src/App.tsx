import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { RequireAuth } from "@/components/RequireAuth";
import { Navbar } from "@/components/Navbar";
import Home from "./pages/Home";
import TopicPage from "./pages/TopicPage";
import Bookmarks from "./pages/Bookmarks";
import Quiz from "./pages/Quiz";
import ProgressDashboard from "./pages/ProgressDashboard";
import AIStudio from "./pages/AIStudio";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="*"
                element={
                  <RequireAuth>
                    <div className="min-h-screen bg-background text-foreground">
                      <Navbar />
                      <main>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/topic/:topicId" element={<TopicPage />} />
                          <Route path="/bookmarks" element={<Bookmarks />} />
                          <Route path="/quiz" element={<Quiz />} />
                          <Route path="/progress" element={<ProgressDashboard />} />
                          <Route path="/ai" element={<AIStudio />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </RequireAuth>
                }
              />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
