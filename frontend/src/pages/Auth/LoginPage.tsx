import { Card, CardHeader, CardFooter, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function LoginPage(){
    return (
    <>
    <div className="min-h-screen flex items-center justify-start custom-bg">
        <Card className="min-h-screen w-full md:w-[400px] lg:w-[591px]">
            <CardHeader className="flex flex-col items-center"> 
                <CardTitle className="text-4xl ">Войти в аккаунт</CardTitle>
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
                <Button variant="link">
                    <a href="/registration">
                        <i>Нет аккаунта?</i>
                    </a>
                </Button>
            </CardFooter>
        </Card>
    </div>
    </>
)
}

export default LoginPage;