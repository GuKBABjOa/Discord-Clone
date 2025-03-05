import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    '/sign-in(.*)',
    '/sign-up(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
    // 요청 URL에서 pathname을 확인하여 '/api/uploadthing' 경로는 건너뛰기
    if (request.nextUrl.pathname.startsWith('/api/uploadthing')) {
        return NextResponse.next();
    }

    if (!isPublicRoute(request)) {
        await auth.protect();
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Next.js 내부 파일 및 정적 파일들을 제외하고
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // API 및 trpc 라우트에 대해 적용
        '/(api|trpc)(.*)',
    ],
};
