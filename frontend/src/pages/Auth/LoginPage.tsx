import { Card, CardHeader, CardFooter, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        const resultError = await login(email, password);

        if (resultError) {
            setErrorMsg(resultError);
        } else {
            console.log("Login successful");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-start custom-bg">
            <Card className="w-full min-md:w-[600px] flex flex-col justify-center items-center py-auto">
                <CardHeader className="flex flex-col items-center w-full">
                    <CardTitle className="text-4xl">Войти в аккаунт</CardTitle>
                </CardHeader>
                <CardContent className="">
                    <form onSubmit={handleSubmit}>
                        <div className="py-2">
                            <label htmlFor="email">Электронная почта</label>
                            <Input
                                id="email"
                                type="text"
                                placeholder="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="">
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

                        {errorMsg && (
                            <div className="text-red-500 text-sm mt-4 text-center">
                                {errorMsg}
                            </div>
                        )}

                        <CardFooter className="flex flex-col w-full mt-12">
                            <Button type="submit" className="px-12" disabled={loading}>
                                {loading ? "Вход..." : "Войти"}
                            </Button>
                        </CardFooter>
                    </form>
                    <a href="/registration" className="flex flex-col w-full">
                        <Button variant="link">
                            <i>Нет аккаунта?</i>
                        </Button>
                    </a>
                </CardContent>
            </Card>
        </div>
    );
}

export default LoginPage;