<?php
// Autor: Mario Miranda
// Archivo: ProductoController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;

/**
 * Controlador de productos.
 *
 * Gestiona las operaciones CRUD sobre los productos
 * del catálogo de la tienda Scripe.
 */
class ProductoController extends Controller
{
    /**
     * Devuelve todos los productos de la base de datos.
     *
     * Además, transforma el campo imagen para que devuelva
     * una ruta pública accesible desde el frontend.
     *
     * @return \Illuminate\Http\JsonResponse  Lista completa de productos en formato JSON
     */
    public function index()
    {
        $productos = Producto::all()->map(function ($producto) {
            // Si el producto tiene imagen, se construye la URL pública
            // usando la carpeta storage enlazada al directorio public
            $producto->imagen = $producto->imagen
                ? asset('storage/' . $producto->imagen)
                : null;

            return $producto;
        });

        return response()->json($productos);
    }

    /**
     * Crea un nuevo producto en la base de datos.
     *
     * Valida que los campos obligatorios estén presentes
     * y que la categoría exista antes de insertar.
     *
     * @param  \Illuminate\Http\Request  $request  Datos del nuevo producto
     * @return \Illuminate\Http\JsonResponse       Producto creado con código 201
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre'       => 'required|string|max:255',
            'descripcion'  => 'nullable|string',
            'precio'       => 'required|numeric|min:0',
            'stock'        => 'required|integer|min:0',
            'categoria_id' => 'required|integer|exists:categorias,id',
        ]);

        $producto = Producto::create($request->all());

        // Si el producto tiene imagen, se transforma también a URL pública
        $producto->imagen = $producto->imagen
            ? asset('storage/' . $producto->imagen)
            : null;

        return response()->json($producto, 201);
    }

    /**
     * Devuelve un producto concreto por su ID.
     *
     * Lanza un error 404 si el producto no existe.
     * También transforma la imagen en una URL pública accesible.
     *
     * @param  int  $id  Identificador del producto
     * @return \Illuminate\Http\JsonResponse  Producto encontrado en formato JSON
     */
    public function show($id)
    {
        $producto = Producto::findOrFail($id);

        // Si el producto tiene imagen, se construye la ruta pública
        $producto->imagen = $producto->imagen
            ? asset('storage/' . $producto->imagen)
            : null;

        return response()->json($producto);
    }

    /**
     * Actualiza los datos de un producto existente.
     *
     * Todos los campos son opcionales en la actualización.
     * Valida el formato de los datos recibidos.
     *
     * @param  \Illuminate\Http\Request  $request  Nuevos datos del producto
     * @param  int                       $id       Identificador del producto
     * @return \Illuminate\Http\JsonResponse       Producto actualizado
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre'       => 'string|max:255',
            'descripcion'  => 'nullable|string',
            'precio'       => 'numeric|min:0',
            'stock'        => 'integer|min:0',
            'categoria_id' => 'integer|exists:categorias,id',
        ]);

        $producto = Producto::findOrFail($id);
        $producto->update($request->all());

        // Si el producto tiene imagen, se devuelve como URL pública
        $producto->imagen = $producto->imagen
            ? asset('storage/' . $producto->imagen)
            : null;

        return response()->json($producto);
    }

    /**
     * Elimina un producto de la base de datos.
     *
     * @param  int  $id  Identificador del producto a eliminar
     * @return \Illuminate\Http\JsonResponse  Mensaje de confirmación
     */
    public function destroy($id)
    {
        Producto::destroy($id);

        return response()->json(['mensaje' => 'Producto eliminado']);
    }
}