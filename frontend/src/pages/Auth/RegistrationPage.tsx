import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Card, CardHeader, CardFooter, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";



const validationSchema = Yup.object({
    username: Yup.string()
        .min(3, "Имя пользователя должно быть не менее 3 символов")
        .required("Имя пользователя обязательно"),
    name: Yup.string()
        .matches(/^[а-яА-Яa-zA-ZÀ-ÖÙ-öù-ÿĀ-žḀ-ỿ0-9\s\-\/.]+$/, 'Имя должно начинаться с заглавной буквы и быть написано кириллицей')
        .max(40)
        .required("Имя обязательно"),
    surname: Yup.string()
        .matches(/^[а-яА-Яa-zA-ZÀ-ÖÙ-öù-ÿĀ-žḀ-ỿ0-9\s\-\/.]+$/, 'Фамилия должна начинаться с заглавной буквы')
        .max(40)
        .required("Фамилия обязательна"),
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
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const formik = useFormik({
        initialValues: {
            username: "",
            name: "",
            surname: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await register(values.username, values.name, values.surname, values.email, values.password);
            } catch (err: any) {
                const status = err.response?.status;
                const data = err.response?.data || {};
                // дополнительная проверка на дублирование ключа в бд, ибо сервер может возвращать разные коды статусов((
                const isDuplicateKey = 
                    data.Code === "23505" || 
                    (data.Message && data.Message.includes("duplicate key")) ||
                    (data.message && data.message.includes("duplicate key")); 

                if (isDuplicateKey) {
                    const detail = data.Detail || data.detail || "";
                    if (detail.includes("email") || data.ConstraintName?.includes("email")) {
                        setErrorMessage("Этот email уже зарегистрирован");
                        setSubmitting(false);
                        return;
                    } 
                    if (detail.includes("username") || data.ConstraintName?.includes("username")) {
                        setErrorMessage("Этот логин уже занят");
                        setSubmitting(false);
                        return;
                    }
                }
                switch (status) {
                    case 400:
                        setErrorMessage("Некорректные данные. Проверьте введённую информацию.");
                        break;
                    case 409:
                        setErrorMessage("Пользователь с таким email уже существует.");
                        break;
                    default:
                        setErrorMessage(err.response?.data?.message || "Ошибка регистрации. Попробуйте позже.");
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
    <div className="min-h-screen w-screen justify-start custom-bg">
        <Card className="auth-card min-md:w-[400px] flex flex-col justify-center items-center">
            <CardHeader className="flex flex-col items-center"> 
                <CardTitle className="text-4xl">Регистрация</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center items-center">
                <form onSubmit={formik.handleSubmit} className="w-[300px]">
                    <div className="gap-2">
                        <div className="flex flex-col gap-2 items-center">
                            <div className="pt-2 w-[280px]">
                                <label className="text-foreground" htmlFor="username">Логин</label>
                                <Input 
                                    id="username" 
                                    type="text" 
                                    placeholder="username" 
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    required
                                    className={formik.touched.username && formik.errors.username ? "border-destructive focus-visible:ring-destructive" : ""}
                                />
                                {formik.touched.username && formik.errors.username && (
                                    <div className="text-destructive text-sm mt-1">{formik.errors.username}</div>
                                )}
                            </div>

                            <div className="w-[280px]">
                                <label className="text-foreground" htmlFor="fname">Имя</label>
                                <Input
                                    id="name"
                                    type="fname"
                                    placeholder="Иван"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    required
                                    className={formik.touched.name && formik.errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <div className="text-destructive text-sm mt-1">{formik.errors.name}</div>
                                )}
                            </div>

                            <div className="w-[280px]">
                                <label className="text-foreground" htmlFor="lname">Фамилия</label>
                                <Input
                                    id="surname"
                                    type="lname"
                                    placeholder="Иванов"
                                    value={formik.values.surname}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    required
                                    className={formik.touched.surname && formik.errors.surname ? "border-destructive focus-visible:ring-destructive" : ""}
                                />
                                {formik.touched.surname && formik.errors.surname && (
                                    <div className="text-destructive text-sm mt-1">{formik.errors.surname}</div>
                                )}
                            </div>  

                            <div className="w-[280px]">
                                <label className="text-foreground" htmlFor="email">Электронная почта</label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    required
                                    className={formik.touched.email && formik.errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <div className="text-destructive text-sm mt-1">{formik.errors.email}</div>
                                )}
                            </div>

                            <div className="w-[280px]">
                                <label className="text-foreground" htmlFor="password">Пароль</label>
                                <div className="relative">   
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        required
                                        className={formik.touched.password && formik.errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
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
                                        <div className="text-destructive text-sm mt-1">{formik.errors.password}</div>
                                    )}
                            </div>

                            <div className="pb-2 w-[280px]">
                                <label className="text-foreground" htmlFor="confirmPassword">Повторите пароль</label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        required
                                        className={formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                    <div className="text-destructive text-sm mt-1">{formik.errors.confirmPassword}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {errorMessage && (
                            <div className="text-destructive text-sm mt-4 text-center">
                                {errorMessage}
                            </div>
                        )}

                    <CardFooter className="flex flex-col w-full mt-12">
                        <Button type="submit" className="px-8 hover:cursor-pointer" disabled={formik.isSubmitting || !formik.isValid}>
                            {formik.isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
                        </Button>
                    </CardFooter>
                </form>
                <a href="/login" className="flex flex-col w-full">
                    <Button variant="link" className="hover:cursor-pointer">
                    
                        <i>Уже есть аккаунт?</i>
                    </Button>
                </a>
            </CardContent>
        </Card>
    </div>
)
}

export default RegistrationPage;
