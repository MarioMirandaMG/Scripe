<?php
// Autor: Mario Miranda
// Archivo: PedidoController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pedido;
use App\Models\ContenidoPedido;
use App\Models\Producto;

/**
 * Controlador de pedidos.
 *
 * Gestiona las operaciones CRUD sobre los pedidos de la tienda Scripe.
 * Incluye verificación de stock y descuento automático al confirmar un pedido.
 */
class PedidoController extends Controller
{
    /**
     * Devuelve la lista de pedidos según el rol del usuario.
     *
     * Si el usuario es admin, devuelve todos los pedidos con datos del cliente.
     * Si es cliente, devuelve únicamente sus propios pedidos.
     *
     * @param  \Illuminate\Http\Request  $request  Petición con el usuario autenticado
     * @return \Illuminate\Database\Eloquent\Collection  Lista de pedidos ordenados por fecha
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
     * Crea un nuevo pedido junto con sus líneas de contenido.
     *
     * Antes de crear el pedido verifica que haya stock suficiente
     * para todos los productos. Si hay stock, crea el pedido,
     * inserta las líneas y descuenta el stock de cada producto.
     *
     * @param  \Illuminate\Http\Request  $request  Datos del pedido y sus productos
     * @return \Illuminate\Http\JsonResponse         Pedido creado con sus contenidos, código 201
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

        // Verificamos stock de todos los productos antes de crear el pedido
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

        // Creamos las líneas del pedido y descontamos el stock de cada producto
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
     * Devuelve un pedido concreto por su ID junto con sus productos.
     *
     * Lanza un error 404 si el pedido no existe.
     *
     * @param  int  $id  Identificador del pedido
     * @return \App\Models\Pedido  Pedido con sus líneas de contenido
     */
    public function show($id){
        return Pedido::with('contenidos.producto')->findOrFail($id);
    }

    /**
     * Actualiza los datos de un pedido existente.
     *
     * Permite modificar la dirección, el estado o el total del pedido.
     * Todos los campos son opcionales en la actualización.
     *
     * @param  \Illuminate\Http\Request  $request  Nuevos datos del pedido
     * @param  int                       $id       Identificador del pedido
     * @return \Illuminate\Http\JsonResponse        Pedido actualizado
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
     * Elimina un pedido de la base de datos.
     *
     * @param  int  $id  Identificador del pedido a eliminar
     * @return \Illuminate\Http\JsonResponse  Mensaje de confirmación
     */
    public function destroy($id){
        Pedido::destroy($id);
        return response()->json(['mensaje' => 'Pedido eliminado']);
    }
}