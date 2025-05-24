'use client';

import { useEffect, useState } from "react";
import { useRouter} from "next/navigation";
import type { ComponentType } from "react";

type TipoUsuario = 'advogado' | 'administrador';

// const allowedRoles: TipoUsuario[] = ['advogado', 'administrador'];

const redirectMap: Record<TipoUsuario, string> = {
    advogado: '/login',
    administrador: '/login',
};

export function withAuth<P extends object>(allowedRoles: TipoUsuario[]) {
    return function (Component: ComponentType<P>) {
        return function AuthComponent(props: P) {
            const router = useRouter();
            const [isAuthorized, setIsAuthorized] = useState(false);
            const [isCheckingAuth, setIsCheckingAuth] = useState(true);

            useEffect(() => {
                const token = sessionStorage.getItem('authToken');
                const tipoUsuario = sessionStorage.getItem('tipoUsuario') as TipoUsuario | null;

                if (!token || !tipoUsuario) {
                    
                    router.push('/login');
                } else if (!allowedRoles.includes(tipoUsuario)) {
                    // Redireciona para a rota padrão do tipo de usuário
                    const redirectTo = redirectMap[tipoUsuario];
                    router.push(redirectTo);
                } else {
                    setIsAuthorized(true);
                }

                setIsCheckingAuth(false);
            }, []);

            if (isCheckingAuth)  {
                return (
                    <div className="flex justify-center items-center">
                        <p>Carregando...</p>
                    </div>
                ); 
            }

            return isAuthorized ? <Component {...props} /> : null;
        };
    };
    
}