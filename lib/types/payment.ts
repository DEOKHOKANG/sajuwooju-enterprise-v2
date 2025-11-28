/**
 * Payment Types
 * Phase 8.10: Toss Payments Integration
 */

export type PaymentStatus = 'pending' | 'ready' | 'in_progress' | 'done' | 'canceled' | 'failed';

export type PaymentMethod = 'card' | 'virtual_account' | 'transfer' | 'mobile_phone' | 'culture_gift_certificate' | 'book_culture_gift_certificate' | 'game_culture_gift_certificate';

/**
 * Payment request from client
 */
export interface PaymentRequest {
  productId: string;
  userId?: string;
  sessionId?: string;
  amount: number;
  orderName: string;
  customerName: string;
  customerEmail?: string;
  customerMobilePhone?: string;
}

/**
 * Toss Payments 승인 요청
 */
export interface TossPaymentApprovalRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

/**
 * Toss Payments 승인 응답
 */
export interface TossPaymentApprovalResponse {
  version: string;
  paymentKey: string;
  type: string;
  orderId: string;
  orderName: string;
  mId: string;
  currency: string;
  method: PaymentMethod;
  totalAmount: number;
  balanceAmount: number;
  status: PaymentStatus;
  requestedAt: string;
  approvedAt: string;
  useEscrow: boolean;
  lastTransactionKey: string | null;
  suppliedAmount: number;
  vat: number;
  cultureExpense: boolean;
  taxFreeAmount: number;
  taxExemptionAmount: number;
  cancels: any[] | null;
  isPartialCancelable: boolean;
  card?: {
    amount: number;
    issuerCode: string;
    acquirerCode?: string;
    number: string;
    installmentPlanMonths: number;
    approveNo: string;
    useCardPoint: boolean;
    cardType: string;
    ownerType: string;
    acquireStatus: string;
    isInterestFree: boolean;
    interestPayer: string | null;
  };
  virtualAccount?: any;
  transfer?: any;
  mobilePhone?: any;
  giftCertificate?: any;
  cashReceipt?: any;
  cashReceipts?: any;
  discount?: any;
  secret?: string;
  type_?: string;
  easyPay?: any;
  country: string;
  failure?: {
    code: string;
    message: string;
  };
  metadata?: Record<string, string>;
}

/**
 * Database Payment model
 */
export interface Payment {
  id: string;
  orderId: string;
  paymentKey?: string;
  userId?: string;
  sessionId?: string;
  consultationId?: string;
  productId: string;
  amount: number;
  status: PaymentStatus;
  orderName: string;
  customerName: string;
  customerEmail?: string;
  customerMobilePhone?: string;
  method?: PaymentMethod;
  approvedAt?: Date;
  canceledAt?: Date;
  failureCode?: string;
  failureMessage?: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payment creation response
 */
export interface PaymentCreateResponse {
  orderId: string;
  amount: number;
  orderName: string;
  customerName: string;
  successUrl: string;
  failUrl: string;
  createdAt: Date;
}

/**
 * Product pricing
 */
export interface ProductPricing {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  description?: string;
}
