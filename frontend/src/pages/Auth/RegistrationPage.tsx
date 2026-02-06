import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, CardHeader, CardFooter, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Имя пользователя должно быть не менее 3 символов")
    .required("Имя пользователя обязательно"),
  email: Yup.string()
    .email("Введите корректный email")
    .required("Email обязателен"),
  password: Yup.string()
    .min(8, "Пароль должен быть не менее 8 символов")
    .matches(/[0-9]/, "Пароль должен содержать хотя бы одну цифру")
    .matches(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
    .required("Пароль обязателен"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], "Пароли не совпадают")
    .required("Повторите пароль"),
});

function RegistrationPage(){
    const { register } = useAuth();
    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema: validationSchema,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await register(values.username, values.email, values.password);
            } catch (err: any) {
                // TODO: Обработка ошибок с бэка
                const errorMessage = err.response?.data?.message || "Ошибка регистрации";
                alert(errorMessage); 
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
    <div className="min-h-screen flex items-center justify-start custom-bg">
        <Card className="min-h-screen w-full min-md:w-[600px] flex flex-col items-center justify-center">
            <CardHeader className="flex flex-col items-center"> 
                <CardTitle className="text-4xl">Регистрация</CardTitle>
            </CardHeader>

            <CardContent className="">
                <form onSubmit={formik.handleSubmit}>
                    <div className="py-2">
                        <label htmlFor="username">Логин</label>
                        <Input 
                            id="username" 
                            type="text" 
                            placeholder="username" 
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                        />
                    </div>

                    <div className="pb-2">
                        <label htmlFor="email">Электронная почта</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                        />
                    </div>

                    <div className="pb-2">
                        <label htmlFor="password">Пароль</label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                        />
                    </div>

                        <div className="">
                        <label htmlFor="confirmPassword">Повторите пароль</label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                        />
                    </div>
                    <CardFooter className="flex flex-col w-full mt-12">
                        <Button type="submit" className="px-8" disabled={formik.isSubmitting || !formik.isValid}>
                            {formik.isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
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
