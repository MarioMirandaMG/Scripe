<?php
// Autor: Mario Miranda
// Archivo: DireccionController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Direccion;

/**
 * Controlador de direcciones.
 *
 * Gestiona las operaciones CRUD sobre las direcciones
 * de envío del usuario autenticado.
 */
class DireccionController extends Controller
{
    /**
     * Devuelve todas las direcciones del usuario autenticado.
     *
     * Filtra las direcciones por el ID del usuario extraído del token.
     *
     * @param  \Illuminate\Http\Request  $request  Petición con el usuario autenticado
     * @return \Illuminate\Database\Eloquent\Collection  Lista de direcciones del usuario
     */
    public function index(Request $request){
        return Direccion::where('usuario_id', $request->user()->id)->get();
    }

    /**
     * Crea una nueva dirección para el usuario autenticado.
     *
     * El usuario_id se obtiene del token, nunca del cuerpo de la petición.
     *
     * @param  \Illuminate\Http\Request  $request  Datos de la nueva dirección
     * @return \Illuminate\Http\JsonResponse         Dirección creada con código 201
     */
    public function store(Request $request){
        $request->validate([
            'direccion'     => 'required|string|max:255',
            'ciudad'        => 'required|string|max:50',
            'codigo_postal' => 'required|string|max:10',
            'es_principal'  => 'boolean'
        ]);

        // usuario_id se obtiene del token, no del body 🔒
        $direccion = Direccion::create([
            ...$request->all(),
            'usuario_id' => $request->user()->id
        ]);

        return response()->json($direccion, 201);
    }

    /**
     * Devuelve una dirección concreta por su ID.
     *
     * Lanza un error 404 si la dirección no existe.
     *
     * @param  int  $id  Identificador de la dirección
     * @return \App\Models\Direccion  Dirección encontrada
     */
    public function show($id){
        return Direccion::findOrFail($id);
    }

    /**
     * Actualiza los datos de una dirección existente.
     *
     * Todos los campos son opcionales en la actualización.
     *
     * @param  \Illuminate\Http\Request  $request  Nuevos datos de la dirección
     * @param  int                       $id       Identificador de la dirección
     * @return \Illuminate\Http\JsonResponse        Dirección actualizada
     */
    public function update(Request $request, $id){
        $request->validate([
            'direccion'     => 'string|max:255',
            'ciudad'        => 'string|max:50',
            'codigo_postal' => 'string|max:10',
            'es_principal'  => 'boolean'
        ]);

        $direccion = Direccion::findOrFail($id);
        $direccion->update($request->all());
        return response()->json($direccion);
    }

    /**
     * Elimina una dirección de la base de datos.
     *
     * @param  int  $id  Identificador de la dirección a eliminar
     * @return \Illuminate\Http\JsonResponse  Mensaje de confirmación
     */
    public function destroy($id){
        Direccion::destroy($id);
        return response()->json(['mensaje' => 'Dirección eliminada correctamente']);
    }
}