<?php
// Autor: Mario Miranda
// Archivo: CategoriaController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Categoria;

/**
 * Controlador de categorías.
 *
 * Gestiona las operaciones CRUD sobre las categorías
 * de productos de la tienda Scripe.
 */
class CategoriaController extends Controller
{
    /**
     * Devuelve todas las categorías disponibles.
     *
     * @return \Illuminate\Database\Eloquent\Collection  Lista de todas las categorías
     */
    public function index(){
        return Categoria::all();
    }

    /**
     * Crea una nueva categoría en la base de datos.
     *
     * Valida que el nombre sea único antes de insertarla.
     *
     * @param  \Illuminate\Http\Request  $request  Datos de la nueva categoría
     * @return \Illuminate\Http\JsonResponse         Categoría creada con código 201
     */
    public function store(Request $request){
        $request->validate([
            'nombre' => 'required|string|max:255|unique:categorias,nombre'
        ]);

        $categoria = Categoria::create(['nombre' => $request->nombre]);
        return response()->json($categoria, 201);
    }

    /**
     * Devuelve una categoría concreta por su ID.
     *
     * Lanza un error 404 si la categoría no existe.
     *
     * @param  int  $id  Identificador de la categoría
     * @return \App\Models\Categoria  Categoría encontrada
     */
    public function show($id){
        return Categoria::findOrFail($id);
    }

    /**
     * Actualiza los datos de una categoría existente.
     *
     * Valida que el nuevo nombre sea único, excluyendo la propia categoría.
     *
     * @param  \Illuminate\Http\Request  $request  Nuevos datos de la categoría
     * @param  int                       $id       Identificador de la categoría
     * @return \Illuminate\Http\JsonResponse        Categoría actualizada
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
     * Elimina una categoría de la base de datos.
     *
     * @param  int  $id  Identificador de la categoría a eliminar
     * @return \Illuminate\Http\JsonResponse  Mensaje de confirmación
     */
    public function destroy($id){
        Categoria::destroy($id);
        return response()->json(['mensaje' => 'Categoría eliminada']);
    }
}