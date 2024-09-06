export default function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: JSX.Element;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-100 p-6 rounded-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
      {icon}
      <h4 className="text-xl font-semibold mb-2 text-gray-900">{title}</h4>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}
