/**
 * 사주 결과 컨텐츠 표시 (Markdown 렌더링)
 */

"use client";

interface ResultContentProps {
  result: string; // Markdown 형식
}

export function ResultContent({ result }: ResultContentProps) {
  // Markdown을 단순 파싱 (제목, 단락, 리스트만 지원)
  const parseMarkdown = (md: string) => {
    const lines = md.split("\n");
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];
    let key = 0;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${key++}`} className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            {currentList.map((item, idx) => (
              <li key={idx} className="ml-4">
                {item}
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line) => {
      line = line.trim();

      // 빈 줄
      if (!line) {
        flushList();
        return;
      }

      // 제목 (## 또는 ###)
      if (line.startsWith("###")) {
        flushList();
        elements.push(
          <h3 key={`h3-${key++}`} className="text-xl font-bold text-gray-800 mt-8 mb-4">
            {line.replace(/^###\s*/, "")}
          </h3>
        );
      } else if (line.startsWith("##")) {
        flushList();
        elements.push(
          <h2 key={`h2-${key++}`} className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            {line.replace(/^##\s*/, "")}
          </h2>
        );
      }
      // 리스트 (- 또는 *)
      else if (line.startsWith("- ") || line.startsWith("* ")) {
        currentList.push(line.replace(/^[-*]\s*/, ""));
      }
      // 볼드 텍스트 (**text**)
      else if (line.includes("**")) {
        flushList();
        const parts = line.split("**");
        const formatted = parts.map((part, idx) => {
          if (idx % 2 === 1) {
            return (
              <strong key={idx} className="font-bold text-purple-600">
                {part}
              </strong>
            );
          }
          return part;
        });
        elements.push(
          <p key={`p-${key++}`} className="text-gray-700 leading-relaxed mb-4">
            {formatted}
          </p>
        );
      }
      // 일반 단락
      else {
        flushList();
        elements.push(
          <p key={`p-${key++}`} className="text-gray-700 leading-relaxed mb-4">
            {line}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {parseMarkdown(result)}
      </div>
    </div>
  );
}
