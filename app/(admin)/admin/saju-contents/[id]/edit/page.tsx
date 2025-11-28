"use client";

/**
 * 사주 컨텐츠 에디터 페이지
 * Rich Text Editor for Saju Contents
 *
 * Features:
 * - Tiptap Rich Text Editor
 * - 자동 저장 (draft)
 * - 미리보기 모드
 * - 메타데이터 편집
 */

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Save,
  Eye,
  Edit3,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  X,
} from "lucide-react";

// Dynamic import for RichTextEditor (client-only)
const RichTextEditor = dynamic(
  () => import("@/components/admin/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
      </div>
    ),
  }
);

interface SajuContent {
  id: string;
  templateId: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status: "draft" | "published" | "archived";
  publishedAt?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  template?: {
    id: string;
    name: string;
    category?: {
      id: string;
      name: string;
    };
  };
}

interface SajuTemplate {
  id: string;
  name: string;
  category?: {
    id: string;
    name: string;
  };
}

export default function ContentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params?.id as string;

  // Content state
  const [content, setContent] = useState<SajuContent | null>(null);
  const [templates, setTemplates] = useState<SajuTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");

  // UI state
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch content
  const fetchContent = useCallback(async () => {
    if (!contentId || contentId === "new") {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/saju-contents/${contentId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "컨텐츠를 불러오는데 실패했습니다.");
      }

      setContent(data);
      setTitle(data.title);
      setSlug(data.slug);
      setExcerpt(data.excerpt || "");
      setBodyContent(data.content);
      setTemplateId(data.templateId);
      setStatus(data.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [contentId]);

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/saju-templates?limit=100");
      const data = await response.json();
      if (response.ok) {
        setTemplates(data.templates || []);
      }
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
    fetchContent();
  }, [fetchTemplates, fetchContent]);

  // Show toast
  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Save content
  const handleSave = async (newStatus?: "draft" | "published" | "archived") => {
    if (!title.trim()) {
      showToast("error", "제목을 입력해주세요.");
      return;
    }

    if (!templateId) {
      showToast("error", "템플릿을 선택해주세요.");
      return;
    }

    setSaving(true);

    try {
      const isNew = !contentId || contentId === "new";
      const url = isNew
        ? "/api/admin/saju-contents"
        : `/api/admin/saju-contents/${contentId}`;

      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          title,
          slug: slug || generateSlug(title),
          excerpt,
          content: bodyContent,
          status: newStatus || status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "저장에 실패했습니다.");
      }

      setLastSaved(new Date());

      if (isNew && data.id) {
        router.replace(`/admin/saju-contents/${data.id}/edit`);
      }

      if (newStatus) {
        setStatus(newStatus);
      }

      showToast(
        "success",
        newStatus === "published"
          ? "컨텐츠가 게시되었습니다."
          : "저장되었습니다."
      );
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // Generate slug
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Auto-save draft
  useEffect(() => {
    if (!title || !templateId || loading) return;

    const autoSaveTimer = setTimeout(() => {
      if (status === "draft") {
        handleSave();
      }
    }, 30000); // 30초마다 자동 저장

    return () => clearTimeout(autoSaveTimer);
  }, [title, bodyContent, excerpt, templateId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
        <Link
          href="/admin/saju-contents"
          className="mt-4 text-purple-600 hover:text-purple-700"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/saju-contents"
            className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {content ? "컨텐츠 편집" : "새 컨텐츠"}
            </h1>
            {lastSaved && (
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                <Clock className="w-4 h-4" />
                마지막 저장: {lastSaved.toLocaleTimeString("ko-KR")}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
              previewMode
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            )}
          >
            {previewMode ? (
              <>
                <Edit3 className="w-4 h-4" />
                편집
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                미리보기
              </>
            )}
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            저장
          </button>
          {status !== "published" && (
            <button
              onClick={() => handleSave("published")}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              게시
            </button>
          )}
        </div>
      </div>

      {/* Editor / Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full px-4 py-3 text-2xl font-bold border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            readOnly={previewMode}
          />

          {/* Content Editor / Preview */}
          {previewMode ? (
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              {excerpt && (
                <p className="text-lg text-slate-600 dark:text-slate-400 italic mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                  {excerpt}
                </p>
              )}
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: bodyContent }}
              />
            </div>
          ) : (
            <RichTextEditor
              content={bodyContent}
              onChange={setBodyContent}
              placeholder="컨텐츠를 작성하세요..."
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="font-medium text-slate-900 dark:text-white mb-3">
              상태
            </h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="draft">초안</option>
              <option value="published">게시됨</option>
              <option value="archived">보관됨</option>
            </select>
          </div>

          {/* Template */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="font-medium text-slate-900 dark:text-white mb-3">
              템플릿 *
            </h3>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">템플릿 선택</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name} ({template.category?.name || "미분류"})
                </option>
              ))}
            </select>
          </div>

          {/* Excerpt */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="font-medium text-slate-900 dark:text-white mb-3">
              요약
            </h3>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="검색 결과에 표시될 짧은 요약"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Slug */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="font-medium text-slate-900 dark:text-white mb-3">
              URL Slug
            </h3>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="url-slug"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="mt-2 text-xs text-slate-500">
              소문자, 숫자, 하이픈만 사용 가능
            </p>
          </div>

          {/* Stats (for existing content) */}
          {content && (
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="font-medium text-slate-900 dark:text-white mb-3">
                통계
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">조회수</span>
                  <span className="text-slate-900 dark:text-white">
                    {content.viewCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">생성일</span>
                  <span className="text-slate-900 dark:text-white">
                    {new Date(content.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">수정일</span>
                  <span className="text-slate-900 dark:text-white">
                    {new Date(content.updatedAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowSettings(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl m-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                설정
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={() => {
                  setSlug(generateSlug(title));
                  setShowSettings(false);
                }}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                제목에서 Slug 생성
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={cn(
            "fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white z-50",
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}
