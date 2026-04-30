<?php
// Mario Miranda
// Archivo api.php

use App\Http\Controllers\ProductoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\DireccionController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// --- Rutas públicas ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Productos y categorías son públicos (cualquiera puede ver el catálogo)
Route::apiResource('productos',  ProductoController::class)->only(['index', 'show']);
Route::apiResource('categorias', CategoriaController::class)->only(['index', 'show']);

// --- Rutas protegidas ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('productos',   ProductoController::class)->except(['index', 'show']);
    Route::apiResource('categorias',  CategoriaController::class)->except(['index', 'show']);
    Route::apiResource('pedidos',     PedidoController::class);
    Route::apiResource('direcciones', DireccionController::class);
});