import { Card, CardHeader, CardFooter, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function LoginPage(){
    return (
    <>
    <div className="min-h-screen flex items-center justify-center custom-gradient">
        <Card className="scale-105 md:scale-125 lg:scale-140">
            <CardHeader className="flex flex-col justify-center items-center">
                <CardTitle className="text-lg">Войти в аккаунт</CardTitle>
            </CardHeader>
            <CardContent className="">
                <form>
                    {/* TODO (в будущем): добавить/заменить юзернейм на почту */}
                    <div className="py-2">
                        <label htmlFor="uname">Имя пользователя</label>
                        <Input id="uname" type="text" placeholder="you@example.com" />
                    </div>
                    <div className="">
                        <label htmlFor="password">Пароль</label>
                        <Input id="password" type="password" placeholder="••••••••" />
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col">
                <Button type="submit" className="w-full">Войти</Button>
                <Button variant="link"><i>Нет аккаунта?</i></Button>
            </CardFooter>
        </Card>
    </div>
    </>
)
}

export default LoginPage;