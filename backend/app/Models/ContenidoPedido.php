<?php
// Autor: Mario Miranda
// Archivo: ContenidoPedido.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo que representa la tabla contenido_pedidos.
 *
 * Actúa como tabla intermedia entre pedidos y productos,
 * almacenando la cantidad y el precio unitario de cada
 * producto en el momento de realizar el pedido.
 */
class ContenidoPedido extends Model
{
    /**
     * Campos permitidos para asignación masiva (mass assignment).
     *
     * @var array<string>
     */
    protected $fillable = [
        'pedido_id',
        'producto_id',
        'cantidad',
        'precio_unitario',
    ];

    /**
     * Relación N:1 con el modelo Pedido.
     *
     * Cada línea de contenido pertenece a un único pedido.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function pedido(){
        return $this->belongsTo(Pedido::class);
    }

    /**
     * Relación N:1 con el modelo Producto.
     *
     * Cada línea de contenido hace referencia a un único producto.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function producto(){
        return $this->belongsTo(Producto::class);
    }
}