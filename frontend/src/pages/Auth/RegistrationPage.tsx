import { useState } from "react";
import { Card, CardHeader, CardFooter, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

function RegistrationPage(){
    const { register } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Пароли не совпадают");
            return;
        }

        setLoading(true);
        try {
            await register(username, email, password);
        } catch (err: any) {
            alert(err.response?.data?.message || "Ошибка регистрации");
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="min-h-screen flex items-center justify-start custom-bg">
        <Card className="min-h-screen w-full min-md:w-[600px] flex flex-col items-center justify-center">
            <CardHeader className="flex flex-col items-center"> 
                <CardTitle className="text-4xl">Регистрация</CardTitle>
            </CardHeader>

            <CardContent className="">
                <form onSubmit={handleSubmit}>
                    <div className="py-2">
                        <label htmlFor="uname">Логин</label>
                        <Input 
                            id="uname" 
                            type="text" 
                            placeholder="username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="pb-2">
                        <label htmlFor="email">Электронная почта</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="pb-2">
                        <label htmlFor="password">Пароль</label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                        <div className="">
                        <label htmlFor="confirmpassword">Повторите пароль</label>
                        <Input
                            id="confirmpassword"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <CardFooter className="flex flex-col w-full mt-12">
                        <Button type="submit" className="px-8" disabled={loading}>
                            {loading ? "Регистрация..." : "Зарегистрироваться"}
                        </Button>
                    </CardFooter>
                </form>
                <a href="/login" className="flex flex-col w-full">
                    <Button variant="link">
                    
                        <i>Уже есть аккаунт?</i>
                    </Button>
                </a>
            </CardContent>
        </Card>
    </div>
)
}

export default RegistrationPage;
