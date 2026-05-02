<?php
// Autor: Mario Miranda
// Archivo: Producto.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo que representa la tabla productos en la base de datos.
 *
 * Contiene la información de los bolígrafos artesanales
 * disponibles en el catálogo de la tienda Scripe.
 */
class Producto extends Model
{
    /**
     * Campos permitidos para asignación masiva (mass assignment).
     *
     * @var array<string>
     */
    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'stock',
        'categoria_id',
        'imagen'
    ];

    /**
     * Relación N:1 con el modelo Categoria.
     *
     * Cada producto pertenece a una única categoría.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function categoria(){
        return $this->belongsTo(Categoria::class);
    }

    /**
     * Relación N:M con el modelo Pedido.
     *
     * Un producto puede estar en varios pedidos.
     * La relación se gestiona mediante la tabla intermedia contenido_pedidos.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function pedidos(){
        return $this->belongsToMany(Pedido::class, 'contenido_pedidos');
    }
}