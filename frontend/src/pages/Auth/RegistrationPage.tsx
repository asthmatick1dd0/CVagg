import { Card, CardHeader, CardFooter, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function RegistrationPage(){
    return (
    <div className="min-h-screen flex items-center justify-center custom-gradient">
        <Card className="scale-105 md:scale-125 lg:scale-140">

            <CardHeader className="flex flex-col justify-center items-center">
                <CardTitle className="text-lg">Регистрация</CardTitle>
            </CardHeader>

            <CardContent className="">
                <form>
                    <div className="py-2">
                        <label htmlFor="login">Логин</label>
                        <Input id="login" type="text" placeholder="Irina332217" />
                    </div>

                    <div className="">
                        <label htmlFor="uname">Электронная почта</label>{/*Я сделала расположение в кнопок не как в фигме, потому что такое мне кажется более логичным */}
                        <Input id="uname" type="text" placeholder="you@example.com" /> {/*На страничке логина ув примере была почта, поэтому я ей дала айдишку uname, но, предполагаю, она должна быть у логина*/}
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

            <CardFooter className="flex flex-col">
                <Button type="submit" className="w-full">Зарегистрироваться</Button>

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
