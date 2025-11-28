'use client';

/**
 * 토스 페이먼츠 결제 페이지
 * SDK v2 단순 결제창 방식
 *
 * 키 종류:
 * - test_gck_docs_... : 문서용 테스트 키 (결제위젯 전용, SDK v2에서도 동작)
 * - test_ck_... : API 개별 연동 키 (결제위젯 불가)
 * - live_gck_... : 실제 결제위젯 키
 */

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { ArrowLeft, Shield, Clock, CheckCircle2, AlertCircle, Loader2, CreditCard } from 'lucide-react';
import Link from 'next/link';

// 환경변수에서 클라이언트 키 가져오기
const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';

// Mock 결제 모드 활성화 조건:
// 1. NEXT_PUBLIC_ALLOW_MOCK_PAYMENTS === 'true'
// 2. CLIENT_KEY가 비어있음
// 3. 테스트 키인 경우 (test_로 시작)
//
// 참고:
// - test_ck_... : API 개별 연동 키 (SDK v2 전용, 등록 필요)
// - test_gck_... : 결제위젯 키 (결제위젯 SDK 전용, SDK v2 불가)
// - 현재 SDK v2 사용 중이므로 gck 키도 Mock 모드로 처리
const ALLOW_MOCK_PAYMENTS =
  process.env.NEXT_PUBLIC_ALLOW_MOCK_PAYMENTS === 'true' ||
  !CLIENT_KEY ||
  CLIENT_KEY.startsWith('test_');

interface PaymentPageProps {
  params: Promise<{
    contentSlug: string;
  }>;
}

interface ContentInfo {
  id?: string;
  title: string;
  price: number;
  category: string;
  categorySlug: string;
  description?: string;
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [contentSlug, setContentSlug] = useState<string>('');
  const [contentInfo, setContentInfo] = useState<ContentInfo | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // params unwrap
  useEffect(() => {
    params.then(p => setContentSlug(p.contentSlug));
  }, [params]);

  // 콘텐츠 정보 로드
  useEffect(() => {
    if (!contentSlug) return;

    const fetchContentInfo = async () => {
      setIsLoadingContent(true);
      setError(null);

      try {
        // API에서 콘텐츠 정보 조회
        const response = await fetch(`/api/saju/contents/${contentSlug}`);

        if (response.ok) {
          const data = await response.json();
          if (data.content) {
            setContentInfo({
              id: data.content.id,
              title: data.content.title,
              price: data.content.price || 29000,
              category: data.content.category?.name || data.content.categoryName || '사주 분석',
              categorySlug: data.content.category?.slug || data.content.categorySlug || 'fortune',
              description: data.content.description,
            });
            setIsLoadingContent(false);
            return;
          }
        }

        // API에서 못 찾으면 slug 기반 기본값 사용
        const categoryMap: Record<string, { name: string; slug: string; price: number }> = {
          'love': { name: '연애운', slug: 'love-fortune', price: 29000 },
          'wealth': { name: '재물운', slug: 'wealth-fortune', price: 32000 },
          'career': { name: '직장운', slug: 'career-fortune', price: 28000 },
          'health': { name: '건강운', slug: 'health-fortune', price: 28000 },
          'monthly': { name: '월간운세', slug: 'monthly-fortune', price: 15000 },
          'compatibility': { name: '궁합', slug: 'compatibility', price: 27000 },
          'reunion': { name: '재회 가능성 분석', slug: 'love-fortune', price: 19000 },
          'crush': { name: '짝사랑 성공률 분석', slug: 'love-fortune', price: 19000 },
          'marriage': { name: '결혼 시기 분석', slug: 'love-fortune', price: 29000 },
          'ideal': { name: '이상형 찾기', slug: 'love-fortune', price: 19000 },
          'relationship': { name: '연인 궁합', slug: 'compatibility', price: 27000 },
        };

        let found = { name: '사주 분석', slug: 'fortune', price: 29000 };
        for (const [key, value] of Object.entries(categoryMap)) {
          if (contentSlug.toLowerCase().includes(key)) {
            found = value;
            break;
          }
        }

        // slug에서 제목 생성
        const title = contentSlug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        setContentInfo({
          title,
          price: found.price,
          category: found.name,
          categorySlug: found.slug,
        });
        setIsLoadingContent(false);

      } catch (err) {
        console.error('콘텐츠 정보 로드 실패:', err);
        setError('콘텐츠 정보를 불러오는데 실패했습니다.');
        setIsLoadingContent(false);
      }
    };

    fetchContentInfo();
  }, [contentSlug]);

  // 결제 레코드 생성
  const createPaymentOrder = useCallback(async () => {
    if (!contentInfo) return null;

    try {
      const customerName = searchParams.get('name') || '고객';
      const customerEmail = searchParams.get('email') || '';

      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: contentInfo.price,
          orderName: contentInfo.title,
          customerName,
          customerEmail,
          productId: contentInfo.id || contentSlug,
          metadata: {
            contentSlug,
            categorySlug: contentInfo.categorySlug,
          },
        }),
      });

      const result = await response.json();
      if (result.success) {
        return result.data.orderId;
      } else {
        console.error('결제 레코드 생성 실패:', result.error);
        return null;
      }
    } catch (err) {
      console.error('결제 레코드 생성 오류:', err);
      return null;
    }
  }, [contentInfo, contentSlug, searchParams]);

  // Mock 결제 처리 (테스트용)
  const handleMockPayment = async () => {
    if (!contentInfo || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      // 1. 결제 레코드 생성
      const orderId = await createPaymentOrder();
      if (!orderId) {
        throw new Error('주문 생성에 실패했습니다.');
      }

      const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

      console.log('[Payment] Mock payment mode - simulating successful payment');

      // 2. Mock paymentKey 생성
      const mockPaymentKey = `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      // 3. 결제 성공 페이지로 이동 (실제 결제 없이)
      router.push(`/payment/success?orderId=${orderId}&paymentKey=${mockPaymentKey}&amount=${contentInfo.price}&contentSlug=${contentSlug}&mock=true`);

    } catch (err: any) {
      console.error('Mock 결제 실패:', err);
      setError(err.message || '결제 처리 중 오류가 발생했습니다.');
      setIsProcessing(false);
    }
  };

  // 실제 결제 실행 (SDK v2 단순 결제창)
  const handleRealPayment = async () => {
    if (!contentInfo || isProcessing || !CLIENT_KEY) return;

    setIsProcessing(true);
    setError(null);

    try {
      // 1. 결제 레코드 먼저 생성
      const orderId = await createPaymentOrder();
      if (!orderId) {
        throw new Error('주문 생성에 실패했습니다. 다시 시도해주세요.');
      }

      const customerName = searchParams.get('name') || '고객';
      const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

      console.log('[Payment] Loading TossPayments SDK v2 with key:', CLIENT_KEY.substring(0, 15) + '...');

      // 2. SDK v2 로드
      const tossPayments = await loadTossPayments(CLIENT_KEY);

      // 3. 결제 요청 (payment 객체 생성)
      const payment = tossPayments.payment({ customerKey: 'ANONYMOUS' });

      console.log('[Payment] Requesting payment with method: CARD');

      // 4. 결제창 호출 (카드 결제)
      await payment.requestPayment({
        method: 'CARD' as const,
        amount: {
          currency: 'KRW',
          value: contentInfo.price,
        },
        orderId,
        orderName: contentInfo.title,
        customerName,
        successUrl: `${siteUrl}/payment/success?orderId=${orderId}&contentSlug=${contentSlug}`,
        failUrl: `${siteUrl}/payment/fail?orderId=${orderId}&contentSlug=${contentSlug}`,
        card: {
          useEscrow: false,
          flowMode: 'DEFAULT',
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });

    } catch (err: any) {
      console.error('결제 요청 실패:', err);
      setIsProcessing(false);

      if (err.code === 'USER_CANCEL' || err.message?.includes('cancel')) {
        return;
      } else if (err.code === 'INVALID_CARD_COMPANY') {
        setError('지원하지 않는 카드사입니다. 다른 카드를 이용해주세요.');
      } else if (err.message?.includes('clientKey') || err.message?.includes('인증')) {
        setError('결제 시스템 설정 오류입니다. 관리자에게 문의해주세요.');
      } else {
        setError(err.message || '결제 요청 중 오류가 발생했습니다.');
      }
    }
  };

  // 결제 핸들러 (Mock 또는 실제 결제)
  const handlePayment = ALLOW_MOCK_PAYMENTS ? handleMockPayment : handleRealPayment;

  // 로딩 중
  if (!contentSlug || isLoadingContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">콘텐츠 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 콘텐츠 에러
  if (error && !contentInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">오류가 발생했습니다</h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  if (!contentInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">콘텐츠를 찾을 수 없습니다</h1>
          <p className="text-slate-400 mb-6">요청하신 콘텐츠 정보를 찾을 수 없습니다.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/saju/${contentInfo.categorySlug}/${contentSlug}`}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>돌아가기</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 sticky top-8">
              <h2 className="text-lg font-bold text-white mb-4">주문 정보</h2>

              {/* Product Info */}
              <div className="mb-6 pb-6 border-b border-slate-700">
                <div className="text-sm text-purple-400 mb-1">{contentInfo.category}</div>
                <div className="font-semibold text-white mb-3">{contentInfo.title}</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">
                    ₩{contentInfo.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span>100% 안전한 결제</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span>결제 후 즉시 이용</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-purple-400" />
                  <span>7일 환불 보장</span>
                </div>
              </div>

              {/* Total */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">총 결제금액</span>
                  <span className="text-2xl font-bold text-white">
                    ₩{contentInfo.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">결제하기</h1>

              {/* 에러 표시 */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-red-900 mb-1">결제 오류</div>
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                </div>
              )}

              {/* Mock 결제 모드 안내 */}
              {ALLOW_MOCK_PAYMENTS && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-amber-900 mb-1">테스트 모드</div>
                      <div className="text-sm text-amber-700">
                        현재 테스트 모드로 실행 중입니다. 실제 결제 없이 결제 완료 플로우를 테스트할 수 있습니다.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 카드 결제 안내 */}
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-purple-900">신용/체크카드 결제</div>
                    <div className="text-sm text-purple-700">
                      {ALLOW_MOCK_PAYMENTS ? '테스트 결제 진행' : '모든 카드사 결제 가능'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                type="button"
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    결제창 열기...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    ₩{contentInfo.price.toLocaleString()} 결제하기
                  </>
                )}
              </button>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <div className="font-semibold text-gray-700 mb-1">안전한 결제</div>
                    <div>토스페이먼츠의 PCI-DSS 인증을 받은 안전한 결제 시스템을 사용합니다. 결제 버튼 클릭 시 별도 결제창이 열립니다.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 bg-purple-900/30 border border-purple-700/50 rounded-xl p-4">
              <h3 className="font-semibold text-purple-300 mb-2">결제 안내</h3>
              <ul className="text-sm text-purple-400 space-y-1">
                <li>• 결제 완료 후 즉시 콘텐츠를 이용하실 수 있습니다.</li>
                <li>• 결제 내역은 마이페이지에서 확인 가능합니다.</li>
                <li>• 구매 후 7일 이내 환불 요청이 가능합니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
