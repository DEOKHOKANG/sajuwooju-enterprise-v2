'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, Home, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [isMockPayment, setIsMockPayment] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    orderId: string;
    amount: number;
    approvedAt: string;
    contentSlug?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // URL 파라미터
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const contentSlug = searchParams.get('contentSlug');
  const mockParam = searchParams.get('mock');

  useEffect(() => {
    const confirmPayment = async () => {
      if (!paymentKey || !orderId || !amount) {
        setError('결제 정보가 올바르지 않습니다.');
        setIsProcessing(false);
        return;
      }

      // Mock 결제인 경우 API 호출 없이 바로 성공 처리
      if (mockParam === 'true' || paymentKey.startsWith('mock_')) {
        console.log('[Payment Success] Mock payment detected - skipping API confirmation');
        setIsMockPayment(true);
        setPaymentData({
          orderId: orderId,
          amount: parseInt(amount),
          approvedAt: new Date().toISOString(),
          contentSlug: contentSlug || undefined,
        });
        setIsProcessing(false);
        return;
      }

      try {
        // 실제 결제 승인 API 호출
        const response = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: parseInt(amount),
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error?.message || '결제 승인에 실패했습니다.');
        }

        // 결제 성공 데이터 저장
        setPaymentData({
          orderId: result.data.orderId,
          amount: parseInt(amount),
          approvedAt: result.data.approvedAt || new Date().toISOString(),
          contentSlug: contentSlug || undefined,
        });
        setIsProcessing(false);
      } catch (err: any) {
        console.error('Payment confirmation error:', err);
        setError(err.message || '결제 승인 중 오류가 발생했습니다.');
        setIsProcessing(false);
      }
    };

    confirmPayment();
  }, [paymentKey, orderId, amount, contentSlug, mockParam]);

  // 로딩 중
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 처리 중</h1>
          <p className="text-gray-600">결제를 승인하고 있습니다. 잠시만 기다려주세요...</p>
        </div>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 처리 실패</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition"
            >
              <Home className="w-5 h-5" />
              홈으로
            </Link>
            <Link
              href="/contact"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              고객센터
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 결제 성공
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-16">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">결제가 완료되었습니다</h1>
            <p className="text-green-100">주문이 정상적으로 처리되었습니다</p>
          </div>

          {/* Payment Details */}
          <div className="p-8">
            {/* Mock Payment Notice */}
            {isMockPayment && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-amber-900 mb-1">테스트 결제</div>
                    <div className="text-sm text-amber-700">
                      이것은 테스트 결제입니다. 실제 결제가 이루어지지 않았습니다.
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">결제 정보</h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">주문번호</span>
                  <span className="font-mono text-sm text-gray-900">{paymentData?.orderId}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">결제금액</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₩{paymentData?.amount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">승인시간</span>
                  <span className="text-gray-900">
                    {paymentData?.approvedAt
                      ? new Date(paymentData.approvedAt).toLocaleString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                이용 안내
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 구매하신 콘텐츠를 바로 이용하실 수 있습니다.</li>
                <li>• 결제 내역은 마이페이지에서 확인 가능합니다.</li>
                <li>• 영수증은 이메일로 발송되었습니다.</li>
                <li>• 구매 후 7일 이내 환불 요청이 가능합니다.</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/saju/input/${paymentData?.orderId}`}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl font-semibold"
              >
                <ArrowRight className="w-5 h-5" />
                사주 정보 입력하기
              </Link>

              <Link
                href="/"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition font-semibold"
              >
                <Home className="w-5 h-5" />
                나중에 하기
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>문의사항이 있으시면 고객센터(1588-0000)로 연락주세요.</p>
          <p className="mt-1">평일 09:00 - 18:00 (주말 및 공휴일 휴무)</p>
        </div>
      </div>
    </div>
  );
}
