<?php
// Autor: Mario Miranda
// Archivo: ProductoController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;

class ProductoController extends Controller
{
    /**
     * Método que devuelve todos los productos de la base de datos
     */
    public function index(){
        return Producto::all();
    }

    /**
     * Método que crea un nuevo producto en la base de datos
     */
    public function store(Request $request){

        // Validación de datos
        $request->validate([
            'nombre'       => 'required|string|max:255',
            'descripcion'  => 'nullable|string',
            'precio'       => 'required|numeric|min:0',
            'stock'        => 'required|integer|min:0',
            'categoria_id' => 'required|integer|exists:categorias,id',
        ]);

        $producto = Producto::create($request->all());
        return response()->json($producto, 201);
    }

    /**
     * Método para buscar registro por id
     */
    public function show($id){
        return Producto::findOrFail($id);
    }

    /**
     * Método para actualizar un producto existente
     */
    public function update(Request $request, $id){

        // Validación de datos
        $request->validate([
            'nombre'       => 'string|max:255',
            'descripcion'  => 'nullable|string',
            'precio'       => 'numeric|min:0',
            'stock'        => 'integer|min:0',
            'categoria_id' => 'integer|exists:categorias,id',
        ]);

        $producto = Producto::findOrFail($id);
        $producto->update($request->all());
        return response()->json($producto);
    }

    /**
     * Método para eliminar un producto
     */
    public function destroy($id){
        Producto::destroy($id);
        return response()->json(['mensaje' => 'Producto eliminado']);
    }
}