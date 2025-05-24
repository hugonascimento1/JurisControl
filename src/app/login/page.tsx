import LoginForm from '@/components/ui/login-form'
import { ScaleIcon } from "lucide-react";
import Logo from '@/components/logo-text-icon';

export default function LoginPage() {
    return (
        <main className="flex items-center justify-center h-screen bg-[#030430]">
            <div className="mx-auto flex w-full max-w-[400px] flex-col space-y-6 p-4">
                <Logo />
                <LoginForm />
            </div>
        </main>
    );
}

//<main className="flex items-center justify-center h-screen bg-[#030430]">
//    <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
//        <div className="flex h-20 w-full items-end rounded-lg bg-[#030430] p-3 md:h-36">
//            <div className="w-32 text-white md:w-36 ml-4 flex flex-row">
//                <Logo />             
//            </div>
//        </div>
//        <LoginForm />
//    </div>
//</main>