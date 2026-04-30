<?php
// Autor: Mario Miranda
// Archivo ContenidoPedido

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo que representa la tabla contenido_pedidos
 * Esta tabla actúa como tabla intermedia entre pedidos y productos
 */
class ContenidoPedido extends Model
{

    protected $fillable = [
        'pedido_id',
        'producto_id',
        'cantidad',
        'precio_unitario',
    ];

    /**
     * Relación N:1
     * Cada registro pertenece a un pedido.
     */
    public function pedido(){
            return $this->belongsTo(Pedido::class);
        }
    
    /**
     * Relación N:1
     * Cada registro pertenece a un producto.
     */
    public function producto(){
            return $this->belongsTo(Producto::class);
        }
}
