<?php
// Autor: Mario Miranda
// Archivo: CategoriaController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Categoria;

class CategoriaController extends Controller
{
    /**
     * Devuelve todas las categorías
     */
    public function index(){
        return Categoria::all();
    }

    /**
     * Crea una nueva categoría
     */
    public function store(Request $request){

        $request->validate([
            'nombre' => 'required|string|max:255|unique:categorias,nombre'
        ]);

        $categoria = Categoria::create(['nombre' => $request->nombre]);
        return response()->json($categoria, 201); // 👈 código 201 correcto
    }

    /**
     * Devuelve una categoría por su ID
     */
    public function show($id){
        return Categoria::findOrFail($id);
    }

    /**
     * Actualiza una categoría existente
     */
    public function update(Request $request, $id){

        $request->validate([
            'nombre' => 'required|string|max:255|unique:categorias,nombre,'.$id
        ]);

        $categoria = Categoria::findOrFail($id);
        $categoria->update($request->all());
        return response()->json($categoria);
    }

    /**
     * Elimina una categoría
     */
    public function destroy($id){
        Categoria::destroy($id);
        return response()->json(['mensaje' => 'Categoría eliminada']);
    }
}