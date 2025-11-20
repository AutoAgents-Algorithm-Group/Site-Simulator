import Link from 'next/link';

interface TestCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  link: string;
  tags: string[];
}

export default function TestCard({ id, title, description, category, link, tags }: TestCardProps) {
  return (
    <Link href={link}>
      <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-all hover:shadow-lg cursor-pointer">
        <div className="flex items-start justify-between mb-2">
          <h5 className="text-xl font-bold tracking-tight text-gray-900">{title}</h5>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {category}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 text-sm text-blue-600 font-medium flex items-center">
          Run Test
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

