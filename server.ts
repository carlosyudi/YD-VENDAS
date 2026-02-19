import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("yv_vendas.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sale_price REAL NOT NULL,
    cost_price REAL NOT NULL DEFAULT 0,
    category TEXT,
    stock INTEGER DEFAULT 0,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    sale_price REAL NOT NULL,
    cost_price REAL NOT NULL,
    total_price REAL NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (id)
  );
`);

// Migration: Add new columns if they don't exist (for existing databases)
try { db.exec("ALTER TABLE products ADD COLUMN cost_price REAL DEFAULT 0"); } catch (e) {}
try { db.exec("ALTER TABLE products ADD COLUMN image TEXT"); } catch (e) {}
try { db.exec("ALTER TABLE products RENAME COLUMN price TO sale_price"); } catch (e) {}
try { db.exec("ALTER TABLE sales ADD COLUMN sale_price REAL DEFAULT 0"); } catch (e) {}
try { db.exec("ALTER TABLE sales ADD COLUMN cost_price REAL DEFAULT 0"); } catch (e) {}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' })); // Increase limit for base64 images

  // Auth Endpoints
  app.post("/api/register", (req, res) => {
    const { name, email, password } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
      const result = stmt.run(name, email, password);
      res.json({ id: result.lastInsertRowid, name, email });
    } catch (error: any) {
      if (error.message.includes("UNIQUE constraint failed")) {
        res.status(400).json({ error: "Email already exists" });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  });

  // Products Endpoints
  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  });

  app.post("/api/products", (req, res) => {
    const { name, sale_price, cost_price, category, stock, image } = req.body;
    const stmt = db.prepare("INSERT INTO products (name, sale_price, cost_price, category, stock, image) VALUES (?, ?, ?, ?, ?, ?)");
    const result = stmt.run(name, sale_price, cost_price || 0, category, stock || 0, image);
    res.json({ id: result.lastInsertRowid, name, sale_price, cost_price, category, stock, image });
  });

  app.put("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const { name, sale_price, cost_price, category, stock, image } = req.body;
    db.prepare("UPDATE products SET name = ?, sale_price = ?, cost_price = ?, category = ?, stock = ?, image = ? WHERE id = ?")
      .run(name, sale_price, cost_price, category, stock, image, id);
    res.json({ success: true });
  });

  app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM products WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // Sales Endpoints
  app.post("/api/sales", (req, res) => {
    const { product_id, quantity } = req.body;
    const product = db.prepare("SELECT sale_price, cost_price FROM products WHERE id = ?").get(product_id) as any;
    if (!product) return res.status(404).json({ error: "Product not found" });

    const sale_price = product.sale_price;
    const cost_price = product.cost_price;
    const total_price = sale_price * quantity;
    
    const stmt = db.prepare("INSERT INTO sales (product_id, quantity, sale_price, cost_price, total_price) VALUES (?, ?, ?, ?, ?)");
    const result = stmt.run(product_id, quantity, sale_price, cost_price, total_price);
    
    // Update stock
    db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?").run(quantity, product_id);

    res.json({ id: result.lastInsertRowid, product_id, quantity, sale_price, cost_price, total_price });
  });

  app.get("/api/sales", (req, res) => {
    const sales = db.prepare(`
      SELECT s.*, p.name as product_name 
      FROM sales s 
      JOIN products p ON s.product_id = p.id 
      ORDER BY s.date DESC
    `).all();
    res.json(sales);
  });

  // Dashboard / Reports Endpoints
  app.get("/api/stats", (req, res) => {
    const today = db.prepare("SELECT SUM(total_price) as total FROM sales WHERE date(date) = date('now')").get() as any;
    const week = db.prepare("SELECT SUM(total_price) as total FROM sales WHERE date >= date('now', '-7 days')").get() as any;
    const month = db.prepare("SELECT SUM(total_price) as total FROM sales WHERE date >= date('now', 'start of month')").get() as any;

    res.json({
      today: today.total || 0,
      week: week.total || 0,
      month: month.total || 0
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
