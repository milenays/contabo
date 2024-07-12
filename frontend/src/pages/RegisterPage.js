import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { registerUser } from '../api/userApi';
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { useToast } from "../components/ui/use-toast"
import '../styles/auth.css';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const { toast } = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ email, password });
      history.push('/login');
      toast({
        title: "Kayıt başarılı",
        description: "Lütfen giriş yapın.",
      });
    } catch (error) {
      console.error('Error registering user:', error);
      toast({
        variant: "destructive",
        title: "Kayıt başarısız",
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
            <CardTitle>Kayıt Ol</CardTitle>
            <CardDescription>Yeni bir hesap oluşturun</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister}>
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
              <Button className="w-full mt-4" type="submit">Kayıt Ol</Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p>Zaten hesabınız var mı? <a href="/login" className="text-blue-500 hover:underline">Giriş Yap</a></p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;