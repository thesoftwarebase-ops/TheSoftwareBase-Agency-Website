import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
// NOTE: bcryptjs + lib/db (mongodb driver) are imported LAZILY inside
// authorize(). Static imports would poison the edge-runtime middleware
// bundle (middleware only reads the JWT session, never touches the DB).

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || '').toLowerCase().trim();
        const password = String(credentials?.password || '');
        if (!email || !password) return null;
        const { default: bcrypt } = await import('bcryptjs');
        const { connectToDatabase } = await import('@/lib/db');
        const { db } = await connectToDatabase();
        const user = await db.collection('users').findOne({ email });
        if (!user || typeof user.passwordHash !== 'string') return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return {
          id: String(user._id),
          email: user.email,
          name: user.name || 'Admin',
          role: user.role || 'admin',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.name = token.name;
      }
      return session;
    },
  },
});
