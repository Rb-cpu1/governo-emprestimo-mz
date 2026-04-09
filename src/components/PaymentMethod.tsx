"use client";

import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Smartphone, AlertTriangle } from 'lucide-react';

interface PaymentMethodProps {
  amount: number;
  onPaymentComplete: (transactionId: string) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ amount, onPaymentComplete }) => {
  const [selectedMethod, setSelectedMethod] = useState<'mpesa' | 'emola' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const getTax = (val: number) => {
    if (val <= 50000) return 250;
    if (val <= 100000) return 500;
    if (val <= 500000) return 1000;
    return 2000;
  };

  const handlePayment = async () => {
    if (!selectedMethod || !phoneNumber || !transactionId) return;
    
    setIsProcessing(true);
    setPaymentStatus('processing');

    // Simulate payment processing
    setTimeout(() => {
      // Simulate successful payment (in real app, this would be an API call)
      if (transactionId.length >= 6) {
        setPaymentStatus('success');
        setTimeout(() => {
          onPaymentComplete(transactionId);
        }, 2000);
      } else {
        setPaymentStatus('error');
      }
      setIsProcessing(false);
    }, 3000);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as 84XXX-XXX or 85XXX-XXX etc.
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return cleaned.slice(0, 3) + '-' + cleaned.slice(3);
    return cleaned.slice(0, 3) + '-' + cleaned.slice(3, 6) + '-' + cleaned.slice(6, 9);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl border-t-8 border-[#005a32]">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="text-[#005a32] w-8 h-8" />
        <h2 className="text-2xl font-bold">Fase Final: Activação do Desembolso</h2>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600 mb-6 flex gap-3">
        <ShieldCheck className="text-blue-600 shrink-0" />
        <p className="text-sm text-blue-800">
          O valor de <strong>{amount.toLocaleString()} MT</strong> já se encontra processado no Sistema de Administração Financeira do Estado (SISTAFE). Para o envio imediato, é necessária a liquidação da Taxa de Selo e Aprovação.
        </p>
      </div>

      {/* Payment Summary */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-slate-600">Valor do Empréstimo:</span>
          <span className="font-bold">{amount.toLocaleString()} MT</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-slate-600 italic">Taxa de Aprovação Governamental:</span>
          <span className="font-bold text-red-600 underline">{getTax(amount)} MT</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b bg-slate-50 px-2 rounded">
          <span className="font-bold">Total a Receber na Conta:</span>
          <span className="font-bold text-green-700">{(amount + getTax(amount)).toLocaleString()} MT*</span>
        </div>
        <p className="text-[10px] text-slate-400 italic mt-1">* A taxa paga será reembolsada integralmente junto com o primeiro desembolso conforme o regulamento do fundo.</p>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-8">
        <h3 className="font-bold mb-4">Escolha o Método de Pagamento:</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedMethod('mpesa')}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              selectedMethod === 'mpesa'
                ? 'border-[#005a32] bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold">M-Pesa</h4>
                <p className="text-sm text-gray-600">Transferência via M-Pesa</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedMethod('emola')}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              selectedMethod === 'emola'
                ? 'border-[#005a32] bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold">e-Mola</h4>
                <p className="text-sm text-gray-600">Transferência via e-Mola</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Payment Form */}
      {selectedMethod && (
        <div className="bg-slate-900 text-white p-6 rounded-xl mb-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <ShieldCheck className="text-green-400" /> 
            Instruções de Pagamento ({selectedMethod.toUpperCase()})
          </h3>
          
          <div className="space-y-4 mb-6">
            <div className="bg-slate-800 p-4 rounded">
              <h4 className="font-semibold mb-2">Passos:</h4>
              <ol className="text-sm space-y-1">
                <li>1. Aceda ao menu do seu provedor ({selectedMethod.toUpperCase()})</li>
                <li>2. Escolha "Transferir Dinheiro"</li>
                <li>3. Digite o número do Agente de Arrecadação: <span className="bg-yellow-400 text-black px-2 py-0.5 rounded font-mono font-bold tracking-widest text-lg">84 123 4567</span></li>
                <li>4. Valor: <span className="text-yellow-400 font-bold text-lg">{getTax(amount)} MT</span></li>
                <li>5. Após o pagamento, insira o código de transação abaixo:</li>
              </ol>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Número de Telefone ({selectedMethod.toUpperCase()})</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                placeholder={`Ex: 84XXX-XXX (para ${selectedMethod === 'mpesa' ? 'M-Pesa' : 'e-Mola'})`}
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Código da Transação</label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                placeholder="Ex: PKJ765S..."
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded text-center font-mono uppercase tracking-widest"
              />
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing || !phoneNumber || !transactionId}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black py-3 rounded transition-colors uppercase disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processando...' : 'Confirmar Pagamento e Receber Valor'}
          </button>
        </div>
      )}

      {/* Status Messages */}
      {paymentStatus === 'processing' && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-blue-800">A verificar o pagamento...</p>
        </div>
      )}

      {paymentStatus === 'success' && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-green-800 font-bold">Pagamento Confirmado!</p>
          <p className="text-sm text-green-600 mt-1">Aguarde o processamento do desembolso...</p>
        </div>
      )}

      {paymentStatus === 'error' && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
          <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
          <p className="text-red-800 font-bold">Erro no Pagamento</p>
          <p className="text-sm text-red-600 mt-1">Verifique o código da transação e tente novamente.</p>
        </div>
      )}

      {/* Warning */}
      <div className="mt-6 flex items-start gap-3 bg-amber-50 p-4 rounded border border-amber-200">
        <AlertTriangle className="text-amber-600 shrink-0" />
        <p className="text-xs text-amber-800">
          Atenção: O sistema aguarda o pagamento por apenas 15 minutos. Caso não seja detectado, o seu perfil será bloqueado para novas solicitações este ano.
        </p>
      </div>
    </div>
  );
};

export default PaymentMethod;