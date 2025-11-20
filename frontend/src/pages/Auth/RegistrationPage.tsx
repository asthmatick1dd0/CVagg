import { Card, CardHeader, CardFooter, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function RegistrationPage(){
    return (
    <div className="min-h-screen flex items-center justify-start custom-bg">
        <Card className="min-h-screen w-full min-md:w-[600px]">
            <CardHeader className="flex flex-col items-center"> 
                <CardTitle className="text-4xl">Регистрация</CardTitle>
            </CardHeader>

            <CardContent className="">
                <form>
                    <div className="py-2">
                        <label htmlFor="uname">Логин</label>
                        <Input id="uname" type="text" placeholder="username" />
                    </div>

                    <div className="">
                        <label htmlFor="email">Электронная почта</label>
                        <Input id="email" type="email" placeholder="you@example.com" />
                    </div>

                    <div className="">
                        <label htmlFor="password">Пароль</label>
                        <Input id="password" type="password" placeholder="••••••••" />
                    </div>

                        <div className="">
                        <label htmlFor="confirmpassword">Повторите пароль</label>
                        <Input id="confirmpassword" type="password" placeholder="••••••••" />
                    </div>
                </form>
            </CardContent>

            <CardFooter className="flex flex-col w-full">
                <Button type="submit" className="px-8">Зарегистрироваться</Button>

                <Button variant="link">
                    <a href="/login">
                        <i>Уже есть аккаунт?</i>
                    </a>
                </Button>
            </CardFooter>
        </Card>
    </div>
)
}

export default RegistrationPage;
