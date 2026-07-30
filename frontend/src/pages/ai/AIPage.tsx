import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Sidebar from '../../components/layout/Sidebar';
import { aiApi } from '../../api/ai.api';

type TabKey = 'cover' | 'analyze' | 'cv' | 'interview';

const tabs: { key: TabKey; label: string; description: string }[] = [
  { key: 'cover', label: 'Cover Letter', description: 'Generate a tailored cover letter' },
  { key: 'analyze', label: 'Analyze Job', description: 'Break down a job description' },
  { key: 'cv', label: 'Improve CV', description: 'Get actionable resume feedback' },
  { key: 'interview', label: 'Interview Prep', description: 'Predict likely questions' },
];

const AIPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('cover');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const [coverForm, setCoverForm] = useState({
    company: '', position: '', jobDescription: '', userBackground: '',
  });
  const [analyzeForm, setAnalyzeForm] = useState({ jobDescription: '' });
  const [cvForm, setCvForm] = useState({ cvText: '', targetRole: '' });
  const [interviewForm, setInterviewForm] = useState({
    position: '', company: '', jobDescription: '',
  });

  const switchTab = (key: TabKey) => {
    setActiveTab(key);
    setResult('');
    setError('');
    setCopied(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');
    setCopied(false);
    try {
      let res;
      if (activeTab === 'cover') {
        res = await aiApi.coverLetter(coverForm);
      } else if (activeTab === 'analyze') {
        res = await aiApi.analyzeJob(analyzeForm);
      } else if (activeTab === 'cv') {
        res = await aiApi.improveCv(cvForm);
      } else {
        res = await aiApi.interviewQuestions(interviewForm);
      }
      setResult(res.data.data.result);
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const currentTab = tabs.find(t => t.key === activeTab)!;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">AI Tools</h2>
          <p className="text-slate-500 mt-1">
            Let AI help you write, analyze and prepare for your applications.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => switchTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="card p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900">{currentTab.label}</h3>
          <p className="text-sm text-slate-500 mb-5">{currentTab.description}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'cover' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Company *
                    </label>
                    <input
                      className="input-field"
                      value={coverForm.company}
                      onChange={e => setCoverForm({ ...coverForm, company: e.target.value })}
                      placeholder="e.g. Google"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Position *
                    </label>
                    <input
                      className="input-field"
                      value={coverForm.position}
                      onChange={e => setCoverForm({ ...coverForm, position: e.target.value })}
                      placeholder="e.g. Frontend Developer"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Job description (optional)
                  </label>
                  <textarea
                    className="input-field"
                    rows={5}
                    value={coverForm.jobDescription}
                    onChange={e => setCoverForm({ ...coverForm, jobDescription: e.target.value })}
                    placeholder="Paste the job posting here for a more tailored letter..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Your background (optional)
                  </label>
                  <textarea
                    className="input-field"
                    rows={4}
                    value={coverForm.userBackground}
                    onChange={e => setCoverForm({ ...coverForm, userBackground: e.target.value })}
                    placeholder="Your experience, skills, achievements..."
                  />
                </div>
              </>
            )}

            {activeTab === 'analyze' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Job description *
                </label>
                <textarea
                  className="input-field"
                  rows={10}
                  value={analyzeForm.jobDescription}
                  onChange={e => setAnalyzeForm({ jobDescription: e.target.value })}
                  placeholder="Paste the full job posting here..."
                  required
                />
              </div>
            )}

            {activeTab === 'cv' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Target role (optional)
                  </label>
                  <input
                    className="input-field"
                    value={cvForm.targetRole}
                    onChange={e => setCvForm({ ...cvForm, targetRole: e.target.value })}
                    placeholder="e.g. Senior React Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Your CV content *
                  </label>
                  <textarea
                    className="input-field"
                    rows={12}
                    value={cvForm.cvText}
                    onChange={e => setCvForm({ ...cvForm, cvText: e.target.value })}
                    placeholder="Paste your CV text here..."
                    required
                  />
                </div>
              </>
            )}

            {activeTab === 'interview' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Position *
                    </label>
                    <input
                      className="input-field"
                      value={interviewForm.position}
                      onChange={e => setInterviewForm({ ...interviewForm, position: e.target.value })}
                      placeholder="e.g. Backend Engineer"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Company (optional)
                    </label>
                    <input
                      className="input-field"
                      value={interviewForm.company}
                      onChange={e => setInterviewForm({ ...interviewForm, company: e.target.value })}
                      placeholder="e.g. Spotify"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Job description (optional)
                  </label>
                  <textarea
                    className="input-field"
                    rows={5}
                    value={interviewForm.jobDescription}
                    onChange={e => setInterviewForm({ ...interviewForm, jobDescription: e.target.value })}
                    placeholder="Paste the job posting for more specific questions..."
                  />
                </div>
              </>
            )}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Generating...' : 'Generate with AI'}
            </button>
          </form>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="card p-12 flex flex-col items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            <p className="text-sm text-slate-500">The AI is working on it...</p>
          </div>
        )}

        {result && !loading && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Result</h3>
              <button onClick={handleCopy} className="btn-secondary text-sm">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="ai-output">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AIPage;