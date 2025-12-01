import { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authApi } from './api';

// Extend the Session and User types to include 'id'
declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string;
    };
    accessToken?: string;
  }
  interface User {
    id?: string;
    accessToken?: string;
  }
}

// NextAuth configuration
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        try {
          const response = await authApi.login(
            credentials.email,
            credentials.password,
          );

          if (response.data.access_token && response.data.user) {
            return {
              id: response.data.user._id,
              email: response.data.user.email,
              name: `${response.data.user.firstName} ${response.data.user.lastName}`,
              accessToken: response.data.access_token,
            };
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error('Invalid credentials');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session as any).accessToken = token.accessToken;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Client-side auth utilities
export const getAccessToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const setAccessToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
};

export const removeAccessToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};
