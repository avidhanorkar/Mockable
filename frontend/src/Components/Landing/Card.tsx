type CardProps = {
  title: string;
  description: string;
};

export default function Card({ title, description }: CardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-left shadow-lg backdrop-blur-md transition-all duration-300 hover:drop-shadow-xl hover:-translate-y-2">
      <div className="flex flex-col gap-1 mb-4">
        <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {title}
        </h3>
        <span className="h-[3px] w-[50%] bg-white/20"></span>
      </div>
      <p className="text-gray-400 leading-relaxed text-lg">
        {description}
      </p>
    </div>
  );
}
