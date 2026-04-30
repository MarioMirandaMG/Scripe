<?php
// Autor: Mario Miranda
// Archivo: PedidoController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pedido;
use App\Models\ContenidoPedido;
use App\Models\Producto;

class PedidoController extends Controller
{
    /**
     * Devuelve pedidos: todos si es admin, solo los propios si es cliente
     */
    public function index(Request $request){
        $user = $request->user();

        if ($user->rol === 'admin') {
            return Pedido::with('contenidos.producto', 'usuario')
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return Pedido::with('contenidos.producto')
            ->where('usuario_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Método para crear un nuevo pedido y sus líneas de contenido
     */
    public function store(Request $request){

        $request->validate([
            'usuario_id'                  => 'required|integer|exists:users,id',
            'direccion_id'                => 'required|integer|exists:direcciones,id',
            'estado'                      => 'required|string|in:Pendiente,Enviado,Entregado',
            'total'                       => 'required|numeric|min:0',
            'productos'                   => 'required|array|min:1',
            'productos.*.producto_id'     => 'required|integer|exists:productos,id',
            'productos.*.cantidad'        => 'required|integer|min:1',
            'productos.*.precio_unitario' => 'required|numeric|min:0',
        ]);

        // ✅ Verificar stock ANTES de crear el pedido
        foreach ($request->productos as $item) {
            $producto = Producto::findOrFail($item['producto_id']);
            if ($producto->stock < $item['cantidad']) {
                return response()->json([
                    'mensaje' => "Stock insuficiente para: {$producto->nombre}"
                ], 422);
            }
        }

        $pedido = Pedido::create([
            'usuario_id'   => $request->usuario_id,
            'direccion_id' => $request->direccion_id,
            'estado'       => $request->estado,
            'total'        => $request->total,
        ]);

        // ✅ Crear líneas y restar stock
        foreach ($request->productos as $item) {
            ContenidoPedido::create([
                'pedido_id'       => $pedido->id,
                'producto_id'     => $item['producto_id'],
                'cantidad'        => $item['cantidad'],
                'precio_unitario' => $item['precio_unitario'],
            ]);

            $producto = Producto::findOrFail($item['producto_id']);
            $producto->stock -= $item['cantidad'];
            $producto->save();
        }

        return response()->json($pedido->load('contenidos'), 201);
    }

    /**
     * Devuelve un pedido por ID con sus productos
     */
    public function show($id){
        return Pedido::with('contenidos.producto')->findOrFail($id);
    }

    /**
     * Actualiza un pedido existente
     */
    public function update(Request $request, $id){
        $request->validate([
            'direccion_id' => 'integer|exists:direcciones,id',
            'estado'       => 'string|in:Pendiente,Enviado,Entregado',
            'total'        => 'numeric|min:0',
        ]);

        $pedido = Pedido::findOrFail($id);
        $pedido->update($request->all());
        return response()->json($pedido);
    }

    /**
     * Elimina un pedido
     */
    public function destroy($id){
        Pedido::destroy($id);
        return response()->json(['mensaje' => 'Pedido eliminado']);
    }
}