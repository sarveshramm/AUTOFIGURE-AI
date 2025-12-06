import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold mb-6">AutoDiagram</h1>
        <p className="text-xl mb-8 text-blue-100">
          Turn your text and notes into easy diagrams for exams.
        </p>
        <Link
          href="/diagram"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Start Generating Diagrams
        </Link>
      </div>
    </section>
  );
}

