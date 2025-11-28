'use client';

import { useSearchParams } from 'next/navigation';
import { XCircle, RotateCcw, MessageCircle, Home, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailPage() {
  const searchParams = useSearchParams();

  // URL 파라미터에서 에러 정보 추출
  const code = searchParams.get('code');
  const message = searchParams.get('message');
  const orderId = searchParams.get('orderId');

  // 에러 메시지 매핑
  const getErrorMessage = () => {
    if (message) return decodeURIComponent(message);

    // 에러 코드별 메시지
    switch (code) {
      case 'PAY_PROCESS_CANCELED':
        return '사용자가 결제를 취소하였습니다.';
      case 'PAY_PROCESS_ABORTED':
        return '결제 진행 중 오류가 발생했습니다.';
      case 'REJECT_CARD_COMPANY':
        return '카드사에서 승인을 거부했습니다. 카드사로 문의해주세요.';
      case 'REJECT_CARD':
        return '유효하지 않은 카드입니다.';
      case 'EXCEED_MAX_AMOUNT':
        return '결제 한도를 초과했습니다.';
      case 'INVALID_CARD_EXPIRATION':
        return '카드 유효기간이 만료되었습니다.';
      case 'INVALID_STOPPED_CARD':
        return '정지된 카드입니다.';
      case 'EXCEED_MAX_DAILY_PAYMENT_COUNT':
        return '일일 결제 횟수를 초과했습니다.';
      case 'NOT_ENOUGH_BALANCE':
        return '잔액이 부족합니다.';
      case 'INVALID_PASSWORD':
        return '비밀번호가 일치하지 않습니다.';
      case 'INCORRECT_BASIC_INFO':
        return '카드 정보가 올바르지 않습니다.';
      case 'FDS_ERROR':
        return '부정 거래가 의심되어 결제가 거부되었습니다.';
      default:
        return '결제 처리 중 오류가 발생했습니다.';
    }
  };

  // 에러 타입별 아이콘 및 색상
  const getErrorStyle = () => {
    if (code === 'PAY_PROCESS_CANCELED') {
      return {
        icon: <AlertTriangle className="w-12 h-12 text-yellow-600" />,
        bgColor: 'bg-yellow-100',
        gradientFrom: 'from-yellow-50',
        gradientVia: 'via-orange-50',
        gradientTo: 'to-red-50',
      };
    }
    return {
      icon: <XCircle className="w-12 h-12 text-red-600" />,
      bgColor: 'bg-red-100',
      gradientFrom: 'from-red-50',
      gradientVia: 'via-orange-50',
      gradientTo: 'to-yellow-50',
    };
  };

  const errorStyle = getErrorStyle();
  const errorMessage = getErrorMessage();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${errorStyle.gradientFrom} ${errorStyle.gradientVia} ${errorStyle.gradientTo}`}>
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-16">
        {/* Error Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-600 p-8 text-center text-white">
            <div className={`w-20 h-20 ${errorStyle.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
              {errorStyle.icon}
            </div>
            <h1 className="text-3xl font-bold mb-2">결제에 실패했습니다</h1>
            <p className="text-red-100">아래 내용을 확인해주세요</p>
          </div>

          {/* Error Details */}
          <div className="p-8">
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">실패 정보</h2>

              <div className="space-y-3">
                {orderId && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">주문번호</span>
                    <span className="font-mono text-sm text-gray-900">{orderId}</span>
                  </div>
                )}

                {code && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">오류코드</span>
                    <span className="font-mono text-sm text-red-600">{code}</span>
                  </div>
                )}

                <div className="py-3">
                  <div className="text-gray-600 mb-2">오류 상세</div>
                  <div className="text-gray-900 bg-red-50 p-4 rounded-lg border border-red-200">
                    {errorMessage}
                  </div>
                </div>
              </div>
            </div>

            {/* Help Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">결제 실패 해결 방법</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 카드 정보를 다시 확인해주세요.</li>
                <li>• 카드 한도 및 잔액을 확인해주세요.</li>
                <li>• 다른 결제 수단을 시도해보세요.</li>
                <li>• 문제가 계속되면 고객센터로 문의해주세요.</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.history.back()}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl font-semibold"
              >
                <RotateCcw className="w-5 h-5" />
                다시 시도
              </button>

              <Link
                href="/contact"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition font-semibold"
              >
                <MessageCircle className="w-5 h-5" />
                고객센터
              </Link>
            </div>

            <div className="mt-4">
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition"
              >
                <Home className="w-5 h-5" />
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>문의사항이 있으시면 고객센터(1588-0000)로 연락주세요.</p>
          <p className="mt-1">평일 09:00 - 18:00 (주말 및 공휴일 휴무)</p>
        </div>

        {/* Common Error Solutions */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">자주 발생하는 오류</h3>
          <div className="space-y-4">
            <div>
              <div className="font-semibold text-gray-900 mb-1">카드 승인 거부</div>
              <div className="text-sm text-gray-600">
                카드사 또는 은행의 보안 정책에 따라 결제가 차단될 수 있습니다. 카드사 고객센터(1588-XXXX)로 문의해주세요.
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-1">한도 초과</div>
              <div className="text-sm text-gray-600">
                카드 한도를 확인하거나 다른 결제 수단을 이용해주세요.
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-1">인터넷 결제 미등록</div>
              <div className="text-sm text-gray-600">
                카드사 앱 또는 홈페이지에서 인터넷 결제 서비스를 활성화해주세요.
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-1">일시적 오류</div>
              <div className="text-sm text-gray-600">
                네트워크 문제일 수 있습니다. 잠시 후 다시 시도해주세요.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
