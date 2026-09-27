const { Client } = require('pg');

const connectionString = "postgresql://postgres.kzudptnfvrrwizmqikba:Landwood1234*@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres";

async function migrate() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL database successfully!');

    // Schema Definition
    const sql = `
      -- 1. Profiles Table (Heritage Passports)
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE,
        display_name TEXT,
        avatar_url TEXT,
        heritage_level TEXT DEFAULT 'Brahma Seeker',
        visited_monuments TEXT[] DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 2. Bookmarks Table (Monuments, Ragas, Eras, Crafts)
      CREATE TABLE IF NOT EXISTS public.bookmarks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
        item_id TEXT NOT NULL,
        item_type TEXT NOT NULL, -- 'monument', 'raga', 'dance', 'craft', 'event'
        title TEXT NOT NULL,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 3. Artisan Orders Table (KalaMitra Marketplace)
      CREATE TABLE IF NOT EXISTS public.artisan_orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_name TEXT NOT NULL,
        customer_email TEXT,
        items JSONB NOT NULL,
        total_amount NUMERIC(10, 2) NOT NULL,
        artisan_cluster TEXT,
        status TEXT DEFAULT 'confirmed',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 4. Quiz Leaderboard Table
      CREATE TABLE IF NOT EXISTS public.quiz_scores (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        player_name TEXT NOT NULL,
        quiz_category TEXT NOT NULL, -- 'history', 'natyashastra', 'ragas'
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Enable Row Level Security (RLS) & Public Read
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.artisan_orders ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;

      -- Allow anonymous/authenticated read & write for prototype
      DO $$
      BEGIN
        DROP POLICY IF EXISTS "Public select on profiles" ON public.profiles;
        CREATE POLICY "Public select on profiles" ON public.profiles FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Public insert on profiles" ON public.profiles;
        CREATE POLICY "Public insert on profiles" ON public.profiles FOR ALL USING (true);

        DROP POLICY IF EXISTS "Public on bookmarks" ON public.bookmarks;
        CREATE POLICY "Public on bookmarks" ON public.bookmarks FOR ALL USING (true);

        DROP POLICY IF EXISTS "Public on orders" ON public.artisan_orders;
        CREATE POLICY "Public on orders" ON public.artisan_orders FOR ALL USING (true);

        DROP POLICY IF EXISTS "Public on quiz" ON public.quiz_scores;
        CREATE POLICY "Public on quiz" ON public.quiz_scores FOR ALL USING (true);
      END $$;
    `;

    await client.query(sql);
    console.log('Database tables, schemas, and RLS policies created successfully!');

    // Test inserting a demo leaderboard score to verify
    await client.query(`
      INSERT INTO public.quiz_scores (player_name, quiz_category, score, total_questions)
      VALUES ('Arya Scholar', 'history', 10, 10)
      ON CONFLICT DO NOTHING;
    `);

    const res = await client.query('SELECT COUNT(*) FROM public.quiz_scores;');
    console.log('Quiz scores count in Supabase:', res.rows[0].count);

  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await client.end();
  }
}

migrate();
