import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import api from '@/lib/api';

const OTP_EXPIRY_SECONDS = 5 * 60; // 5 minutes

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔹 Resend OTP timer (30s)
  const [cooldown, setCooldown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // 🔹 OTP expiry timer (5 min)
  const [otpExpiry, setOtpExpiry] = useState(OTP_EXPIRY_SECONDS);

  /* =========================
     SAFETY: no email → login
     ========================= */
  useEffect(() => {
    if (!email) {
      navigate('/auth/login', { replace: true });
    }
  }, [email, navigate]);

  /* =========================
     RESEND OTP COOLDOWN TIMER
     ========================= */
  useEffect(() => {
    if (canResend) return;

    if (cooldown === 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown, canResend]);

  /* =========================
     OTP EXPIRY TIMER (5 min)
     ========================= */
  useEffect(() => {
    if (otpExpiry === 0) return;

    const timer = setTimeout(() => {
      setOtpExpiry((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [otpExpiry]);

  /* =========================
     VERIFY OTP
     ========================= */
  const handleVerify = async () => {
    if (!otp) {
      toast.error('Enter OTP');
      return;
    }

    if (otpExpiry === 0) {
      toast.error('OTP expired. Please resend OTP.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/verify-email', { email, otp });

      toast.success('Email verified successfully');
      navigate('/auth/login', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RESEND OTP (FIXED)
     ========================= */
  const resendOtp = async () => {
    if (!canResend) return;

    try {
      await api.post('/auth/resend-otp', { email });

      toast.success('OTP sent again');
      setCooldown(30);
      setCanResend(false);
      setOtpExpiry(OTP_EXPIRY_SECONDS);
      setOtp('');
    } catch (err) {
      toast.error(
        err.response?.data?.detail || 'Failed to resend OTP'
      );
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            OTP sent to <b>{email}</b>
          </p>

          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />

          {/* OTP expiry info */}
          <p className="text-xs text-muted-foreground text-center">
            OTP expires in{' '}
            <span className={otpExpiry < 60 ? 'text-red-500' : 'font-medium'}>
              {formatTime(otpExpiry)}
            </span>
          </p>

          <Button
            onClick={handleVerify}
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </Button>

          {/* Resend OTP */}
          <button
            onClick={resendOtp}
            disabled={!canResend}
            className={`text-sm w-full text-center ${
              canResend
                ? 'text-primary underline'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            {canResend
              ? 'Resend OTP'
              : `Resend OTP in ${cooldown}s`}
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
