type CardProps = {
  title: string;
  description: string;
};

export default function Card({ title, description }: CardProps) {
  return (
    <div className="rounded-xl border p-5 text-left shadow-md">
      <h3 className="text-2xl font-semibold text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-300 leading-relaxed w-96">
        {description}
      </p>
    </div>
  );
}
