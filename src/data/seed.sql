-- Al Junassan E-Commerce Database Schema
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price INT NOT NULL,
  compare_at_price INT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  gender TEXT NOT NULL DEFAULT 'unisex' CHECK (gender IN ('men', 'women', 'unisex')),
  images TEXT[] DEFAULT '{}',
  material TEXT,
  weight TEXT,
  in_stock BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 3. PROFILES TABLE (linked to auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  city TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 4. ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  subtotal INT NOT NULL,
  shipping_cost INT NOT NULL DEFAULT 250,
  total INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL DEFAULT 'cod',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 5. ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_price INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  total INT NOT NULL
);

-- ============================================
-- 6. CONTACT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 7. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_gender ON products(gender);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ============================================
-- 8. AUTO-CREATE PROFILE ON USER SIGNUP (TRIGGER)
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 9. AUTO-UPDATE updated_at TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 10. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Categories: public read
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Categories are editable by service role" ON categories;
CREATE POLICY "Categories are editable by service role" ON categories FOR ALL USING (auth.role() = 'service_role');

-- Products: public read
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Products are editable by service role" ON products;
CREATE POLICY "Products are editable by service role" ON products FOR ALL USING (auth.role() = 'service_role');

-- Profiles: users can read/update their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Profiles insertable by trigger" ON profiles;
CREATE POLICY "Profiles insertable by trigger" ON profiles FOR INSERT WITH CHECK (true);

-- Orders: authenticated users can create and view their own
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role full access orders" ON orders;
CREATE POLICY "Service role full access orders" ON orders FOR ALL USING (auth.role() = 'service_role');

-- Order Items: follow order ownership
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create order items" ON order_items;
CREATE POLICY "Users can create order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
DROP POLICY IF EXISTS "Service role full access order items" ON order_items;
CREATE POLICY "Service role full access order items" ON order_items FOR ALL USING (auth.role() = 'service_role');

-- Contact Messages: anyone can insert
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can send contact messages" ON contact_messages;
CREATE POLICY "Anyone can send contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Service role reads messages" ON contact_messages;
CREATE POLICY "Service role reads messages" ON contact_messages FOR SELECT USING (auth.role() = 'service_role');

-- ============================================
-- 11. SEED DATA: CATEGORIES
-- ============================================
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Rings', 'rings', 'Exquisite rings for every occasion - from statement pieces to everyday elegance.', 1),
  ('Necklaces', 'necklaces', 'Stunning necklaces and chains that add the perfect finishing touch.', 2),
  ('Bracelets', 'bracelets', 'Beautiful bracelets and bangles crafted with precision and style.', 3),
  ('Pendants', 'pendants', 'Elegant pendants that tell your unique story.', 4),
  ('Men Accessories', 'men-accessories', 'Bold and sophisticated accessories designed for the modern gentleman.', 5);

-- ============================================
-- 12. SEED DATA: PRODUCTS
-- ============================================

-- RINGS
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, gender, material, weight, is_featured, images) VALUES
(
  'Royal Gold Signet Ring',
  'royal-gold-signet-ring',
  'A bold and distinguished signet ring crafted from premium gold-plated stainless steel. Perfect for the modern gentleman who appreciates classic luxury.',
  18500,
  22000,
  (SELECT id FROM categories WHERE slug = 'rings'),
  'men',
  '18K Gold Plated Stainless Steel',
  '12g',
  true,
  ARRAY['/images/products/placeholder.jpg']
),
(
  'Diamond Solitaire Ring',
  'diamond-solitaire-ring',
  'An iconic solitaire ring featuring a brilliant-cut cubic zirconia stone set in a polished gold band. Timeless elegance for her.',
  45000,
  55000,
  (SELECT id FROM categories WHERE slug = 'rings'),
  'women',
  '18K Gold Plated Sterling Silver',
  '5g',
  true,
  ARRAY['/images/products/placeholder.jpg']
),
(
  'Emerald Statement Ring',
  'emerald-statement-ring',
  'A stunning emerald-green stone set in an intricately designed gold band. Makes a powerful fashion statement.',
  32000,
  NULL,
  (SELECT id FROM categories WHERE slug = 'rings'),
  'women',
  'Gold Plated Brass',
  '8g',
  false,
  ARRAY['/images/products/placeholder.jpg']
),
(
  'Minimalist Band Ring',
  'minimalist-band-ring',
  'A sleek, modern band ring with a polished finish. Subtle luxury for everyday wear.',
  12000,
  15000,
  (SELECT id FROM categories WHERE slug = 'rings'),
  'unisex',
  'Stainless Steel with Gold Finish',
  '6g',
  true,
  ARRAY['/images/products/placeholder.jpg']
);

-- NECKLACES
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, gender, material, weight, is_featured, images) VALUES
(
  'Cuban Link Gold Chain',
  'cuban-link-gold-chain',
  'A heavyweight Cuban link chain with a luxurious gold finish. The ultimate statement piece for men.',
  28000,
  35000,
  (SELECT id FROM categories WHERE slug = 'necklaces'),
  'men',
  '18K Gold Plated Stainless Steel',
  '45g',
  true,
  ARRAY['/images/products/placeholder.jpg']
),
(
  'Pearl Strand Necklace',
  'pearl-strand-necklace',
  'A classic pearl strand necklace with a gold clasp. Timeless sophistication for any occasion.',
  38000,
  NULL,
  (SELECT id FROM categories WHERE slug = 'necklaces'),
  'women',
  'Freshwater Pearls, Gold Clasp',
  '20g',
  true,
  ARRAY['/images/products/placeholder.jpg']
),
(
  'Layered Gold Necklace',
  'layered-gold-necklace',
  'A trendy multi-layered necklace combining delicate chains with small pendant accents.',
  22000,
  28000,
  (SELECT id FROM categories WHERE slug = 'necklaces'),
  'women',
  'Gold Plated Sterling Silver',
  '10g',
  false,
  ARRAY['/images/products/placeholder.jpg']
),
(
  'Rope Chain Necklace',
  'rope-chain-necklace',
  'A premium rope chain with a thick, textured design. Bold luxury for the confident man.',
  24000,
  NULL,
  (SELECT id FROM categories WHERE slug = 'necklaces'),
  'men',
  '18K Gold Plated Stainless Steel',
  '38g',
  false,
  ARRAY['/images/products/placeholder.jpg']
);

-- BRACELETS
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, gender, material, weight, is_featured, images) VALUES
(
  'Gold Cuff Bangle',
  'gold-cuff-bangle',
  'A stunning open cuff bangle with intricate Middle Eastern-inspired engravings. Statement luxury.',
  26000,
  32000,
  (SELECT id FROM categories WHERE slug = 'bracelets'),
  'women',
  '18K Gold Plated Brass',
  '25g',
  true,
  ARRAY['/images/products/placeholder.jpg']
),
(
  'Tennis Bracelet',
  'tennis-bracelet',
  'A dazzling tennis bracelet adorned with sparkling cubic zirconia stones in a gold setting.',
  52000,
  65000,
  (SELECT id FROM categories WHERE slug = 'bracelets'),
  'women',
  'Gold Plated Sterling Silver, CZ Stones',
  '15g',
  true,
  ARRAY['/images/products/placeholder.jpg']
),
(
  'Leather & Gold Bracelet',
  'leather-gold-bracelet',
  'A premium leather bracelet with gold-plated hardware. Masculine elegance at its finest.',
  14000,
  NULL,
  (SELECT id FROM categories WHERE slug = 'bracelets'),
  'men',
  'Genuine Leather, Gold Plated Steel',
  '18g',
  false,
  ARRAY['/images/products/placeholder.jpg']
);

-- PENDANTS
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, gender, material, weight, is_featured, images) VALUES
(
  'Crescent Moon Pendant',
  'crescent-moon-pendant',
  'A beautifully crafted crescent moon pendant with delicate filigree details. Inspired by Middle Eastern artistry.',
  19500,
  25000,
  (SELECT id FROM categories WHERE slug = 'pendants'),
  'women',
  '18K Gold Plated Sterling Silver',
  '7g',
  true,
  ARRAY['/images/products/placeholder.jpg']
),
(
  'Lion Head Pendant',
  'lion-head-pendant',
  'A bold lion head pendant symbolizing strength and royalty. Comes with a matching chain.',
  21000,
  NULL,
  (SELECT id FROM categories WHERE slug = 'pendants'),
  'men',
  'Gold Plated Stainless Steel',
  '22g',
  false,
  ARRAY['/images/products/placeholder.jpg']
),
(
  'Heart Locket Pendant',
  'heart-locket-pendant',
  'A romantic heart-shaped locket that opens to hold a photo. The perfect sentimental gift.',
  16500,
  20000,
  (SELECT id FROM categories WHERE slug = 'pendants'),
  'women',
  'Gold Plated Sterling Silver',
  '6g',
  false,
  ARRAY['/images/products/placeholder.jpg']
);

-- MEN ACCESSORIES
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, gender, material, weight, is_featured, images) VALUES
(
  'Premium Cufflinks Set',
  'premium-cufflinks-set',
  'An executive cufflinks set with mother of pearl inlay and gold trim. Elevate your formal wear.',
  15000,
  19000,
  (SELECT id FROM categories WHERE slug = 'men-accessories'),
  'men',
  'Gold Plated Brass, Mother of Pearl',
  '15g (pair)',
  true,
  ARRAY['/images/products/placeholder.jpg']
),
(
  'Luxury Tie Clip',
  'luxury-tie-clip',
  'A sleek gold-finished tie clip that adds a touch of sophistication to any suit.',
  10000,
  NULL,
  (SELECT id FROM categories WHERE slug = 'men-accessories'),
  'men',
  '18K Gold Plated Steel',
  '8g',
  false,
  ARRAY['/images/products/placeholder.jpg']
),
(
  'Black Onyx Ring',
  'black-onyx-ring',
  'A commanding black onyx ring set in a gold band. Dark luxury for the bold man.',
  20000,
  25000,
  (SELECT id FROM categories WHERE slug = 'men-accessories'),
  'men',
  'Gold Plated Steel, Black Onyx',
  '14g',
  true,
  ARRAY['/images/products/placeholder.jpg']
);

-- ============================================
-- 13. SUPABASE STORAGE BUCKET (run separately in Supabase dashboard)
-- ============================================
-- Go to Storage > Create new bucket
-- Name: product-images
-- Public: true
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp
