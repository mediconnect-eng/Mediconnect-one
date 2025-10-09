import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { UserPlus, ArrowLeft } from "lucide-react";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the Terms of Service"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function PatientSignup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: undefined,
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const { user } = await api.auth.signup({
        name: data.name,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth || undefined,
        gender: data.gender || undefined,
        agreeToTerms: data.agreeToTerms,
      });

      localStorage.setItem("mediconnect_user", JSON.stringify(user));
      
      toast({
        title: "Account created successfully!",
        description: "Welcome to Mediconnect",
      });
      
      setLocation("/patient/home");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Mediconnect</h1>
          <p className="text-muted-foreground">Create your patient account</p>
        </div>

        <Link href="/patient/login">
          <Button variant="ghost" size="sm" className="mb-2" data-testid="link-back-to-login">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Button>
        </Link>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      data-testid="input-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      {...field}
                      data-testid="input-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+254 700 123 456"
                      {...field}
                      data-testid="input-phone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      data-testid="input-date-of-birth"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male" data-testid="option-male">Male</SelectItem>
                      <SelectItem value="female" data-testid="option-female">Female</SelectItem>
                      <SelectItem value="other" data-testid="option-other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say" data-testid="option-prefer-not-to-say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="checkbox-agree-to-terms"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal">
                      I agree to the{" "}
                      <Link href="/legal/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/legal/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading || !form.watch("agreeToTerms")}
              data-testid="button-create-account"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/patient/login" className="text-primary hover:underline font-medium" data-testid="link-sign-in">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
