import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

// TODO: Habilitar quando Supabase estiver conectado corretamente
export async function middleware_disabled(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getSetCookie();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as CookieOptions)
          );
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // Rotas públicas (permitem acesso sem autenticação)
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (isPublicRoute) {
    return response;
  }

  // Se não está autenticado, redireciona para login
  if (!user || authError) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Rotas protegidas por role
  const adminRoutes = ['/admin'];
  const gestorRoutes = ['/gestor'];

  const isAdminRoute = adminRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  const isGestorRoute = gestorRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (isAdminRoute || isGestorRoute) {
    // Busca o profile para verificar role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Valida acesso por role
    if (isAdminRoute && profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/gestor/revendas', request.url));
    }

    if (isGestorRoute && profile.role !== 'gestor' && profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Protege todas as rotas exceto _next, api, static files, etc
    '/((?!_next|api|.*\\..*|favicon\\.ico).*)',
  ],
};
