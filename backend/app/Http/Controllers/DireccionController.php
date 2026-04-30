<?php
// Autor: Mario Miranda
// Archivo: DireccionController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Direccion;

class DireccionController extends Controller
{
    /**
     * Returns all addresses of the authenticated user
     */
    public function index(Request $request){
        return Direccion::where('usuario_id', $request->user()->id)->get();
    }

    /**
     * Creates a new address
     */
    public function store(Request $request){
        $request->validate([
            'direccion'     => 'required|string|max:255',
            'ciudad'        => 'required|string|max:50',
            'codigo_postal' => 'required|string|max:10',
            'es_principal'  => 'boolean'
        ]);

        // usuario_id is taken from the token, not the body 🔒
        $direccion = Direccion::create([
            ...$request->all(),
            'usuario_id' => $request->user()->id
        ]);

        return response()->json($direccion, 201);
    }

    /**
     * Returns an address by ID
     */
    public function show($id){
        return Direccion::findOrFail($id);
    }

    /**
     * Updates an existing address
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
     * Deletes an address
     */
    public function destroy($id){
        Direccion::destroy($id);
        return response()->json(['mensaje' => 'Address deleted successfully']);
    }
}