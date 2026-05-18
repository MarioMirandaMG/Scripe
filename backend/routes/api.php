    <?php
    // Autor: Mario Miranda
    // Archivo: api.php

    // Controladores que consume el frontend
    use App\Http\Controllers\ProductoController;
    use App\Http\Controllers\CategoriaController;
    use App\Http\Controllers\PedidoController;
    use App\Http\Controllers\DireccionController;
    use App\Http\Controllers\AuthController;
    use Illuminate\Support\Facades\Route;

    // ─── Rutas públicas ───────────────────────────────────────────────
    // Accesibles sin autenticación

    // Registro e inicio de sesión
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);

    // Productos y categorías son públicos para que cualquier visitante
    // pueda consultar el catálogo sin necesidad de estar registrado
    Route::apiResource('productos',  ProductoController::class)->only(['index', 'show']);
    Route::apiResource('categorias', CategoriaController::class)->only(['index', 'show']);


    // ─── Rutas protegidas ─────────────────────────────────────────────
    // Requieren token Sanctum válido en la cabecera Authorization

    Route::middleware('auth:sanctum')->group(function () {

        // Cierre de sesión — elimina el token actual del usuario
        Route::post('/logout', [AuthController::class, 'logout']);

        // Crear, editar y eliminar productos y categorías — solo admins
        Route::apiResource('productos',   ProductoController::class)->except(['index', 'show']);
        Route::apiResource('categorias',  CategoriaController::class)->except(['index', 'show']);

        // Pedidos y direcciones — solo usuarios autenticados
        Route::apiResource('pedidos',     PedidoController::class);
        Route::apiResource('direcciones', DireccionController::class);
    });