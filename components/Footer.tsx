export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-400">
            Student Project by [Your Name]
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © {new Date().getFullYear()} AutoDiagram. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

