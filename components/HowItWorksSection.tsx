export default function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Paste text or upload image",
      description: "Enter your notes or upload an image of your textbook page.",
      icon: "📝",
    },
    {
      number: "2",
      title: "We analyze the content",
      description: "Our system extracts key information and structure.",
      icon: "🔍",
    },
    {
      number: "3",
      title: "You get a diagram for revision",
      description: "Visualize complex concepts as clear, interactive diagrams.",
      icon: "📊",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="text-5xl mb-4">{step.icon}</div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

