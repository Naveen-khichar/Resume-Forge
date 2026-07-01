export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 pt-20 pb-8 overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 -z-10 h-[400px] w-[600px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-10 -z-10 h-[300px] w-[500px] rounded-full bg-blue-900/10 blur-[100px] pointer-events-none" />

      {/* Modern Badge */}
      <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 px-3 py-1 text-xs font-medium text-purple-400 mb-6">
        <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
        Powered by Gemini 2.5 AI & Advanced NLP
      </div>

      {/* Main Gradient Title */}
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-3.1xl leading-[1.1]">
        Optimize Your Resume For
        <span className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
          Applicant Tracking Systems
        </span>
      </h1>

      {/* Subtext description */}
      <p className="mt-6 text-base md:text-lg text-zinc-400 max-w-2xl leading-relaxed">
        Get a deterministic ATS compatibility score, extract hidden skill keywords,
        and obtain actionable suggestions to rewrite your bullet points for top companies.
      </p>
    </section>
  );
}