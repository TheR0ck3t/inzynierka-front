require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT;
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');

// Middleware do obsługi JSON i URL-encoded przed routowaniem
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (np. CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Setup EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Wczytywanie tras
const routesPath = path.join(__dirname, './src/routes');
const loadRroutes = (dirPath) => {
    fs.readdirSync(dirPath).forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            loadRroutes(fullPath);
        } else {
            const { path: routePath, router, routeName } = require(fullPath);
            if (router && routePath) {
                app.use(routePath, router);
                const relativePath = path.relative(routesPath, fullPath);
                console.log(`Loaded route: ${routeName}\nPath: ${routePath}\nFrom file: ${relativePath}\n`);
            } else {
                console.log(`Error loading route from file: ${fullPath}`);
            }
        }
    });
};

loadRroutes(routesPath);

app.use(
    "/api",
    createProxyMiddleware({
        target: "http://owo.local:2137/",
        changeOrigin: true,
        pathRewrite: {
            "": "/api", // dodanie /api do ścieżki
        },
        on: {
            proxyReq: fixRequestBody, // Dodanie fixRequestBody do obsługi problemów z ciałem zapytania
            proxyRes: (proxyRes) => {
                console.log("Proxy response:", proxyRes.statusCode);
            },
            error: (err, req, res) => {
                console.error("Proxy error:", err);

            },
        },
        secure: false,
    }));

// Start serwera
app.listen(PORT, () => {
    console.log('Frontend server started on port ' + PORT);
});