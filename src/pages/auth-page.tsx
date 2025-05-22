import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation } = useAuth();
  
  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Redirect to="/" />;
  }
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: "",
      password: ""
    }
  });
  
  const onSubmit = (data: { username: string; password: string }) => {
    loginMutation.mutate(data);
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login to Panel Plank.Dev V4.1.1</CardTitle>
            <CardDescription>
              Enter your credentials to access the panel management system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username"
                  placeholder="Enter your username"
                  {...register("username", { required: "Username is required" })}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              This is a secured console panel. Only authorized personnel can login.
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Hero Section */}
      <div className="flex-1 bg-primary p-6 flex flex-col justify-center items-center text-white">
        <div className="max-w-lg text-center">
          <h1 className="text-3xl font-bold mb-4">Panel Plank.Dev V4.1.1</h1>
          <p className="text-lg mb-6">
            Monitor and control your remote devices with real-time updates and command execution capabilities.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Real-Time Monitoring</h3>
              <p className="text-sm">Track device status, battery levels, and activity logs in real-time.</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Remote Control</h3>
              <p className="text-sm">Execute commands and control devices from anywhere in the world.</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">File Management</h3>
              <p className="text-sm">Browse, upload, and download files from your connected devices.</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Secure Access</h3>
              <p className="text-sm">Protected access ensures only authorized personnel can control devices.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}