<?php
// Autor: Mario Miranda
// Archivo: Pedido.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo que representa la tabla pedidos en la base de datos.
 *
 * Un pedido agrupa varios productos comprados por un usuario
 * en un momento concreto, con una dirección de envío asociada.
 */
class Pedido extends Model
{
    /**
     * Campos permitidos para asignación masiva (mass assignment).
     *
     * @var array<string>
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
     *
     * Se ejecuta mediante el evento 'creating' del modelo,
     * justo antes de insertar el registro en la base de datos.
     *
     * @return void
     */
    protected static function booted(){
        static::creating(function ($pedido) {
            $pedido->fecha = now();
        });
    }

    /**
     * Relación N:M con el modelo Producto.
     *
     * Un pedido puede contener muchos productos
     * a través de la tabla intermedia contenido_pedidos.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function productos(){
        return $this->belongsToMany(Producto::class, 'contenido_pedidos');
    }

    /**
     * Relación N:1 con el modelo User.
     *
     * Cada pedido pertenece a un único usuario.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function usuario(){
        return $this->belongsTo(User::class, 'usuario_id');
    }

    /**
     * Relación N:1 con el modelo Direccion.
     *
     * Cada pedido tiene una única dirección de envío asociada.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function direccion(){
        return $this->belongsTo(Direccion::class);
    }

    /**
     * Relación 1:N con el modelo ContenidoPedido.
     *
     * Un pedido tiene muchas líneas de contenido,
     * cada una con un producto, cantidad y precio unitario.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function contenidos(){
        return $this->hasMany(ContenidoPedido::class);
    }
}