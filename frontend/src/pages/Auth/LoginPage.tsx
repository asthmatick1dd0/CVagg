import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Card, CardHeader, CardFooter, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Введите корректный email")
    .required("Email обязателен"),
  password: Yup.string()
    .min(8, "Пароль должен быть не менее 8 символов")
    .matches(/[0-9]/, "Пароль должен содержать хотя бы одну цифру")
    .matches(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
    .required("Пароль обязателен"),
});

function LoginPage() {
    const { login } = useAuth();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => { 
        setShowPassword(!showPassword);
    };   

    const formik = useFormik({
            initialValues: {
                email: "",
                password: ""
            },
            validationSchema: validationSchema,
            validateOnBlur: true,
            validateOnChange: true,
            onSubmit: async (values, { setSubmitting }) => {
                try {
                    await login(values.email, values.password);
                } catch (err: any) {
                    const data = err.response?.data || {};
                    if (data && data.includes("wrong password")) {
                        setErrorMessage("Неверный пароль");
                        setSubmitting(false);
                        return;
                    }
                    if (data && data.includes("user not found by email")) {
                        setErrorMessage("Пользователь с таким email не найден");
                        setSubmitting(false);
                        return;
                    }
                    setErrorMessage("Произошла ошибка при входе. Попробуйте позже.");
                } finally {
                    setSubmitting(false);
                }
            },
        });

    return (
        <div className="min-h-screen flex items-center justify-start custom-bg">
            <Card className="w-full min-md:w-[600px] flex flex-col justify-center items-center py-auto">
                <CardHeader className="flex flex-col items-center w-full ">
                    <CardTitle className="text-4xl ">Войти в аккаунт</CardTitle>
                </CardHeader>
                <CardContent className="">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="py-2">
                            <label htmlFor="email">Электронная почта</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                required
                                className={formik.touched.email && formik.errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                            )}
                        </div>
                        <div className="relative">
                            <label htmlFor="password">Пароль</label>
                            <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                required
                                className={formik.touched.password && formik.errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                             </div>
                            {formik.touched.password && formik.errors.password && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                            )}
                           
                        </div>

                        {errorMessage && (
                            <div className="text-red-500 text-sm mt-4 text-center">
                                {errorMessage}
                            </div>
                        )}

                        <CardFooter className="flex flex-col w-full mt-12">
                            <Button type="submit" className="px-12 hover:cursor-pointer" disabled={formik.isSubmitting}>
                                {formik.isSubmitting ? "Вход..." : "Войти"}
                            </Button>
                        </CardFooter>
                    </form>
                    <a href="/registration" className="flex flex-col w-full">
                        <Button variant="link" className="hover:cursor-pointer">
                            <i>Нет аккаунта?</i>
                        </Button>
                    </a>
                </CardContent>
            </Card>
        </div>
    );
}

export default LoginPage;