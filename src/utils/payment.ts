export interface PaymentRequest {
  method: 'mpesa' | 'emola';
  phoneNumber: string;
  transactionId: string;
  amount: number;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export const validatePayment = (request: PaymentRequest): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!request.method) {
    errors.push('Método de pagamento é obrigatório');
  }

  if (!request.phoneNumber) {
    errors.push('Número de telefone é obrigatório');
  } else if (!request.phoneNumber.match(/^84|85|82|86|87/)) {
    errors.push('Número de telefone inválido');
  }

  if (!request.transactionId) {
    errors.push('Código da transação é obrigatório');
  } else if (request.transactionId.length < 6) {
    errors.push('Código da transação deve ter pelo menos 6 caracteres');
  }

  if (!request.amount || request.amount <= 0) {
    errors.push('Valor do pagamento é obrigatório');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return cleaned.slice(0, 3) + '-' + cleaned.slice(3);
  return cleaned.slice(0, 3) + '-' + cleaned.slice(3, 6) + '-' + cleaned.slice(6, 9);
};

export const formatTransactionId = (value: string): string => {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
};