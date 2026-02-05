import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, User, Lock, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = "choice" | "login" | "signup" | "otp" | "forgot-password" | "forgot-otp" | "new-password";

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [step, setStep] = useState<AuthStep>("choice");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp, signIn, verifyOtp, sendOtp, resetPassword } = useAuth();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setPhone("");
    setOtp("");
    setStep("choice");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signUp(email, password, name, phone);
    
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    // Send OTP via SMTP
    const { error: otpError } = await sendOtp(email, "verification");
    
    if (otpError) {
      toast({ title: "Error", description: otpError, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    toast({ 
      title: "OTP Sent", 
      description: "Please check your email for the verification code." 
    });
    setStep("otp");
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);

    const { error } = await verifyOtp(email, otp, "verification");
    
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    toast({ title: "Success", description: "Account created successfully!" });
    handleClose();
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    toast({ title: "Welcome back!", description: "You have successfully logged in." });
    handleClose();
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate email
    if (!email.trim()) {
      toast({ title: "Error", description: "Please enter your email", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    // Send OTP for password reset
    const { error } = await sendOtp(email, "password_reset");
    
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    toast({ 
      title: "OTP Sent", 
      description: "Please check your email for the password reset code." 
    });
    setStep("forgot-otp");
    setIsLoading(false);
  };

  const handleVerifyForgotOtp = async () => {
    setIsLoading(true);

    const { error } = await verifyOtp(email, otp, "password_reset");
    
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    toast({ title: "Verified!", description: "Please enter your new password." });
    setOtp("");
    setStep("new-password");
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const { error } = await resetPassword(email, password);
    
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    toast({ title: "Success!", description: "Your password has been reset. Please log in." });
    resetForm();
    setStep("login");
    setIsLoading(false);
  };

  const handleResendOtp = async (type: "verification" | "password_reset") => {
    setIsLoading(true);
    const { error } = await sendOtp(email, type);
    
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      toast({ title: "OTP Sent", description: "A new OTP has been sent to your email." });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {step === "choice" && "Welcome to Aztech"}
            {step === "login" && "Login to Your Account"}
            {step === "signup" && "Create Your Account"}
            {step === "otp" && "Verify Your Email"}
            {step === "forgot-password" && "Forgot Password"}
            {step === "forgot-otp" && "Verify OTP"}
            {step === "new-password" && "Set New Password"}
          </DialogTitle>
        </DialogHeader>

        {/* Choice Step */}
        {step === "choice" && (
          <div className="space-y-4 pt-4">
            <Button 
              onClick={() => setStep("login")} 
              className="w-full h-12 text-lg"
              variant="default"
            >
              Login
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              onClick={() => setStep("signup")} 
              className="w-full h-12 text-lg"
              variant="outline"
            >
              Create Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Login Step */}
        {step === "login" && (
          <form onSubmit={handleLogin} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep("forgot-password")}
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </button>
            <div className="flex gap-2 pt-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setStep("choice")}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        )}

        {/* Signup Step */}
        {step === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-phone">Mobile Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setStep("choice")}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Processing..." : "Continue"}
              </Button>
            </div>
          </form>
        )}

        {/* OTP Verification Step */}
        {step === "otp" && (
          <div className="space-y-6 pt-4">
            <p className="text-center text-muted-foreground">
              We've sent a verification code to <strong>{email}</strong>
            </p>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <button
              type="button"
              onClick={() => handleResendOtp("verification")}
              className="w-full text-center text-sm text-primary hover:underline"
              disabled={isLoading}
            >
              Didn't receive the code? Resend
            </button>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setStep("signup")}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
              <Button 
                onClick={handleVerifyOtp} 
                className="flex-1" 
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </div>
        )}

        {/* Forgot Password Step */}
        {step === "forgot-password" && (
          <form onSubmit={handleForgotPassword} className="space-y-4 pt-4">
            <p className="text-center text-muted-foreground text-sm">
              Enter your email address and we'll send you an OTP to reset your password.
            </p>
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setStep("login")}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            </div>
          </form>
        )}

        {/* Forgot Password OTP Verification Step */}
        {step === "forgot-otp" && (
          <div className="space-y-6 pt-4">
            <p className="text-center text-muted-foreground">
              We've sent a password reset code to <strong>{email}</strong>
            </p>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <button
              type="button"
              onClick={() => handleResendOtp("password_reset")}
              className="w-full text-center text-sm text-primary hover:underline"
              disabled={isLoading}
            >
              Didn't receive the code? Resend
            </button>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setStep("forgot-password")}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
              <Button 
                onClick={handleVerifyForgotOtp} 
                className="flex-1" 
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </div>
        )}

        {/* New Password Step */}
        {step === "new-password" && (
          <form onSubmit={handleResetPassword} className="space-y-4 pt-4">
            <p className="text-center text-muted-foreground text-sm">
              Enter your new password below.
            </p>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setStep("forgot-otp")}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
