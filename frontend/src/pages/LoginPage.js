import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { loginUser } from '../api/userApi';
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { useToast } from "../components/ui/use-toast"
import '../styles/auth.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { dispatch } = useAuth();
  const history = useHistory();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      dispatch({ type: 'LOGIN', payload: response });
      history.push('/');
      toast({
        title: "Giriş başarılı",
        description: "Hoş geldiniz!",
      });
    } catch (error) {
      console.error('Error logging in:', error);
      toast({
        variant: "destructive",
        title: "Giriş başarısız",
        description: "Lütfen bilgilerinizi kontrol edin.",
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <h1 className="auth-title">Stockie by Milenay</h1>
        <Card className="auth-card">
          <CardHeader>
            <CardTitle>Giriş Yap</CardTitle>
            <CardDescription>Hesabınıza giriş yapın</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">E-posta</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="E-posta adresiniz" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Şifre</Label>
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="Şifreniz" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button className="w-full mt-4" type="submit">Giriş Yap</Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p>Hesabınız yok mu? <a href="/register" className="text-blue-500 hover:underline">Kayıt Ol</a></p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;