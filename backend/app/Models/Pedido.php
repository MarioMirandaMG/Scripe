<?php
// Autor: Mario Miranda
// Archivo: Pedido.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo que representa la tabla pedidos.
 * Un pedido puede contener varios productos
 */
class Pedido extends Model
{
    /**
     * Campos que se pueden rellenar masivamente.
     */
    protected $fillable = [
        'usuario_id',
        'direccion_id',
        'fecha',
        'total',
        'estado'
    ];

    /**
     * Asigna la fecha automáticamente al crear un pedido.
     */
    protected static function booted(){
        static::creating(function ($pedido) {
            $pedido->fecha = now();
        });
    }

    /**
     * Relación N:M
     * Un pedido puede tener muchos productos.
     */
    public function productos(){
        return $this->belongsToMany(Producto::class, 'contenido_pedidos');
    }

    /**
     * Relación N:1
     * Cada pedido pertenece a un usuario.
     */
    public function usuario(){
        return $this->belongsTo(User::class, 'usuario_id');
    }

    /**
     * Relación N:1
     * Cada pedido tiene una dirección de envío.
     */
    public function direccion(){
        return $this->belongsTo(Direccion::class);
    }

    /**
     * Relación 1:N
     * Un pedido tiene muchos contenidos (líneas de pedido).
     */
    public function contenidos(){
        return $this->hasMany(ContenidoPedido::class);
    }
}