export default function StepCard({
    number,
    title,
    description,
  }: {
    number: number;
    title: string;
    description: string;
  }) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
        <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto animate-pulse">
          {number}
        </div>
        <h4 className="text-xl font-semibold mb-2 text-gray-900">{title}</h4>
        <p className="text-gray-700">{description}</p>
      </div>
    );
  }
  