'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, User, ArrowRight, Loader2 } from 'lucide-react';

interface InputPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default function SajuInputPage({ params }: InputPageProps) {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    birthHour: '',
    birthMinute: '',
    gender: 'male',
    solarCalendar: true,
  });

  useEffect(() => {
    params.then(p => setOrderId(p.orderId));
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 유효성 검증
    if (!formData.name || !formData.birthYear || !formData.birthMonth || !formData.birthDay) {
      setError('필수 정보를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // AI 분석 API 호출
      const response = await fetch('/api/saju/analyze-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          ...formData,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || '분석 요청에 실패했습니다.');
      }

      // 분석 결과 페이지로 이동
      router.push(`/saju/result/${result.data.analysisId}`);
    } catch (err: any) {
      console.error('Analysis request error:', err);
      setError(err.message || '분석 요청 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 border-b-2 border-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">사주 정보 입력</h1>
          <p className="text-gray-600">정확한 분석을 위해 생년월일 정보를 입력해주세요</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          {/* 이름 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              이름
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="홍길동"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* 생년월일 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              생년월일
            </label>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                name="birthYear"
                value={formData.birthYear}
                onChange={handleChange}
                placeholder="1990"
                min="1900"
                max="2100"
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="number"
                name="birthMonth"
                value={formData.birthMonth}
                onChange={handleChange}
                placeholder="1"
                min="1"
                max="12"
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="number"
                name="birthDay"
                value={formData.birthDay}
                onChange={handleChange}
                placeholder="1"
                min="1"
                max="31"
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">년 / 월 / 일</p>
          </div>

          {/* 출생시간 (선택사항) */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              출생시간 (선택사항)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                name="birthHour"
                value={formData.birthHour}
                onChange={handleChange}
                placeholder="14"
                min="0"
                max="23"
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                name="birthMinute"
                value={formData.birthMinute}
                onChange={handleChange}
                placeholder="30"
                min="0"
                max="59"
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">시 / 분 (24시간 형식)</p>
          </div>

          {/* 성별 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              성별
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>남성</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>여성</span>
              </label>
            </div>
          </div>

          {/* 음력/양력 */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              달력 종류
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="solarCalendar"
                  value="true"
                  checked={formData.solarCalendar === true}
                  onChange={() => setFormData(prev => ({ ...prev, solarCalendar: true }))}
                  className="mr-2"
                />
                <span>양력</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="solarCalendar"
                  value="false"
                  checked={formData.solarCalendar === false}
                  onChange={() => setFormData(prev => ({ ...prev, solarCalendar: false }))}
                  className="mr-2"
                />
                <span>음력</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                분석 중...
              </>
            ) : (
              <>
                <ArrowRight className="w-5 h-5" />
                AI 사주 분석 시작
              </>
            )}
          </button>

          {/* Notice */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800">
              입력하신 정보는 암호화되어 안전하게 보관되며, 분석 목적으로만 사용됩니다.
            </p>
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>분석에는 약 2-3분이 소요됩니다.</p>
          <p className="mt-1">정확한 분석을 위해 출생시간을 입력하시면 더욱 자세한 결과를 받으실 수 있습니다.</p>
        </div>
      </div>
    </div>
  );
}
